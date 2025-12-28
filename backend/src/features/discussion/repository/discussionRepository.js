import Discussion from '../models/DiscussionModel.js';

export const populateDiscussionFields = (query) => {
  return query
    .populate('userId', 'name email role')
    .populate('problemId', 'title slug difficulty')
    .populate('comments.userId', 'name email role');
};

export const createDiscussion = async (discussionData) => {
  const discussion = new Discussion(discussionData);
  return await discussion.save();
};

export const findDiscussionById = async (id) => {
  return await populateDiscussionFields(Discussion.findById(id)).lean();
};

export const findAllDiscussions = async (filters = {}, options = {}) => {
  const { page = 1, limit = 20, sortBy = '-lastActivityAt' } = options;
  const skip = (page - 1) * limit;

  const discussions = await populateDiscussionFields(Discussion.find(filters))
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();
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
  return await populateDiscussionFields(Discussion.findByIdAndUpdate(id, updates, { new: true }));
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

export const toggleVote = async (discussionId, userId) => {
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) return null;

  const upvoteIndex = discussion.upvotes.indexOf(userId);

  if (upvoteIndex > -1) {
  
    discussion.upvotes.splice(upvoteIndex, 1);
  } else {
    discussion.upvotes.push(userId);
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
  return await Discussion.findOneAndUpdate(
    { _id: discussionId, "comments._id": commentId },
    { 
      $set: {
        "comments.$.content": content,
        "comments.$.isEdited": true,
        "comments.$.updatedAt": Date.now()
      }
    },
    { new: true }
  );
};

export const deleteComment = async (discussionId, commentId) => {
  return await Discussion.findByIdAndUpdate(
    discussionId,
    { $pull: { comments: { _id: commentId } } },
    { new: true }
  );
};

export const toggleCommentVote = async (discussionId, commentId, userId) => {
  const discussion = await Discussion.findOne({
    _id: discussionId,
    "comments._id": commentId
  });

  if (!discussion) return null;

  const comment = discussion.comments.id(commentId);
  if (!comment) return null;

  const upvoteIndex = comment.upvotes.indexOf(userId);

  if (upvoteIndex > -1) {
   
    comment.upvotes.splice(upvoteIndex, 1);
  } else {
    
    comment.upvotes.push(userId);
  }

  discussion.lastActivityAt = new Date();
  return await discussion.save();
};
