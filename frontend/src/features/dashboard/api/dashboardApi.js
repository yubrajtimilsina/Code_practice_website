import api from "../../../utils/api";

export const getLearnerDashboardApi = () => {
  return api.get("/dashboard/learner");
};
export const getAdminDashboardApi = () => {
  return api.get("/dashboard/admin");
};

export const getLearnerProfileApi = () => {
  return api.get("/users");
};

export const blockUserApi = (id) => api.put(`/users/${id}/block`);
export const deleteUserApi = (id) => api.delete(`/users/${id}`);

export const getAdminsApi = () => api.get("/super-admin/manage-admins");
export const setAdminApi = (id) => api.put(`/super-admin/${id}/set-admin`);
export const revokeAdminApi = (id) => api.put(`/super-admin/${id}/revoke-admin`);

