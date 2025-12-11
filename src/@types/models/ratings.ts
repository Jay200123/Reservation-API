import mongoose from "mongoose";
import { Users } from "./user";
import { Image } from "./image";
import { Reservations } from "./reservations";

type Ratings = {
  user: mongoose.Types.ObjectId | Users;
  reservation: mongoose.Types.ObjectId | Reservations;
  description: string;
  rating: number;
  image: Image[];
  createdAt: Date;
  updatedAt: Date;
};

export type { Ratings };
