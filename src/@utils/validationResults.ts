import { ResultFactory, validationResult } from "express-validator";
import { ErrorHandler } from "./handlers";
import { STATUSCODE } from "../@constants";
import { Request } from "express";

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

  console.log(errors);

  if (errors.length > 0) {
    throw new ErrorHandler(STATUSCODE.UNPROCESSABLE_ENTITY, errors[0]);
  }
};
