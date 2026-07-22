import { Router, Response } from 'express';
import { db } from '../services/db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user subscription plan
router.get('/plan', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const plan = await db.subscriptions.getCurrentPlan(req.user!.id);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription plan' });
  }
});

export default router;
