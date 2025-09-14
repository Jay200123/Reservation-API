import { Schema, model } from "mongoose";
import { RESOURCE } from "../../@constants";
import { Timeslot } from "../../@types";

const timeslotSchema = new Schema<Timeslot>({
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
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

const Timeslot = model(RESOURCE.TIMESLOTS, timeslotSchema);

export default Timeslot;
