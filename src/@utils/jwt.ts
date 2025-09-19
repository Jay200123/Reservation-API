import jwt from "jsonwebtoken";
import { ErrorHandler } from "./handlers";
import { STATUSCODE } from "../@constants";
import { logger } from "./logger";
import { JWTPayload } from "../@types";

//Need payload types for each methods
// Check if all methods has pre defined return types. - meaning does each method requires to assign types on what they return ?

export class JWT {
  generateAccessToken(payload: JWTPayload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY as string, {
      expiresIn: "1h",
    });
  }

  verifyAccessToken(access_token: string): JWTPayload {
    try {
      return jwt.verify(
        access_token,
        process.env.JWT_ACCESS_SECRET_KEY as string
      ) as JWTPayload;
    } catch (err) {
      logger.info({
        VERIFY_ACCESS_TOKEN_ERROR: {
          message: "Access Token Verification failed.",
          err: err,
        },
      });
      throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized");
    }
  }

  generateRefreshToken(payload: JWTPayload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY as string, {
      expiresIn: "30d",
    });
  }

  verifyRefreshToken(refresh_token: string): void {
    return jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET_KEY as string,
      (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          logger.info({
            JWT_ACCESS_TOKEN_VERIFY_ERROR: {
              message: "Refresh token verification failed.",
              error: err,
            },
          });

          throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized");
        }

        return decoded;
      }
    );
  }
}
