import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payments';
import deliveryRoutes from './routes/deliveries';
import messageRoutes from './routes/messages';
import analyticsRoutes from './routes/analytics';
import rfqRoutes from './routes/rfq';
import verificationRoutes from './routes/verification';
import cooperativesRoutes from './routes/cooperatives';
import intelligenceRoutes from './routes/intelligence';
import walletRoutes from './routes/wallet';
import subscriptionsRoutes from './routes/subscriptions';
import learningRoutes from './routes/learning';
import exportRoutes from './routes/export';
import forumRoutes from './routes/forum';
import traceabilityRoutes from './routes/traceability';
import { config } from './config';

// Load environment variables from .env if present (no-op if missing).
dotenv.config();

const app = express();
const PORT = config.port;

// Enable CORS
app.use(cors({
  origin: '*', // For local dev, allows any frontend connection
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), platform: 'Agrein' });
});

// Routing namespaces
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/rfq', rfqRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/cooperatives', cooperativesRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/traceability', traceabilityRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[SERVER ERROR]:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  Agrein Backend Server Running on Port: ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});
