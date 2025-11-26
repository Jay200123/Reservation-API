import ServiceServices from "./service";
import { MiddlewareFn } from "../../@types";
import { SuccessHandler, logger, validateFields } from "../../@utils";
import { STATUSCODE } from "../../@constants";

export default class ServiceController {
  constructor(private serviceServices: ServiceServices) {}

  getAllServices: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_ALL_SERVICES_REQUEST: {
        message: "SUCCESS",
      },
    });

    validateFields(req);

    const result = await this.serviceServices.getAllServices(
      Number(req.query.skip || 0),
      Number(req.query.limit || 10)
    );

    logger.info({
      GET_ALL_SERVICES_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  getServiceById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_SERVICE_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.serviceServices.getServiceById(req.params.id);

    logger.info({
      GET_SERVICE_BY_ID_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  createService: MiddlewareFn = async (req, res, next) => {
    logger.info({
      CREATE_SERVICE_REQUEST: {
        message: "SUCCESS",
      },
    });

    validateFields(req);

    console.log("Checking Files");
    console.log(req.files);

    const result = await this.serviceServices.createService({
      ...req.body,
      image: req.files,
    });

    logger.info({
      CREATE_SERVICE_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.CREATED,
      result,
      "New service created successfully."
    );
  };

  updateServiceById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      UPDATE_SERVICE_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.serviceServices.updateServiceById(req.params.id, {
      ...req.body,
      image: req.files,
    });

    logger.info({
      UPDATE_SERVICE_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.SUCCESS,
      result,
      "Service updated successfully."
    );
  };

  deleteServiceById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      DELETE_SERVICE_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.serviceServices.deleteServiceById(
      req.params.service_id
    );

    logger.info({
      DELETE_SERVICE_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  getUserServices: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_USER_SERVICES_REQUEST: {
        message: "SUCCESS",
      },
    });

    validateFields(req);

    const result = await this.serviceServices.getUserServices(
      //filter object
      {
        service_name: String(req.query.service_name) || "",
        service_price: Number(req.query.service_price) || 0,
      },

      //skip
      Number(req.query.skip || 0),
      //limit
      Number(req.query.limit || 10)
    );

    logger.info({
      GET_USER_SERVICES_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };
}
