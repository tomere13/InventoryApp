// src/routes/items.ts

import { Router, Request, Response, NextFunction } from 'express';
import Item, { IItem } from '../models/item';

const router = Router();

// Create an item
router.post('/', async (req: Request, res: Response) => {
  const item = new Item(req.body);
  try {
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Get all items
router.get('/', async (req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get an item by ID
router.get('/:id', getItem, (req: Request, res: Response) => {
  res.json(res.locals.item);
});

// Update an item
router.patch('/:id', getItem, async (req: Request, res: Response) => {
  const item = res.locals.item as IItem;
  if (req.body.name != null) {
    item.name = req.body.name;
  }
  if (req.body.quantity != null) {
    item.quantity = req.body.quantity;
  }
  // Update other fields as needed
  try {
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Delete an item
router.delete('/:id', getItem, async (req: Request, res: Response) => {
  const item = res.locals.item as IItem;
  try {
    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Middleware function to get item by ID
async function getItem(req: Request, res: Response, next: NextFunction) {
  let item: IItem | null;
  try {
    item = await Item.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find item' });
    }
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
  res.locals.item = item;
  next();
}

export default router;