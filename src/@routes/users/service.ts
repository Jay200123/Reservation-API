import UserRepository from "./repository";
import UserDetailsRepository from "../user_details/repository";
import { UserType, Image } from "../../@types";
import {
  ErrorHandler,
  logger,
  updateUserFields,
  uploadImage,
  verifyFields,
} from "../../@utils";
import mongoose from "mongoose";
import { STATUSCODE } from "../../@constants";

export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private userDetailsRepository: UserDetailsRepository
  ) {}

  /**
   * Retrieve all user records from the database.
   * @returns result
   */
  async getAllUsers(skip: number, limit: number) {
    const result = await this.userDetailsRepository.getAllUserDetails(
      skip,
      limit
    );

    // Check if users exist
    if (!result.length) {
      throw new ErrorHandler(404, "Users not found");
    }

    return result;
  }

  /**
   * Retrieve specific user using user_id
   * @returns result
   */
  async getUserById(id: string) {
    // Check if id is provided
    if (id == ":id") {
      throw new ErrorHandler(400, "Missing user ID");
    }

    // Validate id format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.info({
        GET_USER_BY_ID_REQUEST: {
          message: "Invalid mongoose ID.",
        },
      });

      throw new ErrorHandler(400, "Invalid user ID");
    }

    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new ErrorHandler(404, "User not found");
    }

    const result = await this.userDetailsRepository.getDetailsByUserId(id);

    // Check if user exists
    if (!result) {
      throw new ErrorHandler(404, "Details not found");
    }

    return result;
  }

  /**
   * Update user details
   * @param id - user id
   * @param data  - user details
   * @returns result
   */
  async updateUser(
    id: string,
    data: Partial<Omit<UserType, "image">> &
      Partial<{ image: Express.Multer.File[] }>
  ) {
    if (id == ":id") {
      throw new ErrorHandler(400, "Missing user ID");
    }

    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new ErrorHandler(404, "User not found");
    }

    //Checks if the req.body is empty or null.
    if (!data || null) {
      throw new ErrorHandler(
        STATUSCODE.BAD_REQUEST,
        `Missing required fields: ${updateUserFields.join(", ")}`
      );
    }

    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(updateUserFields, data);

    // Initialize `newImages` as an array of `Image` objects.
    // Each object contains `public_id`, `url`, and `originalname` — values returned by the `uploadImage` utility function.
    let newImages: Image[];

    // Initialize `images` as an array of `Express.Multer.File` objects.
    // The `uploadImage` utility only accepts this type for file uploads.
    const images = data.image as Express.Multer.File[];

    // Pass the files from the request to the `uploadImage` utility for Cloudinary upload.
    // When the upload completes, `uploadImage` returns an array of objects containing
    // the `public_id`, `url`, and `originalname` of each uploaded file.
    newImages = await uploadImage(images, []);

    const result = await this.userDetailsRepository.updateById(id, {
      ...data,
      image: newImages,
    });

    return result;
  }

  async deleteUser(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorHandler(400, "Invalid user ID");
    }

    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new ErrorHandler(404, "User not found");
    }

    const result = await this.userRepository.deleteById(id);

    return result;
  }
}
