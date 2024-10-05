import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path'; // Import path
import itemRoutes from './routes/items';
import authRoutes from './routes/auth';
import branchRoutes from './routes/branchRoutes';
import sendReport from './routes/sendReport';
import reports from './routes/reports';
import axios from 'axios';

// Initialize Express App
const app: Application = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/reports', reports);
app.use('/api/:branchId/items', itemRoutes);
app.use('/api', sendReport);

// Catch-all route to serve React's index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
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
  }, 10 * 60 * 1000); // Ping every 10 minutes
};

// MongoDB Connection and Server Start
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI as string;

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