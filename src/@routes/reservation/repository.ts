import mongoose, { Model } from "mongoose";
import { Reservations } from "../../@types";

export default class ReservationRepository {
  constructor(private ReservationModel: Model<Reservations>) {}

  async getAll() {
    return await this.ReservationModel.find();
  }

  async getById(id: string) {
    return await this.ReservationModel.findById(id);
  }

  async getByTimeslotId(timeslot_id: string) {
    return await this.ReservationModel.findOne({ timeslot: timeslot_id });
  }

  async getByReservationDate(date: any) {
    return await this.ReservationModel.findOne({ reservation_date: date });
  }

  async create(
    data: Omit<Reservations, "createdAt" | "updatedAt">,
    options?: { session?: mongoose.ClientSession }
  ) {
    return await this.ReservationModel.create([data], options);
  }
}
