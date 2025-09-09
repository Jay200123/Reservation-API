import { STATUSCODE } from "../@constants";
import { ErrorHandler } from "./handlers";

/**
 * @param field
 * @param data
 */
export const verifyFields = (fields: string[], data: Record<string, any>) => {
  const requestFields = Object.keys(data);

  const unknownFields = requestFields.filter(
    (field) => !fields.includes(field)
  );

  if (unknownFields.length > 0) {
    throw new ErrorHandler(
      STATUSCODE.UNPROCESSABLE_ENTITY,
      `Unknown fields: ${unknownFields.join(", ")}`
    );
  }
};
