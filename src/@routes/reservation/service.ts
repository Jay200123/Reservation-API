import mongoose from "mongoose";
import { STATUSCODE } from "../../@constants";
import {
  createReservationFields,
  ErrorHandler,
  logger,
  rescheduleFields,
  verifyFields,
} from "../../@utils";
import ReservationRepository from "./repository";
import ServiceRepository from "../service/repository";
import { Reschedule, Reservations, ReservationStatus } from "../../@types";
import TimeslotRepository from "../timeslot/repository";
import UserRepository from "../users/repository";

export default class ReservationService {
  constructor(
    private reservationRepository: ReservationRepository,
    private serviceRepository: ServiceRepository,
    private timeslotRepository: TimeslotRepository,
    private userRepository: UserRepository
  ) {}

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

  /**
   * Insert Reservation Details to reservation collections in the database.
   * @param data
   * @returns result
   */

  async createReservation(data: Omit<Reservations, "createdAt" | "updatedAt">) {
    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createReservationFields, data);

    // New Possible Features
    // - Reschedule Reservation
    // - Cancel or void Reservations

    //Initiate Mongoose Session
    const session = await mongoose.startSession();

    //Start Transactions
    session.startTransaction();

    try {
      // Retrieve user by id (data.user property) - (to check if the user exists in the database.)
      const user = await this.userRepository.getById(data.user.toString());

      //If user does not exists.
      // For security, send only a generic error to the client. Log detailed error info using Winston.
      if (!user) {
        logger.info({
          CREATE_RESERVATION_ERROR: {
            message: "User Not Found",
          },
        });
        throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Reservations");
      }

      // Retrieve timeslot by id  (data.timeslot property) - (to check if the timeslot exists in the database.)
      const timeslot = await this.timeslotRepository.getById(
        data.timeslot.toString()
      );

      //If timeslot does not exists.
      // For security, send only a generic error to the client. Log detailed error info using Winston.
      if (!timeslot) {
        logger.info({
          CREATE_RESERVATION_ERROR: {
            message: "Timeslot Not Found",
          },
        });
        throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Reservations");
      }

      // Retrieve an existing reservation by the selected timeslot ID (to check for conflicts)
      const reservation_timeslot =
        await this.reservationRepository.getByTimeslotId(
          data.timeslot.toString()
        );

      /**
       * Checks if the timeslot and reservation date selected by the user already existed in the reservations collection.
       * Ensures the selected timeslot and reservation date are not already booked
       */
      if (
        (reservation_timeslot &&
          reservation_timeslot.reservation_date.toISOString().split("T")[0] ==
            String(data.reservation_date) &&
          reservation_timeslot.status == "PENDING") ||
        reservation_timeslot?.status == "ONGOING"
      ) {
        throw new ErrorHandler(
          STATUSCODE.BAD_REQUEST,
          "Timeslot already occupied"
        );
      }

      // initiate a amount with default value of zero
      let totalAmount: number = 0;

      /**
       * Reiterate each object with a `service` property inside the services array.
       * This is used to calculate the total amount for the reservation placed by the user and
       * service validation if the service selected by the user exists in the `services` collection.
       */
      for (const services of data.services) {
        const service = await this.serviceRepository.getById(
          services.service.toString()
        );

        // For security, send only a generic error to the client. Log detailed error info using Winston.
        if (!service) {
          logger.info({
            CREATE_RESERVATION_ERROR: {
              message: "Service Not Found",
            },
          });

          throw new ErrorHandler(
            STATUSCODE.BAD_REQUEST,
            "Invalid Reservations"
          );
        }

        // Add the service's price (from the Services collection) to the total amount
        totalAmount += service.service_price;
      }

      const result = await this.reservationRepository.create({
        ...data,
        amount: totalAmount,
        status: "PENDING", //set the reservation to default as `pending`.
      });

      //commit mongoose Transaction
      await session.commitTransaction();

      return result;
    } catch (err) {
      logger.info({
        CREATE_RESERVATION_ERROR: {
          err: err,
        },
      });
      await session.abortTransaction();

      throw err;
    } finally {
      await session.endSession();
    }
  }

  async updateReservationStatusById(id: string, status: ReservationStatus) {
    if (id == ":id") {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Missing Reservation ID");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const reservation = await this.reservationRepository.getById(id);

    if (!reservation) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Reservation  not found");
    }

    const result = await this.reservationRepository.updateStatusById(
      id,
      status
    );

    return result;
  }

  async updateReservationScheduleById(
    id: string,
    data: Omit<Reschedule, "status">
  ) {
    if (id == ":id") {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Missing Reservation ID");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const reservation = await this.reservationRepository.getById(id);

    if (!reservation) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Reservation  not found");
    }

    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(rescheduleFields, data);

    const reservation_timeslot =
      await this.reservationRepository.getByTimeslotId(
        data.timeslot.toString()
      );

    if (
      reservation_timeslot &&
      reservation_timeslot.reservation_date.toISOString().split("T")[0] ==
        String(data.reservation_date)
    ) {
      throw new ErrorHandler(
        STATUSCODE.BAD_REQUEST,
        "Timeslot already occupied"
      );
    }

    // const result = await this.reservationRepository.rescheduleById(id, {
    //   ...data,
    //   status: "RESCHEDULED",
    // });

    const result = "Mock Reschedule API";

    return result;
  }
}
