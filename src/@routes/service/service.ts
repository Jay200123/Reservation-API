import ServiceRepository from "./repository";
import { ErrorHandler, logger } from "../../@utils";
import { STATUSCODE } from "../../@constants";
import mongoose from "mongoose";
import { Service } from "../../@types";
export default class ServiceServices {
  constructor(private serviceRepository: ServiceRepository) {}

  async getAllServices() {
    const result = await this.serviceRepository.getAll();

    if (!result) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Services not found");
    }

    return result;
  }

  async getServiceById(service_id: string) {
    if (service_id == ":service_id") {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Missing service_id");
    }

    if (!mongoose.Types.ObjectId.isValid(service_id)) {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const result = await this.serviceRepository.getById(service_id);

    if (!result) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Service not found");
    }

    return result;
  }

  async createService(data: Omit<Service, "createdAt" | "updatedAt">) {
    const result = await this.serviceRepository.create(data);

    return result;
  }

  async updateServiceById(service_id: string, data: Partial<Service>) {
    const service = await this.serviceRepository.getById(service_id);

    if (!service) {
      logger.info({
        UPDATE_SERVICE_ERROR: {
          message: "Service not found",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const result = await this.serviceRepository.updateById(service_id, data);

    return result;
  }

  async deleteServiceById(service_id: string) {
    const result = await this.serviceRepository.deleteById(service_id);

    return result;
  }
}
