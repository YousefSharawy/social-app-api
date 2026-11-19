import { NextFunction, Request, Response } from "express";
import { authService } from "../service/auth.service";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      res
        .status(201)
        .json({
          message: "User Created Successfully",
          sucess: true,
          data: user,
        });
    } catch (error) {
      next(error);
    }
  }
}
export const authController = new AuthController();