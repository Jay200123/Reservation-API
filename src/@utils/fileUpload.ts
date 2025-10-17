import multer from "multer";
import { generateRandomCharacters } from "./generateRandomCharacters";
import { generateFormattedDate } from "./generateFormattedDate";
import { logger } from "./logger";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

/**
 * Cloudinary Storage Configuration (v2)
 * -------------------------------------
 *
 * This configuration integrates Multer with Cloudinary for seamless image uploads.
 * Instead of storing uploaded files locally, this setup automatically uploads them
 * directly to your Cloudinary account.
 *
 * Each uploaded image is stored inside the `cloudinaryFiles` folder on Cloudinary
 * with a dynamically generated `public_id` for uniqueness and traceability.
 *
 * The `public_id` format:
 *    <original_filename>-<randomCharacters><formattedDate>
 *
 * Example:
 *    "profile-picture-AB12CD-20251015"
 *
 * Dependencies:
 *  - cloudinary: The Cloudinary SDK instance.
 *  - CloudinaryStorage: Multer adapter for Cloudinary.
 *  - generateRandomCharacters(): Utility that returns a short 6 character random string.
 *  - generateFormattedDate(): Utility that returns a formatted date string. (ddmmyyyy)
 *
 * @constant
 * @type {CloudinaryStorage}
 * @description
 * Defines a Multer-compatible storage engine that uploads image files
 * directly to Cloudinary under the folder "cloudinaryFiles" and assigns
 * each image a unique `public_id`.
 *
 * @example
 * // Example usage with Multer:
 * const upload = multer({ storage });
 * app.post("/upload", upload.array("image"), (req, res) => {
 *   res.status(200).json({ message: "Files uploaded to Cloudinary successfully" });
 * });
 */
const randomCharacters = generateRandomCharacters();
const formattedDate = generateFormattedDate();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // cloudinary config
  params: async (req: Express.Request, file: Express.Multer.File) => ({
    folder: "cloudinaryFiles",
    public_id: `${file.originalname.replace(
      /\.[^/.]+$/,
      ""
    )}-${randomCharacters}${formattedDate}`,
  }),
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
  files: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  // Using JavaScript's "split" method, the file name is divided into an array to extract its file extension.
  const fileType = files.originalname.split("."); // - ["image", "jpeg"];

  // Define allowed MIME types for image uploads.
  const allowedMimeTypes = [
    "jpeg",
    "jpg",
    "png",
    "jfif",
    "webp",
    "gif",
    "heic",
    "heif",
    "svg",
  ];

  // Each API request allows a maximum of 5 file uploads.
  // If the number of files exceeds 5, an error will be thrown.
  if (req.files?.length == 6) {
    return callback(
      new Error(
        "File upload limit exceeded. You can only upload up to 5 files at a time."
      )
    );
  }

  // Reject the file if its MIME type is not in the allowed list.
  // `fileType` - "jpeg".
  if (!allowedMimeTypes.includes(fileType[1])) {
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
 * Uploads one or more image files to Cloudinary while removing any previously uploaded images.
 *
 * This helper function performs two main tasks:
 * 1. Deletes existing Cloudinary images whose `public_id`s are provided.
 * 2. Uploads new files from the provided array and returns metadata for each uploaded image.
 *
 * @async
 * @function uploadImage
 * @param {Express.Multer.File[]} files - An array of uploaded image files from Multer.
 * @param {string[]} oldImagePublicIds - A list of Cloudinary `public_id`s to delete before uploading new files.
 * @returns {Promise<Image[]>} A promise that resolves to an array of uploaded image metadata objects.
 *
 * @typedef {Object} Image
 * @property {string} public_id - The Cloudinary public identifier of the uploaded image.
 * @property {string} url - The secure Cloudinary URL of the uploaded image.
 * @property {string} originalname - The original file name of the uploaded image.
 *
 * @example
 * // Example usage in a controller:
 * const uploadedImages = await uploadImage(req.files as Express.Multer.File[], ["old_public_id_1"]);
 * console.log(uploadedImages);
 */
const uploadImage = async (
  files: Express.Multer.File[],
  oldImagePublicIds: string[]
): Promise<
  {
    public_id: string;
    url: string;
    originalname: string;
  }[]
> => {
  // Return an empty array if there are no files to upload.
  if (!files || !Array.isArray(files) || files.length === 0) {
    return [];
  }

  // Remove old images from Cloudinary if their public IDs are provided.
  for (const publicId of oldImagePublicIds) {
    if (publicId?.trim()) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error(`Failed to delete Cloudinary image: ${publicId}`, error);
      }
    }
  }

  // Upload all new files to Cloudinary concurrently.
  const uploadResults = await Promise.all(
    files.map(async (file) => {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          public_id: file.filename,
        });

        return {
          public_id: result.public_id,
          url: result.secure_url,
          originalname: file.originalname,
        };
      } catch (err) {
        logger.info({
          CLOUDINARY_FILE_UPLOAD_ERROR: {
            message: `Failed to upload file: ${file.originalname}`,
            err: err,
          },
        });
        throw err;
      }
    })
  );

  // Return structured metadata for all successfully uploaded images.
  return uploadResults;
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
    fileSize: 5 * 1024 * 1024, // 5mb
  },
});

export { upload, uploadImage };
