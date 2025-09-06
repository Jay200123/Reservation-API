import UserService from "./service";
import { MiddlewareFn } from "../../@types";
import { SuccessHandler, logger, valdiateFields } from "../../@utils";
import { STATUSCODE } from "../../@constants";

export default class UserController {
  constructor(private userService: UserService) {}

  getAllUsers: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_ALL_USERS_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.userService.getAllUsers();

    logger.info({
      GET_ALL_USERS_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  getUserById: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_USER_BY_ID_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.userService.getUserById(req.params.user_id);

    logger.info({
      GET_USER_BY_ID_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  createUser: MiddlewareFn = async (req, res, next) => {
    logger.info({
      CREATE_USER_REQUEST: {
        message: "SUCCESS",
      },
    });

    // Validate request fields
    valdiateFields(req);

    const result = await this.userService.createUser(req.body);

    logger.info({
      CREATE_USER_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.CREATED, result, "Success");
  };
}
