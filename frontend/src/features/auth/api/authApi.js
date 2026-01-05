import api from "../../../utils/api";

export const registerApi = (playload) => {
  return api.post("/auth/register", playload);
};
export const loginApi = (playload) => {
  return api.post("/auth/login", playload);
}

export const googleLoginApi = (credential) => {
  return api.post("/auth/google", { credential });
};

export const protectedApi = () => {
  return api.get("/protected");
}
export const meApi = () => {
  // Interceptor already handles token authorization
  return api.get("/auth/me");
};