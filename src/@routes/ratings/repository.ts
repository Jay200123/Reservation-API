import { Model } from "mongoose";
import { Ratings } from "../../@types";

export default class RatingsRepository {
  constructor(private RatingsModel: Model<Ratings>) {}

  async getAll(skip: number, limit: number) {
    return await this.RatingsModel.find()
      .populate({
        path: "user",
        select: "username",
      })
      // .populate({
      //   path: "service",
      //   select: "service_name service_price description duration",
      // })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async getById(id: string) {
    return await this.RatingsModel.findById(id)
      .populate({
        path: "user",
        select: "username",
      })
      // .populate({
      //   path: "service",
      //   select: "service_name service_price description duration",
      // })
      .lean()
      .exec();
  }

  async create(data: Omit<Ratings, "createdAt" | "updatedAt">) {
    return await this.RatingsModel.create({ ...data });
  }

  async updateById(id: string, data: Partial<Ratings>) {
    return await this.RatingsModel.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now },
      { new: true }
    );
  }

  async deleteById(id: string) {
    return await this.RatingsModel.findByIdAndDelete(id);
  }
}
