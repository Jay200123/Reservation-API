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

  async create(
    data: Omit<Reservations, "createdAt" | "updatedAt">,
    options?: { session?: mongoose.ClientSession }
  ) {
    return await this.ReservationModel.create([data], options);
  }

  async updateById(id: string, data: Partial<Reservations>) {
    return await this.ReservationModel.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );
  }
}
