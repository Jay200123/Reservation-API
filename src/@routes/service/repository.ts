import { Model } from "mongoose";
import { Service } from "../../@types";

export default class ServiceRepository {
  constructor(private serviceModel: Model<Service>) {}

  getAll() {}

  getById() {}

  create() {}

  updateById() {}

  deleteById() {}
}
