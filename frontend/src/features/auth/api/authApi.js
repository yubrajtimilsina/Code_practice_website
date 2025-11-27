import api from "../../../utils/api";

export const registerApi = (playload) => {
  return api.post("/auth/register", playload);
};
export const loginApi = (playload) => {
  return api.post("/auth/login", playload);
}

export const protectedApi = () => {
  return api.get("/protected");
}
export const meApi = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "null" || token === "undefined") {
    return api.get("/auth/me");
  }
  return api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

