import { getAdminDashboard as getAdminDashboardUseCase } from "../../dashboard/use-cases/getAdminDashboard.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const dashboardData = await getAdminDashboardUseCase();
    res.json({ dashboard: dashboardData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
