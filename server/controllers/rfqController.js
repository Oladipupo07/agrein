// Buyer Reverse Marketplace RFQ Controller for Agrein — Phase C: Supabase-backed.

const supabase = require('../utils/supabaseClient');

exports.getAllRFQs = async (req, res) => {
  try {
    const { owner } = req.query;
    let query = supabase
      .from('rfqs')
      .select('*, rfq_bids(id, bid_price, message, status, created_at, farmer_id)')
      .order('created_at', { ascending: false });

    if (owner === 'me' && req.user && req.user.id) {
      query = query.eq('buyer_id', req.user.id);
    } else {
      query = query.in('status', ['OPEN', 'AWAITING_BIDS']);
    }

    const { data, error } = await query;
    if (error) throw error;

    const items = (data || []).map((r) => ({
      id: r.id,
      crop_name: r.crop_name,
      crop: r.crop_name,
      quantity: Number(r.quantity),
      qty: Number(r.quantity),
      target_price: r.target_price == null ? null : Number(r.target_price),
      delivery_state: r.delivery_state,
      location: r.delivery_state,
      notes: r.notes,
      status: (r.status || '').toLowerCase(),
      bidsCount: Array.isArray(r.rfq_bids) ? r.rfq_bids.length : 0,
      created_at: r.created_at,
      buyer_id: r.buyer_id
    }));

    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createRFQ = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Login required.' });
    const { crop_name, quantity, target_price, delivery_state, notes } = req.body || {};
    if (!crop_name || !quantity) return res.status(400).json({ success: false, message: 'crop_name and quantity required.' });

    const { data, error } = await supabase
      .from('rfqs')
      .insert({
        buyer_id: req.user.id,
        crop_name,
        quantity: Number(quantity),
        target_price: target_price == null ? null : Number(target_price),
        delivery_state: delivery_state || null,
        notes: notes || null,
        status: 'OPEN'
      })
      .select('*')
      .single();
    if (error) throw error;
    return res.status(201).json({ success: true, message: 'RFQ posted', rfq: data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitBid = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Login required.' });
    const farmerId = req.user.id;
    const { rfqId, bid_price, quotePerUnit, message, notes } = req.body || {};
    if (!rfqId) return res.status(400).json({ success: false, message: 'rfqId required.' });

    const price = bid_price != null ? Number(bid_price) : Number(quotePerUnit);
    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ success: false, message: 'bid_price must be a positive number.' });
    }

    const { data, error } = await supabase.from('rfq_bids').insert({
      rfq_id: rfqId,
      farmer_id: farmerId,
      bid_price: price,
      message: message || notes || null,
      status: 'SUBMITTED'
    }).select('*').single();
    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Bid submitted',
      bid: { ...data, rfqId, quotePerUnit: price, notes: data.message, status: 'submitted' }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
