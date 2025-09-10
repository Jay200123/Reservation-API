import { MiddlewareFn } from "../../@types";
import AuthService from "./service";
import {
  logger,
  SuccessHandler,
  ErrorHandler,
  valdiateFields,
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
    valdiateFields(req);

    const result = await this.authService.registerUser(req.body);

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

    const headers = req.headers["authorization"];

    if (!headers) {
      return next(new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Invalid Request"));
    }

    const refresh_token = headers.split(", ")[1];

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
}
