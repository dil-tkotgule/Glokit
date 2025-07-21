import UserRepository from "../repository/UserRepository";
import { UserUI, UserDB } from "../models/User";
import { mapUserDBToUI, mapUserUIToDB } from "../mapper/userMapper";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { ValidationError } from "../errors/ErrorHandler";
import UserValidation from "../ValidationSchemas/UserValidation";

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

    public async register(email: string, password: string, name: string): Promise<UserUI> {
        // --- Sanitization ---
        email = validator.escape(validator.trim(email));
        password = validator.escape(validator.trim(password));
        name = validator.escape(validator.trim(name));

        // Joi validation for email and password
        const { error } = UserValidation.registerSchema().validate({ email, password, name });
        if (error) {
            throw new ValidationError(error.details[0].message);
        }

        // Check if user already exists
        const existingUser = await UserRepository.getUserByEmail(email);
        if (existingUser) {
            throw new ValidationError("User with this email already exists.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser: Partial<UserDB> = {
            email,
            password_hash: hashedPassword,
            role: 'fresher', // Default role, can be changed later
            user_id: 0, // This will be set by the database
            name
        };

        // Save the user to the database
        const createdUser = await UserRepository.register(newUser);

        // Map DB to UI (do not expose password_hash)
        return mapUserDBToUI(createdUser);
    }

    public async changePassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
        // --- Sanitization ---
        email = validator.escape(validator.trim(email));
        currentPassword = validator.escape(validator.trim(currentPassword));
        newPassword = validator.escape(validator.trim(newPassword));

        // Validate inputs
        if (!email || !currentPassword || !newPassword) {
            throw new ValidationError("User email, current password, and new password are required");
        }

        // Get user by email
        const user: UserDB | null = await UserRepository.getUserByEmail(email);
        if (!user) {
            throw new ValidationError("User not found");
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isCurrentPasswordValid) {
            return false;
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database using user_id
        const result = await UserRepository.updatePassword(user.user_id, hashedNewPassword);
        
        return result;
    }

}

export default new UserService();