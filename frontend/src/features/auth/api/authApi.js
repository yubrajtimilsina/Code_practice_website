import api from "../../../utils/api";

export const registerApi = (payload) => {
  return api.post("/auth/register", payload);
};

export const loginApi = (payload) => {
  return api.post("/auth/login", payload);
};

export const googleLoginApi = (credential) => {
  return api.post("/auth/google", { credential });
};

export const protectedApi = () => {
  return api.get("/protected");
};

export const meApi = () => {
  return api.get("/auth/me");
};

// Password Reset APIs
export const forgotPasswordApi = (email) => {
  return api.post("/auth/forgot-password", { email });
};

export const verifyResetTokenApi = (token) => {
  return api.get(`/auth/verify-reset-token/${token}`);
};

export const resetPasswordApi = (token, password) => {
  return api.put(`/auth/reset-password/${token}`, { password });
};

export const changePasswordApi = (currentPassword, newPassword) => {
  return api.put("/users/change-password", { 
    currentPassword, 
    newPassword 
  });
};

export const updateProfileApi = (payload) => {
  return api.put("/users/profile", payload);
};