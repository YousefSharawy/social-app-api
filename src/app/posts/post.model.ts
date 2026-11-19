import { Schema, Types, model } from "mongoose";

export interface IPost {
  content: string;
  userId: Types.ObjectId;
  commentsCount: number;
  reactionsCount: number;
  allowComments: boolean;
}

const schema = new Schema<IPost>({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200,
  },
  userId: {
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  commentsCount:{
    type:Number,
    default:0,
  },
  reactionsCount:{
    type:Number,
    default:0,
  },
  allowComments:{
    type:Boolean,
    default:true,
  }
});
export const Post =  model('Post',schema);