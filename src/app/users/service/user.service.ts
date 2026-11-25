import { readFileSync } from "fs";
import { s3CloudProvider } from "../../../lib/cloud/init";
import { ICloudProvider } from "../../../pkg/cloud/cloud.interface";
import userRepo from "../repo/user.repo";
import { AppError } from "../../../pkg/error/error";
import { userDoesNotExist } from "../error";
import { Types } from "mongoose";
import { UpdateProfileDto } from "../dto/dto";

class UserService {
  private readonly cloudProvider: ICloudProvider = s3CloudProvider;
  private readonly userRepo = userRepo;

  uploadProfilePicture = async (file: Express.Multer.File, userID: string) => {
    file.buffer = readFileSync(file.path);
    const key = await this.cloudProvider.uploadFile(file, `users/${userID}`);
    await this.userRepo.update(
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
  generatePresignedUrl = async (
    file: Partial<Express.Multer.File>,
    userId: string,
  ) => {
    return await this.cloudProvider.generatePresignedUrl(
      file,
      `users/${userId}`,
    );
  };
  getMyProfile = async (id: string) => {
    const user = await this.userRepo.getOne(
      { _id: id, isDeleted: false },
      "email userName bio gender profilePicturePath isPrivate",
    );
    if (!user) throw userDoesNotExist;
    return user;
  };
  updateProfile = async (id: string, updateProfileDto: UpdateProfileDto) => {
    const updateUser = await this.userRepo.update(
      { _id: id, isDeleted: false },
      updateProfileDto,
      {
        new: true,
        runValidators: true,
        projection: "-password -__v",
      },
    );
    if (!updateUser) throw userDoesNotExist;
    return updateUser;
  };
  followUser = async (myId: string, targetId: string) => {
    if (!Types.ObjectId.isValid(targetId)) throw userDoesNotExist;
    if (myId === targetId) throw new AppError("You can't follow yourself", 400);
    const target = await this.userRepo.getOne(
      { _id: targetId, isDeleted: false },
      "_id",
    );
    if (!target) throw userDoesNotExist;
    const me = await this.userRepo.update(
      { _id: myId, following: { $ne: targetId } },
      {
        $addToSet: { following: targetId },
      },
    );
    if (!me) throw new AppError("You already follow this user", 409);
    await this.userRepo.update(
      {
        _id: targetId,
      },
      {
        $addToSet: { followers: myId },
      },
    );
  };
  unfollowUser = async (myId: string, targetId: string) => {
    if (!Types.ObjectId.isValid(targetId)) throw userDoesNotExist;
    if (myId === targetId)
      throw new AppError("You can't unfollow yourself", 400);
    const target = await this.userRepo.getOne(
      { _id: targetId, isDeleted: false },
      "_id",
    );
    if (!target) throw userDoesNotExist;

    const me = await this.userRepo.update(
      { _id: myId, following: targetId },
      {
        $pull: { following: targetId },
      },
    );
    if (!me) throw new AppError("You don\'t follow this user", 400);
    await this.userRepo.update(
      {
        _id: targetId,
      },
      {
        $pull: { followers: myId },
      },
    );
  };
  searchUsers = async (q: string) => {
    if (!q?.trim()) return [];
    const users = this.userRepo.getAll(
      {
        userName: { $regex: q, $options: "i" },
        isDeleted: false,
      },
      {},
      "userName bio profilePicturePath",
    );
    return users;
  };
  getUserSuggestions = async (userId: string) => {
    const user = await this.userRepo.getOne({ _id: userId, isDeleted: false });
    if (!user) throw userDoesNotExist;

    const users = await this.userRepo.getAll(
      {
        _id: { $nin: [...user.following, user._id] },
        isDeleted: false,
      },
      {},
      "userName profilePicturePath gender bio",
    );
    return users;
  };
  changeAccountPrivacy = async (userId: string) => {
    const userPrivacy = await this.userRepo.getOne({ _id: userId, isDeleted: false } , "isPrivate");
    if (!userPrivacy) throw userDoesNotExist;
    const updatedUser = await this.userRepo.update(
      { _id: userId, isDeleted: false },
      { isPrivate: !userPrivacy.isPrivate },
      {
        returnDocument: "after",
        projection : 'isPrivate'
      },
    );
    return updatedUser;
  };
}

export default new UserService();
