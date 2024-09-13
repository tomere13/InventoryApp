// server/controllers/branchController.ts

import { Request, Response } from 'express';
import Branch, { IBranch } from '../models/Branch';

// Create a new branch
export const createBranch = async (req: Request, res: Response): Promise<void> => {
  const { name, address } = req.body;

  if (!name || !address) {
    res.status(400).json({ message: 'Name and address are required.' });
    return;
  }

  try {
    const existingBranch = await Branch.findOne({ name });
    if (existingBranch) {
      res.status(400).json({ message: 'Branch name already exists.' });
      return;
    }

    const newBranch: IBranch = new Branch({ name, address });
    await newBranch.save();

    res.status(201).json(newBranch);
  } catch (error) {
    console.error('Error creating branch:', error);
    res.status(500).json({ message: 'Server error while creating branch.' });
  }
};

// Get all branches
export const getAllBranches = async (req: Request, res: Response): Promise<void> => {
  try {
    const branches: IBranch[] = await Branch.find().sort({ createdAt: -1 });
    res.status(200).json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ message: 'Server error while fetching branches.' });
  }
};

// Get a single branch by ID
export const getBranchById = async (req: Request, res: Response): Promise<void> => {
  const { branchId } = req.params;

  try {
    const branch: IBranch | null = await Branch.findById(branchId);
    if (!branch) {
      res.status(404).json({ message: 'Branch not found.' });
      return;
    }
    res.status(200).json(branch);
  } catch (error) {
    console.error('Error fetching branch:', error);
    res.status(500).json({ message: 'Server error while fetching branch.' });
  }
};