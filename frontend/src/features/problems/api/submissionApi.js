import api from "../../../utils/api.js";
import axios from "axios";


export const submitSolutionApi = (payload) => {
    return api.post("/submissions/submit", payload);
};

export const runCodeApi = (payload) => {
  return api.post("/submissions/run", payload);
};

export const saveDraftApi = async (problemId, { code, language }) => {
  return await axios.post(`/api/submissions/draft/${problemId}`, {
    code,
    language,
    verdict: 'Pending', // must match backend enum
  });
};


export const getDraftApi = (problemId) => {
  return api.get(`/submissions/draft/${problemId}`);
};

export const getSubmissionHistoryApi = (params = {})=> {
    return api.get("/submissions", {params});
};