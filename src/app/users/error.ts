import { AppError } from "../../pkg/error/error";

export const userAlreadyExists = new AppError ('User alreaedy exists', 409); 
export const userDoesNotExist = new AppError ('User doesn\'t exist', 400); 
export const userAlreadyVerified = new AppError ('User already verifired', 409); 
export const userIsNotVerified = new AppError ('User is not verifired', 401); 
export const invalidCredentials = new AppError ('Invalid credentials', 401); 