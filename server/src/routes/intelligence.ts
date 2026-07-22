import { Router } from 'express';
import { db } from '../services/db';

const router = Router();

// Get AI Market Intelligence & Commodity Trends
router.get('/', async (req, res) => {
  try {
    const data = await db.intelligence.getCommodityTrends();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market intelligence' });
  }
});

export default router;
