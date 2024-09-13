// backend/src/index.ts

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import itemRoutes from './routes/items';
import authRoutes from './routes/auth';
import branchRoutes from './routes/branchRoutes';



const app: Application = express();
// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/branches', branchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/:branchId/items', itemRoutes);
dotenv.config();


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