import mongoose from "mongoose";
import { STATUSCODE } from "../../@constants";
import { Timeslot } from "../../@types";
import {
  ErrorHandler,
  logger,
  verifyFields,
  createTimeslotFields,
} from "../../@utils";
import TimeslotRepository from "./repository";

export default class TimeslotService {
  constructor(private timeslotRepository: TimeslotRepository) {}

  async getAllTimeslots(skip: number, limit: number) {
    const result = await this.timeslotRepository.getAll(skip, limit);

    if (!result.length) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Timeslots not found");
    }

    return result;
  }

  async getTimeslotById(id: string) {
    if (id == ":id") {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Missing timeslot ID");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.info({
        GET_TIMESLOT_BY_ID_ERROR: {
          message: "Invalid Timeslot ID",
        },
      });

      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const result = await this.timeslotRepository.getById(id);

    if (!result) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Timeslot not Found");
    }

    return result;
  }

  async createTimeslot(data: Omit<Timeslot, "createdAt" | "updatedAt">) {
    verifyFields(createTimeslotFields, data);

    const result = await this.timeslotRepository.create(data);

    if (!result) {
      logger.info({
        CREATE_TIMESLOT_ERROR: {
          message: "Timeslot creation failed",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    return result;
  }

  async updateTimeslotById(id: string, data: Partial<Timeslot>) {
    if (id == ":id") {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Missing timeslot ID");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.info({
        GET_TIMESLOT_BY_ID_ERROR: {
          message: "Invalid Timeslot ID",
        },
      });

      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const timeslot = await this.timeslotRepository.getById(id);

    if (!timeslot) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Timeslot not Found");
    }

    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createTimeslotFields, data);

    const result = await this.timeslotRepository.updateById(id, data);

    return result;
  }

  async deleteTimeslotById(id: string) {
    if (id == ":id") {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Missing timeslot ID");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.info({
        GET_TIMESLOT_BY_ID_ERROR: {
          message: "Invalid Timeslot ID",
        },
      });

      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const result = await this.timeslotRepository.deleteById(id);

    if (!result) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Timeslot not Found");
    }

    return result;
  }
}
