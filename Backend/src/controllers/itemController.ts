// server/controllers/itemController.ts

import { Request, Response } from 'express';
import Item, { IItem } from '../models/item';
import Branch from '../models/Branch';

// Get all items for a specific branch
export const getItems = async (req: Request, res: Response): Promise<void> => {
  const { branchId } = req.params;

  try {
    const items: IItem[] = await Item.find({ branch: branchId });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error while fetching items.' });
  }
};

// Get a single item by ID for a specific branch
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  const { branchId, itemId } = req.params;

  try {
    const item: IItem | null = await Item.findOne({ _id: itemId, branch: branchId });
    if (!item) {
      res.status(404).json({ message: 'Item not found.' });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Server error while fetching item.' });
  }
};

// Add a new item to a branch
export const addItem = async (req: Request, res: Response): Promise<void> => {
  const { branchId } = req.params;
  const { name, description, quantity, price } = req.body;

  if (!name || quantity == null) {
    res.status(400).json({ message: 'Name and quantity are required.' });
    return;
  }

  try {
    // Optionally, check if branch exists
    const branch = await Branch.findById(branchId);
    if (!branch) {
      res.status(404).json({ message: 'Branch not found.' });
      return;
    }

    const newItem: IItem = new Item({
      name: name.trim(),
      description: description?.trim(),
      quantity,
      price,
      branch: branchId,
    });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Server error while adding item.' });
  }
};

// Edit an existing item
export const editItem = async (req: Request, res: Response): Promise<void> => {
  const { branchId, itemId } = req.params;
  const { name, description, quantity, price } = req.body;

  try {
    const item = await Item.findOne({ _id: itemId, branch: branchId });
    if (!item) {
      res.status(404).json({ message: 'Item not found.' });
      return;
    }

    if (name) item.name = name.trim();
    if (description) item.description = description.trim();
    if (quantity != null) item.quantity = quantity;
    if (price != null) item.price = price;

    await item.save();

    res.status(200).json(item);
  } catch (error) {
    console.error('Error editing item:', error);
    res.status(500).json({ message: 'Server error while editing item.' });
  }
};

// Delete an item
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  const { branchId, itemId } = req.params;

  try {
    const item = await Item.findOneAndDelete({ _id: itemId, branch: branchId });
    if (!item) {
      res.status(404).json({ message: 'Item not found.' });
      return;
    }

    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error while deleting item.' });
  }
};