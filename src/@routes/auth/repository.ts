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
}
