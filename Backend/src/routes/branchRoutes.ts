// server/routes/branchRoutes.ts

import express from 'express';
import { createBranch, getAllBranches, getBranchById } from '../controllers/branchController';
import { authenticate, authorize } from '../middleware/auth';
import itemRoutes from './itemRoutes'; // Import item routes

const router = express.Router();

// Protect all branch routes
router.use(authenticate);
router.use('/:branchId/items', itemRoutes); // Make sure this is correct

// Create a new branch
router.post('/', createBranch);

// Get all branches
router.get('/', getAllBranches);

// Get a single branch by ID
router.get('/:branchId', getBranchById);

// Additional routes for updating and deleting branches can be added here.

export default router;