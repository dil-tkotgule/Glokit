import Joi from 'joi';

class UserValidation {

    static loginSchema() {
        return Joi.object({
            email: Joi.string().email().required().messages({
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required',
            }),
            password: Joi.string().min(6).required().messages({
                'string.min': 'Password must be at least 6 characters long',
                'any.required': 'Password is required',
            }),
        });
    }

    static registerSchema() {
        return Joi.object({
            name: Joi.string().min(2).max(100).required().messages({
                'string.base': 'Name should be a type of string',
                'string.min': 'Name should have a minimum length of 2 characters',
                'string.max': 'Name should not exceed 100 characters',
                'any.required': 'Name is required',
            }),
            email: Joi.string().email().required().messages({
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required',
            }),
            password: Joi.string().min(6).required().messages({
                'string.min': 'Password must be at least 6 characters long',
                'any.required': 'Password is required',
            }),
        });
    }
}

export default UserValidation;
