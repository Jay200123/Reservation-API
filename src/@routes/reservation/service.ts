import mongoose from "mongoose";
import { STATUSCODE } from "../../@constants";
import {
  createReservationFields,
  ErrorHandler,
  logger,
  verifyFields,
} from "../../@utils";
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
    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createReservationFields, data);

    const session = await mongoose.startSession();

    session.startTransaction();
    try {
      //checking logic here!

      const result = await this.reservationRepository.create({
        ...data,
        status: "PENDING",
      });

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
    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createReservationFields, data);

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
