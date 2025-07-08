// export class Product {
//     constructor(
//         public id: string,
//         public name: string,
//         public description: string,
//         public price: number,
//         public category_id: number,
//         public created_by?: string|null,
//         public updated_by?: string|null,
//         public created_at?: Date|null,
//         public updated_at?: Date|null,

//     ) {}
// }
import { IThumbnailDB} from "./Thumbnail";
import {ICategoryDB} from "./Category";
export interface IProductUI {
    product_id: number;
    product_name: string;
    product_description: string;
    product_price: number;
    category_name:string;
    product_category_id?: number;
    created_by?: string|null;
    updated_by?: string|null;
    created_at?: Date|null;
    updated_at?: Date|null;
}

export interface IProductDB {
    productId: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    createdBy?: string|null;
    updatedBy?: string|null;
    createdAt?: Date|null;
    updatedAt?: Date|null;

}

export interface IProductUIThumbnail{
  product_id: number,
        product_name: string,
        product_description: string,
        product_price: number,
        product_category_id: number,
        category_name: string,
       image_url: string, // Optional, if needed
        file_size: number, // Optional, if needed
        created_at: Date,
        updated_at: Date, // Optional, if needed
}
// Explicitly define the combined interface to resolve property conflicts
export interface IProductDBThumbnail {
    // From IProductDB
    productId: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    createdAt?: Date|null;
    updatedAt?: Date|null;
    categoryName: string;
   imageUrl?: string; // Optional, if needed
    fileSize?: number;
     // Optional, if needed
    

    // From ICategoryDB (rename 'id' to 'categoryId' if needed)
    // id: number; // Commented out to avoid conflict, use categoryId from IProductDB

    // From IThumbnailDB (rename 'id' and 'productId' if needed)
    // id: number; // Commented out to avoid conflict
    // productId: number; // Already included above

    // Add other properties from ICategoryDB and IThumbnailDB that do not conflict
    // Example:
    // thumbnailUrl?: string;
    // categoryName?: string;
}