import { Types } from "mongoose";

export interface CreatePostDTO {
  content: string;
  allowComments?: boolean;
}
