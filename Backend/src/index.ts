import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import itemRoutes from './routes/items';
import authRoutes from './routes/auth';
import branchRoutes from './routes/branchRoutes';
import sendReport from './routes/sendReport';
import reports from './routes/reports';
import axios from 'axios'; // Add axios for pinging

// Initialize Express App
const app: Application = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Use your frontend URL or allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies if needed
}));
app.use(express.json()); // Parse incoming JSON

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/reports', reports); // Mount reports router once
app.use('/api/:branchId/items', itemRoutes);
app.use('/api', sendReport);



// Self-ping function to keep the backend awake (only run in server environment)
  const keepAlive = () => {
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
    setInterval(async () => {
      try {
        const response = await axios.get(backendUrl); // Ping the backend URL
        console.log('Pinged backend to keep alive:', response.status);
      } catch (error) {
        console.error('Error pinging backend to keep alive:');
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
      
      // Start the keepAlive function only on the server-side
        keepAlive();
      
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });