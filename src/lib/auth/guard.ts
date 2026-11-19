import { NextFunction,Request,Response } from "express";
import { AppError } from "../../pkg/error/error.js";
import { env } from "../config/env.js";
import jwt, { JwtPayload } from 'jsonwebtoken';
export function guard(req:Request, res:Response, next:NextFunction) {
    try {
        const token = req.cookies.access_token;
        if (!token) throw new AppError('No token is provided', 401);
        req.user = jwt.verify(token, env.jwt.secret) as JwtPayload;
        next();
    } catch (error) {
        next(error);
    }
}