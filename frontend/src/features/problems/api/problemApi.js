import api from "../../../utils/api.js";

export const listProblems = async (params) => {
  try {
    return await api.get("/problems", { params });
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    throw new Error(error.response?.data?.error || "Failed to load problems");
  }
};

export const getProblem = async (idOrSlug) => {
  try {
    return await api.get(`/problems/${idOrSlug}`);
  } catch (error) {
    console.error("Failed to fetch problem:", error);
    throw new Error(error.response?.data?.error || "Problem not found");
  }
};

export const createProblem = async (payload) => {
  try {
    return await api.post("/problems", payload);
  } catch (error) {
    console.error("Failed to create problem:", error);
    throw new Error(error.response?.data?.error || "Failed to create problem");
  }
};

export const updateProblem = async (id, payload) => {
  try {
    return await api.put(`/problems/${id}`, payload);
  } catch (error) {
    console.error("Failed to update problem:", error);
    throw new Error(error.response?.data?.error || "Failed to update problem");
  }
};

export const deleteProblem = async (id) => {
  try {
    return await api.delete(`/problems/${id}`);
  } catch (error) {
    console.error("Failed to delete problem:", error);
    throw new Error(error.response?.data?.error || "Failed to delete problem");
  }
};