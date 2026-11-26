import { Router } from "express";
import { uploadSingle } from "../../lib/media/multer";
import { guard } from "../../lib/auth/guard";
import { container } from "tsyringe";
import { UserController } from "./controller/user.controller";
import { TOKENS } from "../../lib/di/tokens";

export const userRouter = Router();
const userController = container.resolve<UserController>(TOKENS.UserController);
userRouter.post(
  "/upload-profile-picture",
  guard,
  uploadSingle("pp"),
  userController.uploadProfilePicture,
);
userRouter.delete(
  "/delete-profile-picture",
  guard,
  userController.deleteProfilePicture,
);

userRouter.post('/get-presigned-url',guard,userController.generatePresignedUrl);
userRouter.get("/me", guard, userController.getMyProfile);
userRouter.patch("/me", guard, userController.updateProfile);
userRouter.post("/:id/follow", guard, userController.followUser);
userRouter.delete("/:id/follow", guard, userController.unfollowUser);
userRouter.get("/search", guard, userController.searchUsers);
userRouter.get('/suggestions', guard , userController.getUserSuggestions);
userRouter.patch('/me/privacy', guard , userController.changeAccountPrivacy);