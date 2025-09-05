import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Database } from "./src/@config";
import { logger } from "./src/@utils";
import { ErrorMiddleware } from "./src/@middleware";
import mongoose from "mongoose";

dotenv.config();
const app = express();

Database.connect(process.env.DATABASE_URI as string);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Booking API Running!",
  });
});

// Set up the base route for all API v1 endpoints
// app.use("/api/v1")

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

app.use(errorMiddleware.errorJson.bind(errorMiddleware));
app.use(errorMiddleware.errorHandler.bind(errorMiddleware));

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
