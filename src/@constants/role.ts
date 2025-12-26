import { UserRole } from "../@types";

/**
 * Centralized user role constants.
 *
 * Maps each allowed UserRole to itself to provide a single source
 * of truth for role values, prevent hard-coded strings, and ensure
 * type-safe role checks across the application.
 */
export const ROLE: Record<UserRole, UserRole> = {
  USER: "USER",
  ADMIN: "ADMIN",
};
