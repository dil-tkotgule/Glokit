import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

// Extend Express session and request types
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      role: 'admin' | 'user';
      email?: string;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'admin' | 'user';
        email?: string;
      };
    }
  }
}

// Constants
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in .env');
}

// Session setup (Put this in your main app.ts or server.ts)
export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'default-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
});

// Middleware: Authenticate request using session or JWT
export function authenticate(req: Request, res: Response, next: NextFunction) {
  // Check session
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }

  // Check token from cookies
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: 'admin' | 'user';
      email?: string;
    };
    req.user = decoded;
    req.session.user = decoded; // optional session set
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Middleware: Require admin role
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// Middleware: Require user (or admin) role
export function requireUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (req.user.role !== 'user' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'User access required' });
  }
  next();
}
