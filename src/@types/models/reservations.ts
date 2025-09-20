import mongoose from "mongoose";
import { Users } from "./user";
import { Service } from "./service";
import { Timeslot } from "./timeslots";

type PaymentType = "CASH" | "ONLINE_PAYMENT";
type ReservationStatus = "PENDING" | "ONGOING" | "FINISHED";

export type Reservations = {
  user: mongoose.Types.ObjectId | Users;
  services: mongoose.Types.ObjectId | Service;
  timeslot: mongoose.Types.ObjectId | Timeslot;
  payment_type: PaymentType;
  status: ReservationStatus;
  amount: number;
  reservation_date: Date;
  createdAt: Date;
  updatedAt: Date;
};
