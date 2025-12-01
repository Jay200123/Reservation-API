import express from "express";
import Ratings from "./model";
import RatingsRepository from "./repository";
import User from "../users/model";
import UserRepository from "../users/repository";
import Settings from "../settings/model";
import SettingsRepository from "../settings/repository";
import UserCredentials from "../auth/model";
import AuthRepository from "../auth/repository";
import Service from "../service/model";
import ServiceRepository from "../service/repository";
import RatingsService from "./service";
import RatingsController from "./controller";
import { AuthMiddleware } from "../../@middleware";
import { JWT } from "../../@utils";
import { PATH } from "../../@constants";
import { createRatingField } from "../../@validations";

const router = express.Router();

const ratingRepository = new RatingsRepository(Ratings);
const userRepository = new UserRepository(User);
const serviceRepository = new ServiceRepository(Service);

const ratingsService = new RatingsService(
  ratingRepository,
  userRepository,
  serviceRepository
);

const ratingsController = new RatingsController(ratingsService);

const settingsRepository = new SettingsRepository(Settings);
const authRepository = new AuthRepository(UserCredentials);

const authMiddleware = new AuthMiddleware(
  settingsRepository,
  authRepository,
  new JWT()
);

//get all ratings endpoint
router.get(
  PATH.RATINGS,
  authMiddleware.AccessTokenVerifier(),
  ratingsController.getAllRatings
);

// get rating by id endpoint
router.get(
  PATH.RATING_ID,
  authMiddleware.AccessTokenVerifier(),
  ratingsController.getRatingById
);

// add rating endpoint
router.post(
  PATH.RATING_ID,
  authMiddleware.AccessTokenVerifier(),
  ratingsController.addRating
);

// update rating by id endpoint
router.patch(
  PATH.EDIT_RATING_ID,
  createRatingField,
  authMiddleware.AccessTokenVerifier(),
  ratingsController.updateRatingById
);

// delete rating by id endpoint
router.patch(
  PATH.RATING_ID,
  authMiddleware.AccessTokenVerifier(),
  ratingsController.deleteRatingById
);

export default router;
