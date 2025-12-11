import { body } from "express-validator";

const createRatingField = [
  body("user").trim().escape().notEmpty().withMessage("user required"),
  body("reservation")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("reservation required"),
  body("description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("description required"),
  body("rating")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("rating required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("rating must be 0 or greater"),
];

const updateRatingFields = [
  body("description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("description required"),
  body("rating")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("rating required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("rating must be 0 or greater"),
];

export { createRatingField, updateRatingFields };
