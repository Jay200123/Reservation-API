import jwt from "jsonwebtoken";

//Need payload types for each methods
// Check if all methods has pre defined return types. - meaning does each method requires to assign types on what they return ?

export class JWT {
  generateAccessToken(payload: any) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY as string, {
      expiresIn: "5m",
    });
  }

  verifyAccessToken(access_token: any) {
    return jwt.verify(
      access_token,
      process.env.JWT_ACCESS_SECRET_KEY as string
    );
  }

  generateRefreshToken(payload: any) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY as string, {
      expiresIn: "30d",
    });
  }

  verifyRefreshToken(refresh_token: any) {
    return jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET_KEY as string
    );
  }
}
