import { Router } from "express";
import { uploadSingle } from "../../lib/media/multer";
import userController from "./controller/user.controller";
import { guard } from "../../lib/auth/guard";

export const userRouter = Router();

userRouter.post(
  "/upload-profile-picture",
  uploadSingle("pp"),
  userController.uploadProfilePicture,
);
userRouter.delete(
  "/delete-profile-picture",
  userController.uploadProfilePicture,
);

userRouter.post('/get-presigned-url',userController.generatePresignedUrl);
userRouter.get("/me", guard, userController.getMyProfile);
userRouter.patch("/me", guard, userController.updateProfile);
userRouter.post("/:id/follow", guard, userController.followUser);
userRouter.delete("/:id/follow", guard, userController.unfollowUser);