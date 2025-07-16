import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

class Database {
    private static instance: Database;
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
           user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
        });

        this.pool.connect()
            .then(() => {


                console.log('[DB] Database connected');
            })
            .catch((err) => {
                console.error('[DB] Connection error', err);
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