import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { TOKENS } from "../../../lib/di/tokens";
import { CommentService } from "../service/comment.service";

@injectable()
export class CommentController {
  constructor(
    @inject(TOKENS.CommentService) private readonly commentService: CommentService,
  ) {}
  createComment = async (req: Request<{ postId: string }>, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body;
      const comment = await this.commentService.createComment(req.user?.id, req.params.postId, { content });
      res.status(201).json({
        message: "Comment Created Successfully",
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };
  getPostComments = async (req: Request<{ postId: string }>, res: Response, next: NextFunction) => {
    try {
      const comments = await this.commentService.getPostComments(req.params.postId);
      res.status(200).json({ success: true, data: comments });
    } catch (error) {
      next(error);
    }
  };
  getComment = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const comment = await this.commentService.getComment(req.params.id);
      res.status(200).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  };
  updateComment = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body;
      const comment = await this.commentService.updateComment(req.user?.id, req.params.id, { content });
      res.status(200).json({
        message: "Comment Updated Successfully",
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };
  deleteComment = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await this.commentService.deleteComment(req.user?.id, req.params.id);
      res.status(200).json({ message: "Comment Deleted Successfully", success: true });
    } catch (error) {
      next(error);
    }
  };
}
