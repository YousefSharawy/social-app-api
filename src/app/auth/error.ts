import { AppError } from "../../pkg/error/error";

export const userAlreadyExists = new AppError ('User alreaedy exists', 400); 