import RatingsRepository from "./repository";
import UserRepository from "../users/repository";
import {
  ErrorHandler,
  logger,
  createRatingsField,
  updateRatingsField,
  verifyFields,
  uploadImage,
} from "../../@utils";
import { STATUSCODE } from "../../@constants";
import mongoose from "mongoose";
import { Image, Ratings } from "../../@types";
import ReservationRepository from "../reservation/repository";
export default class RatingsService {
  constructor(
    private ratingsRepository: RatingsRepository,
    private userRepository: UserRepository,
    private reservationRepository: ReservationRepository
  ) {}

  async getAllRatings(skip: number, limit: number) {
    const result = await this.ratingsRepository.getAll(skip, limit);

    if (!result.length) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Ratings not found");
    }

    return result;
  }

  async getRatingById(id: string) {
    if (id == ":id") {
      logger.info({
        GET_RATINGS_BY_ID_REQUEST_ERROR: {
          message: "Missing ID parameter",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.info({
        GET_RATINGS_BY_ID_REQUEST_ERROR: {
          message: "Invalid Rating ID",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const result = await this.ratingsRepository.getById(id);

    if (!result) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Rating Not Found");
    }

    return result;
  }

  async addRating(
    data: Omit<Ratings, "createdAt" | "updatedAt"> & {
      image: Express.Multer.File[];
    }
  ) {
    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createRatingsField, data);

    /**
     * Retrieves user data.
     * Validates whether the user exists in the database.
     * Throws an error if the retrieved `user` object is empty.
     */
    const user = await this.userRepository.getById(data.user.toString());

    if (!user) {
      logger.info({
        CREATE_RATING_REQUEST_ERROR: {
          message: "User Not Found",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    /**
     * Retrieves service data.
     * Validates whether the service exists in the database.
     * Throws an error if the retrieved `service` object is empty.
     */
    const reservation = await this.reservationRepository.getById(
      data.reservation.toString()
    );

    if (!reservation) {
      logger.info({
        CREATE_RATING_REQUEST_ERROR: {
          message: "Service Not Found",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    /**
     * Pass the files from the request to the `uploadImage` utility for Cloudinary upload.
     * When the upload completes, `uploadImage` returns an array of objects containing  the `public_id`, `url`, and `originalname` of each uploaded file.
     */
    const images = await uploadImage(data.image, []);

    const result = await this.ratingsRepository.create({
      ...data,
      image: images,
    });

    return result;
  }

  async updateRatingById(
    id: string,
    data: Partial<Omit<Ratings, "image">> &
      Partial<{ image: Express.Multer.File[] }>
  ) {
    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(updateRatingsField, data);

    if (id == ":id") {
      logger.info({
        UPDATE_RATINGS_BY_ID_REQUEST_ERROR: {
          message: "Missing ID parameter",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.info({
        UPDATE_RATINGS_BY_ID_REQUEST_ERROR: {
          message: "Invalid Rating ID",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const rating = await this.ratingsRepository.getById(id);

    if (!rating) {
      logger.info({
        UPDATE_RATINGS_BY_ID_REQUEST_ERROR: {
          message: "Rating not found",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const imageLength =
      (rating?.image?.length ?? 0) + (data?.image?.length ?? 0);

    if (imageLength == 5) {
      throw new ErrorHandler(
        STATUSCODE.BAD_REQUEST,
        "File upload limit exceeded. You can only upload up to 5 files at a time."
      );
    }

    // Initialize a new array to store uploaded image metadata (typed as Image[])
    let newImages: Image[];

    // Cast the provided image data to an array of Express.Multer.File objects
    const images = data.image as Express.Multer.File[];

    newImages = await uploadImage(images, []);

    const result = await this.ratingsRepository.updateById(id, {
      ...data,
      image: newImages,
    });

    return result;
  }

  async deleteRatingById(id: string) {
    if (id == ":id") {
      logger.info({
        GET_RATINGS_BY_ID_REQUEST_ERROR: {
          message: "Missing ID parameter",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.info({
        GET_RATINGS_BY_ID_REQUEST_ERROR: {
          message: "Invalid Rating ID",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const result = await this.ratingsRepository.deleteById(id);

    if (!result) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Rating Not Found");
    }

    return result;
  }
}
