import { Model } from "mongoose";
import { Service } from "../../@types";

export default class ServiceRepository {
  constructor(private serviceModel: Model<Service>) {}

  async getAll() {
    return await this.serviceModel.find().exec();
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
}
