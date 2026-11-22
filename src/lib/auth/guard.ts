import { NextFunction,Request,Response } from "express";
import { AppError } from "../../pkg/error/error.js";
import { env } from "../config/env.js";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cacheProvider } from "../cache/init.js";
export async function guard(req:Request, res:Response, next:NextFunction) {
    try {
        const token = req.cookies.access_token;
        if (!token) throw new AppError('No token is provided', 401);
        const payload = jwt.verify(token, env.jwt.secret) as JwtPayload;
        const revoked = await cacheProvider.get(`revoked:${payload.jti}`);
        if(revoked) throw new AppError('Token has been revoked', 401);
        req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
}