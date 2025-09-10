import { MiddlewareFn } from "../../@types";
import AuthService from "./service";
import { logger, SuccessHandler, valdiateFields } from "../../@utils";
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
}
