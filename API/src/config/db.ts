import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
class Database {
    private static instance: Database;
    private pool: Pool;
    private constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false, // Required by Neon
            },
        });
        
 
        this.pool.connect()
            .then(() => {
                console.log("Connecting to DB:", process.env.DATABASE_URL);
                console.log('[DB] Connected to Neon database');
            })
            .catch((err) => {
                console.error('[DB] Connection error:', err.message);
                process.exit(1);
            });
    }
 
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
 
    public getPool(): Pool {
        return this.pool;
    }
}

const db = Database.getInstance();
export const pool = db.getPool();