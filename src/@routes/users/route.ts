import express from "express";
import { PATH } from "../../@constants";
import User from "./model";
import UserRepository from "./repository";
import UserService from "./service";
import UserController from "./controller";
import UserDetailsModel from "../user_details/model";
import UserDetailsRepository from "../user_details/repository";

const router = express.Router();

// Initialize repositories, services, and controllers
const userDetailsRepository = new UserDetailsRepository(UserDetailsModel);
const userRepository = new UserRepository(User);

// User Service depends on both UserRepository and UserDetailsRepository
const userService = new UserService(userRepository, userDetailsRepository);
const userController = new UserController(userService);

// Set up routes for /users endpoint

//get all users endpoint
router.get(PATH.GET_ALL_USERS, userController.getAllUsers.bind(userController));

// get user by id endpoint
router.get(
  PATH.GET_USER_BY_USER_ID,
  userController.getUserById.bind(userController)
);

//create user endpoint
router.post(PATH.REGISTER, userController.createUser.bind(userController));

export default router;
