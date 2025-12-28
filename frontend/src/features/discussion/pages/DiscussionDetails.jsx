import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DiscussionSkeleton } from "../loading/DiscussionSkeleton.jsx";

import {
  getDiscussionById,
  voteDiscussion,
  addComment,
  updateComment,
  deleteComment,
  voteComment,
  deleteDiscussion,
  updateDiscussion,
  pinDiscussion
} from "../api/discussionApi.js";
import {
  ThumbsUp,
  MessageSquare,
  Eye,
  ArrowLeft,
  Edit2,
  Trash2,
  Send,
  Pin,
  Check,
  Reply,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Disc
} from "lucide-react";

export default function DiscussionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Enhanced Reply State
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [collapsedReplies, setCollapsedReplies] = useState(new Set());

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDiscussionById(id);
      setDiscussion(response.data.discussion);
    } catch (err) {
      setError("Failed to load discussion");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 const handleVoteDiscussion = async () => {
  if (!user) {
    alert("Please login to vote");
    return;
  }

  let previousUpvotes;

  setDiscussion(prev => {
    if (!prev) return prev;

    previousUpvotes = prev.upvotes;

    const hasUpvoted = prev.upvotes.some(
      v => v === user.id || v?._id === user.id
    );

    const updatedUpvotes = hasUpvoted
      ? prev.upvotes.filter(v => v !== user.id && v?._id !== user.id)
      : [...prev.upvotes, user.id];

    return { ...prev, upvotes: updatedUpvotes };
  });

  try {
    await voteDiscussion(id);
  } catch (error) {
    console.error("Vote failed:", error);

    setDiscussion(prev => prev ? { ...prev, upvotes: previousUpvotes } : prev);
  }
};


  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      setSubmitting(true);
      await addComment(id, commentContent.trim(), null);
      setCommentContent("");
      await fetchDiscussion();
    } catch (error) {
      console.error("Add comment failed:", error);
      alert("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Enhanced Reply Handler with Error Handling
  const handleReply = async (parentCommentId) => {
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      await addComment(id, replyContent.trim(), parentCommentId);
      setReplyContent("");
      setReplyingTo(null);
      await fetchDiscussion();
    } catch (error) {
      console.error("Reply failed:", error);
      alert("Failed to add reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      await updateComment(id, commentId, editContent.trim());
      setEditingComment(null);
      setEditContent("");
      await fetchDiscussion();
    } catch (error) {
      console.error("Edit failed:", error);
      alert("Failed to edit comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment? This will also delete all replies.")) return;

    try {
      await deleteComment(id, commentId);
      await fetchDiscussion();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete comment");
    }
  };

  const handleVoteComment = async (commentId) => {
  if (!user) {
    alert("Please login to vote");
    return;
  }

  let previousComments;

  setDiscussion(prev => {
    if (!prev) return prev;

    previousComments = prev.comments;

    const updatedComments = prev.comments.map(comment => {
      if (comment._id !== commentId) return comment;

      const hasUpvoted = comment.upvotes.some(
        v => v === user.id || v?._id === user.id
      );

      const updatedUpvotes = hasUpvoted
        ? comment.upvotes.filter(v => v !== user.id && v?._id !== user.id)
        : [...comment.upvotes, user.id];

      return { ...comment, upvotes: updatedUpvotes };
    });

    return { ...prev, comments: updatedComments };
  });

  try {
    await voteComment(id, commentId, 'upvote');
  } catch (error) {
    console.error("Vote failed:", error);

    setDiscussion(prev =>
      prev ? { ...prev, comments: previousComments } : prev
    );
  }
};


  const handleDeleteDiscussion = async () => {
    if (!confirm("Delete this discussion? This cannot be undone.")) return;
    try {
      await deleteDiscussion(id);
      navigate("/discussion");
    } catch (error) {
      alert("Failed to delete discussion");
    }
  };

  const handleMarkResolved = async () => {
    try {
      await updateDiscussion(id, { isResolved: !discussion.isResolved });
      await fetchDiscussion();
    } catch (error) {
      alert("Failed to update discussion");
    }
  };

  const handlePinDiscussion = async () => {
    try {
      await pinDiscussion(id);
      await fetchDiscussion();
    } catch (error) {
      alert("Failed to pin discussion");
    }
  };

  const getTimeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  const getCategoryColor = (cat) => {
    const colors = {
      general: "bg-blue-100 text-blue-700",
      "problem-help": "bg-green-100 text-green-700",
      algorithm: "bg-purple-100 text-purple-700",
      interview: "bg-yellow-100 text-yellow-700",
      "bug-report": "bg-red-100 text-red-700",
      "feature-request": "bg-indigo-100 text-indigo-700"
    };
    return colors[cat] || "bg-slate-100 text-slate-700";
  };

  const hasUserUpvotedDiscussion = () => {
    if (!user || !discussion) return false;
    return discussion.upvotes?.some(v => v === user.id || v?._id === user.id);
  };

  const hasUserUpvotedComment = (comment) => {
    if (!user || !comment) return false;
    return comment.upvotes?.some(v => v === user.id || v?._id === user.id);
  };

  const mainComments = discussion?.comments?.filter(c => !c.parentCommentId) || [];
  
  const getReplies = (commentId) => {
    return discussion?.comments?.filter(c => 
      c.parentCommentId?.toString() === commentId.toString()
    ) || [];
  };

  // ✅ Toggle Reply Collapse/Expand
  const toggleReplies = (commentId) => {
    setCollapsedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // ✅ Enhanced Comment Renderer with Better Visual Hierarchy
  const renderComment = (comment, depth = 0) => {
    const replies = getReplies(comment._id);
    const isAuthor = comment.userId?._id === user?.id;
    const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';
    const isCollapsed = collapsedReplies.has(comment._id);
    const replyCount = replies.length;

    

    return (
      <div key={comment._id} className={depth > 0 ? "ml-8 mt-3 border-l-2 border-blue-200 pl-4" : ""}>
        <div className={`flex gap-3 p-4 rounded-lg transition-all ${
          depth === 0 ? 'bg-slate-50' : 'bg-white border border-slate-200'
        }`}>

          {/* Vote Section */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleVoteComment(comment._id)}
              className={`p-1 rounded transition-colors ${
                hasUserUpvotedComment(comment)
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title="Upvote"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-slate-900">
              {comment.upvotes?.length || 0}
            </span>
          </div>

          {/* Comment Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-900">
                  {comment.userId?.name}
                </span>
                <span className="text-sm text-slate-500">
                  {getTimeSince(comment.createdAt)}
                </span>
                {comment.isEdited && (
                  <span className="text-xs text-slate-400 italic">(edited)</span>
                )}
                {/* ✅ Reply Count Badge */}
                {replyCount > 0 && (
                  <button
                    onClick={() => toggleReplies(comment._id)}
                    className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                    {isCollapsed ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronUp className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>

              {/* Actions */}
              {(isAuthor || isAdmin) && (
                <div className="flex gap-2">
                  {isAuthor && (
                    <button
                      onClick={() => {
                        setEditingComment(comment._id);
                        setEditContent(comment.content);
                      }}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Content or Edit Form */}
            {editingComment === comment._id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder="Edit your comment..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    disabled={!editContent.trim()}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent("");
                    }}
                    className="px-4 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-slate-700 whitespace-pre-line mb-3">{comment.content}</p>

                {/* Reply Button */}
                <button
                  onClick={() => {
                    setReplyingTo(comment._id);
                    setReplyContent("");
                  }}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
              </>
            )}

            {/* ✅ Reply Form with Better Styling */}
            {replyingTo === comment._id && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2 text-sm text-blue-800">
                  <Reply className="w-4 h-4" />
                  <span className="font-medium">Replying to {comment.userId?.name}</span>
                </div>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                  placeholder={`Reply to ${comment.userId?.name}...`}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReply(comment._id)}
                    disabled={!replyContent.trim() || submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    {submitting ? "Posting..." : "Post Reply"}
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                    disabled={submitting}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Render Nested Replies with Collapse/Expand */}
        {replies.length > 0 && !isCollapsed && (
          <div className="mt-2">
            {replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const isAuthor = discussion?.userId?._id === user?.id;
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

  if (loading) {
     return <DiscussionSkeleton />;
   }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-300 rounded-lg p-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-red-700 font-semibold">{error}</p>
              <button
                onClick={fetchDiscussion}
                className="mt-2 text-sm text-red-600 underline hover:text-red-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Discussion not found</h2>
          <button
            onClick={() => navigate("/discussion")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to discussions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/discussion")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to discussions
        </button>

        {/* Discussion Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-start gap-4">
              {/* Vote Section */}
              <div className="flex flex-col items-center gap-2 min-w-[60px]">
                <button
                  onClick={handleVoteDiscussion}
                  className={`p-2 rounded-lg transition-colors ${
                    hasUserUpvotedDiscussion()
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-slate-100 text-slate-400'
                  }`}
                  title="Upvote discussion"
                >
                  <ThumbsUp className="w-6 h-6" />
                </button>
                <span className="text-2xl font-bold text-slate-900">
                  {discussion.upvotes?.length || 0}
                </span>
                <span className="text-xs text-slate-500">votes</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {discussion.isPinned && (
                      <Pin className="w-5 h-5 text-yellow-600" />
                    )}
                    <h1 className="text-3xl font-bold text-slate-900">
                      {discussion.title}
                    </h1>
                  </div>

                  {(isAuthor || isAdmin) && (
                    <div className="flex gap-2">
                      {isAuthor && (
                        <button
                          onClick={handleMarkResolved}
                          className={`p-2 rounded-lg transition-colors ${
                            discussion.isResolved
                              ? 'bg-green-100 text-green-700'
                              : 'hover:bg-slate-100 text-slate-400'
                          }`}
                          title={discussion.isResolved ? "Mark as unresolved" : "Mark as resolved"}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={handlePinDiscussion}
                          className={`p-2 rounded-lg transition-colors ${
                            discussion.isPinned
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'hover:bg-slate-100 text-slate-400'
                          }`}
                          title={discussion.isPinned ? "Unpin" : "Pin"}
                        >
                          <Pin className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={handleDeleteDiscussion}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Delete discussion"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(discussion.category)}`}>
                    {discussion.category.replace('-', ' ')}
                  </span>

                  {discussion.isResolved && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                      ✓ Resolved
                    </span>
                  )}

                  {discussion.tags?.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500 mb-6 flex-wrap">
                  <span>by <span className="font-medium text-slate-700">{discussion.userId?.name}</span></span>
                  <span>{getTimeSince(discussion.createdAt)}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{discussion.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{discussion.comments?.length || 0} comments</span>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {discussion.content}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {discussion.comments?.length || 0} Comments
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !commentContent.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {mainComments.length > 0 ? (
                mainComments.map(comment => renderComment(comment))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}