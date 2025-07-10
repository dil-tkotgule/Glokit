import { UserUI, UserDB } from '../models/User';

/**
 * Maps UserDB model to UserUI model.
 * @param userDB - The UserDB object to map.
 * @returns The mapped UserUI object.
 */
export function mapUserDBToUI(userDB: UserDB): UserUI {
    return {
        user_id: userDB.user_id,
        name: userDB.name,
        email: userDB.email,
        role: userDB.role,
        password_hash: userDB.password_hash,
        is_verified: userDB.is_verified,
        last_login: userDB.last_login,
        created_at: userDB.created_at,
        deleted_at: userDB.deleted_at,
    };
}

/**
 * Maps UserUI model to UserDB model.
 * @param userUI - The UserUI object to map.
 * @returns The mapped UserDB object.
 */
export function mapUserUIToDB(userUI: UserUI): UserDB {
    return {
        user_id: userUI.user_id,
        name: userUI.name,
        email: userUI.email,
        password_hash: userUI.password_hash, // Assuming password is hashed before saving
        role: userUI.role,
        is_verified: userUI.is_verified,
        last_login: userUI.last_login,
        created_at: userUI.created_at,
        deleted_at: userUI.deleted_at,
    };
}