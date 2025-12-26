/**
 * Centralized HTTP status code constants.
 *
 * Used to standardize API responses, avoid magic numbers,
 * and improve readability and consistency across controllers
 * and middleware.
 */

export const STATUSCODE = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};
