import { UserDetails } from "../../@types";
import { RESOURCE } from "../../@constants";
import mongoose from "mongoose";

const UserDetailsSchema = new mongoose.Schema<UserDetails>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: RESOURCE.USERS,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact_number: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
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

const UserDetailsModel = mongoose.model<UserDetails>(
  RESOURCE.USER_DETAILS,
  UserDetailsSchema
);

export default UserDetailsModel;
