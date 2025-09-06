import mongoose from "mongoose";
import { logger } from "../@utils";

/**
 * Establish a connection to the MongoDB database using Mongoose.
 * The connection URI is passed as an argument to the connect method.
 * If the connection is successful, a success message is logged.
 * If there is an error during the connection, it is caught and logged,
 * and the process exits with a failure code.
 */
export class Database {
  public static async connect(uri: string): Promise<void> {
    try {
      await mongoose.connect(uri); // Use the provided URI for connection
      logger.info(`Mongoose database connection established successfully`);
    } catch (error) {
      logger.error("Mongoose database connection error:", error);
      process.exit(1); // Exit the process with a failure code
    }
  }
}
