import mongoose, { Schema, model } from "mongoose";
import { Reservations } from "../../@types";
import { RESOURCE } from "../../@constants";

const reservationSchema = new Schema<Reservations>({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  services: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  timeslot: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  payment_type: {
    type: String,
    enum: ["CASH", "ONLINE_PAYMENT"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Reservation = model(RESOURCE.RESERVATIONS, reservationSchema);

export default Reservation;
