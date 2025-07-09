export interface IThumbnailDB {
        id: string,
        productId: string,
        imagePath: string,
        createdAt?: Date | null,
        updatedAt?: Date | null
}

export interface IThumbnailUI {
        thumbnail_id: string,
        product_id: string,
        image_path: string,
        created_at?: Date | null,
        updated_at?: Date | null
}

