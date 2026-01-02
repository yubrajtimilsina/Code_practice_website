import * as DiscussionApi from "../api/discussionApi";

export class DiscussionService {
 
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

 
  static async searchDiscussions(query, options = {}) {
    const filters = {
      search: query,
      ...options,
    };
    return this.getDiscussions(filters);
  }
}

export default DiscussionService;
