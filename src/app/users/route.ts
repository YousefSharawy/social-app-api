import { Router } from "express";
import { uploadSingle } from "../../lib/media/multer";
import userController from "./controller/user.controller";

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

userRouter.post('/get-presigned-url',userController.generatePresignedUrl)