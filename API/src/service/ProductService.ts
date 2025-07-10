import { ProductRepository } from "../repository/ProductRepository";
import { IProductUI, IProductDB, IProductDBThumbnail, IProductUIThumbnail } from "../models/Product";
import { pool } from "../config/db";
import { mapProductDBToUI, mapProductListDBToUI, mapProductUIToDB } from "../mapper/mapper";
import ProductValidation from "../ValidationSchemas/ProductValidation";
import { ValidationError } from "../errors/ErrorHandler";
import validator from "validator";

export class ProductService {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    public async getAllProducts(): Promise<IProductUIThumbnail[]> {
        const dbProducts = await this.productRepository.getAll();
        const uiProducts = mapProductListDBToUI(dbProducts); // Map to UI model if needed
        return uiProducts; // No mapping to IProductUI, return as IProductDBThumbnail[]
    }

    public async getProductById(id: string): Promise<IProductUIThumbnail[]> {
        const dbProduct = await this.productRepository.getById(id);
        if (!dbProduct) {
            return [];
        }
        const uiProducts = mapProductListDBToUI(dbProduct!);
        return uiProducts; // No mapping to IProductUI, return as IProductDBThumbnail | null
    }

    public async createProduct(product: IProductUI, files: Express.Multer.File[] | undefined): Promise<number> {
        try {
            // --- Sanitization ---
            console.log(product);
            product.product_name = validator.escape(validator.trim(String(product.product_name)));
            product.product_description = validator.escape(validator.trim(String(product.product_description)));
            product.product_price = Number(product.product_price);
            console.log(product.product_price);
            // Joi validation for product fields
            const { error } = ProductValidation.createProductSchema().validate(product);
            if (error) {
                throw new ValidationError(error.details[0].message);
            }

            // Prepare files for Joi validation (if files exist)
            if (!files || files.length === 0) {
                throw new ValidationError("At least one image is required.");
            }
            const filesForValidation = files.map(file => ({
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
            }));
            const thumbValidation = ProductValidation.thumbnailSchema().validate(filesForValidation);
            if (thumbValidation.error) {
                throw new ValidationError(thumbValidation.error.details[0].message);
            }

            // Ensure category exists and get its ID
            const categoryId = await this.ensureCategoryExists(product.category_name);
            product.product_category_id = categoryId;

            const dbProduct: IProductDB = mapProductUIToDB(product);
            const productID = await this.productRepository.createProduct(dbProduct);
console.log(files)
            for (const file of files) {
                await this.productRepository.addProductThumbnail(productID.toString(), `uploads\\${file.filename}`, file.size);
            }
            return productID;
        } catch (error) {
            throw error;
        }
    }


    public async softDeleteProduct(id: string): Promise<boolean> {
        const dbProduct = await this.productRepository.getById(id);
        if (!dbProduct) {
            return false;
        }
        await this.productRepository.softDeleteProduct(id);
        return true;
    }

    public async updateProduct(id: string, product: IProductUI, files: Express.Multer.File[] | undefined): Promise<IProductUI> {
        // --- Sanitization ---
        product.product_name = validator.escape(validator.trim(String(product.product_name)));
        product.product_description = validator.escape(validator.trim(String(product.product_description)));
        product.product_price = Number(product.product_price);
        console.log(product.product_price)
        // Joi validation for product fields
        const { error } = ProductValidation.updateProductSchema().validate(product);
        if (error) {
            throw new ValidationError(error.details[0].message);
        }

        // Prepare files for Joi validation (if files exist)
        if (!files || files.length === 0) {
            throw new ValidationError("At least one image is required.");
        }
        const filesForValidation = files.map(file => ({
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        }));
        const thumbValidation = ProductValidation.thumbnailSchema().validate(filesForValidation);
        if (thumbValidation.error) {
            throw new ValidationError(thumbValidation.error.details[0].message);
        }

        // Ensure category exists and get its ID
        const categoryId = await this.ensureCategoryExists(product.category_name);
        product.product_category_id = categoryId;

        const dbProduct: IProductDB = mapProductUIToDB(product);

        await pool.query("BEGIN");
        try {
            const updatedProduct = await this.productRepository.updateProduct(
                id,
                dbProduct.name,
                dbProduct.description,
                dbProduct.price,
                dbProduct.categoryId
            );
            await this.productRepository.deleteProductThumbnails(id);
            for (const file of files) {
                await this.productRepository.addProductThumbnail(id, `uploads\\${file.filename}`, file.size);
            }
            await pool.query("COMMIT");
            return mapProductDBToUI(updatedProduct);
        } catch (err) {
            await pool.query("ROLLBACK");
            throw err;
        }
    }

    // Accepts category name, returns category id (number)
    private async ensureCategoryExists(categoryName: string): Promise<number> {
        console.log(categoryName)
        let categoryId: number | null = await this.productRepository.getCategoryByName(categoryName);
        if (!categoryId) {
            const newCategory = await this.productRepository.createCategory(categoryName);
            categoryId = newCategory.id;
        }
        return categoryId;
    }

    // private mapDBToUI(db: IProductDB): IProductUI {
    //     return {
    //         product_id: db.productId,
    //         product_name: db.name,
    //         product_description: db.description,
    //         product_price: db.price,
    //         product_category_id: db.categoryId,
    //         created_by: db.createdBy,
    //         updated_by: db.updatedBy,
    //         created_at: db.createdDate,
    //         updated_at: db.updatedDate,
    //     };
    // }

    // // Map UI to DB
    // private mapUIToDB(ui: IProductUI, categoryId: number): IProductDB {
    //     return {
    //         productId: ui.product_id,
    //         name: ui.product_name,
    //         description: ui.product_description,
    //         price: ui.product_price,
    //         categoryId: categoryId,
    //         createdBy: ui.created_by || null,
    //         updatedBy: ui.updated_by,
    //         createdDate: ui.created_at || null,
    //         updatedDate: ui.updated_at,
    //         isDeleted: false,
    //     };
    // }
}
//         updatedDate: ui.updated_at,
//         isDeleted: false,
//     };
// }


