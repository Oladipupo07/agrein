import { Router, Response } from 'express';
import { db } from '../services/db';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

// 1. Get deliveries assigned to logged-in partner
router.get('/my-deliveries', authenticateToken, requireRole(['delivery_partner']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const list = await db.deliveries.listByPartner(req.user.id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

// 2. Get list of all orders that are paid and need a delivery partner
router.get('/pending-pickup', authenticateToken, requireRole(['delivery_partner']), async (req: AuthRequest, res: Response) => {
  try {
    const allOrders = await db.orders.listAll();
    // Filter orders with status 'paid' (which means paid but not yet assigned to a partner)
    const unassigned = allOrders.filter((o: any) => o.status === 'paid' && !o.delivery_partner_id);
    
    // Fetch items details
    const unassignedWithDetails = [];
    for (const order of unassigned) {
      const fullOrder = await db.orders.findById(order.id);
      if (fullOrder) {
        unassignedWithDetails.push(fullOrder);
      }
    }
    res.json(unassignedWithDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending pickups' });
  }
});

// 3. Self-assign / Accept order delivery
router.post('/:orderId/accept', authenticateToken, requireRole(['delivery_partner']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { orderId } = req.params;

  try {
    const order = await db.orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.delivery_partner_id) {
      return res.status(400).json({ error: 'Order already assigned to another delivery partner' });
    }

    if (order.status !== 'paid') {
      return res.status(400).json({ error: 'Order is not in paid status' });
    }

    // Create delivery record and update order status
    await db.deliveries.create(orderId, req.user.id);

    // Notify Buyer
    await db.notifications.create(
      order.buyer_id,
      'Delivery Partner Assigned',
      `A delivery partner has accepted your order ${order.payment_reference}. Status: Shipped.`
    );

    // Notify Farmer(s)
    const items = order.items || [];
    const notifiedFarmers = new Set<string>();
    for (const item of items) {
      if (item.farmer_id && !notifiedFarmers.has(item.farmer_id)) {
        notifiedFarmers.add(item.farmer_id);
        await db.notifications.create(
          item.farmer_id,
          'Order Dispatched',
          `Order Ref ${order.payment_reference} has been picked up by a delivery partner.`
        );
      }
    }

    res.json({ success: true, message: 'Delivery accepted successfully. Order status updated to shipped.' });
  } catch (error) {
    console.error('Accept delivery error:', error);
    res.status(500).json({ error: 'Failed to accept delivery' });
  }
});

// 4. Update shipment status (e.g. picked_up, delivered)
router.post('/:orderId/status', authenticateToken, requireRole(['delivery_partner']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { orderId } = req.params;
  const { status, notes } = req.body;

  if (!status || !['picked_up', 'delivered'].includes(status)) {
    return res.status(400).json({ error: 'Invalid delivery status. Must be picked_up or delivered.' });
  }

  try {
    const order = await db.orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.delivery_partner_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You are not assigned to this order' });
    }

    // Update status
    await db.deliveries.update(orderId, status, notes || `Status updated to ${status}`);

    // Notify Buyer
    if (status === 'picked_up') {
      await db.notifications.create(
        order.buyer_id,
        'Order Picked Up',
        `Your package for order ${order.payment_reference} has been picked up and is on its way.`
      );
    } else if (status === 'delivered') {
      await db.notifications.create(
        order.buyer_id,
        'Order Delivered',
        `Your package for order ${order.payment_reference} has been delivered. Please open the app and confirm receipt to finalize payment.`
      );
    }

    res.json({ success: true, message: `Delivery status updated to ${status}` });
  } catch (error) {
    console.error('Update delivery error:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

export default router;
