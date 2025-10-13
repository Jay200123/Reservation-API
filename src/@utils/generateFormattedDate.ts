/**
 * Generates the current date formatted as DDMMYYYY.
 * Uses padStart to ensure single-digit days or months (1–9) are padded with a leading zero.
 * @returns The formatted date string (e.g., "12102025").
 */
const generateFormattedDate = (): string => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // +1 because getMonth() is array-based(starting from zero)
  const year = String(now.getFullYear());

  return `${day}${month}${year}`; // e.g. "12102025"
};

export { generateFormattedDate };
