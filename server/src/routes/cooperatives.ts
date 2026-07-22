import { Router } from 'express';
import { db } from '../services/db';

const router = Router();

// List all registered farmer cooperatives
router.get('/', async (req, res) => {
  try {
    const list = await db.cooperatives.listAll();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cooperatives' });
  }
});

export default router;
