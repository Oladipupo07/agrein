import { Router } from 'express';
import { db } from '../services/db';

const router = Router();

// List community discussion threads
router.get('/', async (req, res) => {
  try {
    const list = await db.forum.listThreads();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch community threads' });
  }
});

export default router;
