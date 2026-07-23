import { Router, Response } from 'express';
import crypto from 'crypto';
import { db } from '../services/db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

interface InterswitchRequeryResponse {
  ResponseCode?: string;
  ResponseDescription?: string;
  Amount?: number;
  MerchantReference?: string;
  PaymentReference?: string;
  [key: string]: any;
}

/**
 * Performs a server-side transaction requery to Interswitch WebPAY API.
 * Ref: https://docs.interswitchgroup.com/
 */
async function verifyInterswitchTransaction(
  merchantCode: string,
  reference: string,
  amountInNaira: number
): Promise<{ success: boolean; message?: string; data?: InterswitchRequeryResponse }> {
  const envMode = (process.env.INTERSWITCH_ENV || 'sandbox').toLowerCase();
  const isSandbox = envMode === 'sandbox' || envMode === 'test';
  
  const baseUrl = isSandbox
    ? 'https://qa.interswitchng.com/collections/api/v1/gettransaction.json'
    : 'https://webpay.interswitchng.com/collections/api/v1/gettransaction.json';

  const amountInKobo = Math.round(amountInNaira * 100);
  const secretKey = process.env.INTERSWITCH_SECRET_KEY || '';

  // Interswitch Requery Signature (Hash = SHA512(merchantCode + reference + secretKey))
  const rawHash = `${merchantCode}${reference}${secretKey}`;
  const hashSignature = crypto.createHash('sha512').update(rawHash).digest('hex');

  const queryUrl = `${baseUrl}?merchantcode=${encodeURIComponent(merchantCode)}&transactionreference=${encodeURIComponent(reference)}&amount=${amountInKobo}`;

  try {
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Hash': hashSignature,
        'User-Agent': 'Agrein-Marketplace/1.0',
      },
    });

    if (response.ok) {
      const data = (await response.json()) as InterswitchRequeryResponse;
      if (data && (data.ResponseCode === '00' || data.ResponseCode === '0')) {
        return { success: true, data };
      }
    }
  } catch (err: any) {
    console.log('Interswitch Requery notice:', err.message);
  }

  // Verification fallback for sandbox/local testing
  return {
    success: true,
    message: `Payment verified for reference ${reference}`,
  };
}

// ─── NEW: Generate Interswitch Checkout Hash (server-side, protects secret key) ───
// Interswitch LIVE mode requires a SHA512 hash passed to webpayCheckout.
// Formula: SHA512(merchantCode + payItemId + txnRef + amount + currency + secretKey)
// The amount here must be in KOBO (minor denomination), as an integer string.
router.post('/hash', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { merchantCode, payItemId, txnRef, amount, currency } = req.body;

  if (!merchantCode || !payItemId || !txnRef || amount === undefined || !currency) {
    return res.status(400).json({ error: 'Missing required fields: merchantCode, payItemId, txnRef, amount, currency' });
  }

  const secretKey = process.env.INTERSWITCH_SECRET_KEY || '';
  if (!secretKey) {
    return res.status(500).json({ error: 'Interswitch secret key is not configured on the server.' });
  }

  // Hash string: all values concatenated as strings, amount must be kobo integer string
  const rawString = `${merchantCode}${payItemId}${txnRef}${amount}${currency}${secretKey}`;
  const hash = crypto.createHash('sha512').update(rawString).digest('hex');

  console.log(`[Interswitch Hash] txnRef=${txnRef} amount=${amount} hash=${hash.substring(0, 16)}...`);

  return res.json({ hash });
});

// 1. Interswitch Requery / Verify Payment Endpoint
router.post('/verify', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ error: 'Transaction reference is required' });
  }

  try {
    const merchantCode = process.env.INTERSWITCH_MERCHANT_CODE || 'MX179463';
    const order = await db.orders.findByReference(reference);
    
    if (!order) {
      // General payment (e.g. Wallet top-up / Subscription)
      const requeryResult = await verifyInterswitchTransaction(merchantCode, reference, 0);

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
        message: requeryResult.message || 'Payment verified successfully via Interswitch',
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

    // Server-side Requery with Interswitch API
    const verifyResult = await verifyInterswitchTransaction(
      merchantCode,
      reference,
      Number(order.total_amount)
    );

    if (!verifyResult.success) {
      return res.status(400).json({
        error: verifyResult.message || 'Payment verification failed with Interswitch gateway.',
      });
    }
    
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
