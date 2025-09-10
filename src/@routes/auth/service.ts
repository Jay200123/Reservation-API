import {
  ErrorHandler,
  hashPassword,
  verifyFields,
  createUserFields,
} from "../../@utils";
import AuthRepository from "./repository";
import UserRepository from "../users/repository";
import UserDetailsRepository from "../user_details/repository";
import { STATUSCODE } from "../../@constants";
import { logger } from "../../@utils";
import { UserType } from "../../@types";
import mongoose from "mongoose";

export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
    private userDetailsRepository: UserDetailsRepository
  ) {}

  async registerUser(data: UserType) {
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

  loginUser() {}

  refreshCredentialsByUser() {}

  logoutUser() {}
}
