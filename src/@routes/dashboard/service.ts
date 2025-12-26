import { STATUSCODE } from "../../@constants";
import { ErrorHandler } from "../../@utils";
import DashboardRepository from "./repository";
export default class DashboardService {
  constructor(private dashboardRepository: DashboardRepository) {}

  async GetUserRoleDashboard() {
    const result = await this.dashboardRepository.UserRoleOverView();

    if (!result) {
      throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "User data not found");
    }

    return result;
  }
}
