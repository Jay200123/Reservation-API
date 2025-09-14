import { body } from "express-validator";

export const createTimeslotValidation = [
  body("start_time")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("start_time required"),
  body("end_time").trim().escape().notEmpty().withMessage("end_time required"),
];
