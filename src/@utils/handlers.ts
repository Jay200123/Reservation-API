import { SuccessMiddleware } from "../@types";

/**
 * Custom Error Handler Class
 * @class ErrorHandler
 * @extends Error
 * @property {number} statusCode - HTTP status code
 * @property {string} message - Error message
 * @method constructor - Initializes the error with status code and message
 * @method captureStackTrace - Captures the stack trace for debugging
 */
export class ErrorHandler extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Success Response Handler
 * @param res Response object from Express
 * @param statusCode HTTP status code
 * @param data Response data
 * @param message Success message
 * @returns JSON response
 */
export const SuccessHandler: SuccessMiddleware = (
  res,
  statusCode,
  data,
  message
) => {
  return res.status(statusCode).json({
    status: statusCode,
    details: data,
    message: message,
  });
};
