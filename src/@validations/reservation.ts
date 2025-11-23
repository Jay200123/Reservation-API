import { body, query } from "express-validator";

const createReservationFields = [
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

const updateReservationStatusField = [
  body("status")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("status required")
    .bail()
    .isIn(["PENDING", "RESCHEDULED", "ONGOING", "FINISHED"])
    .withMessage(
      "status must be 'PENDING', 'RESCHEDULED', 'ONGOING' AND 'FINISHED' "
    ),
];

const rescheduleReservationFields = [
  body("timeslot").trim().escape().notEmpty().withMessage("timeslot required"),
  body("reservation_date")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("reservation_date required"),
  body("reason").trim().escape().notEmpty().withMessage("reason required"),
];

export const reservationParams = [
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

export {
  createReservationFields,
  updateReservationStatusField,
  rescheduleReservationFields,
};
