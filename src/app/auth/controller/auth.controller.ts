import { NextFunction, Request, Response } from "express";
import { setCookies } from "../../../pkg/utils/cookies";
import { inject, injectable } from "tsyringe";
import { AuthService } from "../service/auth.service";
import { TOKENS } from "../../../lib/di/tokens";


@injectable()
export class AuthController {
  constructor(
    @inject(TOKENS.AuthService)private readonly authService : AuthService,
  ){};
   register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({
        message: "User Created Successfully",
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.verifyAccount(req.body);
      res.status(200).json({
        message: "Account Verified Successfully",
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  sendOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.sendOTP(req.body);
      res.status(200).json({
        message: "OTP Sent Successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
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
  };

  enable2FactorAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.enable2FactorAuth(req.body);
      res.status(200).json({
        message: "2FA Enabled Successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  verify2FactorAuthCodeToLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = await this.authService.verify2FactorAuthCodeToLogin(req.body);
      res.status(200).json({
        message: "Logged In Successfully",
        success: true,
        data: { token },
      });
    } catch (error) {
      next(error);
    }
  };

  loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.loginWithGoogle(req.body.idToken);
      res.status(200).json({
        message: "Logged In With Google Successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken_token ?? req.body.refreshToken;
      const result = await this.authService.refreshToken(token);
      await setCookies(res, result.token, result.refreshToken);
      res.status(200).json({
        message: "Token Refreshed Successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { access_token, refreshToken_token } = req.cookies;
      if (access_token) await this.authService.logout(access_token);
      if (refreshToken_token) await this.authService.logout(refreshToken_token);
      res.clearCookie("access_token");
      res.clearCookie("refreshToken_token");
      res
        .status(200)
        .json({ message: "Logged Out Successfully", success: true });
    } catch (error) {
      next(error);
    }
  };
  forgtPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {email} = req.body;
      await this.authService.forgetPassword(email);
      res.status(200).json({ message: "Code sent successfully to your email", success: true });
    } catch (error) {
      next(error);
    }
  };
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.resetPassword(req.body);
      res.status(200).json({ message: "Your password has been reset", success: true });
    } catch (error) {
      next(error);
    }
  };
}
