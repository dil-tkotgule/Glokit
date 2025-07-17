import { IProductDB, IProductDBThumbnail, IProductUI, IProductUIThumbnail } from "../models/Product";
import { ICategoryDB, ICategoryUI } from "../models/Category";
import { IThumbnailDB, IThumbnailUI } from "../models/Thumbnail";

// Product mapping
export function mapProductDBToUI(db: IProductDB): IProductUI {
    return {
        product_id: db.productId,
        product_name: db.name,
        product_description: db.description,
        product_quantity: db.quantity,
        product_category_id: db.categoryId,
        category_name: "", // or null, depending on IProductUI definition
        created_by: db.createdBy,
        updated_by: db.updatedBy,
        created_at: db.createdAt,
        updated_at: db.updatedAt,
    };
}
export function mapProductListDBToUI(db: IProductDBThumbnail[]): IProductUIThumbnail[] {
    return db.map(product => ({
        product_id: product.productId,
        product_name: product.name,
        product_description: product.description,
        product_quantity: product.quantity,
        product_category_id: product.categoryId,
        category_name: product.categoryName, // or null, depending on IProductUI definition
        image_url: product.imageUrl ?? "", // Provide a default empty string if undefined
        file_size: product.fileSize ?? 0, // Provide a default value if undefined
        created_at: product.createdAt ?? new Date(0),
        updated_at: product.updatedAt ?? new Date(0),
    }));
}
export function mapProductUIToDB(ui: IProductUI): IProductDB {
    return {
        productId: ui.product_id,
        name: ui.product_name,
        description: ui.product_description,
        quantity: ui.product_quantity,
        categoryId: ui.product_category_id !== undefined ? ui.product_category_id : 0, // or handle as needed
        createdBy: ui.created_by || null,
        updatedBy: ui.updated_by,
        createdAt: ui.created_at || null,
        updatedAt: ui.updated_at,
       
    };
}

// Category mapping
export function mapCategoryDBToUI(db: ICategoryDB): ICategoryUI {
    return {
        category_id: db.id,
        category_name: db.name,
        created_at: db.createdAt,
        updated_at: db.updatedAt,
    };
}

export function mapCategoryUIToDB(ui: ICategoryUI): ICategoryDB {
    return {
        id: ui.category_id,
        name: ui.category_name,
        createdAt: ui.created_at,
        updatedAt: ui.updated_at,
    };
}

// Thumbnail mapping
export function mapThumbnailDBToUI(db: IThumbnailDB): IThumbnailUI {
    return {
        thumbnail_id: db.id,
        product_id: db.productId,
        image_path: db.imagePath,
        created_at: db.createdAt,
        updated_at: db.updatedAt,
    };
}


export function mapThumbnailUIToDB(ui: IThumbnailUI): IThumbnailDB {
    return {
        id: ui.thumbnail_id,
        productId: ui.product_id,
        imagePath: ui.image_path,
        createdAt: ui.created_at,
        updatedAt: ui.updated_at,
    };
}
