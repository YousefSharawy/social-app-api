import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
import { PostService } from "../service/post.service";
import { NextFunction, Request, Response } from "express";

@injectable()
export class PostController {
  constructor(
    @inject(TOKENS.PostService) private readonly postService: PostService,
  ) {}
   createPost =  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content, allowComments } = req.body;
      const post = await this.postService.createPost(req.user?.id,{content , allowComments});
      res.status(201).json({
        message: "Post Created Successfully",
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  };
  getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.postService.getMyPosts(req.user?.id);
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      next(error);
    }
  };
  getPost = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.getPost(req.params.id);
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  };
  updatePost = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { content, allowComments } = req.body;
      const post = await this.postService.updatePost(req.user?.id, req.params.id, { content, allowComments });
      res.status(200).json({
        message: "Post Updated Successfully",
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  };
  deletePost = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await this.postService.deletePost(req.user?.id, req.params.id);
      res.status(200).json({ message: "Post Deleted Successfully", success: true });
    } catch (error) {
      next(error);
    }
  };
}
