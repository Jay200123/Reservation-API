import { body, query } from "express-validator";

const createServiceValidation = [
  body("service_name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("service_name required"),
  body("service_price")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("service_price required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price must be 0 or greater"),
  body("duration").trim().escape().notEmpty().withMessage("duration required"),
  body("description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("description required"),
];

const serviceParams = [
  query("skip")
    .notEmpty()
    .withMessage("Missing parameters")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Invalid request"),
  query("limit")
    .notEmpty()
    .withMessage("Missing parameters")
    .isInt({ min: 0 })
    .withMessage("Invalid request"),
];

const userServiceParams = [
  query("service_name").notEmpty().withMessage("missing service_name"),
  query("service_price")
    .notEmpty()
    .withMessage("Missing parameters")
    .isInt({ min: 0 })
    .withMessage("Invalid request"),
  query("skip")
    .notEmpty()
    .withMessage("Missing parameters")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Invalid request"),
  query("limit")
    .notEmpty()
    .withMessage("Missing parameters")
    .isInt({ min: 0 })
    .withMessage("Invalid request"),
];

export { createServiceValidation, serviceParams, userServiceParams };
