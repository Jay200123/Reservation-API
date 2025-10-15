import { Image } from "./image";

export type Service = {
  service_name: string;
  service_price: number;
  description: string;
  duration: string;
  image: Image[];
  createdAt: Date;
  updatedAt: Date;
};
