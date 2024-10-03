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



// Start the server after connecting to MongoDB
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI as string;
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });