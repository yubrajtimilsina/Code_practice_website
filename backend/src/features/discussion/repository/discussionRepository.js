import Discussion from '../models/DiscussionModel.js';

export const createDiscussion = async (discussionData) => {
  const discussion = new Discussion(discussionData);
  return await discussion.save();
};

export const findDiscussionById = async (id) => {
  return await Discussion.findById(id)
    .populate('userId', 'name email role')
    .populate('problemId', 'title slug difficulty')
    .populate('comments.userId', 'name email role')
    .lean();
};

export const findAllDiscussions = async (filters = {}, options = {}) => {
  const { page = 1, limit = 20, sortBy = '-lastActivityAt' } = options;
  const skip = (page - 1) * limit;

  const query = Discussion.find(filters)
    .populate('userId', 'name email role')
    .populate('problemId', 'title slug')
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();

  const discussions = await query;
  const total = await Discussion.countDocuments(filters);

  return {
    discussions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const updateDiscussion = async (id, updates) => {
  updates.updatedAt = Date.now();
  return await Discussion.findByIdAndUpdate(id, updates, { new: true })
    .populate('userId', 'name email role')
    .populate('problemId', 'title slug');
};

export const deleteDiscussion = async (id) => {
  return await Discussion.findByIdAndDelete(id);
};

export const incrementViews = async (id) =>{
  return await Discussion.findByIdAndUpdate(
    id,
    { $inc: { views:1}},
    { new: true}
  );
};

export const toggleVote = async (discussionId, userId, voteType) => {
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) return null;

  const upvoteIndex = discussion.upvotes.indexOf(userId);
  const downvoteIndex = discussion.downvotes.indexOf(userId);

  if (voteType === 'upvote') {
    if (upvoteIndex > -1) {
      discussion.upvotes.splice(upvoteIndex, 1);
    } else {
      discussion.upvotes.push(userId);
      if (downvoteIndex > -1) {
        discussion.downvotes.splice(downvoteIndex, 1);
      }
    }
  } else if (voteType === 'downvote') {
    if (downvoteIndex > -1) {
      discussion.downvotes.splice(downvoteIndex, 1);
    } else {
      discussion.downvotes.push(userId);
      if (upvoteIndex > -1) {
        discussion.upvotes.splice(upvoteIndex, 1);
      }
    }
  }

  return await discussion.save();
};


export const addComment = async (discussionId, commentData) => {
  const discussion = await Discussion.findById(discussionId);

  if (!discussion) return null;
  discussion.comments.push(commentData);
  discussion.lastActivityAt = Date.now();
  
  return await discussion.save();
};

export const updateComment = async (discussionId, commentId, content) => {
  const discussion = await Discussion.findById(discussionId);
  if(!discussion ) return null;

  const comment = discussion.comments.id(commentId);
  if(!comment ) return null;

  comment.content = content;
  comment.isEdited = true;
  comment.updatedAt = Date.now();

  return await discussion.save();
};

export const deleteComment = async (discussionId, commentId) => {
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) return null;

  discussion.comments.id(commentId).remove();
  
  return await discussion.save();
};

export const toggleCommentVote = async (discussionId, commentId, userId, voteType) => {
  const discussion = await Discussion.findById(discussionId);
  if(!discussion) return null;

  const comment = discussion.comments.id(commentId);
  if (!comment) return null;

   const upvoteIndex = comment.upvotes.indexOf(userId);
  const downvoteIndex = comment.downvotes.indexOf(userId);

   if (voteType === 'upvote') {
    if (upvoteIndex > -1) {
      comment.upvotes.splice(upvoteIndex, 1);
    } else {
      comment.upvotes.push(userId);
      if (downvoteIndex > -1) {
        comment.downvotes.splice(downvoteIndex, 1);
      }
    }
  } else if (voteType === 'downvote') {
    if (downvoteIndex > -1) {
      comment.downvotes.splice(downvoteIndex, 1);
    } else {
      comment.downvotes.push(userId);
      if (upvoteIndex > -1) {
        comment.upvotes.splice(upvoteIndex, 1);
      }
    }
  }
   return await discussion.save();
};
