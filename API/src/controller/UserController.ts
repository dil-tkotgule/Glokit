import UserService from "../service/UserService";
import { Request, Response } from "express";
import { UserUI } from "../models/User";
import { NotFoundError } from "../errors/ErrorHandler";
import logger from "../utils/logger";
import { sendError, sendSuccess } from '../utils/responseUtil';
import jwt from 'jsonwebtoken';

class UserController {

    public async login(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body);

            const { email, password } = req.body;
            
            const user = await UserService.login(email, password);
            
            if (!user) {
                sendError(res, new NotFoundError("Invalid email or password"));
                return;
            }

            // Generate JWT
            const token = jwt.sign({
                user_id: user.user_id,
                email: user.email,
                role: user.role
            }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });


            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            });

            sendSuccess(res, { user }, "User logged in successfully");
        } catch (error) {
            logger.error("Error fetching user", { error });
            sendError(res, error);
        }
    }

    public async logout(req: Request, res: Response): Promise<void> {
        try {
            // Clear the JWT cookie
            res.clearCookie('token');
            sendSuccess(res, {}, "User logged out successfully");
        } catch (error) {
            logger.error("Error logging out user", { error });
            sendError(res, error);
        }
    }

}

export default new UserController();