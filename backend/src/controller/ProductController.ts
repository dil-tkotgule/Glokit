import { Request, Response } from "express";
import { ProductService } from "../service/ProductService";
import { IProductDBThumbnail, IProductUI, IProductUIThumbnail } from "../models/Product";
import { mapProductDBToUI, mapProductListDBToUI, mapProductUIToDB } from "../mapper/mapper";
import { ValidationError, NotFoundError, InternalServerError } from "../errors/ErrorHandler";
import logger from "../utils/logger"; // <-- Add logger import

export class ProductController {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    public async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await this.productService.getAllProducts();
            console.log(products); 
            const uiProducts = mapProductListDBToUI(products); // <-- Log the products for debugging
            console.log(uiProducts); // <-- Log the products for debugging
            if (products.length === 0) {
                res.status(404).json({ message: "No products found" });
                
                return;
            }
            res.status(200).json({ data: uiProducts });
        } catch (err) {
            logger.error("Error fetching products", { error: err });
            res.status(500).json({ error: "Error fetching products" });
        }
    }

    public async getProductById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const product: IProductDBThumbnail[] | null = await this.productService.getProductById(id);
            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }
            const uiProductArray: IProductUIThumbnail[] = mapProductListDBToUI(product); // Map to UI model
            res.status(200).json({ data: uiProductArray });
        } catch (err) {
            logger.error("Error fetching product", { error: err });
            res.status(500).json({ error: "Error fetching product" });
        }
    }

    public async createProduct(req: Request, res: Response): Promise<void> {
        try {
            const product: IProductUI = req.body;
            console.log(product)
            const files = req.files as Express.Multer.File[] | undefined;

            const productID = await this.productService.createProduct(product, files);
            res.status(201).json({ message: "Product created successfully", productID });
        } catch (err: any) {
            logger.error("Error creating product", { error: err });
            res.status(400).json({ error: err.message || "Error creating product" });
        }
    }

    public async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            console.log("hello")
            const { id } = req.params;
            const product: IProductUI = req.body;
            console.log(product)
            product.product_id=Number(id);
            console.log(req.body, req.files);
            const files = req.files as Express.Multer.File[] | undefined;

            const updatedProduct = await this.productService.updateProduct(id, product, files);
            res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
        } catch (err: any) {
            logger.error("Error updating product", { error: err });
            res.status(400).json({ error: err.message || "Error updating product" });
        }
    }
}
