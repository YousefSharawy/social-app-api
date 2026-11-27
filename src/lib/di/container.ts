import { container } from "tsyringe";
import { TOKENS } from "./tokens";
import { AuthRepo } from "../../app/auth/repo/auth.repo";
import { AuthService } from "../../app/auth/service/auth.service";
import { AuthController } from "../../app/auth/controller/auth.controller";
import { UserRepo } from "../../app/users/repo/user.repo";
import { UserService } from "../../app/users/service/user.service";
import { UserController } from "../../app/users/controller/user.controller";
import { s3CloudProvider } from "../cloud/init";
import { cacheProvider } from "../cache/init";
import { mailjetProvider } from "../email/init";
import { PostRepo } from "../../app/posts/repo/post.repo";
import { PostService } from "../../app/posts/service/post.service";
import { PostController } from "../../app/posts/controller/post.controller";
import { CommentRepo } from "../../app/comments/repo/comment.repo";
import { CommentService } from "../../app/comments/service/comment.service";
import { CommentController } from "../../app/comments/controller/comment.controller";

// Repos
container.registerSingleton<AuthRepo>(TOKENS.AuthRepo, AuthRepo);
container.registerSingleton<UserRepo>(TOKENS.UserRepo, UserRepo);
container.registerSingleton<PostRepo>(TOKENS.PostRepo, PostRepo);
container.registerSingleton<CommentRepo>(TOKENS.CommentRepo, CommentRepo);

// Services
container.registerSingleton<AuthService>(TOKENS.AuthService, AuthService);
container.registerSingleton<UserService>(TOKENS.UserService, UserService);
container.registerSingleton<PostService>(TOKENS.PostService, PostService);
container.registerSingleton<CommentService>(TOKENS.CommentService, CommentService);

//Controller
container.registerSingleton<AuthController>(TOKENS.AuthController, AuthController);
container.registerSingleton<UserController>(TOKENS.UserController, UserController);
container.registerSingleton<PostController>(TOKENS.PostController, PostController);
container.registerSingleton<CommentController>(TOKENS.CommentController, CommentController);

// utils
container.registerInstance(TOKENS.CacheProvider ,cacheProvider);
container.registerInstance(TOKENS.CloudProvider , s3CloudProvider);
container.registerInstance(TOKENS.MaijetProvider , mailjetProvider);

export default container ; 