import express from "express";
import { PATH } from "../../@constants";
import User from "./model";
import UserRepository from "./repository";
import UserService from "./service";
import UserController from "./controller";
import UserDetailsModel from "../user_details/model";
import UserCredentials from "../auth/model";
import UserDetailsRepository from "../user_details/repository";
import Settings from "../settings/model";
import SettingsRepository from "../settings/repository";
import AuthRepository from "../auth/repository";
import { JWT } from "../../@utils";
import { AuthMiddleware } from "../../@middleware";

const router = express.Router();

// Initialize repositories, services, and controllers

// Injects User on UserRepository - for calling queries related on users.
// Injects UserDetailsModel - for calling queries related on user_details collection.
const userDetailsRepository = new UserDetailsRepository(UserDetailsModel);
const userRepository = new UserRepository(User);

// User Service depends on both UserRepository and UserDetailsRepository
const userService = new UserService(userRepository, userDetailsRepository);
//UserController depends on userService.
const userController = new UserController(userService);

const settingsRepository = new SettingsRepository(Settings);
const authRepository = new AuthRepository(UserCredentials);
const authMiddleware = new AuthMiddleware(
  settingsRepository,
  authRepository,
  new JWT()
);

// Set up routes for /users endpoint

//get all users endpoint
router.get(
  PATH.GET_ALL_USERS,
  authMiddleware.BasicAuthenticationVerifier(),
  userController.getAllUsers
);

// get user by id endpoint
router.get(
  PATH.GET_USER_BY_USER_ID,
  authMiddleware.BasicAuthenticationVerifier(),
  userController.getUserById
);

//upate user endpoint
router.patch(PATH.UPDATE_USER_BY_USER_ID, userController.updateUser);

export default router;
