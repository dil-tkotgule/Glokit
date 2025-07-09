import { pool } from "../config/db";
import { IProductDB, IProductDBThumbnail } from "../models/Product";
import { ICategoryUI, ICategoryDB } from "../models/Category";
import { mapCategoryDBToUI, mapCategoryUIToDB, mapThumbnailDBToUI, mapThumbnailUIToDB } from "../mapper/mapper";

export class ProductRepository {
    public async getAll(): Promise<IProductDBThumbnail[]> {
        const { rows } = await pool.query(
            `SELECT 
                p."id" as "productId",
                p."name",
                p."description",
                p."price",
                p."categoryId",
                p."createdAt",
                p."updatedAt",
                c."name" AS "categoryName",
                t."imageUrl",
                t."fileSize"
            FROM products p
            JOIN categories c ON p."categoryId" = c."id"
            JOIN product_thumbnails t ON p."id" = t."productId"
            WHERE p."isDeleted" = FALSE;`
        );

        console.log("Fetched products:", rows); // Debugging log
        return rows;
    }

    public async softDeleteProduct(id: string): Promise<boolean> {
        const result = await pool.query(`
            UPDATE products
            SET "isDeleted" = TRUE, "updatedAt" = NOW()
            WHERE "id" = $1 AND "isDeleted" = FALSE
        `, [id]);

        // Also soft delete thumbnails
        await pool.query(`
            UPDATE product_thumbnails
            SET "isDeleted" = TRUE, "updatedAt" = NOW()
            WHERE "productId" = $1
        `, [id]);
        if (!result.rowCount) {
            return false; // No rows updated, product may not exist or already deleted    
        }
        return result.rowCount > 0;
    }
    public async getById(id: string): Promise<IProductDBThumbnail[] | null> {
        const { rows } = await pool.query(
            `SELECT 
                p."id" AS "productId",
                p."name",
                p."description",
                p."price",
                p."categoryId",
                p."createdAt",
                p."updatedAt",
                c."name" AS "categoryName",
                t."imageUrl",
                t."fileSize"
            FROM products p
            JOIN categories c ON p."categoryId" = c."id"
            JOIN product_thumbnails t ON p."id" = t."productId"
            WHERE p."id" = $1 and p."isDeleted" = FALSE`, [id]
        );

        console.log("Fetched product by ID:", rows);
        return rows.length > 0 ? rows : null;
    }

    public async createProduct(product: IProductDB): Promise<number> {
        await pool.query("BEGIN");
        try {
            let productID: number;
            const result = await pool.query(
                `INSERT INTO products ("name", "description", "price", "categoryId") 
                VALUES ($1, $2, $3, $4) 
                RETURNING *`,
                [product.name, product.description, product.price, product.categoryId]
            );
            await pool.query("COMMIT");
            productID = result?.rows[0].id || 0;
            return productID;
        } catch (err) {
            await pool.query("ROLLBACK");
            throw err;
        }
    }

    public async updateProduct(id: string, name: string, description: string, price: number, categoryId: number): Promise<IProductDB> {
        const result = await pool.query(
            `UPDATE products 
            SET "name" = $1, "description" = $2, "price" = $3, "categoryId" = $4 
            WHERE "id" = $5 
            RETURNING *`,
            [name, description, price, categoryId, id]
        );
        return result.rows[0];
    }

    public async deleteProductThumbnails(productId: string): Promise<void> {
        await pool.query(`DELETE FROM product_thumbnails WHERE "productId" = $1`, [productId]);
    }

    public async addProductThumbnail(productId: string, imageUrl: string, fileSize: number): Promise<void> {
        await pool.query(
            `INSERT INTO product_thumbnails ("productId", "imageUrl", "fileSize") 
            VALUES ($1, $2, $3)`,
            [productId, imageUrl, fileSize]
        );
    }

    public async getCategoryByName(categoryName: string): Promise<number | null> {
        const result = await pool.query(`SELECT * FROM categories WHERE "name" = $1`, [categoryName]);
        return (result.rowCount ?? 0) > 0 ? result.rows[0].id : null;
    }

    public async createCategory(name: string): Promise<ICategoryDB> {
        const result = await pool.query(
            `INSERT INTO categories ("name") VALUES ($1) RETURNING *`,
            [name]
        );
        return result.rows[0];
    }
}
