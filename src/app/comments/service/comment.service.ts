import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { TOKENS } from "../../../lib/di/tokens";
import { CommentRepo } from "../repo/comment.repo";
import { PostRepo } from "../../posts/repo/post.repo";
import { CreateCommentDTO, UpdateCommentDTO } from "../dto";
import { commentNotFound, commentsAreDisabled, notAllowedToDeleteComment } from "../error";
import { postNotFound } from "../../posts/error";

@injectable()
export class CommentService {
  constructor(
    @inject(TOKENS.CommentRepo) private readonly commentRepo: CommentRepo,
    @inject(TOKENS.PostRepo) private readonly postRepo: PostRepo,
  ) {}
  createComment = async (userId: string, postId: string, createCommentDto: CreateCommentDTO) => {
    if (!Types.ObjectId.isValid(postId)) throw postNotFound;
    const post = await this.postRepo.getOne({ _id: postId }, "allowComments");
    if (!post) throw postNotFound;
    if (!post.allowComments) throw commentsAreDisabled;
    const createdComment = await this.commentRepo.create({
      ...createCommentDto,
      postId: post._id,
      userId: new Types.ObjectId(userId),
    });
    await this.postRepo.update({ _id: post._id }, { $inc: { commentsCount: 1 } });
    return createdComment;
  };
  getPostComments = async (postId: string) => {
    if (!Types.ObjectId.isValid(postId)) throw postNotFound;
    const post = await this.postRepo.getOne({ _id: postId }, "_id");
    if (!post) throw postNotFound;
    return await this.commentRepo.getAll({ postId: post._id }, { sort: { _id: -1 } });
  };
  getComment = async (commentId: string) => {
    if (!Types.ObjectId.isValid(commentId)) throw commentNotFound;
    const comment = await this.commentRepo.getOne({ _id: commentId });
    if (!comment) throw commentNotFound;
    return comment;
  };
  updateComment = async (userId: string, commentId: string, updateCommentDto: UpdateCommentDTO) => {
    if (!Types.ObjectId.isValid(commentId)) throw commentNotFound;
    // owner check is inside the filter: not found OR not yours -> 404
    const updatedComment = await this.commentRepo.update(
      { _id: commentId, userId },
      updateCommentDto,
      { new: true, runValidators: true },
    );
    if (!updatedComment) throw commentNotFound;
    return updatedComment;
  };
  deleteComment = async (userId: string, commentId: string) => {
    if (!Types.ObjectId.isValid(commentId)) throw commentNotFound;
    const comment = await this.commentRepo.getOne({ _id: commentId });
    if (!comment) throw commentNotFound;
    // allowed: comment owner OR owner of the post
    if (comment.userId.toString() !== userId) {
      const post = await this.postRepo.getOne({ _id: comment.postId }, "userId");
      if (!post || post.userId.toString() !== userId) throw notAllowedToDeleteComment;
    }
    await this.commentRepo.delete(comment._id);
    await this.postRepo.update({ _id: comment.postId }, { $inc: { commentsCount: -1 } });
  };
}
