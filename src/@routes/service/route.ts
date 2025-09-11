import express from "express";
import Service from "./model";
import ServiceRepository from "./repository";
import ServiceServices from "./service";
import ServiceController from "./controller";
import { createServiceValidation } from "../../@validations";
import { PATH } from "../../@constants";

//ADD access token middleware.
const router = express.Router();

const serviceRepository = new ServiceRepository(Service);

const serviceServices = new ServiceServices(serviceRepository);

const serviceController = new ServiceController(serviceServices);

//get all users endpoint.
router.get(PATH.GET_ALL_SERVICES, serviceController.getAllServices);

//get one user endpoint.
router.get(PATH.GET_SERVICE_BY_ID, serviceController.getServiceById);

//create service endpoint.
router.post(
  PATH.CREATE_SERVICE,
  createServiceValidation,
  serviceController.createService
);

//update service endpoint.
router.patch(PATH.EDIT_SERVICE_BY_ID, serviceController.updateServiceById);

//delete service endpoint.
router.delete(PATH.DELETE_SERVICE_BY_ID, serviceController.deleteServiceById);
export default router;
