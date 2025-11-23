import { skip } from "node:test";
import { Timeslot } from "../../@types";
import { Model } from "mongoose";

export default class TimeslotRepository {
  constructor(private timeslotModel: Model<Timeslot>) {}

  async getAll(skip: number, limit: number) {
    return await this.timeslotModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async getById(id: string) {
    return await this.timeslotModel.findById(id);
  }

  async create(data: Omit<Timeslot, "createdAt" | "updatedAt">) {
    return await this.timeslotModel.create({ ...data });
  }

  async updateById(id: string, data: Partial<Timeslot>) {
    return await this.timeslotModel.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true }
    );
  }

  async deleteById(id: string) {
    return await this.timeslotModel.findByIdAndDelete(id);
  }
}
