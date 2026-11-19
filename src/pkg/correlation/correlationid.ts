import { NextFunction,Response,Request } from 'express';
import crypto from 'node:crypto';
export function correlationId(req:Request, res:Response, next:NextFunction) {
    const id = crypto.randomUUID();
    req.correlationId = id;
    res.setHeader('X-correlationId', id);
    next();
}