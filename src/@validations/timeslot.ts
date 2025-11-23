import { body, query } from "express-validator";

export const createTimeslotValidation = [
  body("start_time")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("start_time required"),
  body("end_time").trim().escape().notEmpty().withMessage("end_time required"),
];

export const timeslotParams = [
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
