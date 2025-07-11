export interface UserUI {
    user_id: number;
    name: string;
    email: string;
    password_hash: string;
    role: 'fresher' | 'hr' | 'admin';
    is_verified: boolean;
    last_login: Date | null;
    created_at: Date;
    deleted_at: Date | null;
}

export interface UserDB {
    user_id: number;
    name: string;
    email: string;
    password_hash: string;
    role: 'fresher' | 'hr' | 'admin';
    is_verified: boolean;
    last_login: Date | null;
    created_at: Date;
    deleted_at: Date | null;
}