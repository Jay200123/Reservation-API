import express from "express";
import Reservation from "./model";
import Settings from "../settings/model";
import UserCredentials from "../auth/model";
import Service from "../service/model";
import Timeslot from "../timeslot/model";
import User from "../users/model";
import UserDetails from "../user_details/model";
import ReservationRepository from "./repository";
import SettingsRepository from "../settings/repository";
import AuthRepository from "../auth/repository";
import ServiceRepository from "../service/repository";
import TimeslotRepository from "../timeslot/repository";
import UserRepository from "../users/repository";
import UserDetailsRepository from "../user_details/repository";
import ReservationService from "./service";
import ReservationController from "./controller";
import { AuthMiddleware } from "../../@middleware";
import { JWT } from "../../@utils";
import {
  createReservationFields,
  rescheduleReservationFields,
  updateReservationStatusField,
  reservationParams,
} from "../../@validations";
import { PATH, ROLE } from "../../@constants";

const router = express.Router();

const reservationRepository = new ReservationRepository(Reservation);
const settingsRepository = new SettingsRepository(Settings);
const authRepository = new AuthRepository(UserCredentials);
const serviceRepository = new ServiceRepository(Service);
const timeslotRepository = new TimeslotRepository(Timeslot);
const userRepository = new UserRepository(User);
const userDetailsRepository = new UserDetailsRepository(UserDetails);

const reservationService = new ReservationService(
  reservationRepository,
  serviceRepository,
  timeslotRepository,
  userRepository,
  userDetailsRepository
);

const reservationController = new ReservationController(reservationService);

const authMiddleware = new AuthMiddleware(
  settingsRepository,
  authRepository,
  new JWT()
);

//get all reservations endpoint.
router.get(
  PATH.RESERVATIONS,
  reservationParams,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.USER, ROLE.ADMIN),
  reservationController.getAllReservations
);

//get reservation by id endpoint.
router.get(
  PATH.RESERVATION_ID,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.USER, ROLE.ADMIN),
  reservationController.getReservationById
);

//create reservation endpoint.
router.post(
  PATH.RESERVATIONS,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.USER),
  createReservationFields,
  reservationController.createReservation
);

//edit reservation status endpoint.
router.patch(
  PATH.EDIT_STATUS_RESERVATION_ID,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.ADMIN),
  updateReservationStatusField,
  reservationController.updateReservationStatusById
);

//reschedule reservation endpoint.
router.patch(
  PATH.RESCHEDULE_RESERVATION_ID,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.USER, ROLE.ADMIN),
  rescheduleReservationFields,
  reservationController.updateReservationScheduleById
);

//retrieve user reservations
router.get(
  PATH.GET_RESERVATIONS_BY_USER_ID,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.USER, ROLE.ADMIN),
  reservationController.getUserReservationsByUserId
);

export default router;
