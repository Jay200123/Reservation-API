import { body } from "express-validator";

export const createServiceValidation = [
  body("service_name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("service_name required"),
  body("service_price")
    .trim()
    .escape()
    .isFloat({ min: 0 })
    .withMessage("Price must be 0 or greater")
    .bail()
    .notEmpty()
    .withMessage("service_price required"),
  body("description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("description required"),
];
