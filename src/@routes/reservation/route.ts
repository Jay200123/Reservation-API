import express from "express";
import Reservation from "./model";
import Settings from "../settings/model";
import UserCredentials from "../auth/model";
import ReservationRepository from "./repository";
import SettingsRepository from "../settings/repository";
import AuthRepository from "../auth/repository";
import ReservationService from "./service";
import ReservationController from "./controller";
import { AuthMiddleware } from "../../@middleware";
import { JWT } from "../../@utils";
import { PATH } from "../../@constants";

const router = express.Router();

const reservationRepository = new ReservationRepository(Reservation);
const settingsRepository = new SettingsRepository(Settings);
const authRepository = new AuthRepository(UserCredentials);

const reservationService = new ReservationService(reservationRepository);

const reservationController = new ReservationController(reservationService);

const authMiddleware = new AuthMiddleware(
  settingsRepository,
  authRepository,
  new JWT()
);

//get all reservations endpoint
router.get(
  PATH.RESERVATIONS,
  authMiddleware.AccessTokenVerifier(),
  reservationController.getAllReservations
);

router.get(
  PATH.RESERVATION_ID,
  authMiddleware.AccessTokenVerifier(),
  reservationController.getReservationById
);

router.post(
  PATH.RESERVATIONS,
  authMiddleware.AccessTokenVerifier(),
  reservationController.createReservation
);

router.patch(
  PATH.RESERVATIONS,
  authMiddleware.AccessTokenVerifier(),
  reservationController.updateReservationById
);

export default router;
