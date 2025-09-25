import mongoose from "mongoose";
import { Users } from "./user";
import { Service } from "./service";
import { Timeslot } from "./timeslots";

type PaymentType = "CASH" | "ONLINE_PAYMENT";
type ReservationStatus = "PENDING" | "RESCHEDULED" | "ONGOING" | "FINISHED";
type ServiceReservations = {
  service: mongoose.Types.ObjectId | Service;
};

type Reservations = {
  user: mongoose.Types.ObjectId | Users;
  services: ServiceReservations[];
  timeslot: mongoose.Types.ObjectId | Timeslot;
  payment_type: PaymentType;
  status: ReservationStatus;
  amount: number;
  reason: string;
  reservation_date: Date;
  createdAt: Date;
  updatedAt: Date;
};

type Reschedule = {
  timeslot: mongoose.Types.ObjectId | Timeslot;
  reservation_date: Date;
  reason: string;
  status: ReservationStatus;
};

export { Reservations, ReservationStatus, Reschedule };
