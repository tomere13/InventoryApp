// backend/src/index.ts

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
import path from 'path';


const app: Application = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Replace FRONTEND_URL with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Set to true if you need to send cookies
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/reports', reports); // Mount reports router once
app.use('/api/:branchId/items', itemRoutes);
app.use('/api', sendReport);

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Self-ping function to keep the backend awake
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


// Start the server after connecting to MongoDB
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
    console.error('Error connecting to MongoDB', error);
  });

  