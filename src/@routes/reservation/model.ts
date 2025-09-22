import mongoose, { Schema, model } from "mongoose";
import { Reservations } from "../../@types";
import { RESOURCE } from "../../@constants";

const reservationSchema = new Schema<Reservations>({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  // array of service properties
  services: [
    {
      service: {
        type: mongoose.Types.ObjectId,
        ref: RESOURCE.SERVICES,
        required: true,
      },
    },
  ],

  timeslot: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  payment_type: {
    type: String,
    enum: ["CASH", "ONLINE_PAYMENT"],
    required: true,
  },

  status: {
    type: String,
    enum: ["PENDING", "ONGOING", "FINISHED"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  reservation_date: {
    type: Date,
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
