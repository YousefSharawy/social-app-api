import { inject, injectable } from "tsyringe";
import { CreatePostDTO } from "../dto";
import { TOKENS } from "../../../lib/di/tokens";
import { PostRepo } from "../repo/post.repo";
import { IPost } from "../model/post.model";
import { UserRepo } from "../../users/repo/user.repo";
import { userDoesNotExist } from "../../users/error";

@injectable()
export class PostService {
  constructor(
    @inject(TOKENS.PostRepo) private readonly postRepo: PostRepo,
    @inject(TOKENS.UserRepo) private readonly userRepo: UserRepo,
) {}
  createPost = async (createPostDto: CreatePostDTO) => {
    const user = await this.userRepo.getOne({_id:createPostDto.userId});
    if(!user) throw userDoesNotExist;
    const createdPost = await this.postRepo.create(createPostDto);
    return createdPost;
  };
}
