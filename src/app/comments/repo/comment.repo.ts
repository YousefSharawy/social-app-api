import { injectable } from "tsyringe";
import { Types } from "mongoose";
import { AbstractRepository } from "../../../lib/db/abstract.repository";
import { Comment, IComment } from "../model/comment.model";
@injectable()
export class CommentRepo extends AbstractRepository<IComment> {
  constructor() {
    super(Comment);
  }
  async deleteByPostId(postId: Types.ObjectId) {
    return await Comment.deleteMany({ postId });
  }
}
