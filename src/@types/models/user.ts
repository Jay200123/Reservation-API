import mongoose from "mongoose";

export type Users = {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserDetails = {
  user: mongoose.Types.ObjectId | Users;
  fullname: string;
  email: string;
  contact_number: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserType = Users & UserDetails;
