import * as DiscussionApi from "../api/discussionApi";

/**
 * DiscussionService - Business logic layer for discussion operations
 */
export class DiscussionService {
  /**
   * Get all discussions with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Discussion list
   */
  static async getDiscussions(filters = {}) {
    try {
      const response = await DiscussionApi.getDiscussions(filters);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch discussions",
      };
    }
  }

  /**
   * Get single discussion with comments
   * @param {string} id - Discussion ID
   * @returns {Promise<Object>} Discussion details
   */
  static async getDiscussionDetails(id) {
    try {
      const response = await DiscussionApi.getDiscussion(id);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Discussion not found",
      };
    }
  }

  /**
   * Create new discussion
   * @param {Object} payload - Discussion data
   * @returns {Promise<Object>} Created discussion
   */
  static async createDiscussion(payload) {
    try {
      const response = await DiscussionApi.createDiscussion(payload);
      return {
        success: true,
        data: response.data,
        message: "Discussion created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to create discussion",
      };
    }
  }

  /**
   * Add comment to discussion
   * @param {string} discussionId - Discussion ID
   * @param {Object} payload - Comment data
   * @returns {Promise<Object>} Created comment
   */
  static async addComment(discussionId, payload) {
    try {
      const response = await DiscussionApi.addComment(discussionId, payload);
      return {
        success: true,
        data: response.data,
        message: "Comment added successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to add comment",
      };
    }
  }

  /**
   * Update comment
   * @param {string} discussionId - Discussion ID
   * @param {string} commentId - Comment ID
   * @param {Object} payload - Updated comment data
   * @returns {Promise<Object>} Updated comment
   */
  static async updateComment(discussionId, commentId, payload) {
    try {
      const response = await DiscussionApi.updateComment(discussionId, commentId, payload);
      return {
        success: true,
        data: response.data,
        message: "Comment updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to update comment",
      };
    }
  }

  /**
   * Delete comment
   * @param {string} discussionId - Discussion ID
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>} Deletion status
   */
  static async deleteComment(discussionId, commentId) {
    try {
      await DiscussionApi.deleteComment(discussionId, commentId);
      return {
        success: true,
        message: "Comment deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to delete comment",
      };
    }
  }

  /**
   * Search discussions
   * @param {string} query - Search query
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Search results
   */
  static async searchDiscussions(query, options = {}) {
    const filters = {
      search: query,
      ...options,
    };
    return this.getDiscussions(filters);
  }
}

export default DiscussionService;
