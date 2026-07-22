import { Router, Response } from 'express';
import { db } from '../services/db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// 1. Get List of Contacted Users (Conversations)
router.get('/contacts', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const contacts = await db.messages.listContacts(req.user.id);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat contacts' });
  }
});

// 2. Get Chat History with a User
router.get('/chat/:receiverId', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { receiverId } = req.params;

  try {
    const history = await db.messages.listChat(req.user.id, receiverId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

// 3. Send Message
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ error: 'Receiver ID and content are required' });
  }

  try {
    const newMessage = await db.messages.create(req.user.id, receiverId, content);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
