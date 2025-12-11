import mongoose, { model, Schema } from "mongoose";
import { Ratings } from "../../@types";
import { RESOURCE } from "../../@constants";

const ratingSchema = new Schema<Ratings>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: RESOURCE.USERS,
    required: true,
  },

  reservation: {
    type: mongoose.Types.ObjectId,
    ref: RESOURCE.RESERVATIONS,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
  },

  image: [
    {
      public_id: String,
      url: String,
      originalname: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Ratings = model(RESOURCE.RATINGS, ratingSchema);

export default Ratings;
