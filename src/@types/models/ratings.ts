import mongoose from "mongoose";
import { Users } from "./user";
import { Service } from "./service";
import { Image } from "./image";

type Ratings = {
  user: mongoose.Types.ObjectId | Users;
  service: mongoose.Types.ObjectId | Service;
  description: string;
  rating: number;
  image: Image[];
  createdAt: Date;
  updatedAt: Date;
};

export type { Ratings };
