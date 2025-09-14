import UserRepository from "./repository";
import UserDetailsRepository from "../user_details/repository";
import { UserType } from "../../@types";
import {
  ErrorHandler,
} from "../../@utils";
import mongoose from "mongoose";

export default class UserService {
  constructor(
    private userRepository: UserRepository,
  ) {}

  /**
   * Retrieve all user records from the database.
   * @returns result
   */
  async getAllUsers() {
    const result = await this.userRepository.getAll();

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
