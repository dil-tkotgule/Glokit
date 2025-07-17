// src/middlewares/Authentication.ts

import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { pool } from '../config/db';
dotenv.config(); // Load environment variables

// Extend Session and Request types
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      role: "hr" | "admin" | "fresher";
      name:string;
      email?: string;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "hr" | "admin" | "fresher";
        email?: string;
        name:string;
      };
    }
  }
}

// Constants
const JWT_SECRET = process.env.JWT_SECRET as string;
const SESSION_SECRET = process.env.SESSION_SECRET || 'default-session-secret';

if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is missing in your .env file');
}

// PostgreSQL session store
const PgSession = pgSession(session);
// const pgPool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

export const sessionMiddleware = session({
  store: new PgSession({
    pool: pool,
    tableName: 'user_sessions',
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true if HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'lax',
  },
});

// ✅ Add cookie parser (used for JWT fallback)
export const cookieMiddleware = cookieParser();

// 🔐 Authentication middleware
export function authenticate(req: Request, res: Response, next: NextFunction):void {
  // Check session first
  console.log(req.session)
  if (req.session?.user) {
    req.user = req.session.user;
     next();
     return;
  }

  // Fallback: Check JWT from cookie
  const token = req.cookies?.token;
  if (!token) {
     res.status(401).json({ message: 'Authentication required' });return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: "hr" | "admin" | "fresher";
      email?: string;
      name:string;
    };

    req.user = decoded;
    req.session.user = decoded;
     next();
     return;
  } catch (err) {
     res.status(401).json({ message: 'Invalid or expired token' });
     return
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
     res.status(401).json({ message: 'Not authenticated' });
     return;
  }

  if (req.user.role !== 'admin') {
     res.status(403).json({ message: 'Admin access required' });
     return;
  }

   next();
   return;
}

// export function requireUser(req: Request, res: Response, next: NextFunction) {
//   if (!req.user) {
//     return res.status(401).json({ message: 'Not authenticated' });
//   }

//   if (req.user.role !== 'hr' && req.user.role !== 'admin' && req.user.role!=='fresher') {
//     return res.status(403).json({ message: 'User access required' });
//   }

//   return next();
// }
