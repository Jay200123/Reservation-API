import mongoose, { Model } from "mongoose";
import { Users, Service, Reservations, Ratings } from "../../@types";

export default class DashboardRepository {
  constructor(
    private userModel: Model<Users>,
    private serviceModel: Model<Service>,
    private reservationModel: Model<Reservations>,
    private ratingsModel: Model<Ratings>
  ) {}

  async UserRoleOverView() {
    return await this.userModel.aggregate([
      //1st array object ([0])
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      //2nd array object ([1])
      {
        $sort: { count: -1 },
      },
    ]);
  }
}
