import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { paymentsRouter } from './routes/payments.js';
import { walletRouter } from './routes/wallet.js';
import { productsRouter } from './routes/products.js';
import { rfqRouter } from './routes/rfq.js';
import { aiRouter } from './routes/ai.js';
import { logisticsRouter } from './routes/logistics.js';
import { communityRouter } from './routes/community.js';
import { cooperativesRouter } from './routes/cooperatives.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and Logging Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/payments', paymentsRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/products', productsRouter);
app.use('/api/rfq', rfqRouter);
app.use('/api/ai', aiRouter);
app.use('/api/logistics', logisticsRouter);
app.use('/api/community', communityRouter);
app.use('/api/cooperatives', cooperativesRouter);

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
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Agrein Server Error]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌾 AGREIN BACKEND API RUNNING ON PORT: ${PORT}`);
  console.log(`💳 INTERSWITCH ESCROW ENGINE READY`);
  console.log(`====================================================`);
});
