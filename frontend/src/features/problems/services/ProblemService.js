import * as ProblemApi from "../api/problemApi";

/**
 * ProblemService - Business logic layer for problem operations
 * Handles all problem-related business operations
 */
export class ProblemService {
  /**
   * Fetch list of problems with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Problem list with metadata
   */
  static async getProblems(filters = {}) {
    try {
      const response = await ProblemApi.listProblems(filters);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch problems",
      };
    }
  }

  /**
   * Get single problem details
   * @param {string} idOrSlug - Problem ID or slug
   * @returns {Promise<Object>} Problem details
   */
  static async getProblemDetails(idOrSlug) {
    try {
      const response = await ProblemApi.getProblem(idOrSlug);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Problem not found",
      };
    }
  }

  /**
   * Create new problem (admin only)
   * @param {Object} payload - Problem data
   * @returns {Promise<Object>} Created problem
   */
  static async createNewProblem(payload) {
    try {
      const response = await ProblemApi.createProblem(payload);
      return {
        success: true,
        data: response.data,
        message: "Problem created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to create problem",
      };
    }
  }

  /**
   * Update problem (admin only)
   * @param {string} id - Problem ID
   * @param {Object} payload - Updated problem data
   * @returns {Promise<Object>} Updated problem
   */
  static async updateExistingProblem(id, payload) {
    try {
      const response = await ProblemApi.updateProblem(id, payload);
      return {
        success: true,
        data: response.data,
        message: "Problem updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to update problem",
      };
    }
  }

  /**
   * Delete problem (admin only)
   * @param {string} id - Problem ID
   * @returns {Promise<Object>} Deletion status
   */
  static async deleteProblem(id) {
    try {
      await ProblemApi.deleteProblem(id);
      return {
        success: true,
        message: "Problem deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to delete problem",
      };
    }
  }

  /**
   * Search problems
   * @param {string} query - Search query
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Search results
   */
  static async searchProblems(query, options = {}) {
    const filters = {
      q: query,
      ...options,
    };
    return this.getProblems(filters);
  }

  /**
   * Filter problems by difficulty
   * @param {string} difficulty - Difficulty level
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Filtered results
   */
  static async filterByDifficulty(difficulty, options = {}) {
    const filters = {
      difficulty,
      ...options,
    };
    return this.getProblems(filters);
  }

  /**
   * Filter problems by tags
   * @param {Array<string>} tags - Array of tags
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Filtered results
   */
  static async filterByTags(tags, options = {}) {
    const filters = {
      tags: Array.isArray(tags) ? tags.join(",") : tags,
      ...options,
    };
    return this.getProblems(filters);
  }
}

export default ProblemService;
