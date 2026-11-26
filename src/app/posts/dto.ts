import { Types } from "mongoose";

export interface CreatePostDTO {
  content: string;
  userId:Types.ObjectId;
  commentsCount: number;
  reactionsCount: number;
  allowComments: boolean;
}
