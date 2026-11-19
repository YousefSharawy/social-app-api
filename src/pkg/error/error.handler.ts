import { NextFunction,Request,Response } from 'express';
import { logger } from '../logger/logger.js';
import { AppError } from './error.js';
export function globalErrorHandler(err:AppError, req:Request, res:Response, next:NextFunction) {

    logger.error(err.message, {
        stack: err.stack,
        correlationId: req.correlationId,
    });
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false,
            stack: err.stack
        });
    }
    return res.status(500).json({ message: 'Something went wrong', success: false });
}