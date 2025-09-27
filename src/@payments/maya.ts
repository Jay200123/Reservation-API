import axios from "axios";
import { ErrorHandler, logger } from "../@utils";
import { STATUSCODE } from "../@constants";

export const paymayaCheckout = async (payload: any) => {
  try {
    const result: any = await axios.post(
      `${process.env.MAYA_SANDBOX_BASE_URL}/checkout/v1/checkouts`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.MAYA_PUBLIC_KEY}` + ":"
          ).toString("base64")}`,
        },
      }
    );

    return result.data;
  } catch (err: any) {
    logger.info({
      PAYMAYA_PAYMENT_ERROR: {
        err: err.response?.data,
      },
    });

    throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Invalid Payment");
  }
};
