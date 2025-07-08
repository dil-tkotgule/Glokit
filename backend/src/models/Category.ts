export interface ICategoryDB {
    id: number;
    name: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export interface ICategoryUI {
    category_id: number;
    category_name: string;
    created_at?: Date | null;
    updated_at?: Date | null;
}
