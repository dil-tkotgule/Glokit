import Joi from 'joi';

class ThumbnailValidation {
    // Validate the thumbnails
    static validateThumbnails() {
        return Joi.array().items(
            Joi.object({
                size: Joi.number().max(5242880).required().messages({
                    'number.max': 'File size must not exceed 5MB.',
                    'any.required': 'File size is required.',
                }),
                mimetype: Joi.string().valid('image/png', 'image/jpeg').required().messages({
                    'string.valid': 'Only PNG and JPEG files are allowed.',
                    'any.required': 'Mimetype is required.',
                }),
            })
        )
        .max(2)  // Max 2 files
        .messages({
            'array.max': 'You can upload a maximum of 2 thumbnails.',
            'array.base': 'Thumbnails should be an array of files.',
        });
    }
}

export default ThumbnailValidation;
