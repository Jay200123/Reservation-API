import ServiceRepository from "./repository";
import {
  ErrorHandler,
  logger,
  verifyFields,
  createServiceFields,
  createUserFields,
} from "../../@utils";
import { STATUSCODE } from "../../@constants";
import mongoose from "mongoose";
import { Service } from "../../@types";
export default class ServiceServices {
  constructor(private serviceRepository: ServiceRepository) {}

  async getAllServices() {
    const result = await this.serviceRepository.getAll();

    if (!result.length) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Services not found");
    }

    return result;
  }

  async getServiceById(id: string) {
    if (id == ":id") {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Missing Service ID");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.info({
        GET_SERVICE_BY_ID_ERROR: {
          message: "Invalid mongoose ID",
        },
      });

      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const result = await this.serviceRepository.getById(id);

    if (!result) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Service not found");
    }

    return result;
  }

  async createService(data: Omit<Service, "createdAt" | "updatedAt">) {
    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createServiceFields, data);

    const result = await this.serviceRepository.create(data);

    return result;
  }

  async updateServiceById(id: string, data: Partial<Service>) {
    const service = await this.serviceRepository.getById(id);

    if (!service) {
      logger.info({
        UPDATE_SERVICE_ERROR: {
          message: "Service not found",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    //Checks if the data sent from the req body is empty or null.
    if (!data || null) {
      throw new ErrorHandler(
        STATUSCODE.BAD_REQUEST,
        `Missing required fields: ${createServiceFields.join(", ")}`
      );
    }

    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createServiceFields, data);

    const result = await this.serviceRepository.updateById(id, data);

    return result;
  }

  async deleteServiceById(service_id: string) {
    const result = await this.serviceRepository.deleteById(service_id);

    return result;
  }
}
