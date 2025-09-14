import TimeslotService from "./service";
import { MiddlewareFn } from "../../@types";
import { logger, SuccessHandler, valdiateFields } from "../../@utils";
import { STATUSCODE } from "../../@constants";

export default class TimeslotController {
  constructor(private timeslotService: TimeslotService) {}

  getAllTimeslots: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_ALL_TIMESLOTS_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.timeslotService.getAllTimeslots();

    logger.info({
      GET_ALL_TIMESLOTS_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  getAllTimeslotById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_ALL_TIMESLOTS_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.timeslotService.getTimeslotById(req.params.id);

    logger.info({
      GET_ALL_TIMESLOTS_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  createTimeslot: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_ALL_TIMESLOTS_REQUEST: {
        message: "SUCCESS",
      },
    });

    valdiateFields(req);

    const result = await this.timeslotService.createTimeslot(req.body);

    logger.info({
      GET_ALL_TIMESLOTS_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.CREATED,
      result,
      "Timeslot created successfully."
    );
  };

  updateTimeslotById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_ALL_TIMESLOTS_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.timeslotService.updateTimeslotById(
      req.params.id,
      req.body
    );

    logger.info({
      GET_ALL_TIMESLOTS_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.SUCCESS,
      result,
      "Timeslot updated successfully."
    );
  };

  deleteTimeslotById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_ALL_TIMESLOTS_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.timeslotService.deleteTimeslotById(req.params.id);

    logger.info({
      GET_ALL_TIMESLOTS_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.SUCCESS,
      result,
      "Timeslot deleted successfully."
    );
  };
}
