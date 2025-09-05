import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../../@utils";

export type ErrorMiddlewareFn = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type SuccessMiddleware = (
  res: Response,
  statusCode: number,
  data: any,
  message: string
) => void;

export type ControllerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
