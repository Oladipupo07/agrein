import { Router, Response } from 'express';
import { db } from '../services/db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get Wallet Balance & Transactions
router.get('/balance', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const data = await db.wallet.getBalance(req.user!.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallet details' });
  }
});

// Deposit Funds to Digital Wallet
router.post('/deposit', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { amount } = req.body;
  try {
    const result = await db.wallet.deposit(req.user!.id, Number(amount || 0));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Deposit failed' });
  }
});

// Request Instant Payout / Withdrawal
router.post('/withdraw', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { amount } = req.body;
  try {
    const result = await db.wallet.withdraw(req.user!.id, Number(amount || 0));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

export default router;
