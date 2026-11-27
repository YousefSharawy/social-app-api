import { Router } from "express";
import { authRouter } from "./app/auth/route";
import { userRouter } from "./app/users/route";
import postRouter from "./app/posts/route";
import commentRouter from "./app/comments/route";


export const router = Router();

router.use('/auth',authRouter);
router.use('/user',userRouter);
router.use('/comments', commentRouter);
router.use('/posts',postRouter);