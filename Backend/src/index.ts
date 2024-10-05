import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import itemRoutes from './routes/items';
import authRoutes from './routes/auth';
import branchRoutes from './routes/branchRoutes';
import sendReport from './routes/sendReport';
import reports from './routes/reports';
import axios from 'axios';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI as string;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Determine build path
const buildPath = process.env.REACT_BUILD_PATH || path.join(__dirname, '..', 'frontend', 'build');

// Serve static files from the React app's build directory
console.log('Serving static files from:', buildPath);
app.use(express.static(buildPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/reports', reports);
app.use('/api/:branchId/items', itemRoutes);
app.use('/api', sendReport);

// Catch-all route to serve React's index.html for unknown routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(buildPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send(err);
    }
  });
});

// Self-ping function to keep the backend awake
const keepAlive = () => {
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
  setInterval(async () => {
    try {
      const response = await axios.get(backendUrl);
      console.log('Pinged backend to keep alive:', response.status);
    } catch (error) {
      console.error('Error pinging backend to keep alive:', error);
    }
  }, 10 * 60 * 1000);
};

// MongoDB Connection and Server Start
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      keepAlive();
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });