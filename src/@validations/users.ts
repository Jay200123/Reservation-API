import { body, query } from "express-validator";

export const createUserValidation = [
  body("username")
    .trim() // trim from express-validator removes leading and trailing whitespace ex. "  username  " becomes "username"
    .escape() // escape from express-validator replaces <, >, &, ', " and / with their corresponding HTML entities
    .notEmpty()
    .withMessage("username is required"),
  body("email")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("email required")
    .bail()
    .isEmail()
    .withMessage("email is invalid"),
  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
  body("fullname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("fullname is required"),
  body("contact_number")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("contact_number is required")
    .bail()
    .matches(/^09\d{9}$/)
    .withMessage("Contact number must start with 09 and be 11 digits long"),
  body("address").trim().escape().notEmpty().withMessage("address is required"),
  body("city").trim().escape().notEmpty().withMessage("city is required"),
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

export const usersParams = [
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
