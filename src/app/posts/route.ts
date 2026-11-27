import { Router } from "express";
import { guard } from "../../lib/auth/guard";
import container from "../../lib/di/container";
import { PostController } from "./controller/post.controller";
import { TOKENS } from "../../lib/di/tokens";


const postRouter = Router();
const postController = container.resolve<PostController>(TOKENS.PostController);
postRouter.post('/post',guard,postController.createPost)
postRouter.get('/', guard, postController.getMyPosts);
postRouter.get('/:id', guard, postController.getPost);
postRouter.patch('/:id', guard, postController.updatePost);
postRouter.delete('/:id', guard, postController.deletePost);

export default postRouter;
