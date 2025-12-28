import * as repo from "../repository/discussionRepository.js";

export const createDiscussion = async (req, res) => {
  const { title, content, category, tags, problemId } = req.body;
  const userId = req.user._id;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const discussion = await repo.createDiscussion({
    title,
    content,
    category: category || 'general',
    tags: tags || [],
    userId,
    problemId: problemId || null
  });

  const populatedDiscussion = await repo.findDiscussionById(discussion._id);

  res.status(201).json({
    message: 'Discussion created successfully',
    discussion: populatedDiscussion
  });
};

export const getAllDiscussions = async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    category, 
    tags, 
    search,
    sortBy = '-lastActivityAt',
    problemId
  } = req.query;

  const filters = {};

  if (category && category !== 'all') {
    filters.category = category;
  }

  if (tags) {
    filters.tags = { $in: tags.split(',') };
  }

  if (problemId) {
    filters.problemId = problemId;
  }

  if (search && search.trim()) {
    filters.$text = { $search: search.trim() };
  }

  const result = await repo.findAllDiscussions(filters, { page, limit, sortBy });

  res.json(result);
};

export const getDiscussionById = async (req, res) => {
  const { id } = req.params;

  await repo.incrementViews(id);
  const discussion = await repo.findDiscussionById(id);

  if (!discussion) {
    return res.status(404).json({ error: 'Discussion not found' });
  }

  res.json({ discussion });
};

export const updateDiscussion = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags, isResolved, isClosed } = req.body;
  const userId = req.user._id;

  const discussion = await repo.findDiscussionById(id);

  if (!discussion) {
    return res.status(404).json({ error: 'Discussion not found' });
  }

  if (discussion.userId._id.toString() !== userId.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to update this discussion' });
  }

  const updates = {};
  if (title) updates.title = title;
  if (content) updates.content = content;
  if (category) updates.category = category;
  if (tags) updates.tags = tags;
  if (typeof isResolved !== 'undefined') updates.isResolved = isResolved;
  if (typeof isClosed !== 'undefined') updates.isClosed = isClosed;

  const updatedDiscussion = await repo.updateDiscussion(id, updates);

  res.json({
    message: 'Discussion updated successfully',
    discussion: updatedDiscussion
  });
};

export const deleteDiscussion = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const discussion = await repo.findDiscussionById(id);

  if (!discussion) {
    return res.status(404).json({ error: 'Discussion not found' });
  }

  if (discussion.userId._id.toString() !== userId.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to delete this discussion' });
  }

  await repo.deleteDiscussion(id);

  res.json({ message: 'Discussion deleted successfully' });
};

export const voteDiscussion = async (req, res) => {
  const { id } = req.params;
  const { voteType } = req.body;
  const userId = req.user._id;

  if (!['upvote'].includes(voteType)) {
    return res.status(400).json({ error: 'Invalid vote type' });
  }

  const discussion = await repo.toggleVote(id, userId);

  if (!discussion) {
    return res.status(404).json({ error: 'Discussion not found' });
  }

  res.json({
    message: 'Vote recorded',
    upvoteCount: discussion.upvotes.length,
  });
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, parentCommentId } = req.body; 
    const userId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }


    if (parentCommentId) {
      const discussion = await repo.findDiscussionById(id);
      const parentExists = discussion?.comments?.some(
        c => c._id.toString() === parentCommentId
      );
      
      if (!parentExists) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    }

    const discussion = await repo.addComment(id, {
      userId,
      content: content.trim(),
      parentCommentId: parentCommentId || null // ✅ Set parent
    });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const updatedDiscussion = await repo.findDiscussionById(id);

    res.status(201).json({
      message: parentCommentId ? 'Reply added successfully' : 'Comment added successfully',
      discussion: updatedDiscussion
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const updateComment = async (req, res) => {
  const { id, commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  const discussion = await repo.findDiscussionById(id);

  if (!discussion) {
    return res.status(404).json({ error: 'Discussion not found' });
  }

  const comment = discussion.comments.find(c => c._id.toString() === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (comment.userId._id.toString() !== userId.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to update this comment' });
  }

  const updatedDiscussion = await repo.updateComment(id, commentId, content.trim());

  const finalDiscussion = await repo.findDiscussionById(id);

  res.json({
    message: 'Comment updated successfully',
    discussion: finalDiscussion
  });
};

export const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  const userId = req.user._id;

  const discussion = await repo.findDiscussionById(id);

  if (!discussion) {
    return res.status(404).json({ error: 'Discussion not found' });
  }

  const comment = discussion.comments.find(c => c._id.toString() === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (comment.userId._id.toString() !== userId.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to delete this comment' });
  }

  await repo.deleteComment(id, commentId);

  const updatedDiscussion = await repo.findDiscussionById(id);

  res.json({
    message: 'Comment deleted successfully',
    discussion: updatedDiscussion
  });
};

export const voteComment = async (req, res) => {
  const { id, commentId } = req.params;
  const { voteType } = req.body;
  const userId = req.user._id;

  if (!['upvote'].includes(voteType)) {
    return res.status(400).json({ error: 'Invalid vote type' });
  }

  const discussion = await repo.toggleCommentVote(id, commentId, userId);

  if (!discussion) {
    return res.status(404).json({ error: 'Discussion or comment not found' });
  }

  const comment = discussion.comments.id(commentId);

  res.json({
    message: 'Vote recorded',
    upvoteCount: comment.upvotes.length,
  });
};

export const pinDiscussion = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
    return res.status(403).json({ error: 'Only admins can pin discussions' });
  }

  const discussion = await repo.findDiscussionById(id);

  if (!discussion) {
    return res.status(404).json({ error: 'Discussion not found' });
  }

  const updated = await repo.updateDiscussion(id, { isPinned: !discussion.isPinned });

  res.json({
    message: updated.isPinned ? 'Discussion pinned' : 'Discussion unpinned',
    discussion: updated
  });
};