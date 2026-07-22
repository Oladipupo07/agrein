import { Router, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { db } from '../services/db';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';
import { config } from '../config';

const router = Router();
const JWT_SECRET = config.jwtSecret;

// 1. Register Route
router.post('/register', async (req, res) => {
  const { email, password, fullName, phoneNumber, role, farmName, farmAddress, state, deliveryAddress } = req.body;

  if (!email || !password || !fullName || !role) {
    return res.status(400).json({ error: 'Missing required registration details' });
  }

  if (!['farmer', 'buyer', 'delivery_partner', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid user role' });
  }

  try {
    // Check if user already exists
    const existing = await db.users.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create main user
    const newUser = await db.users.create(email, passwordHash, fullName, phoneNumber, role);

    // Create role specific records
    if (role === 'farmer') {
      if (!farmName || !farmAddress || !state) {
        return res.status(400).json({ error: 'Farmer details are required' });
      }
      await db.farmers.create(newUser.id, farmName, farmAddress, state, {});
      await db.notifications.create(
        newUser.id,
        'Welcome to Agrein!',
        'Your profile has been created and is pending admin approval. You will receive an update soon.'
      );
    } else if (role === 'buyer') {
      await db.buyers.create(newUser.id, deliveryAddress || '', state || '');
      await db.notifications.create(
        newUser.id,
        'Welcome to Agrein!',
        'Start exploring fresh agricultural produce direct from farmers.'
      );
    }

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        phoneNumber: newUser.phone_number,
        role: newUser.role,
        avatarUrl: newUser.avatar_url,
        status: newUser.status
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// 2. Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await db.users.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phoneNumber: user.phone_number,
        role: user.role,
        avatarUrl: user.avatar_url,
        status: user.status
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 3. Get Current User Details
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await db.users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let roleDetails = null;
    if (user.role === 'farmer') {
      roleDetails = await db.farmers.findById(user.id);
    } else if (user.role === 'buyer') {
      roleDetails = await db.buyers.findById(user.id);
    }

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phoneNumber: user.phone_number,
      role: user.role,
      avatarUrl: user.avatar_url,
      status: user.status,
      details: roleDetails
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// 4. Update Profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { fullName, phoneNumber, avatarUrl, farmName, farmAddress, state, deliveryAddress, payoutDetails } = req.body;

  try {
    // Update main user details
    const userUpdates: any = {};
    if (fullName) userUpdates.full_name = fullName;
    if (phoneNumber !== undefined) userUpdates.phone_number = phoneNumber;
    if (avatarUrl) userUpdates.avatar_url = avatarUrl;

    if (Object.keys(userUpdates).length > 0) {
      await db.users.update(req.user.id, userUpdates);
    }

    // Update role details
    if (req.user.role === 'farmer') {
      const farmerUpdates: any = {};
      if (farmName) farmerUpdates.farm_name = farmName;
      if (farmAddress) farmerUpdates.farm_address = farmAddress;
      if (state) farmerUpdates.state = state;
      if (payoutDetails) farmerUpdates.payout_details = payoutDetails;

      if (Object.keys(farmerUpdates).length > 0) {
        await db.farmers.update(req.user.id, farmerUpdates);
      }
    } else if (req.user.role === 'buyer') {
      const buyerUpdates: any = {};
      if (deliveryAddress) buyerUpdates.delivery_address = deliveryAddress;
      if (state) buyerUpdates.state = state;

      if (Object.keys(buyerUpdates).length > 0) {
        await db.buyers.update(req.user.id, buyerUpdates);
      }
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error: any) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// 5. List all users (Admin only)
router.get('/admin/users', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.users.listAll();
    // Map to the camelCase shape used elsewhere in the auth API.
    const users = rows.map((u: any) => ({
      id: u.id,
      email: u.email,
      fullName: u.full_name,
      phone: u.phone_number,
      role: u.role,
      status: u.status,
      avatarUrl: u.avatar_url,
      createdAt: u.created_at
    }));
    res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

export default router;
