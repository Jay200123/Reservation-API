import { model, Schema } from "mongoose";
import { Settings } from "../../@types";
import { RESOURCE } from "../../@constants";

const settingsSchema = new Schema<Settings>({
  settings_username: {
    type: String,
    required: true,
  },
  settings_password: {
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

const Settings = model(RESOURCE.SETTINGS, settingsSchema);

export default Settings;
