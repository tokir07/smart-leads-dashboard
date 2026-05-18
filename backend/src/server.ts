import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import authRoutes from './routes/auth.routes';
import leadsRoutes from './routes/leads.routes';
import { errorHandler } from './middlewares/error.middleware';

// Force Node to resolve DNS via IPv4 and override with Google & Cloudflare DNS servers
// This completely bypasses any blocking local ISP/Router DNS rules!
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-leads';

let isConnected = false;

// Middleware to ensure DB connection for serverless functions
app.use(async (req, res, next) => {
  if (!isConnected && mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(mongoUri);
      isConnected = true;
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('❌ DB connection failed:', err);
    }
  }
  next();
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;
