import api from "../../../utils/api";

export const getGlobalLeaderboardApi = ( params = {}) => {
    return api.get("/leaderboard", { params});
};

export const getMyRankApi = () => {
    return api.get("/leaderboard/my-rank");
};

export const getMyProgressApi = () => {
    return api.get("/leaderboard/my-progress");
};

export const getProblemStatsApi = (problemId) => {
    return api.get(`/leaderboard/problem/${problemId}/stats`);
};

export const getSystemHealthApi = () => {
    return api.get("/leaderboard/system/health");
};



