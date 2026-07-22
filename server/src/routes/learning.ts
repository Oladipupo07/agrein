import { Router } from 'express';
import { db } from '../services/db';

const router = Router();

// List courses in Agri-Learning Center
router.get('/courses', async (req, res) => {
  try {
    const list = await db.learningCenter.listCourses();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

export default router;
