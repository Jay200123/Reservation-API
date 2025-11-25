import { Image } from "./image";

type Service = {
  service_name: string;
  service_price: number;
  description: string;
  duration: string;
  image: Image[];
  createdAt: Date;
  updatedAt: Date;
};

type ServiceFilter = {
  service_name?: string;
  service_price?: number;
};

export { Service, ServiceFilter };
