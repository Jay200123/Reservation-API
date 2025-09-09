import { MiddlewareFn } from "../@types";
import { ErrorHandler, logger } from "../@utils";
import { SettingsRepository } from "../@routes/settings/repository";
import { STATUSCODE } from "../@constants";
import bcrypt from "bcrypt";

export class AuthMiddleware {
  constructor(private settingsRepository: SettingsRepository) {}

  BasicAuthenticationVerifier(): MiddlewareFn {
    return async (req, res, next) => {
      logger.info({
        BASIC_AUTH_REQUEST: {
          message: "SUCCESS",
        },
      });

      const basicHeaders = req.headers["authorization"];

      if (!basicHeaders) {
        logger.info({
          BASIC_AUTH_ERROR: {
            message: "Missing Authorization Headers",
          },
        });
        throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized");
      }

      const basicType = basicHeaders.split(" ")[0];

      if (basicType !== "Basic") {
        logger.info({
          BASIC_AUTH_ERROR: {
            message: "Invalid Authentication Type",
          },
        });
        throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized");
      }

      const basicCredentials = basicHeaders.split(" ")[1];

      const credentials = Buffer.from(basicCredentials, "base64").toString(
        "utf-8"
      );

      const [username, password] = credentials.split(":");

      const result = await this.settingsRepository.getByUsername(username);

      if (!result) {
        logger.info({
          BASIC_AUTH_ERROR: {
            message: "Invalid Credentials",
          },
        });
        throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized");
      }

      const isPasswordMatch = await bcrypt.compare(
        password,
        result.settings_password
      );

      if (!isPasswordMatch) {
        logger.info({
          BASIC_AUTH_ERROR: {
            message: "Invalid Password",
          },
        });
        throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized");
      }

      logger.info({
        BASIC_AUTH_RESPONSE: {
          message: "SUCCESS",
        },
      });
      next();
    };
  }

  // For Verifying access token attached from headers in the request object.
  AccessTokenVerifier(): MiddlewareFn {
    return (req, res, next) => {
      console.log("Access Token!");
      next();
    };
  }
}
