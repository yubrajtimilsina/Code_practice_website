import api from "../../../utils/api.js";

export const submitSolutionApi = (payload) => {
    return api.post("/submissions/submit", payload);
};

export const runCodeApi = (payload) => {
  return api.post("/submissions/run", payload);
};

export const saveDraftApi = (problemId, payload) => {
  return api.post(`/submissions/draft/${problemId}`, payload);
};

export const getDraftApi = (problemId) => {
  return api.get(`/submissions/draft/${problemId}`);
};

export const getSubmissionHistoryApi = (params = {})=> {
    return api.get("/submissions", {params});
};