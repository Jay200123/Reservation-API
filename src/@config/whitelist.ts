/**
 * List of allowed origins for CORS.
 * Used to validate incoming request origins.
 */

const whitelist = [
  "http://localhost:5173", //for react-vite servers
  "http://localhost:80", //nginx servers
  "http://localhost",
];

export default whitelist;
