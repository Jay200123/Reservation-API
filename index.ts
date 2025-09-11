import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Database } from "./src/@config";
import { logger, hashPassword } from "./src/@utils";
import { ErrorMiddleware } from "./src/@middleware";
import { PATH } from "./src/@constants";
import { users, auth, service } from "./src/@routes";
import mongoose from "mongoose";

dotenv.config();
const app = express();

/**
 * Calls the Database object with the `connect` method to establish a connection
 * to the MongoDB database using the connection string from environment variables.
 */
Database.connect(process.env.DATABASE_URI as string);

/**
 * Middleware to parse incoming JSON payloads.
 * Required for handling requests with "Content-Type: application/json"
 **/
app.use(express.json());

/**
 * Middleware to parse URL-encoded payloads (e.g., from HTML forms).
 * Allows the server to handle form submissions from the frontend.
 * "extended: true" enables parsing of nested objects.
 **/
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Booking API Running!",
  });
});

// Set up the base route for all API v1 endpoints
app.use(PATH.API, auth, users, service);

app.all("/*splat", (req: Request, res: Response) => {
  return res.status(405).json({
    message: "Method not Allowed",
  });
});

/**
 * Error Middleware
 * Handles errors and sends JSON responses
 * Should be the last middleware
 * to catch all errors in the whole express application
 */
const errorMiddleware = new ErrorMiddleware();

// app.use(errorMiddleware.errorJson());
app.use(errorMiddleware.errorHandler());

/**
 * Start the server only after the database connection is established
 * to ensure that the application is fully functional
 * when it starts accepting requests.
 */
mongoose.connection.once("open", () => {
  app.listen(process.env.PORT);
  logger.info(`Server running on port ${process.env.PORT}`);
});

/**
 * Handle database connection errors
 * Log the error and exit the process
 * to avoid running the application in an unstable state.
 */
mongoose.connection.on("error", (err) => {
  logger.error(err);
  process.exit(1);
});
