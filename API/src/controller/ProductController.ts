import { Request, Response } from "express";
import { ProductService } from "../service/ProductService";
import { IProductUI } from "../models/Product";
import { NotFoundError } from "../errors/ErrorHandler";
import logger from "../utils/logger";

import { sendError, sendSuccess } from '../utils/responseUtil';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const products = await this.productService.getAllProducts();

      if (!products || products.length === 0) {
        throw new NotFoundError("No products found");
      }

      // Apply pagination manually if service doesn't support it yet
      const startIndex = offset;
      const endIndex = offset + limit;
      const paginatedProducts = products.slice(startIndex, endIndex);
      const total = products.length;

      const paginationData = {
        products: paginatedProducts,
        count: paginatedProducts.length,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1
        }
      };

      sendSuccess(res, paginationData, "Products fetched successfully");
    } catch (err) {
      logger.error("Error fetching products", { error: err });
      sendError(res, err);
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      sendSuccess(res, product, "Product fetched successfully");
    } catch (err) {
      logger.error("Error fetching product", { error: err });
      sendError(res, err);
    }
  }

  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product: IProductUI = req.body;
      const files = req.files as Express.Multer.File[] | undefined;

      const productID = await this.productService.createProduct(product, files);
      sendSuccess(res, { productID }, "Product created successfully");
    } catch (err: any) {
      logger.error("Error creating product", { error: err });
      sendError(res, err);
    }
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      console.log('triveni')
      console.log(req.body)
      console.log(req.files)
      console.log('triveni')
      const { id } = req.params;
      const product: IProductUI = req.body;
      product.product_id = Number(id);
      const files = req.files as Express.Multer.File[] | undefined;

      const updatedProduct = await this.productService.updateProduct(id, product, files);
      sendSuccess(res, { message: "Product updated successfully", product: updatedProduct });
    } catch (err: any) {
      logger.error("Error updating product", { error: err });
      sendError(res, err);
    }
  }

  public async softDeleteProduct(req: Request, res: Response): Promise<void> {
    try {
      console.log("hello")
      const { id } = req.params;
      const deleted = await this.productService.softDeleteProduct(id);
      console.log(deleted)
      if (!deleted) {
        throw new NotFoundError("Product not found or already deleted");
      }
      sendSuccess(res, null, "Product soft-deleted successfully");
    } catch (err: any) {
      logger.error("Error soft-deleting product", { error: err });
      sendError(res, err);
    }
  }
}

