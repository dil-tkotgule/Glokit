import { Request, Response } from 'express';
import UserService from '../service/UserService';
import { NotFoundError } from '../errors/ErrorHandler';
import logger from '../utils/logger';
import { sendError, sendSuccess } from '../utils/responseUtil';
import jwt from 'jsonwebtoken';
// src/types.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      name:string;
      role: 'hr' | 'admin' | 'fresher';
      email?: string;
    };
  }
}

declare namespace Express {
  interface Request {
    user?: {
      id: string;
      name:string;
      role: 'hr' | 'admin' | 'fresher';
      email?: string;
    };
  }
}


// or './types' depending on your file structure

class UserController {
 public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log('[Login] Request body:', req.body);

      const user = await UserService.login(email, password);

      if (!user) {
        return sendError(res, new NotFoundError('Invalid email or password'));
      }

      // Regenerate session to avoid fixation
      req.session.regenerate((err) => {
        if (err) {
          logger.error('[Login] Session regeneration failed:', err);
          return sendError(res, err);
        }

        // Store user info in session
        req.session.user = {
          id: user.user_id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
        console.log("user session ")
        console.log(req.session.user)

        // Generate JWT
        const token = jwt.sign(
          {
            id: user.user_id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET || 'default_jwt_secret',
          { expiresIn: '1d' }
        );

        // Set token in HttpOnly cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Save the session and respond
        req.session.save((err) => {
          if (err) {
            logger.error('[Login] Session save failed:', err);
            return sendError(res, err);
          }

          logger.info(`[Login] User ${user.email} logged in successfully`);
          return sendSuccess(res, { user }, 'User logged in successfully');
        });
      });
    } catch (error) {
      logger.error('[Login] Unexpected error during login:', error);
      sendError(res, error);
    }
  }



  public async logout(req: Request, res: Response): Promise<void> {
    try {
      req.session.destroy((err) => {
        if (err) {
          sendError(res, err);
          return;
        }
        res.clearCookie('connect.sid'); // default session cookie name
        res.clearCookie('token'); // clear JWT cookie if set
        sendSuccess(res, {}, 'User logged out successfully');
      });
    } catch (error) {
      logger.error('Error logging out user', { error });
      sendError(res, error);
    }
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;
      const user = await UserService.register(email, password, name);

      if (!user) {
        sendError(res, new NotFoundError('User registration failed'));
        return;
      }

      sendSuccess(res, { user }, 'User registered successfully');
    } catch (error) {
      logger.error('Error registering user', { error });
      sendError(res, error);
    }
  }

  public async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      console.log('Change Password Request:', req.body);
      console.log('User ID from params:', req.params);
      const { userId } = req.params;

      // Validate required fields
      if (!currentPassword || !newPassword || !confirmPassword) {
        sendError(res, new Error("Current password, new password, and confirm password are required"));
        return;
      }

      // Validate new password confirmation
      if (newPassword !== confirmPassword) {
        sendError(res, new Error("New password and confirm password do not match"));
        return;
      }

      // Validate password strength
      if (newPassword.length < 6) {
        sendError(res, new Error("New password must be at least 6 characters long"));
        return;
      }

      if (!userId) {
        sendError(res, new Error("User ID is required"));
        return;
      }

      // Call service to change password
      const result = await UserService.changePassword(userId, currentPassword, newPassword);
      
      if (!result) {
        sendError(res, new Error("Current password is incorrect"));
        return;
      }

      sendSuccess(res, null, "Password changed successfully");
    } catch (error) {
      logger.error('Error changing password', { error });
      sendError(res, error);
    }
  }
}

export default new UserController();
