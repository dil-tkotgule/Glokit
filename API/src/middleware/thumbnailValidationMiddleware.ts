import { Request, Response, NextFunction } from 'express';
import ThumbnailValidation from '../ValidationSchemas/ThumbnailValidatoin';  // Path to your validation file

const validateThumbnails = (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || req.files.length === 0) {
        res.status(400).json({
            error: 'No files uploaded. Please upload at least one thumbnail.',
        }); return;
    }
    const files = (req.files as Array<any>).map((file: any) => ({
        size: file.size,
        mimetype: file.mimetype,
    }));
    console.log(files)
    const { error } = ThumbnailValidation.validateThumbnails().validate(files);
    console.log("middlewareke andar ka")
    console.log(ThumbnailValidation.validateThumbnails().validate(files));
    if (error) {
        res.status(400).json({
            error: error.details[0].message,
        }); return;
    }
    console.log("kotule")
    next();
};
export default validateThumbnails;
