import { Model } from "mongoose";
import { UserCredentials } from "../../@types";

export default class AuthRepository {
  constructor(private userCredentialModel: Model<UserCredentials>) {}

  async getOneByAccessToken(access_token: string) {
    return await this.userCredentialModel.findOne({ access_token });
  }

  async getOneByRefreshToken(refresh_token: string) {
    return await this.userCredentialModel.findOne({ refresh_token });
  }

  async addCredential(data: Omit<UserCredentials, "createdAt" | "updatedAt">) {
    return await this.userCredentialModel.create({ ...data });
  }

  async updateCredential(
    refresh_token: string,
    data: Partial<UserCredentials>
  ) {
    return await this.userCredentialModel.findOneAndUpdate(
      { refresh_token: refresh_token },
      {
        ...data,
        updatedAt: Date.now(),
      },
      { new: true }
    );
  }

  async removeCredentialsByAccessToken(access_token: string) {
    return await this.userCredentialModel.findOneAndDelete({
      access_token: access_token,
    });
  }
}
