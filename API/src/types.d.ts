// src/types.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      role: 'hr' | 'admin' | 'fresher';
      email?: string;
    };
  }
}

declare namespace Express {
  interface Request {
    user?: {
      id: string;
      role: 'hr' | 'admin' | 'fresher';
      email?: string;
    };
  }
}
