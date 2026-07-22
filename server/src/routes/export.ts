import { Router } from 'express';
import { db } from '../services/db';

const router = Router();

// List export produce listings
router.get('/', async (req, res) => {
  try {
    const list = await db.exportMarketplace.listExportListings();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch export listings' });
  }
});

export default router;
