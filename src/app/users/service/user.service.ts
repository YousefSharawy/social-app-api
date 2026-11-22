import { readFileSync } from "fs";
import { s3CloudProvider } from "../../../lib/cloud/init";
import { ICloudProvider } from "../../../pkg/cloud/cloud.interface";
import userRepo from "../repo/user.repo";
import { AppError } from "../../../pkg/error/error";

class UserService {
  private readonly cloudProvider: ICloudProvider = s3CloudProvider;
  private readonly userRepo = userRepo;

  uploadProfilePicture = async (file: Express.Multer.File, userID: string) => {
    file.buffer = readFileSync(file.path);
    const key = await this.cloudProvider.uploadFile(file, `users/${userID}`);
    this.userRepo.update(
      {
        _id: userID,
      },
      {
        profilePicturePath: key,
      },
    );
  };
  deleteProfilePicture = async (userID: string) => {
    const user = await this.userRepo.getOne({ _id: userID });
    if (!user?.profilePicturePath) {
      throw new AppError("User has no Profile Picture", 404);
    }
    await this.cloudProvider.deleteFile(user?.profilePicturePath);
    await this.userRepo.update(
      { _id: userID },
      { $unset: { profilePicturePath: 1 } },
    );
  };
  generatePresignedUrl = async (file: Partial<Express.Multer.File>, userId: string) => {
   return await this.cloudProvider.generatePresignedUrl(file, `users/${userId}`);
  };
}

export default new UserService();
