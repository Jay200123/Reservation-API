import UserRepository from "../users/repository";
import ServiceRepository from "../service/repository";
import RatingsRepository from "../ratings/repository";
import ReservationRepository from "../reservation/repository";
import TimeslotRepository from "../timeslot/repository";

export default class DashboardService {
  constructor(
    private usersRepository: UserRepository,
    private serviceRepository: ServiceRepository,
    private ratingsRepository: RatingsRepository,
    private reservationRepository: ReservationRepository,
    private timeslotRepository: TimeslotRepository
  ) {}
}
