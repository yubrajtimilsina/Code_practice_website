import api from "../../../utils/api";

export const getLearnerDashboardApi = () => {
  return api.get("/dashboard/learner");
};
export const getAdminDashboardApi = () => {
  return api.get("/dashboard/admin");
};

