import mongoose from "mongoose";

type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING";
type UserRole = "USER" | "ADMIN";

export type Users = {
  _id?: mongoose.Types.ObjectId;
  username: string;
  password: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type UserDetails = {
  user: mongoose.Types.ObjectId | Users;
  fullname: string;
  email: string;
  contact_number: string;
  address: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserType = Users & Omit<UserDetails, "user">; //Here we are omitting user field from UserDetails because it is already present in Users as _id field.
