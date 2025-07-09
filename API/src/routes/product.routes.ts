import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { ProductController} from '../controller/ProductController';
import { ProductService } from '../service/ProductService';
import { validateUpdateProduct } from '../middleware/ProductValidatoin';
import validateThumbnails  from '../middleware/thumbnailValidationMiddleware';
export const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });
const productService = new ProductService();
const productController = new ProductController(productService);    

router.post('/create', upload.array('thumbnails', 2), productController.createProduct.bind(productController));
router.get('/list', productController.getAllProducts.bind(productController));
router.put('/update/:id', upload.array('thumbnails', 2), validateUpdateProduct, validateThumbnails, productController.updateProduct.bind(productController));
router.get('/get/:id', productController.getProductById.bind(productController));
router.delete('/soft-delete/:id', productController.softDeleteProduct.bind(productController));
