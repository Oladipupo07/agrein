import { Router, Response } from 'express';
import { db } from '../services/db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get Farmer Verification Status & Trust Score
router.get('/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const status = await db.verification.getStatus(req.user!.id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch verification status' });
  }
});

// Submit Verification Documents (NIN, BVN, Farm Photos)
router.post('/submit', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.verification.submitVerification(req.user!.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit verification details' });
  }
});

export default router;
