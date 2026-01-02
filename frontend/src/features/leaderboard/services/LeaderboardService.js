import * as LeaderboardApi from "../api/leaderboardApi";


export class LeaderboardService {

  static async getLeaderboard(filters = {}) {
    try {
      const response = await LeaderboardApi.getLeaderboard(filters);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch leaderboard",
      };
    }
  }

 
  static async getUserRanking(userId) {
    try {
      const response = await LeaderboardApi.getUserRanking(userId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch user ranking",
      };
    }
  }

 
  static async getLeaderboardByCategory(category, options = {}) {
    const filters = {
      category,
      ...options,
    };
    return this.getLeaderboard(filters);
  }

 
  static async searchUser(query, options = {}) {
    const filters = {
      search: query,
      ...options,
    };
    return this.getLeaderboard(filters);
  }
}

export default LeaderboardService;
