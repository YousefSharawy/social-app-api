import { NextFunction, Request, Response } from "express";
import { authService } from "../service/auth.service";
import { setCookies } from "../../../pkg/utils/cookies";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        message: "User Created Successfully",
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.verifyAccount(req.body);
      res.status(200).json({
        message: "Account Verified Successfully",
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.sendOTP(req.body);
      res.status(200).json({
        message: "OTP Sent Successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      // 2FA enabled -> service sends a code and returns nothing
      if (!result) {
        res.status(200).json({
          message: "2FA Code Sent To Your Email",
          success: true,
        });
        return;
      }
      await setCookies(res, result.token, result.refreshToken);
      res.status(200).json({
        message: "Logged In Successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async enable2FactorAuth(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.enable2FactorAuth(req.body);
      res.status(200).json({
        message: "2FA Enabled Successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async verify2FactorAuthCodeToLogin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = await authService.verify2FactorAuthCodeToLogin(req.body);
      res.status(200).json({
        message: "Logged In Successfully",
        success: true,
        data: { token },
      });
    } catch (error) {
      next(error);
    }
  }

  async loginWithGoogle(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.loginWithGoogle(req.body.idToken);
      res.status(200).json({
        message: "Logged In With Google Successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken_token ?? req.body.refreshToken;
      const result = await authService.refreshToken(token);
      await setCookies(res, result.token, result.refreshToken);
      res.status(200).json({
        message: "Token Refreshed Successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
export const authController = new AuthController();
