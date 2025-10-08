import type { CorsOptions } from "cors";
import whitelist from "./whitelist";

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
