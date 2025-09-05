import UserRepository from "./repository";
import UserDetailsRepository from "../user_details/repository";
import { UserType } from "../../@types";
import { ErrorHandler, hashPassword } from "../../@utils";
import mongoose from "mongoose";

export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private userDetailsRepository: UserDetailsRepository
  ) {}

  async getAllUsers() {
    const result = await this.userRepository.getAll();
    return result;
  }

  async getUserById(id: string) {
    if (id == ":id") {
      throw new ErrorHandler(400, "Invalid user ID");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorHandler(400, "Invalid user ID");
    }

    const result = await this.userRepository.getById(id);

    if (!result) {
      throw new ErrorHandler(404, "User not found");
    }

    return result;
  }

  async createUser(data: UserType) {
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
        },
        { session }
      );

      return {
        ...result,
        details: {
          ...details,
        },
      };
    } catch (err) {
      session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async updateUser(id: string, data: Partial<UserType>) {
    return this.userRepository.updateById(id, data);
  }

  async deleteUser(id: string) {
    return this.userRepository.deleteById(id);
  }
}
