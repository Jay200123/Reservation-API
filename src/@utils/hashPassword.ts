import { hash } from "bcrypt";

/**
 * Hashes a plain-text password using bcrypt.
 *
 * @param password - The plain-text password to hash.
 * @returns A promise that resolves to the hashed password string.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, Number(process.env.SALT_ROUNDS));
};
