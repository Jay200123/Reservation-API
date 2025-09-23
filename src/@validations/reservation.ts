import { body } from "express-validator";

export const createReservationFields = [
  body("user").trim().escape().notEmpty().withMessage("user required"),
  body("services")
    .isArray({ min: 1 })
    .withMessage("services must be type of arrays"),
  body("timeslot").trim().escape().notEmpty().withMessage("timeslot required"),
  body("payment_type")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("payment_type required")
    .bail()
    .isIn(["CASH", "ONLINE_PAYMENT"])
    .withMessage("payment_type must be 'CASH' OR 'ONLINE_PAYMENT' "),
  body("reservation_date")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("reservation_date"),
];
