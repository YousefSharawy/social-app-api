import 'express';
import { IUser } from '../app/users/model/user.model';
import { JwtPayload } from 'jsonwebtoken';

declare global{
    // reopen 
    namespace Express {
        interface Request {
             correlationId?: string;
             user?:JwtPayload;
        }
    }
}