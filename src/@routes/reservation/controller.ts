import { MiddlewareFn } from "../../@types";
import ReservationService from "./service";
import { SuccessHandler, logger, validateFields } from "../../@utils";
import { STATUSCODE } from "../../@constants";

export default class ReservationController {
  constructor(private reservationService: ReservationService) {}

  getAllReservations: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_RESERVATIONS_REQUEST: {
        message: "SUCCESS",
      },
    });

    validateFields(req);

    const result = await this.reservationService.getAllReservations(
      Number(req.query.skip || 0),
      Number(req.query.limit || 10)
    );

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

    validateFields(req);

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

    validateFields(req);

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

  updateReservationScheduleById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      RESCHEDULE_RESERVATION_REQUEST: {
        message: "SUCCESS",
      },
    });

    validateFields(req);

    const result = await this.reservationService.updateReservationScheduleById(
      req.params.id,
      req.body
    );

    logger.info({
      RESCHEDULE_RESERVATION_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.SUCCESS,
      result,
      "Reservation rescheduled successfully."
    );
  };

  getUserReservationsByUserId: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_RESERVATIONS_BY_USER_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.reservationService.getUserReservationsByUserId(
      req.params.user_id
    );

    logger.info({
      GET_RESERVATIONS_BY_USER_ID_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.SUCCESS,
      result,
      "Reservations retrieved successfully."
    );
  };
}
