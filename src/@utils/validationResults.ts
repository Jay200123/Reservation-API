import { ResultFactory, validationResult } from "express-validator";
import { ErrorHandler } from "./handlers";
import { STATUSCODE } from "../@constants";
import { Request } from "express";
import { logger } from "./logger";

/**
 * A customized validation result factory that formats errors to return only the error message as a string.
 * `ResultFactory<string>` indicates that the errors will be formatted as strings.
 * `formatter` is a function that takes an error object and returns the error message.
 */
const myValidationResult: ResultFactory<string> = validationResult.withDefaults(
  {
    formatter: (error) => error.msg as string,
  }
);

/**
 *
 * @param req - The Express request object to validate.
 * @throws {ErrorHandler} - Throws an ErrorHandler if validation errors are found.
 * @description This function checks for validation errors in the request object using a customized validation result factory.
 * If any errors are found, it throws an ErrorHandler with a status code of 422 (Unprocessable Entity) and a message "Invalid Fields!".
 */
export const valdiateFields = (req: Request) => {
  const errors = myValidationResult(req).array();

  /**
   * If `errors` contains any entries, an error will be thrown.
   * By default, `errors` is an array of error messages returned by the `myValidationResult` function.
   * Using JavaScript's built-in `Array.prototype.join` method, the array of error messages
   * is converted into a single string, with each message separated by a comma and a space (", ").
   */
  if (errors.length > 0) {
    logger.info({
      MISSING_REQUIRED_FIELDS_ERROR: {
        err: errors?.map((err) => {
          return err;
        }),
      },
    });
    throw new ErrorHandler(STATUSCODE.UNPROCESSABLE_ENTITY, errors.join(", "));
  }
};
