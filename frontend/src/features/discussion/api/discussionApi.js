import api from "../../../utils/api.js";

export const getDiscussions = (params) => api.get("/discussion", { params });

export const getDiscussionById = (id) => api.get(`/discussion/${id}`);
export const createDiscussion = (data) => api.post("/discussion", data);
export const updateDiscussion = (id, data) => api.put(`/discussion/${id}`, data);
export const deleteDiscussion = (id) => api.delete(`/discussion/${id}`);
export const voteDiscussion = (id) => api.post(`/discussion/${id}/vote`, { voteType: 'upvote' });

export const updateComment = (id, commentId, content) => api.put(`/discussion/${id}/comments/${commentId}`, { content });
export const deleteComment = (id, commentId) => api.delete(`/discussion/${id}/comments/${commentId}`);
export const voteComment = (id, commentId) => api.post(`/discussion/${id}/comments/${commentId}/vote`, { voteType: 'upvote' });
export const pinDiscussion = (id) => api.post(`/discussion/${id}/pin`);
 

export const addComment = (discussionId, content, parentCommentId = null) =>
  api.post(`/discussion/${discussionId}/comments`, {
    content,
    parentCommentId
  });