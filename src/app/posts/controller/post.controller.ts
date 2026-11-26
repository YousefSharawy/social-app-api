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
      const post = await this.postService.createPost(req.body);
      res.status(201).json({
        message: "Post Created Successfully",
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  };
}
