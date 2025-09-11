/**
 * Re-exports a default export from another module under a named export.
 *
 * This pattern is typically used in index files to centralize and simplify imports,
 * allowing imports from a single entry point instead of multiple files.
 *
 * Example:
 *   // In index.ts
 *   export { default as users } from "./users/route";
 *
 *   // In another file
 *   import { users } from "./routes";
 */

export { default as users } from "./users/route";
export { default as auth } from "./auth/route";
export { default as service } from "./service/route";
