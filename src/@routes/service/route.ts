import express from "express";
import Service from "./model";
import Settings from "../settings/model";
import UserCredentials from "../auth/model";
import SettingsRepository from "../settings/repository";
import AuthRepository from "../auth/repository";
import ServiceRepository from "./repository";
import ServiceServices from "./service";
import ServiceController from "./controller";
import {
  createServiceValidation,
  serviceParams,
  userServiceParams,
} from "../../@validations";
import { JWT } from "../../@utils";
import { PATH, ROLE } from "../../@constants";
import { AuthMiddleware } from "../../@middleware";

//ADD access token middleware.
const router = express.Router();

const settingsRepository = new SettingsRepository(Settings);
const authRepository = new AuthRepository(UserCredentials);
const serviceRepository = new ServiceRepository(Service);

const serviceServices = new ServiceServices(serviceRepository);
const serviceController = new ServiceController(serviceServices);

const authMiddleware = new AuthMiddleware(
  settingsRepository,
  authRepository,
  new JWT()
);

//get all users endpoint.
router.get(
  PATH.SERVICES,
  serviceParams,
  authMiddleware.BasicAuthenticationVerifier(),
  serviceController.getAllServices
);

//user services
router.get(
  PATH.CUSTOMER_SERVICES,
  userServiceParams,
  authMiddleware.BasicAuthenticationVerifier(),
  serviceController.getUserServices
);

//get one user endpoint.
router.get(
  PATH.SERVICE_ID,
  authMiddleware.BasicAuthenticationVerifier(),
  serviceController.getServiceById
);

//create service endpoint.
router.post(
  PATH.SERVICES,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.ADMIN),
  createServiceValidation,
  serviceController.createService
);

//update service endpoint.
router.patch(
  PATH.EDIT_SERVICE_ID,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.ADMIN),
  serviceController.updateServiceById
);

//delete service endpoint.
router.delete(
  PATH.SERVICE_ID,
  authMiddleware.AccessTokenVerifier(),
  authMiddleware.UserRoleVerifier(ROLE.ADMIN),
  serviceController.deleteServiceById
);

export default router;
