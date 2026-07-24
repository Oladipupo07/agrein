"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const payments_js_1 = require("./routes/payments.js");
const wallet_js_1 = require("./routes/wallet.js");
const products_js_1 = require("./routes/products.js");
const rfq_js_1 = require("./routes/rfq.js");
const ai_js_1 = require("./routes/ai.js");
const logistics_js_1 = require("./routes/logistics.js");
const community_js_1 = require("./routes/community.js");
const cooperatives_js_1 = require("./routes/cooperatives.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security and Logging Middlewares
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// API Routes
app.use('/api/payments', payments_js_1.paymentsRouter);
app.use('/api/wallet', wallet_js_1.walletRouter);
app.use('/api/products', products_js_1.productsRouter);
app.use('/api/rfq', rfq_js_1.rfqRouter);
app.use('/api/ai', ai_js_1.aiRouter);
app.use('/api/logistics', logistics_js_1.logisticsRouter);
app.use('/api/community', community_js_1.communityRouter);
app.use('/api/cooperatives', cooperatives_js_1.cooperativesRouter);
// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'Agrein Ecosystem API Server',
        version: '1.0.0',
        interswitchGateway: 'ACTIVE',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('[Agrein Server Error]', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🌾 AGREIN BACKEND API RUNNING ON PORT: ${PORT}`);
    console.log(`💳 INTERSWITCH ESCROW ENGINE READY`);
    console.log(`====================================================`);
});
