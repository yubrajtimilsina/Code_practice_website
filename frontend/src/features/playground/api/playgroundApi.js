import api from "../../../utils/api.js";

export const executeCode =( payload) => {
    return api.post("/playground/execute", payload);
};

export const getPlaygroundStats = () => {
    return api.get("/playground/stats");
};
