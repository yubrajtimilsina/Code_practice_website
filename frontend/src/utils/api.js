import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },        

});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
   
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // Allow specific error handling for login/register
    if (error.response?.status === 401 && !originalRequest.url.includes("/auth/login") && !originalRequest.url.includes("/auth/register")) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default api;