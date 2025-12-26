import express from "express";
import User from "../users/model";
import Service from "../service/model";
import Ratings from "../ratings/model";
import Reservation from "../reservation/model";
import DashboardService from "./service";
import DashboardController from "./controller";
import DashboardRepository from "./repository";
import { PATH, ROLE } from "../../@constants";
import Settings from "../settings/model";
import SettingsRepository from "../settings/repository";
import UserCredentials from "../auth/model";
import AuthRepository from "../auth/repository";
import { JWT } from "../../@utils";
import { AuthMiddleware } from "../../@middleware";

const router = express.Router();

const dashboardRepository = new DashboardRepository(
  User,
  Service,
  Reservation,
  Ratings
);

const dashboardService = new DashboardService(dashboardRepository);

const dashboardController = new DashboardController(dashboardService);

const settingsRepository = new SettingsRepository(Settings);
const authRepository = new AuthRepository(UserCredentials);

const authMiddleware = new AuthMiddleware(
  settingsRepository,
  authRepository,
  new JWT()
);

//`user role dashboard` endpoint.
router.get(
  PATH.USER_ROLE_DASHBOARD,
  authMiddleware.UserRoleVerifier(ROLE.ADMIN),
  authMiddleware.AccessTokenVerifier(),
  dashboardController.GetUserRoleDashboard
);

export default router;
