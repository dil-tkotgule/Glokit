// utils/responseHelper.ts
import { Response } from 'express';
import { ErrorHandler } from '../errors/ErrorHandler';


export const sendSuccess = (res: Response, data: any, message = 'Success', status = 200): void => {
  res.status(status).json({ success: true, message, data });
};

export const sendError = (res: Response, error: any): void => {
  const status = error.statusCode || 500;
  const message = error.message || 'An error occurred';
  res.status(status).json({ success: false, message, error: error.stack || error });
};
