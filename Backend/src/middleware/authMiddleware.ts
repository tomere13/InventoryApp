// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'your_jwt_secret',
    (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    }
  );
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
};