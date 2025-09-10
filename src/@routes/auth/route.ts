import express from "express";
import UserCredentials from "./model";
import User from "../users/model";
import UserDetails from "../user_details/model";
import Settings from "../settings/model";
import AuthRepository from "./repository";
import UserRepository from "../users/repository";
import UserDetailsRepository from "../user_details/repository";
import SettingsRepository from "../settings/repository";
import AuthService from "./service";
import AuthController from "./controller";
import { PATH } from "../../@constants";
import { AuthMiddleware } from "../../@middleware";
import { createUserValidation } from "../../@validations";

const router = express.Router();

//* Repositories Layer
const authRepository = new AuthRepository(UserCredentials);
const userRepository = new UserRepository(User);
const userDetailsRepository = new UserDetailsRepository(UserDetails);
const settingsRepository = new SettingsRepository(Settings);

const authService = new AuthService(
  authRepository,
  userRepository,
  userDetailsRepository
);

const authController = new AuthController(authService);
//create a new Auth middleware instance to access BasicAuthenticationVerifier & AccessTokenVerifier,
//  methods for adding Basic & Authenticated middleware in the routes.
const authMiddleware = new AuthMiddleware(settingsRepository);

//register user endpoint.
router.post(
  PATH.REGISTER,
  authMiddleware.BasicAuthenticationVerifier(),
  createUserValidation,
  authController.registerUser
);
export default router;
