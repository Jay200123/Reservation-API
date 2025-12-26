import type { CorsOptions } from "cors";
import whitelist from "./whitelist";

/**
 * CORS configuration options for the Booking API.
 *
 * Validates the request origin against a predefined whitelist.
 * Requests with no origin (e.g., server-to-server or same-origin)
 * or with an origin included in the whitelist are allowed.
 * All other origins are rejected.
 */
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
};

export { corsOptions };
