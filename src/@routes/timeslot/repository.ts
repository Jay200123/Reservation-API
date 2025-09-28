import { Timeslot } from "../../@types";
import { Model } from "mongoose";

export default class TimeslotRepository {
  constructor(private timeslotModel: Model<Timeslot>) {}

  async getAll() {
    return await this.timeslotModel.find().exec();
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
