import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../../@utils";
import { Users } from "../models/user";

type ErrorMiddlewareFn = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

type SuccessMiddleware = (
  res: Response,
  statusCode: number,
  data: any,
  message: string
) => void;

type MiddlewareFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

type JWTPayload = {
  user: Users;
};
export { ErrorMiddlewareFn, SuccessMiddleware, MiddlewareFn, JWTPayload };
