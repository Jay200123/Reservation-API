import { MiddlewareFn } from "../../@types";
import ReservationService from "./service";
import { SuccessHandler, logger, valdiateFields } from "../../@utils";
import { STATUSCODE } from "../../@constants";

export default class ReservationController {
  constructor(private reservationService: ReservationService) {}

  getAllReservations: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_RESERVATIONS_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.reservationService.getAllReservations();

    logger.info({
      GET_RESERVATIONS_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.SUCCESS,
      result,
      "Reservations retrieved successfully"
    );
  };

  getReservationById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_RESERVATION_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.reservationService.getReservationById(
      req.params.id
    );

    logger.info({
      GET_RESERVATION_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.SUCCESS,
      result,
      "Reservation retrieved successfully"
    );
  };

  createReservation: MiddlewareFn = async (req, res, next) => {
    logger.info({
      CREATE_RESERVATION_REQUEST: {
        message: "SUCCESS",
      },
    });

    valdiateFields(req);

    const result = await this.reservationService.createReservation({
      ...req.body,
    });

    logger.info({
      CREATE_RESERVATION_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.SUCCESS,
      result,
      "Reservations created successfully"
    );
  };

  updateReservationStatusById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      UPDATE_RESERVATION_STATUS_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    valdiateFields(req);

    const result = await this.reservationService.updateReservationStatusById(
      req.params.id,
      req.body.status
    );

    logger.info({
      UPDATE_RESERVATION_STATUS_BY_ID_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.SUCCESS,
      result,
      "Reservation updated successfully."
    );
  };
}
