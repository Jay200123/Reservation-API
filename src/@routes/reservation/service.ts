import mongoose from "mongoose";
import { STATUSCODE } from "../../@constants";
import { ErrorHandler, logger } from "../../@utils";
import ReservationRepository from "./repository";
import { Reservations } from "../../@types";

export default class ReservationService {
  constructor(private reservationRepository: ReservationRepository) {}

  async getAllReservations() {
    const result = await this.reservationRepository.getAll();

    if (!result.length) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Reservations not found");
    }

    return result;
  }

  async getReservationById(id: string) {
    if (id == ":id") {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Missing Reservation ID");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.info({
        GET_RESERVATION_BY_ID_ERROR: {
          message: "Invalid mongoose ID",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const result = await this.reservationRepository.getById(id);

    if (!result) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Reservation not found");
    }

    return result;
  }

  async createReservation(data: Omit<Reservations, "createdAt" | "updatedAt">) {
    const session = await mongoose.startSession();

    session.startTransaction();
    try {
      //checking logic here!

      const result = await this.reservationRepository.create(data);

      await session.commitTransaction();

      return result;
    } catch (err) {
      await session.abortTransaction();

      return err;
    } finally {
      await session.endSession();
    }
  }

  async updateReservationById(id: string, data: Partial<Reservations>) {
    if (id == ":id") {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Missing Reservation ID");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.info({
        GET_RESERVATION_BY_ID_ERROR: {
          message: "Invalid mongoose ID",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const reservation = await this.reservationRepository.getById(id);

    if (!reservation) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Reservation not found");
    }

    const result = await this.reservationRepository.updateById(id, data);

    return result;
  }
}
