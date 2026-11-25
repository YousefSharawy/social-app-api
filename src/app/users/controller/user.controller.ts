import { NextFunction, Request, Response } from "express";
import userService from "../service/user.service";

class UserController {
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
      const { fileName, contentType } = req.body;
      const url = await this.userService.generatePresignedUrl(
        {
          mimetype: contentType,
          originalname: fileName,
        },
        req.user?.id,
      );
      res.status(200).json({
        message: "Url has been generated successfully",
        success: true,
        data: url,
      });
    } catch (error) {
      next(error);
    }
  };
  getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.userService.getMyProfile(req.user?.id);
      res.status(200).json({
        message: "User profile has been retrieved successfully",
        success: true,
        profile: profile,
      });
    } catch (error) {
      next(error);
    }
  };
  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { userName, bio } = req.body;
    try {
      const updatedUser = await this.userService.updateProfile(req.user?.id, {
        userName,
        bio,
      });
      res.status(200).json({
        message: "User profile has been updated successfully",
        success: true,
        profile: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };
  followUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        await this.userService.followUser(req.user?.id,req.params.id);
      res.status(200).json({
        message: "User followed successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  unfollowUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        await this.userService.unfollowUser(req.user?.id,req.params.id);
      res.status(200).json({
        message: "User unfollowed successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await this.userService.searchUsers(req.query.q as string);
    res.status(200).json({success: true, data: users });
  } catch (error) {
    next(error);
  }
};
  getUserSuggestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userSuggestions = await this.userService.getUserSuggestions(req.user?.id);
    res.status(200).json({ success: true, data: userSuggestions });
  } catch (error) {
    next(error);
  }
};
  changeAccountPrivacy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await this.userService.changeAccountPrivacy(req.user?.id);
    res.status(200).json({ message : "user account privacy has been changed successfully",success: true, data: user });
  } catch (error) {
    next(error);
  }
};
}
export default new UserController();
