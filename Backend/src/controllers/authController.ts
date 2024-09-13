// src/controllers/authController.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Your user model
import bcrypt from 'bcryptjs';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Ensure that JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Create JWT payload
    const payload = {
      id: user._id,
      role: user.role, // Assuming you have a role field
    };

    // Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { login };