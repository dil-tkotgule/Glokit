import Joi from 'joi';

class ProductValidation {
    // Create product schema
    static createProductSchema() {
        return Joi.object({
            product_id: Joi.number().optional(), // Allow product_id for update/put
            product_name: Joi.string().min(2).max(100).required().messages({
                'string.base': 'Name should be a type of string',
                'string.min': 'Name should have a minimum length of 2 characters',
                'string.max': 'Name should not exceed 100 characters',
                'any.required': 'Name is required',
            }),
            product_description: Joi.string().max(1000).required().messages({
                'string.base': 'Description should be a type of string',
                'string.max': 'Description should not exceed 1000 characters',
                'any.required': 'Description is required',
            }),
            product_quantity: Joi.number().positive().required().messages({
                'number.base': 'quantity should be a type of number',
                'number.positive': 'quantity should be a positive number',
                'any.required': 'quantity is required',
            }),
            category_name: Joi.string().max(255).required().messages({
                'string.base': 'Category name should be a type of string',
                'string.max': 'Category name should not exceed 255 characters',
                'any.required': 'Category name is required',
            }),
        });
    }

    static updateProductSchema() {
        return Joi.object({
            product_id: Joi.number().optional(), // Allow product_id for update/put
            product_name: Joi.string().min(2).max(100).optional(),
            product_description: Joi.string().max(1000).optional(),
            product_quantity: Joi.number().positive().optional(),
            category_name: Joi.string().max(100).optional(),
        });
    }

    static thumbnailSchema() {
        return Joi.array()
            .min(1)
            .max(2)
            .items(
                Joi.object({
                    originalname: Joi.string().required(),
                    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg', 'image/gif').required(),
                    size: Joi.number().max(5 * 1024 * 1024).required(), // 5MB
                })
            )
            .required()
            .messages({
                'array.min': 'At least one image is required.',
                'array.max': 'Maximum two images allowed.',
                'any.required': 'Images are required.',
                'string.valid': 'Only image files are allowed.',
                'number.max': 'File size must not exceed 5MB.',
            });
    }

    static thumbnailSchemaOptional() {
        return Joi.array()
            .min(1)
            .max(2)
            .items(
                Joi.object({
                    originalname: Joi.string().required(),
                    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg', 'image/gif').required(),
                    size: Joi.number().max(5 * 1024 * 1024).required(), // 5MB
                })
            )
            .optional()
            .messages({
                'array.min': 'At least one image is required.',
                'array.max': 'Maximum two images allowed.',
                'string.valid': 'Only image files are allowed.',
                'number.max': 'File size must not exceed 5MB.',
            });
    }
}

export default ProductValidation;
