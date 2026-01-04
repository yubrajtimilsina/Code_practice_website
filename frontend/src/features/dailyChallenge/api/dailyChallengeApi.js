import api from "../../../utils/api";

export const getTodayChallenge = () => {
  return api.get("/daily-challenge/today");
};

export const getChallengeHistory = (limit = 30) => {
  return api.get("/daily-challenge/history", { params: { limit } });
};

export const getChallengeByDate = (date) => {
  return api.get(`/daily-challenge/date/${date}`);
};

export const getChallengeLeaderboard = (challengeId) => {
  return api.get(`/daily-challenge/leaderboard/${challengeId}`);
};

export const getMyHistory = (page = 1, limit = 10) => {
  return api.get("/daily-challenge/my-history", { params: { page, limit } });
};

export const completeDailyChallenge = (payload) => {
  return api.post("/daily-challenge/complete", payload);
};

export const generateChallenge = () => {
  return api.post("/daily-challenge/generate");
};