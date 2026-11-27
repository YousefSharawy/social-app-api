import { Router } from "express";
import { guard } from "../../lib/auth/guard";
import container from "../../lib/di/container";
import { CommentController } from "./controller/comment.controller";
import { TOKENS } from "../../lib/di/tokens";

const commentRouter = Router();
const commentController = container.resolve<CommentController>(TOKENS.CommentController);
commentRouter.post('/:postId', guard, commentController.createComment);
commentRouter.get('/post/:postId', guard, commentController.getPostComments);
commentRouter.get('/:id', guard, commentController.getComment);
commentRouter.patch('/:id', guard, commentController.updateComment);
commentRouter.delete('/:id', guard, commentController.deleteComment);

export default commentRouter;
