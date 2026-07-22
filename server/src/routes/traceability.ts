import { Router } from 'express';
import { db } from '../services/db';

const router = Router();

// Get batch provenance and QR data
router.get('/:batchId', async (req, res) => {
  try {
    const details = await db.traceability.getBatchDetails(req.params.batchId);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch batch provenance' });
  }
});

export default router;
