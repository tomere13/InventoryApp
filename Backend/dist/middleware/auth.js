"use strict";
// server/middleware/auth.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided.' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ message: 'Invalid token.' });
    }
};
exports.authenticate = authenticate;
const authorize = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        }
        else {
            res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
        }
    };
};
exports.authorize = authorize;
