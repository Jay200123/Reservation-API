import mongoose, { model, Schema } from "mongoose";
import { UserCredentials } from "../../@types";
import { RESOURCE } from "../../@constants";

const userCredentialsSchema = new Schema<UserCredentials>({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  refresh_token: {
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

const UserCredentials = model(RESOURCE.USER_CREDENTIALS, userCredentialsSchema);
export default UserCredentials;
