import express from "express";
import { PATH } from "../../@constants";
import User from "./model";
import UserDetails from "../user_details/model";
import UserRepository from "./repository";
import UserDetailsRepository from "../user_details/repository";
import UserService from "./service";
import UserController from "./controller";
import UserCredentials from "../auth/model";
import Settings from "../settings/model";
import SettingsRepository from "../settings/repository";
import AuthRepository from "../auth/repository";
import { JWT } from "../../@utils";
import { AuthMiddleware } from "../../@middleware";
import { ROLE } from "../../@constants";

const router = express.Router();

// Initialize repositories, services, and controllers

// Injects User on UserRepository - for calling queries related on users.
const userRepository = new UserRepository(User);

const userDetailsRepository = new UserDetailsRepository(UserDetails);

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
  PATH.USERS,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.ADMIN),
  userController.getAllUsers
);

// get user by id endpoint
router.get(
  PATH.USER_ID,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.ADMIN),
  userController.getUserById
);

//upate user endpoint
router.patch(
  PATH.EDIT_USER_ID,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.ADMIN),
  userController.updateUser
);

export default router;
