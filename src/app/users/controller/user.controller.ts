import { NextFunction, Request, Response } from "express";
import userService from "../service/user.service";

class UserControlelr {
  private readonly userService = userService;
  uploadProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.userService.uploadProfilePicture(
        req.file as Express.Multer.File,
        req.user?.id,
      );
      res
        .status(201)
        .json({ message: "Profile uploaded successfully", success: true });
    } catch (error) {
      next(error);
    }
  };
  deleteProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.userService.deleteProfilePicture(req.user?.id);
      res
        .status(200)
        .json({ message: "Profile deleted successfully", success: true });
    } catch (error) {
      next(error);
    }
  };
  generatePresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
        const {fileName , contentType} = req.body;
     const url = await this.userService.generatePresignedUrl(
       {
        mimetype : contentType,
        originalname : fileName
       },
       req.user?._id
      );
      res
        .status(200)
        .json({
          message: "Url has been generated successfully",
          success: true,
          date : url
        });
    } catch (error) {
      next(error);
    }
  };
}
export default new UserControlelr();
