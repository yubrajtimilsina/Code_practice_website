import api from "../../../utils/api.js";


export const submitSolutionApi = (payload) => {
    return api.post("/submissions/submit", payload);
};

export const runCodeApi = (payload) => {
  return api.post("/submissions/run", payload);
};

export const saveDraftApi = async (problemId, { code, language }) => {
  return await api.put(`/submissions/draft/${problemId}`, {
    code,
    language,
    problemId, // Include problemId in the body
  });
};


export const getDraftApi = (problemId) => {
  return api.get(`/submissions/draft/${problemId}`);
};

export const getSubmissionHistoryApi = (params = {})=> {
    return api.get("/submissions", {params});
};