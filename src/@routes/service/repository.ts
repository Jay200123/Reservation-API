import { Model } from "mongoose";
import { Service, ServiceFilter } from "../../@types";

export default class ServiceRepository {
  constructor(private serviceModel: Model<Service>) {}

  async getAll(skip: number, limit: number) {
    return await this.serviceModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async getById(service_id: string) {
    return await this.serviceModel.findById(service_id).exec();
  }

  async create(data: Omit<Service, "createdAt" | "updatedAt">) {
    return await this.serviceModel.create({ ...data });
  }

  async updateById(service_id: string, data: Partial<Service>) {
    return await this.serviceModel.findByIdAndUpdate(
      service_id,
      { ...data },
      { new: true }
    );
  }

  async deleteById(service_id: string) {
    return await this.serviceModel.findByIdAndDelete(service_id);
  }

  async getAllUserServices(filter: [], skip: number, limit: number) {

    console.log(filter);
    
    if (filter.length > 0) {
      return await this.serviceModel
        .find({ $or: filter })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
    }

    return await this.serviceModel.find().skip(skip).limit(limit).lean().exec();
  }
}
