"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRouter = void 0;
const express_1 = require("express");
const interswitch_js_1 = require("../services/interswitch.js");
exports.paymentsRouter = (0, express_1.Router)();
// Store mock database state in memory for immediate API usage when standalone
const escrowStore = {};
/**
 * POST /api/payments/initialize
 * Initialize Interswitch payment for Order or Wallet deposit
 */
exports.paymentsRouter.post('/initialize', async (req, res) => {
    try {
        const { amount, email, channel, orderId, isWalletFunding } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid payment amount is required' });
        }
        const transactionRef = `AGR_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const result = await interswitch_js_1.interswitchService.initializePayment({
            amount: Number(amount),
            email: email || 'customer@agrein.ng',
            transactionRef,
            paymentChannel: channel || 'card',
        });
        // Record initial Escrow hold entry if this is an order purchase
        if (orderId) {
            escrowStore[transactionRef] = {
                orderId,
                amount,
                status: 'held',
                buyerEmail: email,
                paymentChannel: channel || 'interswitch_card',
                createdAt: new Date().toISOString(),
            };
        }
        res.json({
            success: true,
            message: 'Interswitch transaction initialized successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
/**
 * POST /api/payments/verify
 * Verify payment with Interswitch API and update Escrow / Wallet
 */
exports.paymentsRouter.post('/verify', async (req, res) => {
    try {
        const { transactionRef, amount } = req.body;
        if (!transactionRef) {
            return res.status(400).json({ error: 'transactionRef is required' });
        }
        const verification = await interswitch_js_1.interswitchService.verifyPayment(transactionRef, Number(amount || 5000));
        if (verification.status === 'SUCCESS' && escrowStore[transactionRef]) {
            escrowStore[transactionRef].status = 'held';
            escrowStore[transactionRef].interswitchRef = verification.paymentReference;
        }
        res.json({
            success: true,
            data: {
                verification,
                escrow: escrowStore[transactionRef] || null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
/**
 * POST /api/payments/escrow/release
 * Release Escrow funds to Farmer Wallet after buyer delivery confirmation
 */
exports.paymentsRouter.post('/escrow/release', async (req, res) => {
    try {
        const { transactionRef, farmerId } = req.body;
        if (escrowStore[transactionRef]) {
            escrowStore[transactionRef].status = 'released';
            escrowStore[transactionRef].releasedAt = new Date().toISOString();
        }
        res.json({
            success: true,
            message: 'Escrow funds successfully released to Farmer Agrein Wallet minus platform commission (3%)',
            data: {
                transactionRef,
                farmerId: farmerId || 'farmer_101',
                netPayout: escrowStore[transactionRef] ? escrowStore[transactionRef].amount * 0.97 : 0,
                status: 'released',
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
/**
 * POST /api/payments/webhook
 * Interswitch Webhook Handler
 */
exports.paymentsRouter.post('/webhook', (req, res) => {
    const signature = req.headers['x-interswitch-signature'];
    const rawBody = JSON.stringify(req.body);
    const isValid = interswitch_js_1.interswitchService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid Interswitch HMAC signature' });
    }
    console.log('[Interswitch Webhook Event]', req.body);
    res.status(200).json({ received: true });
});
