import { AppError } from "../../pkg/error/error";

export const postNotFound = new AppError("Post not found", 404);
