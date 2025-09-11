import { body } from "express-validator";

export const createUserValidation = [
  body("username")
    .notEmpty()
    .trim() // trim from express-validator removes leading and trailing whitespace ex. "  username  " becomes "username"
    .escape() // escape from express-validator replaces <, >, &, ', " and / with their corresponding HTML entities
    .notEmpty()
    .withMessage("username is required"),
  body("email")
    .notEmpty()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("email required")
    .bail()
    .isEmail()
    .withMessage("email is invalid"),
  body("password")
    .notEmpty()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
  body("fullname")
    .notEmpty()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("fullname is required"),
  body("contact_number")
    .notEmpty()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("contact_number is required"),
  body("address")
    .notEmpty()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("address is required"),
  body("city")
    .notEmpty()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("city is required"),
];

export const loginUserValidation = [
  body("username")
    .trim() // trim from express-validator removes leading and trailing whitespace ex. "  username  " becomes "username"
    .escape() // escape from express-validator replaces <, >, &, ', " and / with their corresponding HTML entities
    .notEmpty()
    .withMessage("username is required"),
  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
];
