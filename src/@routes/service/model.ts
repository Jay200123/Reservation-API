import { Schema, model } from "mongoose";
import { Service } from "../../@types";
import { RESOURCE } from "../../@constants";

const serviceSchema = new Schema<Service>({
  service_name: {
    type: String,
    required: true,
  },

  service_price: {
    type: Number,
    required: true,
  },

  description: {
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

const Service = model(RESOURCE.SERVICES, serviceSchema);

export default Service;
