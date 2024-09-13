// server/routes/itemRoutes.ts

import express from 'express';
import { getItems, addItem, editItem, deleteItem, getItemById } from '../controllers/itemController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router({ mergeParams: true });

// All item routes are nested under a branch and require authentication
router.use(authenticate);

// Get all items for a branch
router.get('/', getItems);

// Get a specific item by ID
router.get('/:itemId', getItemById);

// Add a new item to a branch (admin only)
router.post('/', authorize('admin'), addItem);

// Edit an item (admin only)
router.put('/:itemId', authorize('admin'), editItem);

// Delete an item (admin only)
router.delete('/:itemId', authorize('admin'), deleteItem);

export default router;