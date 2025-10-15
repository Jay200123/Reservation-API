import mongoose from "mongoose";
import { Image } from "./image";

type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING";
type UserRole = "USER" | "ADMIN";

type Users = {
  _id?: mongoose.Types.ObjectId;
  username: string;
  password: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

type UserDetails = {
  user: mongoose.Types.ObjectId | Users;
  fullname: string;
  email: string;
  contact_number: string;
  address: string;
  city: string;
  image: Image[];
  createdAt: Date;
  updatedAt: Date;
};

type UserType = Users & Omit<UserDetails, "user">; //Here we are omitting user field from UserDetails because it is already present in Users as _id field.

export { Users, UserDetails, UserType, UserRole };
