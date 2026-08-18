// Buyer Protection & Escrow Dispute Controller for Agrein — Phase C: Supabase-backed.

const supabase = require('../utils/supabaseClient');

const disputeController = {
  // File a Buyer Dispute
  async fileDispute(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Login required.' });
      }
      const { orderId, reason, description, evidenceUrls } = req.body || {};
      if (!orderId || !reason || !description) {
        return res.status(400).json({ success: false, message: 'Order ID, reason, and description required.' });
      }
      const validReasons = ['NOT_DELIVERED', 'WRONG_PRODUCT', 'DAMAGED', 'POOR_QUALITY', 'QUANTITY_MISMATCH', 'SIGNIFICANTLY_DIFFERENT'];
      if (!validReasons.includes(reason)) {
        return res.status(400).json({ success: false, message: `reason must be one of: ${validReasons.join(', ')}` });
      }

      // Lookup farmer_id from the order so buyer_disputes.farmer_id is satisfied.
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select('id, farmer_id, buyer_id')
        .eq('id', orderId)
        .maybeSingle();
      if (orderErr) throw orderErr;
      if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
      if (order.buyer_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You can only dispute your own orders.' });
      }

      const disputeCode = `DSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data, error } = await supabase.from('buyer_disputes').insert({
        dispute_code: disputeCode,
        order_id: orderId,
        buyer_id: req.user.id,
        farmer_id: order.farmer_id,
        reason,
        description,
        evidence_urls: Array.isArray(evidenceUrls) ? evidenceUrls : [],
        status: 'OPEN'
      }).select('*').single();
      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Buyer protection claim filed. Escrow funds locked pending investigation.',
        dispute: data
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get disputes visible to the caller. Buyers see theirs, farmers see theirs, admins see all.
  async getDisputes(req, res) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Login required.' });
      const { role, status } = req.query;
      let query = supabase.from('buyer_disputes').select('*').order('created_at', { ascending: false });
      if (role === 'buyer' || (!role && req.user.role === 'BUYER')) {
        query = query.eq('buyer_id', req.user.id);
      } else if (role === 'farmer' || (!role && req.user.role === 'FARMER')) {
        query = query.eq('farmer_id', req.user.id);
      }
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return res.json({ success: true, disputes: data || [] });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Admin Resolve Dispute
  async resolveDispute(req, res) {
    try {
      const { disputeId } = req.params;
      const { action, decisionNotes, refundAmount } = req.body || {};
      if (!action || (action !== 'REFUND' && action !== 'RELEASE_PAYMENT')) {
        return res.status(400).json({ success: false, message: "action must be 'REFUND' or 'RELEASE_PAYMENT'." });
      }
      const newStatus = action === 'REFUND' ? 'REFUNDED' : 'RELEASED';
      const { data, error } = await supabase
        .from('buyer_disputes')
        .update({
          status: newStatus,
          admin_decision_notes: decisionNotes || (action === 'REFUND'
            ? 'Refund approved for buyer due to verified product damage.'
            : 'Claim dismissed. Escrow payment released to farmer.'),
          resolved_by: req.user.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', disputeId)
        .select('*')
        .maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ success: false, message: 'Dispute record not found.' });

      return res.json({
        success: true,
        message: `Dispute ${data.dispute_code} resolved (${newStatus}).`,
        dispute: data
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = disputeController;
