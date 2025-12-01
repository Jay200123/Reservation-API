import ServiceRepository from "./repository";
import {
  ErrorHandler,
  logger,
  verifyFields,
  createServiceFields,
  uploadImage,
} from "../../@utils";
import { STATUSCODE } from "../../@constants";
import mongoose from "mongoose";
import { Service, Image, ServiceFilter } from "../../@types";
export default class ServiceServices {
  constructor(private serviceRepository: ServiceRepository) {}

  async getAllServices(skip: number, limit: number) {
    const result = await this.serviceRepository.getAll(skip, limit);

    if (!result.length) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Services not found");
    }

    return result;
  }

  async getServiceById(id: string) {
    if (id == ":id") {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Missing Service ID");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.info({
        GET_SERVICE_BY_ID_ERROR: {
          message: "Invalid mongoose ID",
        },
      });

      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const result = await this.serviceRepository.getById(id);

    if (!result) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Service not found");
    }

    return result;
  }

  async createService(
    data: Omit<Service, "createdAt" | "updatedAt"> & {
      image: Express.Multer.File[];
    }
  ) {
    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createServiceFields, data);

    const image = await uploadImage(data.image, []);

    const result = await this.serviceRepository.create({
      ...data,
      image: image,
    });

    return result;
  }

  /**
   * Updates a service record by its unique ID.
   *
   * @param id - The unique identifier of the service to update.
   * @param data - An object containing the fields to update.
   * Combines two partial types:
   * - `Partial<Omit<Service, "image">>` for all updatable service fields except `image`.
   * - `Partial<{ image: Express.Multer.File[] }>` for handling image uploads.
   *
   * Note: In the `Service` type, the `image` property is defined as `Image[]`,
   * where each object includes `public_id`, `url`, and `originalname`.
   * This method allows replacing or appending images using uploaded files.
   *
   * @returns A promise that resolves to the updated service record.
   */
  async updateServiceById(
    id: string,
    data: Partial<Omit<Service, "image">> &
      Partial<{ image: Express.Multer.File[] }>
  ) {
    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createServiceFields, data);

    const service = await this.serviceRepository.getById(id);

    if (!service) {
      logger.info({
        UPDATE_SERVICE_ERROR: {
          message: "Service not found",
        },
      });
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Request");
    }

    const imageLength =
      (service?.image?.length ?? 0) + (data?.image?.length ?? 0);

    if (imageLength == 5) {
      throw new ErrorHandler(
        STATUSCODE.BAD_REQUEST,
        "File upload limit exceeded. You can only upload up to 5 files at a time."
      );
    }

    //Checks if the data sent from the req body is empty or null.
    if (!data || null) {
      throw new ErrorHandler(
        STATUSCODE.BAD_REQUEST,
        `Missing required fields: ${createServiceFields.join(", ")}`
      );
    }

    // Initialize a new array to store uploaded image metadata (typed as Image[])
    let newImages: Image[];

    // Cast the provided image data to an array of Express.Multer.File objects
    const images = data.image as Express.Multer.File[];

    /**
     *  Use the async helper `uploadImage`, which uploads files to Cloudinary
     *  and returns an array of objects containing `public_id`, `url`, and `originalname`
     */
    newImages = await uploadImage(images, []);

    /**
     * Verifies that all required fields exist in the given data object, if an unknown field exists it will throw an Error
     * @param fields - An array of required field names to check (e.g. createUserFields).
     * @param data - The object to validate, typically req.body.
     */
    verifyFields(createServiceFields, data);

    //Update service record by calling updateById method from `ServiceRepository` class
    const result = await this.serviceRepository.updateById(id, {
      ...data,
      image: newImages,
    });

    return result;
  }

  async deleteServiceById(service_id: string) {
    const result = await this.serviceRepository.deleteById(service_id);

    return result;
  }

  async getUserServices(filter: ServiceFilter, skip: number, limit: number) {
    const serviceFilter: any = [];

    if (filter.service_name !== "") {
      serviceFilter.push({
        service_name: {
          $regex: filter.service_name,
          $options: "i",
        },
      });
    }

    if (filter.service_price !== 0) {
      serviceFilter.push({
        service_price: Number(filter.service_price),
      });
    }

    const result = await this.serviceRepository.getAllUserServices(
      serviceFilter,
      skip,
      limit
    );

    if (!result.length) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Services not found");
    }

    return result;
  }
}
