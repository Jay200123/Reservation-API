// utils/logger.ts
import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  const formattedMessage =
    typeof message === "object" ? JSON.stringify(message) : message;

  return `[${timestamp}] ${level}: ${formattedMessage}`;
});

// Create the logger
export const logger = createLogger({
  level: "info", // default level
  format: combine(
    colorize(), // add colors for console
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new transports.Console(), // log to console
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});
