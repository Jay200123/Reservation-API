import RatingsService from "./service";
import { MiddlewareFn } from "../../@types";
import { logger, SuccessHandler, validateFields } from "../../@utils";
import { STATUSCODE } from "../../@constants";

export default class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  getAllRatings: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_ALL_RATINGS_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.ratingsService.getAllRatings(
      Number(req.query.skip || 0),
      Number(req.query.limit || 0)
    );

    logger.info({
      GET_ALL_RATINGS_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  getRatingById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_RATING_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.ratingsService.getRatingById(req.params.id);

    logger.info({
      GET_RATING_BY_ID_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  addRating: MiddlewareFn = async (req, res, next) => {
    logger.info({
      CREATE_RATING_REQUEST: {
        message: "SUCCESS",
      },
    });

    // Validate request fields
    validateFields(req);

    const result = await this.ratingsService.addRating({
      ...req.body,
      rating: Number(req.body.rating),
      image: req.files,
    });

    logger.info({
      CREATE_RATING_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.CREATED, result, "Success");
  };

  updateRatingById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      UPDATE_RATING_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.ratingsService.updateRatingById(req.params.id, {
      ...req.body,
    });

    logger.info({
      UPDATE_RATING_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  deleteRatingById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      DELETE_RATING_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.ratingsService.deleteRatingById(req.params.id);

    logger.info({
      DELETE_RATING_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };
}
