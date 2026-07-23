import { Router, Response } from 'express';
import { db } from '../services/db';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

/**
 * Generate a unique Interswitch-compatible transaction reference.
 * Interswitch txn_ref has a strict 25-character maximum.
 * Format: AGR + 10-digit timestamp-based + 6-char random hex = 19 chars (safe)
 */
function generateTxnRef(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-8); // 8 chars
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 chars
  return `AGR${ts}${rand}`; // = 3 + 8 + 6 = 17 chars max — well within 25
}

const router = Router();

// 1. Create a New Order (Buyer only)
router.post('/', authenticateToken, requireRole(['buyer']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { items, shippingAddress, shippingState } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0 || !shippingAddress || !shippingState) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  try {
    // Verify product quantities and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await db.products.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.product_id}` });
      }

      if (Number(product.quantity) < Number(item.quantity)) {
        return res.status(400).json({ error: `Insufficient stock for product: ${product.name}` });
      }

      const itemCost = Number(product.price) * Number(item.quantity);
      totalAmount += itemCost;

      validatedItems.push({
        product_id: product.id,
        quantity: Number(item.quantity),
        price: Number(product.price)
      });
    }

    // Generate unique Interswitch-compatible transaction reference (max 25 chars)
    const reference = generateTxnRef();

    // Create the order in the database
    const order = await db.orders.create(
      req.user.id,
      totalAmount,
      shippingAddress,
      shippingState,
      reference,
      validatedItems
    );

    // Decrease product quantities
    for (const item of validatedItems) {
      const prod = await db.products.findById(item.product_id);
      if (prod) {
        const remaining = Number(prod.quantity) - item.quantity;
        await db.products.update(item.product_id, {
          quantity: remaining,
          availability_status: remaining <= 0 ? 'out_of_stock' : 'in_stock'
        });
      }
    }

    res.status(201).json({
      orderId: order.id,
      reference,
      totalAmount,
      message: 'Order created successfully. Proceed to payment.'
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// 2. Get Buyer Orders
router.get('/buyer/my-orders', authenticateToken, requireRole(['buyer']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const list = await db.orders.listByBuyer(req.user.id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch buyer orders' });
  }
});

// 3. Get Farmer Orders
router.get('/farmer/my-orders', authenticateToken, requireRole(['farmer']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const list = await db.orders.listByFarmer(req.user.id);
    // Expand list with details for display
    const ordersWithDetails = [];
    for (const order of list) {
      const fullOrder = await db.orders.findById(order.id);
      if (fullOrder) {
        ordersWithDetails.push(fullOrder);
      }
    }
    res.json(ordersWithDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farmer orders' });
  }
});

// 4. Get Admin Orders (All)
router.get('/admin/all-orders', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const list = await db.orders.listAll();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
});

// 5. Get Single Order Details
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const order = await db.orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Auth check: User must be buyer, farmer of products, admin, or assigned delivery partner
    const isBuyer = order.buyer_id === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isDelivery = order.delivery_partner_id === req.user.id;
    const isFarmer = order.items?.some((i: any) => i.farmer_id === req.user?.id);

    if (!isBuyer && !isAdmin && !isDelivery && !isFarmer) {
      return res.status(403).json({ error: 'Access denied to this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// 6. Confirm Order Completion (Buyer confirming receipt)
// Releases funds (minus 5% platform fee) to the Farmer
router.post('/:id/complete', authenticateToken, requireRole(['buyer']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const order = await db.orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.buyer_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the buyer can complete this order' });
    }

    if (order.status === 'completed') {
      return res.status(400).json({ error: 'Order is already marked as completed' });
    }

    if (order.payment_status !== 'paid' && order.payment_status !== 'verified') {
      return res.status(400).json({ error: 'Cannot complete an unpaid order' });
    }

    // Update order status
    await db.orders.update(order.id, { status: 'completed' });

    // Release funds to farmers for items in this order
    // In our design, we group items by farmer and distribute their shares
    const items = order.items || [];
    const commissionRate = 0.05; // 5% platform fee

    for (const item of items) {
      const farmerId = item.farmer_id;
      const totalItemValue = Number(item.price_at_purchase) * Number(item.quantity);
      const commissionFee = totalItemValue * commissionRate;
      const farmerEarnings = totalItemValue - commissionFee;

      // Fetch farmer profile
      const farmer = await db.farmers.findById(farmerId);
      if (farmer) {
        const newBalance = Number(farmer.balance) + farmerEarnings;
        await db.farmers.update(farmerId, { balance: newBalance });

        // Record payout transaction
        await db.transactions.create(
          order.id,
          farmerId,
          farmerEarnings,
          'payout',
          'success',
          `PAYOUT-${order.id.slice(0, 8)}-${farmerId.slice(0, 4)}`
        );

        // Notify farmer
        await db.notifications.create(
          farmerId,
          'Funds Released!',
          `Buyer confirmed receipt for order ${order.payment_reference}. ₦${farmerEarnings.toLocaleString()} has been added to your balance (after a 5% commission fee of ₦${commissionFee.toLocaleString()}).`
        );
      }
    }

    // Update delivery table status if there was a delivery assignment
    await db.deliveries.update(order.id, 'delivered', 'Order received and confirmed by the buyer.');

    // Notify buyer
    await db.notifications.create(
      req.user.id,
      'Order Completed',
      `Thank you for shopping on Agrein! Your order ${order.payment_reference} has been successfully completed.`
    );

    res.json({ success: true, message: 'Order completed and funds released to the farmer(s) minus commission.' });
  } catch (error) {
    console.error('Complete order error:', error);
    res.status(500).json({ error: 'Failed to complete order' });
  }
});

export default router;
