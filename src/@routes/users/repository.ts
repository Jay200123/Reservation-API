import { Model } from "mongoose";
import { UserType } from "../../@types";

export default class UserRepository {
  /**
   * UserRepository constructor
   * @param userModel Mongoose model for the User schema
   */
  constructor(private userModel: Model<UserType>) {}

  /**
   * Get all users from the database
   * @returns All users in the database
   */
  async getAll() {
    return this.userModel.find();
  }

  /**
   * Get a user by ID from the database
   * @param id User ID
   * @returns The user with the specified ID, or null if not found
   */
  async getById(id: string) {
    return this.userModel.findById(id);
  }

  /**
   * Create a new user in the database
   * @param data User data
   * @returns The created user
   */
  async create(data: UserType) {
    return this.userModel.create(data);
  }

  /**
   * Update a user by ID in the database
   * @param id User ID
   * @param data User data to update
   * @returns The updated user
   */
  async updateById(id: string, data: Partial<UserType>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Delete a user by ID from the database
   * @param id User ID
   * @returns The deleted user, or null if not found
   */
  async deleteById(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
