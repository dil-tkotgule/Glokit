export interface IProductUI {
    product_id: number;
    product_name: string;
    product_description: string;
    product_quantity: number;
    category_name: string;
    product_category_id?: number;
    created_by?: string | null;
    updated_by?: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    image_urls?: string; // Array of image URLs
    file_sizes?: string; // Array of file sizes
    
}

export interface IProductDB {
    productId: number;
    name: string;
    description: string;
    quantity: number;
    categoryId: number;
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    imageUrls?: string; // Array of image URLs
    fileSizes?: string; // Array of file sizes

}

export interface IProductUIThumbnail {
    product_id: number,
    product_name: string,
    product_description: string,
    product_quantity: number,
    product_category_id: number,
    category_name: string,
    image_url: string, // Optional, if needed
    file_size: number, // Optional, if needed
    created_at: Date,
    updated_at: Date, // Optional, if needed
    image_urls?: string; // Comma-separated string of image URLs
    file_sizes?: string; // Comma-separated string of file sizes
}

// Explicitly define the combined interface to resolve property conflicts
export interface IProductDBThumbnail {
    // From IProductDB
    productId: number;
    name: string;
    description: string;
    quantity: number;
    categoryId: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    categoryName: string;
    imageUrl?: string; // Optional, if needed
    fileSize?: number;
    imageUrls?: string; // Comma-separated string of image URLs
    fileSizes?: string; // Comma-separated string of file sizes
}