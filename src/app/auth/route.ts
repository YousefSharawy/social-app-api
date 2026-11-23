import { Router } from "express";
import { authController } from "./controller/auth.controller";
import { guard } from "../../lib/auth/guard";

export const authRouter = Router();

// registration & email verification
authRouter.post("/register", authController.register);
authRouter.post("/verify-account", authController.verifyAccount);
authRouter.post("/send-otp", authController.sendOTP);

// login & sessions
authRouter.post("/login", authController.login);
authRouter.post("/login/google", authController.loginWithGoogle);
authRouter.post("/refresh-token", authController.refreshToken);

// two-factor auth
authRouter.post("/2fa/enable", authController.enable2FactorAuth);
authRouter.post("/2fa/verify", authController.verify2FactorAuthCodeToLogin);

authRouter.post("/logout", guard, authController.logout);
authRouter.post("/forget-password", authController.forgtPassword);
authRouter.post("/reset-password", authController.resetPassword);
