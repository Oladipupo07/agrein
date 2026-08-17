// Buyer Protection & Escrow Dispute Controller for Agrein

let mockDisputes = [];

const disputeController = {
  // File a Buyer Dispute
  async fileDispute(req, res) {
    try {
      const { orderId, reason, description, evidenceUrls } = req.body;

      if (!orderId || !reason || !description) {
        return res.status(400).json({ success: false, message: 'Order ID, dispute reason, and detailed description are required.' });
      }

      const validReasons = ['NOT_DELIVERED', 'WRONG_PRODUCT', 'DAMAGED', 'POOR_QUALITY', 'QUANTITY_MISMATCH', 'SIGNIFICANTLY_DIFFERENT'];
      if (!validReasons.includes(reason)) {
        return res.status(400).json({ success: false, message: `Invalid dispute reason. Must be one of: ${validReasons.join(', ')}` });
      }

      const newDispute = {
        id: `dsp-${Date.now()}`,
        dispute_code: `DSP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        order_id: orderId,
        buyer_id: req.user ? req.user.id : null,
        buyer_name: req.user ? req.user.full_name : null,
        farmer_name: null,
        reason,
        description,
        evidence_urls: evidenceUrls || [],
        status: 'OPEN',
        created_at: new Date().toISOString()
      };

      mockDisputes.unshift(newDispute);

      res.status(201).json({
        success: true,
        message: 'Buyer protection claim filed successfully. Escrow funds locked pending investigation.',
        dispute: newDispute
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get all disputes (Admin or Buyer)
  async getDisputes(req, res) {
    try {
      res.json({
        success: true,
        disputes: mockDisputes
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Admin Resolve Dispute (REFUND vs RELEASE_PAYMENT)
  async resolveDispute(req, res) {
    try {
      const { disputeId } = req.params;
      const { action, decisionNotes, refundAmount } = req.body; // 'REFUND' or 'RELEASE_PAYMENT'

      const dispute = mockDisputes.find(d => d.id === disputeId || d.dispute_code === disputeId);
      if (!dispute) {
        return res.status(404).json({ success: false, message: 'Dispute record not found.' });
      }

      if (action === 'REFUND') {
        dispute.status = 'REFUNDED';
        dispute.admin_decision_notes = decisionNotes || 'Refund approved for buyer due to verified product damage.';
        dispute.refund_amount = refundAmount || 125000;
      } else {
        dispute.status = 'RELEASED';
        dispute.admin_decision_notes = decisionNotes || 'Claim dismissed after inspection. Escrow payment released to farmer.';
      }

      dispute.resolved_at = new Date().toISOString();

      res.json({
        success: true,
        message: `Dispute ${dispute.dispute_code} resolved with decision: ${action}.`,
        dispute
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = disputeController;
