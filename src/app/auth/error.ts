import { AppError } from "../../pkg/error/error";

export const otpIsExpired = new AppError('Otp is expired', 409);
export const invalidCode = new AppError('Invalid Code', 400);
export const noPayload = new AppError('No payload retrieved', 404);