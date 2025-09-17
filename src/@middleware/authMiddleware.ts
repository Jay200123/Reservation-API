import { MiddlewareFn } from "../@types";
import { ErrorHandler, logger, JWT } from "../@utils";
import SettingsRepository from "../@routes/settings/repository";
import AuthRepository from "../@routes/auth/repository";
import { STATUSCODE } from "../@constants";
import bcrypt from "bcrypt";

export class AuthMiddleware {
  constructor(
    private settingsRepository: SettingsRepository,
    private authRepository: AuthRepository,
    private jwtUtils: JWT
  ) {}

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
    return async (req, res, next) => {
      logger.info({
        ACCESS_TOKEN_VERIFIER_REQUEST: {
          message: "Success",
        },
      });

      const access_token = req.headers["authorization"];

      if (!access_token) {
        logger.info({
          ACCESS_TOKEN_VERIFIER_ERROR: {
            message: "Missing authorization headers.",
          },
        });

        throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized.");
      }

      const credentials = await this.authRepository.getOneByAccessToken(
        access_token
      );

      if (!credentials) {
        logger.info({
          ACCESS_TOKEN_VERIFIER_ERROR: {
            message: "Credentials not found",
          },
        });

        throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized.");
      }

      //verify access token.
      this.jwtUtils.verifyAccessToken(access_token);

      logger.info({
        ACCESS_TOKEN_VERIFIER_RESPONSE: {
          message: "Success",
        },
      });

      next();
    };
  }

  RefreshTokenVerifier(): MiddlewareFn {
    return async (req, res, next) => {
      logger.info({
        REFRESH_TOKEN_VERIFIER_REQUEST: {
          message: "SUCCESS",
        },
      });

      const refresh_token = req.headers["authorization"];

      if (!refresh_token) {
        logger.info({
          REFRESH_TOKEN_VERIFIER_ERROR: {
            message: "Missing authorization headers.",
          },
        });

        throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized.");
      }

      const credentials = await this.authRepository.getOneByRefreshToken(
        refresh_token
      );

      if (!credentials) {
        logger.info({
          REFRESH_TOKEN_VERIFIER_ERROR: {
            message: "Credentials not found.",
          },
        });

        throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized.");
      }

      //verifies if the refresh token is still valid or not.
      this.jwtUtils.verifyRefreshToken(refresh_token);

      logger.info({
        REFRESH_TOKEN_VERIFIER_RESPONSE: {
          message: "SUCCESS",
        },
      });

      next();
    };
  }
}
