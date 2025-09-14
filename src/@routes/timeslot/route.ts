import expresss from "express";
import Timeslot from "./model";
import Settings from "../settings/model";
import UserCredentials from "../auth/model";
import TimeslotRepository from "./repository";
import SettingsRepository from "../settings/repository";
import AuthRepository from "../auth/repository";
import TimeslotService from "./service";
import TimeslotController from "./controller";
import { AuthMiddleware } from "../../@middleware";
import { JWT } from "../../@utils";
import { PATH } from "../../@constants";

const router = expresss.Router();

const timeslotRepository = new TimeslotRepository(Timeslot);

const timeslotService = new TimeslotService(timeslotRepository);

const timeslotController = new TimeslotController(timeslotService);

const settingRepository = new SettingsRepository(Settings);
const authRepository = new AuthRepository(UserCredentials);

const authMiddleware = new AuthMiddleware(
  settingRepository,
  authRepository,
  new JWT()
);

//get all timeslots endpoint.
router.get(
  PATH.TIMESLOTS,
  authMiddleware.AccessTokenVerifier(),
  timeslotController.getAllTimeslots
);

//get timeslot by id endpoint.
router.get(
  PATH.TIMESLOT_ID,
  authMiddleware.AccessTokenVerifier(),
  timeslotController.getAllTimeslotById
);

//create timeslot endpoint.
router.post(
  PATH.TIMESLOTS,
  authMiddleware.AccessTokenVerifier(),
  timeslotController.createTimeslot
);

//update timeslot endpoint.
router.patch(
  PATH.EDIT_TIMESLOT_ID,
  authMiddleware.AccessTokenVerifier(),
  timeslotController.updateTimeslotById
);

//delete timeslot endpoint.
router.delete(
  PATH.TIMESLOT_ID,
  authMiddleware.AccessTokenVerifier(),
  timeslotController.deleteTimeslotById
);

export default router;
