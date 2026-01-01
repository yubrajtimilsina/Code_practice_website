import * as LeaderboardApi from "../api/leaderboardApi";

/**
 * LeaderboardService - Business logic layer for leaderboard operations
 */
export class LeaderboardService {
  /**
   * Get leaderboard with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Leaderboard data
   */
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

  /**
   * Get user ranking
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User ranking info
   */
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

  /**
   * Get leaderboard by category
   * @param {string} category - Category name
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Category leaderboard
   */
  static async getLeaderboardByCategory(category, options = {}) {
    const filters = {
      category,
      ...options,
    };
    return this.getLeaderboard(filters);
  }

  /**
   * Search user in leaderboard
   * @param {string} query - Search query
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Search results
   */
  static async searchUser(query, options = {}) {
    const filters = {
      search: query,
      ...options,
    };
    return this.getLeaderboard(filters);
  }
}

export default LeaderboardService;
