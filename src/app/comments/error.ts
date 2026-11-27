import { AppError } from "../../pkg/error/error";

export const commentNotFound = new AppError("Comment not found", 404);
export const commentsAreDisabled = new AppError("Comments are disabled on this post", 403);
export const notAllowedToDeleteComment = new AppError("You are not allowed to delete this comment", 403);
