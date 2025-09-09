import UserRepository from "./repository";
import UserDetailsRepository from "../user_details/repository";
import { UserType } from "../../@types";
import {
  ErrorHandler,
  hashPassword,
  createUserFields,
  verifyFields,
} from "../../@utils";
import mongoose from "mongoose";

export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private userDetailsRepository: UserDetailsRepository
  ) {}

  /**
   * Retrieve all user records from the database.
   * @returns result
   */
  async getAllUsers() {
    const result = await this.userRepository.getAll();

    // Check if users exist
    if (!result.length) {
      throw new ErrorHandler(404, "No users found");
    }

    return result;
  }

  /**
   * Retrieve specific user using user_id
   * @returns result
   */
  async getUserById(user_id: string) {
    // Check if user_id is provided
    if (user_id == ":user_id") {
      throw new ErrorHandler(400, "Missing user ID");
    }

    // Validate user_id format
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      throw new ErrorHandler(400, "Invalid user ID");
    }

    const result = await this.userRepository.getById(user_id);

    // Check if user exists
    if (!result) {
      throw new ErrorHandler(404, "User not found");
    }

    return result;
  }

  /**
   * Insert user & user_details information in the database.
   * @returns result
   */
  async createUser(data: UserType) {
    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createUserFields, data);

    //Hash password before saving to database
    const hashedPassword = await hashPassword(data.password);

    // Start a session for transaction
    const session = await mongoose.startSession();

    /**
     * Using transactions to ensure both user and user_details are created successfully
     * If either fails, the transaction will be aborted and no data will be saved
     * to the database
     * We use try...catch...finally to ensure the session is ended
     * and transaction is either committed or aborted
     * depending on the success or failure of the operations
     */

    // Start transaction
    session.startTransaction();
    try {
      const result = await this.userRepository.create(
        {
          username: data.username,
          password: hashedPassword,
        },
        { session }
      );

      //Create user_details collection entry like fullname, email, contact_number, address
      const details = await this.userDetailsRepository.create(
        {
          user: result[0]?._id,
          fullname: data.fullname,
          email: data.email,
          contact_number: data.contact_number,
          address: data.address,
          city: data.city,
        },
        { session }
      );

      await session.commitTransaction();

      return {
        ...result,
        details: {
          ...details,
        },
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Update user details
   * @param id - user id
   * @param data  - user details
   * @returns result
   */
  async updateUser(id: string, data: Partial<UserType>) {
    const user = await this.userRepository.getById(id);

    if (id == ":user_id") {
      throw new ErrorHandler(400, "Missing user ID");
    }

    if (!user) {
      throw new ErrorHandler(404, "User not found");
    }

    const result = await this.userRepository.updateById(id, data);

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
