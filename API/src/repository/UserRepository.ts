import {pool} from '../config/db';
import { UserDB } from '../models/User';
import { mapUserDBToUI, mapUserUIToDB } from '../mapper/userMapper';

class UserRepository {

    // Get user by email for login (password check in service)
    public async getUserByEmail(email: string): Promise<UserDB | null> {
        console.log(email)
        const { rows } = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );
        console.log(rows)
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }

    public async getProfile(userId: number): Promise<UserDB | null> {
        const { rows } = await pool.query(
            `SELECT * FROM users WHERE user_id = $1`,
            [userId]
        );

        if (rows.length === 0) {
            return null; // No user found with the given userId
        }

        return mapUserDBToUI(rows[0]);
    }

    public async logout(userId: number): Promise<void> {
        console.log(`User with ID ${userId} logged out.`);
    }

    public async register(userData: Partial<UserDB>): Promise<UserDB> {
        const { rows } = await pool.query(
            `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *`,
            [userData.name, userData.email, userData.password_hash, userData.role]
        );

        return rows[0];
    }

    public async getUserById(userId: number): Promise<UserDB | null> {
        const { rows } = await pool.query(
            `SELECT * FROM users WHERE user_id = $1`,
            [userId]
        );
        
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }

    public async updatePassword(userId: number, hashedPassword: string): Promise<boolean> {
        const { rowCount } = await pool.query(
            `UPDATE users SET password_hash = $1 WHERE user_id = $2`,
            [hashedPassword, userId]
        );
        
        return rowCount! > 0;
    }
}

export default new UserRepository();