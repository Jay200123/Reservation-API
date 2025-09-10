import mongoose from "mongoose";
import { Users } from "./user";

export type UserCredentials = {
  user: mongoose.Types.ObjectId | Users;
  access_token: string;
  refresh_token: string;
  createdAt: Date;
  updatedAt: Date;
};
