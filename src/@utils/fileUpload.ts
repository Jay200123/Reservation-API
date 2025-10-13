import multer from "multer";
import path from "path";
import { generateRandomCharacters } from "./generateRandomCharacters";
import { generateFormattedDate } from "./generateFormattedDate";
import { logger } from "./logger";

const storage = multer.diskStorage({
  /**
   * Defines the destination directory for uploaded files on the server.
   *
   * @param req - The Express request object.
   * @param file - The uploaded file object from the request.
   * @param callback - A callback function to specify the destination path or return an error.
   *
   * Files will be stored in the `public/images` directory of the Node application upon successful upload.
   */
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../../public/images"));
  },

  /**
   * Generates a custom filename for each uploaded file before saving it to the storage directory.
   *
   * The filename is composed of randomly generated characters, the current formatted date,
   * and the file's original extension — ensuring each file has a unique and traceable name.
   *
   * Example output: `ABCDEF12102025.jpg`
   *
   * @param req - The Express request object.
   * @param file - The uploaded file object from the request.
   * @param callback - A callback function that returns the generated filename or an error.
   */
  filename: (req, file, callback) => {
    // Generate a random 6-character string (e.g., "ABCDEF")
    const randomCharacters = generateRandomCharacters();

    // Generate the current formatted date (e.g., "12102025" for DDMMYYYY)
    const formattedDate = generateFormattedDate();

    // Retrieve the file's original extension (e.g., ".jpg", ".png", ".webp")
    const fileExtension = path.extname(file.originalname);

    // Combine all parts to create the final custom filename
    const customFileName = `${randomCharacters}${formattedDate}${fileExtension}`; // e.g., "ABCDEF12102025.jpg"

    callback(null, customFileName);
  },
});

/**
 * Custom Multer file filter used to validate the type of each uploaded file before saving it to the server.
 *
 * Ensures that only files with allowed MIME types (e.g., JPEG, PNG, WEBP) are accepted.
 * If the uploaded file does not match any of the allowed types, an error is returned.
 *
 * @param req - The Express request object.
 * @param file - The uploaded file object from the request.
 * @param callback - A callback function that either accepts the file or rejects it with an error.
 */
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  // Define allowed MIME types for image uploads.
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/jfif",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif",
    "image/svg+xml",
  ];

  // Reject the file if its MIME type is not in the allowed list.
  if (!allowedMimeTypes.includes(file.mimetype)) {
    logger.info({
      UPLOAD_FILE_ERROR: {
        message:
          "Invalid file type. Only JPEG, JPG, PNG, JFIF, WEBP, GIF, HEIC, HEIF, and SVG formats are allowed.",
      },
    });
    return callback(new Error("Invalid File Type."));
  }

  // Accept the file.
  callback(null, true);
};

/**
 * Multer configuration for handling file uploads.
 *
 * This instance defines:
 * - The storage engine (`storage`) for controlling file destinations and custom filenames.
 * - The file filter (`fileFilter`) to validate allowed MIME types before upload.
 * - Upload limits (`limits`) to restrict the maximum allowed file size.
 *
 * @constant
 * @type {multer.Multer}
 *
 * @example
 * // Usage in an Express route:
 * app.post("/upload", upload.array("image"), (req, res) => {
 *   res.status(200).json({ message: "Files uploaded successfully" });
 * });
 */
const upload: multer.Multer = multer({
  storage,
  fileFilter,
  limits: {
    fieldSize: 5 * 1024 * 1024, // 5mb
  },
});

export { upload };
