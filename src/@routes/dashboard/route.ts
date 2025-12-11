import express from "express";
import User from "../users/model";
import UserRepository from "../users/repository";
import Service from "../service/model";
import ServiceRepository from "../service/repository";
import Ratings from "../ratings/model";
import RatingsRepository from "../ratings/repository";
import Reservation from "../reservation/model";
import ReservationRepository from "../reservation/repository";
import Timeslot from "../timeslot/model";
import TimeslotRepository from "../timeslot/repository";
import DashboardService from "./service";
import DashboardController from "./controller";

const router = express.Router();

const userRepository = new UserRepository(User);
const serviceRepository = new ServiceRepository(Service);
const ratingsRepository = new RatingsRepository(Ratings);
const reservationRepository = new ReservationRepository(Reservation);
const timeslotRepository = new TimeslotRepository(Timeslot);

const dashboardService = new DashboardService(
  userRepository,
  serviceRepository,
  ratingsRepository,
  reservationRepository,
  timeslotRepository
);

const dashboardController = new DashboardController(dashboardService);
//   private usersRepository: UserRepository,
//     private serviceRepository: ServiceRepository,
//     private ratingsRepository: RatingsRepository,
//     private reservationRepository: ReservationRepository,
//     private timeslotRepository: TimeslotRepository

export default router;
