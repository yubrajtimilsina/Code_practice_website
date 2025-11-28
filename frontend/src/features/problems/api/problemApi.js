import api from "../../../utils/api.js";

export const listProblems = (params) => api.get("/problems", { params });
export const getProblem = (idOrSlug) => api.get(`/problems/${idOrSlug}`);


export const createProblem = (payload) => api.post("/problems", payload);
export const updateProblem = (id, payload ) => api.put(`/problems/${id}`, payload);
export const deleteProblem = (id) => api.delete(`/problems/${id}`);

