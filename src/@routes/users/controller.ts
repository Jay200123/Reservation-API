import UserService from "./service";
import { MiddlewareFn } from "../../@types";
import { SuccessHandler, logger, validateFields } from "../../@utils";
import { STATUSCODE } from "../../@constants";

export default class UserController {
  constructor(private userService: UserService) {}

  getAllUsers: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_ALL_USERS_REQUEST: {
        message: "SUCCESS",
      },
    });

    validateFields(req);

    const result = await this.userService.getAllUsers(
      Number(req.params.skip || 0),
      Number(req.params.limit || 10)
    );

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

    const result = await this.userService.getUserById(req.params.id);

    logger.info({
      GET_USER_BY_ID_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  updateUser: MiddlewareFn = async (req, res, next) => {
    logger.info({
      UPDATE_USER_REQUEST: {
        message: "Success",
      },
    });

    const result = await this.userService.updateUser(req.params.id, {
      ...req.body,
      image: req.files,
    });

    logger.info({
      UPDATE_USER_RESPONSE: {
        message: "Success",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };
}
