import { STATUSCODE } from "../../@constants";
import { MiddlewareFn } from "../../@types";
import { logger, SuccessHandler } from "../../@utils";
import DashboardService from "./service";

export default class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  GetUserRoleDashboard: MiddlewareFn = async (req, res, next) => {
    logger.info({
      GET_USER_ROLE_DASHBOARD_REQUEST: {
        message: "SUCCESS",
      },
    });

    const result = await this.dashboardService.GetUserRoleDashboard();

    logger.info({
      GET_USER_ROLE_DASHBOARD_RESPONSE: {
        message: "SUCCESS",
      },
    });

    return SuccessHandler(res, STATUSCODE.SUCCESS, result, "Success");
  };
}
