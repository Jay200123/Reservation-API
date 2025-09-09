import { Settings } from "../../@types";
import { Model } from "mongoose";

export class SettingsRepository {
  constructor(private settingsModel: Model<Settings>) {}

  async getByUsername(username: string) {
    return await this.settingsModel
      .findOne({ settings_username: username })
      .exec();
  }

  async create(data: Omit<Settings, "createdAt" | "updatedAt">) {
    return await this.settingsModel.create({
      ...data,
    });
  }
}
