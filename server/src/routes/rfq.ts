import { Router, Response } from 'express';
import { db } from '../services/db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// In-memory mock storage for RFQs if DB tables are pending
let rfqs: any[] = [
  {
    id: 'rfq-101',
    buyer_id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    buyer_name: 'Nestlé Agro-Procurement Nigeria',
    title: '50 Tonnes Cleaned Yellow Maize (Grade A)',
    category: 'Grains',
    target_state: 'Kano / Kaduna',
    quantity_required: '50 Tonnes',
    budget_per_unit: '₦480,000 / Tonne',
    deadline: '2026-08-15',
    description: 'Looking for high-grade yellow maize with moisture content strictly under 12%. Direct delivery to storage silo in Kaduna.',
    status: 'open',
    bids_count: 4,
    created_at: new Date()
  },
  {
    id: 'rfq-102',
    buyer_id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    buyer_name: 'Grand Cereals Exporters Ltd',
    title: '30 Tonnes Premium White Sesame Seeds',
    category: 'Grains',
    target_state: 'Jigawa / Benue',
    quantity_required: '30 Tonnes',
    budget_per_unit: '₦950,000 / Tonne',
    deadline: '2026-08-20',
    description: 'High oil content white sesame seeds required for export processing. Purity level 99%.',
    status: 'open',
    bids_count: 2,
    created_at: new Date()
  }
];

let rfqBids: any[] = [
  {
    id: 'bid-1',
    rfq_id: 'rfq-101',
    farmer_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    farmer_name: 'Kole Adebayo (Kano Grain Cooperative)',
    price_per_unit: 470000,
    delivery_timeline: '7 days after contract award',
    notes: 'Can supply up to 35 tonnes from our current harvest in Dawanau silos.',
    created_at: new Date()
  }
];

// 1. List all active RFQs
router.get('/', async (req, res) => {
  try {
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RFQs' });
  }
});

// 2. Post a new RFQ (Institutional Buyers)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!req.user || (req.user.role !== 'buyer' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Only buyers can submit RFQs' });
  }

  const { title, category, target_state, quantity_required, budget_per_unit, deadline, description } = req.body;

  if (!title || !quantity_required) {
    return res.status(400).json({ error: 'Title and required quantity are required' });
  }

  const newRfq = {
    id: 'rfq-' + Date.now(),
    buyer_id: req.user.id,
    buyer_name: req.user.email.split('@')[0].toUpperCase() + ' Institutional Buyer',
    title,
    category: category || 'General Produce',
    target_state: target_state || 'Any State',
    quantity_required,
    budget_per_unit: budget_per_unit || 'Negotiable',
    deadline: deadline || '2026-09-01',
    description: description || '',
    status: 'open',
    bids_count: 0,
    created_at: new Date()
  };

  rfqs.unshift(newRfq);
  res.status(201).json({ message: 'RFQ published successfully', rfq: newRfq });
});

// 3. Submit a Bid on an RFQ (Farmers)
router.post('/:id/bids', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.role !== 'farmer') {
    return res.status(403).json({ error: 'Only farmers can submit bids on RFQs' });
  }

  const rfq = rfqs.find((r) => r.id === req.params.id);
  if (!rfq) {
    return res.status(404).json({ error: 'RFQ not found' });
  }

  const { price_per_unit, delivery_timeline, notes } = req.body;

  const newBid = {
    id: 'bid-' + Date.now(),
    rfq_id: req.params.id,
    farmer_id: req.user.id,
    farmer_name: req.user.email.split('@')[0],
    price_per_unit: Number(price_per_unit),
    delivery_timeline,
    notes: notes || '',
    created_at: new Date()
  };

  rfqBids.push(newBid);
  rfq.bids_count += 1;

  res.status(201).json({ message: 'Bid submitted successfully', bid: newBid });
});

// 4. Get bids for an RFQ
router.get('/:id/bids', authenticateToken, async (req: AuthRequest, res: Response) => {
  const bids = rfqBids.filter((b) => b.rfq_id === req.params.id);
  res.json(bids);
});

export default router;
