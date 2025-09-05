import { Schema, model } from "mongoose";
import { UserType } from "../../@types";

export const UserSchema = new Schema<UserType>({});

const User = model<UserType>("users", UserSchema);

export default User;
