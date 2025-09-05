import { hash } from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, Number(process.env.SALT_ROUNDS));
};
