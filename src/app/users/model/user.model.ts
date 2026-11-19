import { Schema, model } from "mongoose";
import { Gender, Provider } from "../../../lib/enum/enum";

export interface IUser {
  userName: string;
  email: string;
  password: string;
  provider: number;
  gender: number;
}

const schema = new Schema<IUser>({
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 13,
    toLowerCase: true,
  },
  password: {
    type: String,
    required: function (this) {
      return this.provider === Provider.LOCAL;
    },
    trim: true,
  },
  provider: {
    type: Number,
    enum: Provider,
    default: Provider.LOCAL,
  },
  gender: {
    type: Number,
    enum: Gender,
  },
});
export const User = model("User", schema);
