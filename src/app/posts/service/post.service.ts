import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { CreatePostDTO, UpdatePostDTO } from "../dto";
import { TOKENS } from "../../../lib/di/tokens";
import { PostRepo } from "../repo/post.repo";
import { UserRepo } from "../../users/repo/user.repo";
import { CommentRepo } from "../../comments/repo/comment.repo";
import { userDoesNotExist } from "../../users/error";
import { postNotFound } from "../error";

@injectable()
export class PostService {
  constructor(
    @inject(TOKENS.PostRepo) private readonly postRepo: PostRepo,
    @inject(TOKENS.UserRepo) private readonly userRepo: UserRepo,
    @inject(TOKENS.CommentRepo) private readonly commentRepo: CommentRepo,
  ) {}
  createPost = async (userId: string, createPostDto: CreatePostDTO) => {
    const user = await this.userRepo.getOne({ _id: userId });
    if (!user) throw userDoesNotExist;
    const createdPost = await this.postRepo.create({
      ...createPostDto,
      userId: user._id,
    });
    return createdPost;
  };
  getMyPosts = async (userId: string) => {
    return await this.postRepo.getAll({ userId }, { sort: { _id: -1 } });
  };
  getPost = async (postId: string) => {
    if (!Types.ObjectId.isValid(postId)) throw postNotFound;
    const post = await this.postRepo.getOne({ _id: postId });
    if (!post) throw postNotFound;
    return post;
  };
  updatePost = async (userId: string, postId: string, updatePostDto: UpdatePostDTO) => {
    if (!Types.ObjectId.isValid(postId)) throw postNotFound;
    // owner check is inside the filter: not found OR not yours -> 404
    const updatedPost = await this.postRepo.update(
      { _id: postId, userId },
      updatePostDto,
      { new: true, runValidators: true },
    );
    if (!updatedPost) throw postNotFound;
    return updatedPost;
  };
  deletePost = async (userId: string, postId: string) => {
    if (!Types.ObjectId.isValid(postId)) throw postNotFound;
    const post = await this.postRepo.getOne({ _id: postId, userId }, "_id");
    if (!post) throw postNotFound;
    await this.postRepo.delete(post._id);
    await this.commentRepo.deleteByPostId(post._id);
  };
}
