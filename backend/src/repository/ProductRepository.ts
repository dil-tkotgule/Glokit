import { pool } from "../server";
import { IProductDB,IProductDBThumbnail } from "../models/Product";
import { ICategoryUI, ICategoryDB } from "../models/Category";
import { mapCategoryDBToUI, mapCategoryUIToDB, mapThumbnailDBToUI, mapThumbnailUIToDB } from "../mapper/mapper";

export class ProductRepository {
    public async getAll(): Promise<IProductDBThumbnail[]> {
        const { rows } = await pool.query(
            `SELECT 
                p.id AS product_id,
                p.name,
                p.description,
                p.price,
                p.category_id,
                p.created_at,
                p.updated_at,
                c.name AS category_name,
                t.image_url,
                t.file_size
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN product_thumbnails t ON p.id = t.product_id
            where p.is_deleted = FALSE`
        );
        const newdbProducts = rows.map(dbProducts => ({
            productId: dbProducts.product_id,
            name: dbProducts.name,
            description: dbProducts.description,
            price: dbProducts.price,
            categoryId: dbProducts.category_id,
            createdAt: dbProducts.created_at,
            updatedAt: dbProducts.updated_at,
            categoryName: dbProducts.category_name,
            imageUrl: dbProducts.image_url,
            fileSize: dbProducts.file_size
        }));
        console.log("Fetched products:", newdbProducts); // Debugging log
        return newdbProducts;
    }

  public async softDeleteProduct(id: string): Promise<boolean> {
    const result = await pool.query(`
      UPDATE products
      SET is_deleted = TRUE, updated_at = NOW()
      WHERE id = $1 AND is_deleted = FALSE
    `, [id]);

    // Also soft delete thumbnails
    await pool.query(`
      UPDATE product_thumbnails
      SET is_deleted = TRUE, updated_at = NOW()
      WHERE product_id = $1
    `, [id]);
if(!result.rowCount) {
      return false; // No rows updated, product may not exist or already deleted    
}
    return  result.rowCount > 0;
  }
    public async getById(id: string): Promise<IProductDBThumbnail[] | null> {
        const { rows } = await pool.query(
            `SELECT 
                p.id AS product_id,
                p.name,
                p.description,
                p.price,
                p.category_id,
                p.created_at,
                p.updated_at,
                c.name AS category_name,
                t.image_url,
                t.file_size
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN product_thumbnails t ON p.id = t.product_id
            WHERE p.id = $1 and p.is_deleted = FALSE`, [id]
        );
        const newdbProducts = rows.map(dbProducts => ({
            productId: dbProducts.product_id,
            name: dbProducts.name,
            description: dbProducts.description,
            price: dbProducts.price,
            categoryId: dbProducts.category_id,
            createdAt: dbProducts.created_at,
            updatedAt: dbProducts.updated_at,
            categoryName: dbProducts.category_name,
            imageUrl: dbProducts.image_url,
            fileSize: dbProducts.file_size
        }));
        console.log("Fetched product by ID:", newdbProducts);
        return newdbProducts.length > 0 ? newdbProducts : null;
    }

    public async createProduct(product: IProductDB): Promise<number> {
        await pool.query("BEGIN");
        try {
            let productID: number;
            const result = await pool.query(
                `INSERT INTO products (name, description, price, category_id) 
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
            SET name = $1, description = $2, price = $3, category_id = $4 
            WHERE id = $5 
            RETURNING *`,
            [name, description, price, categoryId, id]
        );
        return result.rows[0];
    }

    public async deleteProductThumbnails(productId: string): Promise<void> {
        await pool.query("DELETE FROM product_thumbnails WHERE product_id = $1", [productId]);
    }

    public async addProductThumbnail(productId: string, imageUrl: string, fileSize: number): Promise<void> {
        await pool.query(
            `INSERT INTO product_thumbnails (product_id, image_url, file_size) 
            VALUES ($1, $2, $3)`,
            [productId, imageUrl, fileSize]
        );
    }

    public async getCategoryByName(categoryName: string): Promise<number | null> {
        const result = await pool.query("SELECT * FROM categories WHERE name = $1", [categoryName]);
        return (result.rowCount ?? 0) > 0 ? result.rows[0].id : null;
    }

    public async createCategory(name: string): Promise<ICategoryDB> {
        const result = await pool.query(
            `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
            [name]
        );
        return result.rows[0];
    }
}
