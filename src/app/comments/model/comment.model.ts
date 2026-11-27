import { Schema, Types, model } from "mongoose";

export interface IComment {
  content: string;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
}

const schema = new Schema<IComment>({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
export const Comment = model("Comment", schema);
