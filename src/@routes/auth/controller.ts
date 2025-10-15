import { MiddlewareFn } from "../../@types";
import AuthService from "./service";
import {
  logger,
  SuccessHandler,
  ErrorHandler,
  validateFields,
} from "../../@utils";
import { STATUSCODE } from "../../@constants";
export default class AuthController {
  constructor(private authService: AuthService) {}

  registerUser: MiddlewareFn = async (req, res, next) => {
    logger.info({
      REGISTER_USER_REQUEST: {
        message: "SUCCESS",
      },
    });
    // Validate request fields
    validateFields(req);

    
    const result = await this.authService.registerUser({
      ...req.body,
      image: req.files,
    });

    // const result = "Working on Register API Feature.";

    logger.info({
      REGISTER_USER_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.CREATED,
      result,
      "User registered successfully"
    );
  };

  loginUser: MiddlewareFn = async (req, res, next) => {
    logger.info({
      LOGIN_USER_REQUEST: {
        message: "SUCCESS",
      },
    });

    validateFields(req);

    const result = await this.authService.loginUser(req.body);

    logger.info({
      LOGIN_USER_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.SUCCESS,
      result,
      "User logged in Successfully."
    );
  };

  refreshCredentialsByUser: MiddlewareFn = async (req, res, next) => {
    logger.info({
      REFRESH_TOKEN_REQUEST: {
        message: "SUCCESS",
      },
    });

    const refresh_token = req.headers["authorization"];

    if (!refresh_token) {
      return next(new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Invalid Request"));
    }

    const result = await this.authService.refreshCredentialsByUser(
      refresh_token
    );

    logger.info({
      REFRESH_TOKEN_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };

  logoutUser: MiddlewareFn = async (req, res, next) => {
    logger.info({
      LOGOUT_USER_REQUEST: {
        message: "SUCCESS",
      },
    });

    const access_token = req.headers["authorization"];

    if (!access_token) {
      throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized");
    }

    const result = await this.authService.logoutUser(access_token);

    logger.info({
      LOGOUT_USER_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(
      res,
      STATUSCODE.SUCCESS,
      result,
      "Logout successfully"
    );
  };
}
