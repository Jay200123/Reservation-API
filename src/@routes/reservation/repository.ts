import mongoose, { Model } from "mongoose";
import { Reservations, ReservationStatus, Reschedule } from "../../@types";

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

  async create(
    data: Omit<Reservations, "createdAt" | "updatedAt">,
    options?: { session?: mongoose.ClientSession }
  ) {
    return await this.ReservationModel.create([data], options);
  }

  async updateStatusById(id: string, status: ReservationStatus) {
    return await this.ReservationModel.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
  }

  async rescheduleById(id: string, data: Reschedule) {
    return await this.ReservationModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true }
    );
  }

  async getReservationsByUserId(user_id: string) {
    return await this.ReservationModel.find({ user: user_id });
  }
}
