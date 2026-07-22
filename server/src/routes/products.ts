import { Router, Response } from 'express';
import { db } from '../services/db';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

// 1. Get All Categories
router.get('/categories', async (req, res) => {
  try {
    const list = await db.categories.listAll();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// 2. Search / List Products
router.get('/', async (req, res) => {
  const { category, search, state } = req.query;

  try {
    const list = await db.products.listAll({
      category: category as string,
      search: search as string,
      state: state as string
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// 3. Get Products by Farmer (For Dashboard)
router.get('/farmer/my-products', authenticateToken, requireRole(['farmer']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const list = await db.products.listByFarmer(req.user.id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farmer products' });
  }
});

// 4. Get Product Details by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await db.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// 5. Create a Product (Farmer only)
router.post('/', authenticateToken, requireRole(['farmer']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { name, description, categoryId, price, quantity, quantityUnit, deliveryEstimate, imagePaths } = req.body;

  if (!name || !description || !categoryId || !price || !quantity) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }

  try {
    // Check if farmer is approved
    const farmer = await db.farmers.findById(req.user.id);
    if (!farmer || farmer.verification_status !== 'approved') {
      return res.status(403).json({ error: 'Your farmer profile must be approved by an Admin to list products.' });
    }

    const newProduct = await db.products.create(
      req.user.id,
      name,
      description,
      Number(categoryId),
      Number(price),
      Number(quantity),
      quantityUnit,
      deliveryEstimate,
      imagePaths || []
    );

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// 6. Update Product (Farmer only)
router.put('/:id', authenticateToken, requireRole(['farmer']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const product = await db.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.farmer_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this product' });
    }

    const { name, description, categoryId, price, quantity, quantityUnit, deliveryEstimate, availabilityStatus } = req.body;
    
    const updates: any = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (categoryId) updates.category_id = Number(categoryId);
    if (price !== undefined) updates.price = Number(price);
    if (quantity !== undefined) updates.quantity = Number(quantity);
    if (quantityUnit) updates.quantity_unit = quantityUnit;
    if (deliveryEstimate) updates.delivery_estimate = deliveryEstimate;
    if (availabilityStatus) updates.availability_status = availabilityStatus;

    const updated = await db.products.update(req.params.id, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// 7. Delete Product (Farmer only)
router.delete('/:id', authenticateToken, requireRole(['farmer']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const product = await db.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.farmer_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this product' });
    }

    await db.products.delete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// 8. Add Review for Product (Buyer only)
router.post('/:id/reviews', authenticateToken, requireRole(['buyer']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const product = await db.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const review = await db.reviews.create(req.params.id, req.user.id, Number(rating), comment || '');
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// 9. Get Reviews for Product
router.get('/:id/reviews', async (req, res) => {
  try {
    const list = await db.reviews.listByProduct(req.params.id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
});

export default router;
