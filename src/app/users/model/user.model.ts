import { Schema, Types, model } from "mongoose";
import { Gender, Provider } from "../../../lib/enum/enum";

export interface IUser {
  userName: string;
  email: string;
  password: string;
  provider: number;
  gender?: number;
  isDeleted?: boolean;
  isVerified?: boolean;
  is2FactorAuthEnabled?: boolean;
  profilePicturePath: string;
  bio?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  isPrivate?: boolean;
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
    minlength: 11,
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
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  is2FactorAuthEnabled: {
    type: Boolean,
    default: false,
  },
  profilePicturePath: String,
  bio: {
    type: String,
    default: "",
    maxlength: 100,
    trim: true,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isPrivate: {
    type: Boolean,
    default: false,
  },
});
export const User = model("User", schema);
