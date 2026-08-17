// Buyer Reverse Marketplace RFQ Controller for Agrein

let mockRFQs = [
  {
    id: 'rfq-101',
    buyerName: 'FreshMart Supermarkets Nigeria',
    crop: 'Greenhouse Roma Tomatoes',
    qty: 5000,
    unit: 'kg',
    location: 'Lagos (Lekki Hub)',
    budgetRange: '₦800 - ₦900 / kg',
    requiredDate: '2026-08-18',
    status: 'open',
    bidsCount: 4
  },
  {
    id: 'rfq-102',
    buyerName: 'TopFeeds Milling Industries',
    crop: 'Sun-Dried Yellow Maize',
    qty: 25000,
    unit: 'kg',
    location: 'Ibadan, Oyo State',
    budgetRange: '₦450 - ₦490 / kg',
    requiredDate: '2026-08-25',
    status: 'open',
    bidsCount: 7
  }
];

exports.getAllRFQs = (req, res) => {
  res.json({ success: true, count: mockRFQs.length, data: mockRFQs });
};

exports.createRFQ = (req, res) => {
  const newRfq = {
    id: `rfq-${Date.now()}`,
    ...req.body,
    status: 'open',
    bidsCount: 0,
    created_at: new Date().toISOString()
  };
  mockRFQs.unshift(newRfq);
  res.status(201).json({ success: true, message: 'RFQ posted to reverse marketplace', rfq: newRfq });
};

exports.submitBid = (req, res) => {
  const { rfqId, quotePerUnit, notes } = req.body;
  const rfq = mockRFQs.find(r => r.id === rfqId);
  if (rfq) {
    rfq.bidsCount += 1;
  }
  res.status(201).json({
    success: true,
    message: 'Bid quote submitted to buyer for contract negotiation',
    bid: { rfqId, quotePerUnit, notes, status: 'submitted' }
  });
};
