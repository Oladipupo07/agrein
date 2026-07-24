import { Router, Request, Response } from 'express';

export const rfqRouter = Router();

// Reverse Marketplace (Purchase Requests & Farmer Bids)
const mockRfqs = [
  {
    id: 'rfq-201',
    buyerName: 'Eko Hotels & Suites Procurement',
    buyerType: 'Hotel & Hospitality',
    cropName: 'Fresh Plum Tomatoes',
    quantityRequired: 5,
    unit: 'tons',
    targetPricePerUnit: 1200000, // NGN per ton
    deliveryLocation: 'Victoria Island, Lagos',
    deadlineDate: '2026-08-10',
    status: 'open',
    description: 'Weekly supply contract for fresh, firm red tomatoes. Must be cold-chain delivered to our main central kitchen.',
    bidsCount: 4,
    bids: [
      {
        bidId: 'bid-01',
        farmerName: 'SunRays Agro Cooperative (Jos)',
        offeredPrice: 1150000,
        offeredQuantity: 5,
        fulfillmentDate: '2026-08-08',
        status: 'submitted',
        notes: 'We can guarantee temperature-monitored refrigerated transport directly to VI Lagos.'
      },
      {
        bidId: 'bid-02',
        farmerName: 'Dan-Batatta Farms (Kano)',
        offeredPrice: 1100000,
        offeredQuantity: 5,
        fulfillmentDate: '2026-08-09',
        status: 'submitted',
        notes: 'Bulk price discount applied for 5 tons.'
      }
    ]
  },
  {
    id: 'rfq-202',
    buyerName: 'Crown Flour Mills Nigeria',
    buyerType: 'Food Processor',
    cropName: 'Yellow Maize (Moisture < 12%)',
    quantityRequired: 100,
    unit: 'tons',
    targetPricePerUnit: 920000,
    deliveryLocation: 'Ikeja Industrial Estate, Lagos',
    deadlineDate: '2026-08-25',
    status: 'open',
    description: 'Required for poultry feed production. Strict lab testing on arrival for aflatoxin levels.',
    bidsCount: 7,
    bids: []
  }
];

rfqRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: mockRfqs });
});

rfqRouter.post('/', (req: Request, res: Response) => {
  const { buyerName, cropName, quantityRequired, unit, targetPricePerUnit, deliveryLocation, deadlineDate, description } = req.body;
  const newRfq = {
    id: `rfq-${Date.now()}`,
    buyerName: buyerName || 'Bulk Buyer Corp',
    buyerType: 'Agribusiness',
    cropName,
    quantityRequired: Number(quantityRequired),
    unit: unit || 'tons',
    targetPricePerUnit: Number(targetPricePerUnit),
    deliveryLocation,
    deadlineDate,
    status: 'open',
    description,
    bidsCount: 0,
    bids: []
  };
  mockRfqs.unshift(newRfq);
  res.json({ success: true, message: 'RFQ Purchase Request posted successfully to Reverse Marketplace', data: newRfq });
});

rfqRouter.post('/:id/bids', (req: Request, res: Response) => {
  const { rfqId } = req.params;
  const { farmerName, offeredPrice, offeredQuantity, fulfillmentDate, notes } = req.body;

  const rfq = mockRfqs.find(r => r.id === rfqId || r.id === req.params.id);
  if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

  const newBid = {
    bidId: `bid-${Date.now()}`,
    farmerName: farmerName || 'Verified Farmer',
    offeredPrice: Number(offeredPrice),
    offeredQuantity: Number(offeredQuantity),
    fulfillmentDate,
    status: 'submitted',
    notes
  };

  rfq.bids.push(newBid);
  rfq.bidsCount = rfq.bids.length;

  res.json({ success: true, message: 'Bid submitted successfully to buyer', data: newBid });
});
