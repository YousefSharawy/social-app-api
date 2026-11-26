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

// Repos
container.registerSingleton<AuthRepo>(TOKENS.AuthRepo, AuthRepo);
container.registerSingleton<UserRepo>(TOKENS.UserRepo, UserRepo);

// Services
container.registerSingleton<AuthService>(TOKENS.AuthService, AuthService);
container.registerSingleton<UserService>(TOKENS.UserService, UserService);

//Controller
container.registerSingleton<AuthController>(TOKENS.AuthController, AuthController);
container.registerSingleton<UserController>(TOKENS.UserController, UserController);

// utils
container.registerInstance(TOKENS.CacheProvider ,cacheProvider);
container.registerInstance(TOKENS.CloudProvider , s3CloudProvider);
container.registerInstance(TOKENS.MaijetProvider , mailjetProvider);

export default container ; 