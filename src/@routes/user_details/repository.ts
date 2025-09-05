import { Model } from "mongoose";
import { UserDetails } from "../../@types";

export default class UserDetailsRepository {
  constructor(private userDetailsModel: Model<UserDetails>) {}

  async create(data: UserDetails) {
    return await this.userDetailsModel.create(data);
  }

  updateById(id: string, data: Partial<UserDetails>) {
    return this.userDetailsModel.findByIdAndUpdate(id, data, { new: true });
  }
}
