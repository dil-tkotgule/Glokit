import { Request, Response, NextFunction } from 'express';
import ProductValidation from '../ValidationSchemas/ProductValidation'; // Adjust path if necessary

export const validateCreateProduct = (req: Request, res: Response, next: NextFunction) => {
    const { error } = ProductValidation.createProductSchema().validate(req.body);

    if (error) {
        res.status(400).json({
            error: error.details[0].message,
        }); return;
    }

    next();
};

export const validateUpdateProduct = (req: Request, res: Response, next: NextFunction) => {
    const { error } = ProductValidation.updateProductSchema().validate(req.body);

    if (error) {
        // If validation fails, send error with status 400
        res.status(400).json({
            error: error.details[0].message,  // Provide the first error message
        }); return
    }

    next();  // Validation successful, proceed to the next middleware or route handler
};
