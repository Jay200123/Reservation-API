import {
  ErrorHandler,
  hashPassword,
  verifyFields,
  createUserFields,
  logger,
  JWT,
  uploadImage,
} from "../../@utils";
import AuthRepository from "./repository";
import UserRepository from "../users/repository";
import UserDetailsRepository from "../user_details/repository";
import { STATUSCODE } from "../../@constants";
import { JWTPayload, Users, UserType } from "../../@types";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export default class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
    private userDetailsRepository: UserDetailsRepository,
    private jwtUtils: JWT
  ) {}

  /**
   * Register new User in the System.
   * @param data - req.body object that contains user information such as username, password fullname etc.
   * @returns
   */
  async registerUser(data: UserType & { image: Express.Multer.File[] }) {
    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createUserFields, data);

    // Checks if the username registered by the user already exists.
    //This is implemented to prevent duplicate username at the database.
    const user = await this.userRepository.getByUsername(data.username);

    // if `user` has entry throws a bad request 400 Error.
    if (user) {
      throw new ErrorHandler(
        STATUSCODE.BAD_REQUEST,
        "username already exists."
      );
    }

    //Hash password before saving to database
    const hashedPassword = await hashPassword(data.password);

    //return image's public_id, url and originalname.
    const image = await uploadImage(data.image, []);

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
          status: "PENDING",
          role: "USER",
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
          image: image,
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
      //if transaction catches error transaction would be aborted.
      await session.abortTransaction();
      throw err;
    } finally {
      // end the mongoose session instance.
      await session.endSession();
    }
  }

  async loginUser(data: Omit<Users, "createdAt" | "updatedAt">) {
    const user = await this.userRepository.getByUsername(data.username);

    if (!user) {
      logger.info({
        LOGIN_USER_ERROR: {
          message: "Credentials not found",
        },
      });
      throw new ErrorHandler(
        STATUSCODE.BAD_REQUEST,
        "Invalid email or password"
      );
    }

    // Checks if the plain text password from the request body matches the hashed password from the database.
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      logger.info({
        LOGIN_USER_ERROR: {
          message: "Password does not match",
        },
      });

      throw new ErrorHandler(
        STATUSCODE.BAD_REQUEST,
        "Invalid email or password"
      );
    }

    const accessPayload: JWTPayload = {
      user: {
        _id: user._id,
        username: user.username,
        password: user.password,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    const access_token = this.jwtUtils.generateAccessToken(accessPayload);

    const refresh_token = this.jwtUtils.generateRefreshToken(accessPayload);

    const credentials = await this.authRepository.addCredential({
      user: user._id,
      access_token: access_token,
      refresh_token: refresh_token,
    });

    if (!credentials) {
      logger.info({
        LOGIN_USER_ERROR: {
          message: "Failed to store user credentials.",
        },
      });

      throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Invalid Request");
    }

    return {
      user: user,
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async refreshCredentialsByUser(refresh_token: string) {
    const credentials = await this.authRepository.getOneByRefreshToken(
      refresh_token
    );

    if (!credentials) {
      logger.info({
        USER_REFRESH_TOKEN_ERROR: {
          message: "Credentials not found.",
        },
      });

      throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized");
    }

    const user = await this.userRepository.getById(
      credentials?.user.toString()
    );

    if (!user) {
      logger.info({
        REFRESH_TOKEN_ERROR: {
          message: "User not found",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const refreshPayload: JWTPayload = {
      user: {
        _id: user._id,
        username: user.username,
        password: user.password,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    const newAccessToken = this.jwtUtils.generateAccessToken(refreshPayload);

    const newRefreshToken = this.jwtUtils.generateRefreshToken(refreshPayload);

    const result = await this.authRepository.updateCredential(refresh_token, {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });

    if (!result) {
      throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized.");
    }

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logoutUser(access_token: string) {
    const credentials = await this.authRepository.getOneByAccessToken(
      access_token
    );

    if (!credentials) {
      logger.info({
        LOGOUT_USER_ERROR: {
          message: "Credentials not found.",
        },
      });

      throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized");
    }

    const result = await this.authRepository.removeCredentialsByAccessToken(
      access_token
    );

    if (!result) {
      logger.info({
        LOGOUT_USER_ERROR: {
          message: "Removing credentials failed.",
        },
      });

      throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized");
    }

    return [];
  }
}
