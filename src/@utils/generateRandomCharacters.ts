/**
 * Generate 6 random characters.
 * Used for customizing filename upload.
 * @returns - 6 random characters
 */

const generateRandomCharacters = () => {
  const chars = "ABCDEFGHIKJLMNOPQRSTUVWXYZ";

  let result: string = "";

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

export { generateRandomCharacters };
