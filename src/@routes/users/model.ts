import { Schema, model } from "mongoose";
import { Users } from "../../@types";
import { RESOURCE } from "../../@constants";

/**
 * User Schema
 * @author Jay
 * @description Mongoose Schema for Users
 */
export const UserSchema = new Schema<Users>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Here we are creating a Mongoose model named 'User' using the UserSchema and associating it with the 'users' collection in the database.
const User = model<Users>(RESOURCE.USERS, UserSchema);

export default User;
