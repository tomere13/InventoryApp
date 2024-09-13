// src/routes/auth.ts

import { Router } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

const router = Router();

// Register a new user (for admin use)
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Only allow admin to create new users
    // Implement middleware to check admin privileges if necessary

    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user: IUser | null = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'b86dc8aefce03c58182bff817fa02c9fac5c3a86cf33b19f8efff452e8888efd',
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

export default router;