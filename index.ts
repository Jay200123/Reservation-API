import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Database } from "./src/@config";
import { logger } from "./src/@utils";
import { ErrorMiddleware } from "./src/@middleware";
import { PATH } from "./src/@constants";
import { users, auth, service, timeslot, reservation } from "./src/@routes";
import mongoose from "mongoose";
import axios from "axios";

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

app.post("/payment", async (req, res) => {
  logger.info({
    TESTING_PAYMENT_API_REQUEST: {
      message: "SUCESS",
    },
  });

  try {
    //v1
    const response = await axios.post(
      `${process.env.MAYA_SANDBOX_BASE_URL}/checkout/v1/checkouts`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.MAYA_PUBLIC_KEY}` + ":"
          ).toString("base64")}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err: any) {
    console.log(err.response.data);

    res.status(400).json({
      message: "Payment API Failed",
    });
  }

  logger.info({
    TESTING_PAYMENT_API_RESPONSE: {
      message: "SUCCESS",
    },
  });
});

//mock payment success endpoint
app.get("/success", async (req, res) => {
  logger.info({
    TESTING_PAYMENT_API_SUCCESS_REQUEST: {
      message: "SUCESS",
    },
  });

  const msg = "Payment Success";

  logger.info({
    TESTING_PAYMENT_API_SUCCESS_RESPONSE: {
      message: "SUCCESS",
    },
  });

  res.status(200).json({
    message: msg,
  });
});

app.get("/failure", async (req, res) => {
  logger.info({
    TESTING_PAYMENT_API_FAILURE_REQUEST: {
      message: "SUCESS",
    },
  });

  const msg = "Payment Failure";

  logger.info({
    TESTING_PAYMENT_API_FAILURE_RESPONSE: {
      message: "SUCCESS",
    },
  });

  res.status(200).json({
    message: msg,
  });
});

app.get("/cancel", async (req, res) => {
  logger.info({
    TESTING_PAYMENT_API_CANCEL_REQUEST: {
      message: "SUCESS",
    },
  });

  const msg = "Payment Cancelled";

  logger.info({
    TESTING_PAYMENT_API_CANCEL_RESPONSE: {
      message: "SUCCESS",
    },
  });

  res.status(200).json({
    message: msg,
  });
});

// Set up the base route for all API v1 endpoints
app.use(PATH.API, auth, users, service, timeslot, reservation);

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
