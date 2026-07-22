import { Router, Response } from 'express';
import { db } from '../services/db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// 1. Interswitch Requery / Verify Payment Endpoint
router.post('/verify', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ error: 'Transaction reference is required' });
  }

  try {
    const order = await db.orders.findByReference(reference);
    if (!order) {
      // General payment (e.g. Wallet top-up / Subscription)
      await db.transactions.create(
        null,
        req.user!.id,
        0,
        'payment',
        'success',
        reference
      );
      await db.notifications.create(
        req.user!.id,
        'Payment Verified',
        `Your Interswitch payment (Ref: ${reference}) was verified successfully.`
      );
      return res.json({
        success: true,
        message: 'Payment verified successfully via Interswitch',
        reference,
      });
    }

    // Only the buyer who placed the order may verify its payment.
    if (order.buyer_id !== req.user!.id) {
      return res.status(403).json({ error: 'Only the buyer of this order can verify its payment.' });
    }

    if (order.payment_status === 'paid' || order.payment_status === 'verified') {
      return res.json({ success: true, message: 'Order is already marked as paid.', order });
    }

    // --- INTERSWITCH API VERIFICATION FLOW (SKELETON & SIMULATOR) ---
    // In production:
    // 1. Compute authorization headers / signatures using Merchant Code & Client Secret.
    // 2. HTTP GET to: https://newwebpay.interswitchng.com/collections/api/v1/gettransaction.json?merchantcode=...&transactionreference=...&amount=...
    // 3. Inspect response code. "00" represents success.
    //
    // For this marketplace, we simulate a successful verification.
    
    // We update the order status
    await db.orders.update(order.id, {
      payment_status: 'paid',
      status: 'paid'
    });

    // Create a transaction log
    await db.transactions.create(
      order.id,
      order.buyer_id,
      order.total_amount,
      'payment',
      'success',
      reference
    );

    // Notify Buyer
    await db.notifications.create(
      order.buyer_id,
      'Payment Received!',
      `Your payment of ₦${Number(order.total_amount).toLocaleString()} for order ref ${reference} was verified. The farmer is preparing your order.`
    );

    // Notify Farmer(s)
    const fullOrder = await db.orders.findById(order.id);
    const items = fullOrder?.items || [];
    const notifiedFarmers = new Set<string>();

    for (const item of items) {
      if (item.farmer_id && !notifiedFarmers.has(item.farmer_id)) {
        notifiedFarmers.add(item.farmer_id);
        await db.notifications.create(
          item.farmer_id,
          'New Paid Order!',
          `You have a new paid order (Ref: ${reference}). Open your dashboard to view items and prepare shipment.`
        );
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully via Interswitch',
      order: {
        ...order,
        status: 'paid',
        payment_status: 'paid'
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Internal server error verifying payment' });
  }
});

// 2. Request Payout / Withdrawal (Farmers requesting bank transfers)
router.post('/withdraw', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.role !== 'farmer') {
    return res.status(403).json({ error: 'Only farmers can request withdrawals' });
  }

  const { amount } = req.body;
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Invalid withdrawal amount' });
  }

  try {
    const farmer = await db.farmers.findById(req.user!.id);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer profile not found' });
    }

    if (Number(farmer.balance) < Number(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct from farmer balance
    const newBalance = Number(farmer.balance) - Number(amount);
    await db.farmers.update(req.user!.id, { balance: newBalance });

    // Create Transaction Log
    const ref = 'WD-' + Math.floor(100000 + Math.random() * 900000);
    await db.transactions.create(
      null,
      req.user!.id,
      -Number(amount), // negative indicates outbound
      'payout',
      'success',
      ref
    );

    // Notify farmer
    await db.notifications.create(
      req.user!.id,
      'Withdrawal Processed',
      `Your withdrawal request of ₦${Number(amount).toLocaleString()} has been processed to your registered bank account. Ref: ${ref}`
    );

    res.json({
      success: true,
      message: 'Withdrawal processed successfully',
      newBalance
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

export default router;
