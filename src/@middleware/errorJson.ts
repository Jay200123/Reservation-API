import { ErrorMiddlewareFn } from "../@types";
import { ErrorHandler } from "../@utils";

/**
 * Error Handling Middleware Class
 * @class ErrorMiddleware
 * @method errorJson - Middleware to convert non-ErrorHandler errors to ErrorHandler
 * @method errorHandler - Middleware to send JSON error responses
 */
export class ErrorMiddleware {
  // /**
  //  * @returns {ErrorMiddlewareFn} Middleware function to handle errors
  //  * @description This middleware checks if the error is an instance of ErrorHandler. If not, it converts it to an ErrorHandler with a 500 status code and passes it to the next middleware.
  //  */
  // errorJson(): ErrorMiddlewareFn {
  //   return (err, req, res, next) => {
  //     if (!(err instanceof ErrorHandler)) {
  //       // if the err.message is not a string, set it to "Internal Server Error"
  //       const message =
  //         typeof err === "object" && err !== null && "message" in err
  //           ? (err as any).message
  //           : "Internal Server Error";

  //       err = new ErrorHandler(500, message);

  //       return next(err);
  //     }
  //   };
  // }

  /**
   *
   * @returns {ErrorMiddlewareFn} Middleware function to send JSON error responses
   * @description This middleware sends a JSON response with the error's status code and message. If the error does not have a status code or message, it defaults to 500 and "Internal Server Error".
   */
  errorHandler(): ErrorMiddlewareFn {
    return (err, req, res, next) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(statusCode).json({
        status: statusCode,
        message,
      });
    };
  }
}
