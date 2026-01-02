import * as ProblemApi from "../api/problemApi";


export class ProblemService {

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

  static async searchProblems(query, options = {}) {
    const filters = {
      q: query,
      ...options,
    };
    return this.getProblems(filters);
  }


  static async filterByDifficulty(difficulty, options = {}) {
    const filters = {
      difficulty,
      ...options,
    };
    return this.getProblems(filters);
  }

  static async filterByTags(tags, options = {}) {
    const filters = {
      tags: Array.isArray(tags) ? tags.join(",") : tags,
      ...options,
    };
    return this.getProblems(filters);
  }
}

export default ProblemService;
