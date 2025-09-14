import mongoose from "mongoose";
import { STATUSCODE } from "../../@constants";
import { Timeslot } from "../../@types";
import { ErrorHandler, logger } from "../../@utils";
import TimeslotRepository from "./repository";

export default class TimeslotService {
  constructor(private timeslotRepository: TimeslotRepository) {}

  async getAllTimeslots() {
    const result = await this.timeslotRepository.getAll();

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
