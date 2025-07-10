import UserRepository from "../repository/UserRepository";
import { UserUI, UserDB } from "../models/User";
import { mapUserDBToUI, mapUserUIToDB } from "../mapper/userMapper";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { ValidationError } from "../errors/ErrorHandler";
import UserValidation from "../ValidationSchemas/UserValidation";
import { sendError } from "../utils/responseUtil";

class UserService {

    public async login(email: string, password: string): Promise<UserUI | null> {
        // --- Sanitization ---
        email = validator.escape(validator.trim(email));
        password = validator.escape(validator.trim(password));

        // Joi validation for email and password
        const { error } = UserValidation.loginSchema().validate({ email, password });
        if (error) {
            throw new ValidationError(error.details[0].message);
        }

        // Get user by email
        const user: UserDB | null = await UserRepository.getUserByEmail(email);
        if (!user) {
            return null;
        }

        // Compare password hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return null;
        }

        // Map DB to UI (do not expose password_hash)
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword as UserUI;
    }

    public async getProfile(userId: number): Promise<UserUI | null> {
        // Validate userId
        if (!userId) {
            throw new Error("User ID is required.");
        }

        // Call the repository method to get the user profile
        const user = await UserRepository.getProfile(userId);

        // If user is not found, return null
        if (!user) {
            return null;
        }

        // Map the user from DB model to UI model if needed
        return mapUserDBToUI(user);
    }

    public async logout(userId: number): Promise<void> {
        if (!userId) {
            throw new Error("User ID is required for logout.");
        }

        // Call the repository method to perform logout
        await UserRepository.logout(userId);
    }

}

export default new UserService();