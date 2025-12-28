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
  ThumbsDown,
  MessageSquare,
  Eye,
  ArrowLeft,
  Edit2,
  Trash2,
  Send,
  Pin,
  Check
} from "lucide-react";

export default function DiscussionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  

  const [replyingTo, setReplyingTo] = useState(null);
const [replyContent, setReplyContent] = useState("");

  
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const response = await getDiscussionById(id);
      setDiscussion(response.data.discussion);
    } catch (error) {
      console.error("Failed to fetch discussion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteDiscussion = async (voteType) => {
  if (!user) return;

  // optimistic update
  setDiscussion(prev => {
    if (!prev) return prev;

    const hasUpvoted = prev.upvotes.includes(user.id);
    const hasDownvoted = prev.downvotes.includes(user.id);

    let upvotes = [...prev.upvotes];
    let downvotes = [...prev.downvotes];

    if (voteType === "upvote") {
      if (hasUpvoted) {
        upvotes = upvotes.filter(id => id !== user.id);
      } else {
        upvotes.push(user.id);
        if (hasDownvoted) {
          downvotes = downvotes.filter(id => id !== user.id);
        }
      }
    }

    if (voteType === "downvote") {
      if (hasDownvoted) {
        downvotes = downvotes.filter(id => id !== user.id);
      } else {
        downvotes.push(user.id);
        if (hasUpvoted) {
          upvotes = upvotes.filter(id => id !== user.id);
        }
      }
    }

    return { ...prev, upvotes, downvotes };
  });

  try {
    await voteDiscussion(id, voteType); // backend sync
  } catch (error) {
    console.error("Vote failed:", error);
    fetchDiscussion(); // fallback if API fails
  }
};


  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      setSubmitting(true);
      await addComment(id, commentContent.trim());
      setCommentContent("");
      await fetchDiscussion();
    } catch (error) {
      console.error("Failed to add comment:", error);
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
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await deleteComment(id, commentId);
      await fetchDiscussion();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleVoteComment = async (commentId, voteType) => {
  if (!user) return;

  setDiscussion(prev => {
    if (!prev) return prev;

    const updatedComments = prev.comments.map(comment => {
      if (comment._id !== commentId) return comment;

      const hasUpvoted = comment.upvotes.includes(user.id);
      const hasDownvoted = comment.downvotes.includes(user.id);

      let upvotes = [...comment.upvotes];
      let downvotes = [...comment.downvotes];

      if (voteType === "upvote") {
        if (hasUpvoted) {
          upvotes = upvotes.filter(id => id !== user.id);
        } else {
          upvotes.push(user.id);
          if (hasDownvoted) {
            downvotes = downvotes.filter(id => id !== user.id);
          }
        }
      }

      if (voteType === "downvote") {
        if (hasDownvoted) {
          downvotes = downvotes.filter(id => id !== user.id);
        } else {
          downvotes.push(user.id);
          if (hasUpvoted) {
            upvotes = upvotes.filter(id => id !== user.id);
          }
        }
      }

      return { ...comment, upvotes, downvotes };
    });

    return { ...prev, comments: updatedComments };
  });

  try {
    await voteComment(id, commentId, voteType);
  } catch (error) {
    console.error("Vote failed:", error);
    fetchDiscussion();
  }
};


  const handleDeleteDiscussion = async () => {
    if (!confirm("Delete this discussion? This cannot be undone.")) return;

    try {
      await deleteDiscussion(id);
      navigate("/discussion");
    } catch (error) {
      console.error("Failed to delete discussion:", error);
    }
  };

  const handleMarkResolved = async () => {
    try {
      await updateDiscussion(id, { isResolved: !discussion.isResolved });
      await fetchDiscussion();
    } catch (error) {
      console.error("Failed to update discussion:", error);
    }
  };

  const handlePinDiscussion = async () => {
    try {
      await pinDiscussion(id);
      await fetchDiscussion();
    } catch (error) {
      console.error("Failed to pin discussion:", error);
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

  const hasUserVotedDiscussion = (voteType) => {
    if (!user || !discussion) return false;
    const votes = voteType === 'upvote' ? discussion.upvotes : discussion.downvotes;
    return votes?.some(v => v === user.id || v._id === user.id);
  };

  const hasUserVotedComment = (comment, voteType) => {
    if (!user || !comment) return false;
    const votes = voteType === 'upvote' ? comment.upvotes : comment.downvotes;
    return votes?.some(v => v === user.id || v._id === user.id);
  };

  const handleReply = async (commentId) => {
  if (!replyContent.trim()) return;

  try {
    setSubmitting(true);
    await addComment(id, replyContent.trim(), commentId); // 👈 parent id
    setReplyContent("");
    setReplyingTo(null);
    await fetchDiscussion();
  } catch (error) {
    console.error("Reply failed:", error);
  } finally {
    setSubmitting(false);
  }
};


  const isAuthor = discussion?.userId?._id === user?.id;
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

if (loading) {
  return <DiscussionSkeleton />;
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
            Back to discussion
          </button>
        </div>
      </div>
    );
  }

  const mainComments = discussion.comments?.filter(
  c => !c.parentCommentId
);

const replies = discussion.comments?.filter(
  c => c.parentCommentId
);


  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/discussion")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to discussion
        </button>

        {/* Discussion Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-start gap-4">
              {/* Vote Section */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleVoteDiscussion('upvote')}
                  className={`p-2 rounded-lg transition-colors ${
                    hasUserVotedDiscussion('upvote')
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-slate-100 text-slate-400'
                  }`}
                >
                  <ThumbsUp className="w-6 h-6" />
                </button>
                <span className="text-2xl font-bold text-slate-900">
                  {discussion.upvotes?.length - discussion.downvotes?.length}
                </span>
                <button
                  onClick={() => handleVoteDiscussion('downvote')}
                  className={`p-2 rounded-lg transition-colors ${
                    hasUserVotedDiscussion('downvote')
                      ? 'bg-red-100 text-red-600'
                      : 'hover:bg-slate-100 text-slate-400'
                  }`}
                >
                  <ThumbsDown className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
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
                          title={discussion.isPinned ? "Unpin discussion" : "Pin discussion"}
                        >
                          <Pin className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={handleDeleteDiscussion}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
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

                <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
                  <span>by {discussion.userId?.name}</span>
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
                  <p className="text-slate-700 whitespace-pre-line">{discussion.content}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {discussion.comments?.length || 0} Comments
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add your comment..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !commentContent.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {mainComments?.map((comment) => (
                <div key={comment._id} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleVoteComment(comment._id, 'upvote')}
                      className={`p-1 rounded transition-colors ${
                        hasUserVotedComment(comment, 'upvote')
                          ? 'text-blue-600'
                          : 'text-slate-400 hover:text-blue-600'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-slate-900">
                      {comment.upvotes?.length - comment.downvotes?.length}
                    </span>
                    <button
                      onClick={() => handleVoteComment(comment._id, 'downvote')}
                      className={`p-1 rounded transition-colors ${
                        hasUserVotedComment(comment, 'downvote')
                          ? 'text-red-600'
                          : 'text-slate-400 hover:text-red-600'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {comment.userId?.name}
                        </span>
                        <span className="text-sm text-slate-500">
                          {getTimeSince(comment.createdAt)}
                        </span>
                        {comment.isEdited && (
                          <span className="text-xs text-slate-400">(edited)</span>
                        )}
                      </div>

                      {(comment.userId?._id === user?.id || isAdmin) && (
                        <div className="flex gap-2">
                          {comment.userId?._id === user?.id && (
                            <button
                              onClick={() => {
                                setEditingComment(comment._id);
                                setEditContent(comment.content);
                              }}
                              className="p-1 hover:bg-slate-200 rounded text-slate-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {editingComment === comment._id ? (
                      <div>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditComment(comment._id)}
                            className="px-4 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingComment(null);
                              setEditContent("");
                            }}
                            className="px-4 py-1 border border-slate-300 rounded text-sm font-semibold hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-700 whitespace-pre-line">{comment.content}
                      <button
  onClick={() => setReplyingTo(comment._id)}
  className="mt-2 text-sm text-blue-600 hover:underline"
>
  Reply
</button>

{/* Reply Form */}
{replyingTo === comment._id && (
  <div className="mt-3 ml-6">
    <textarea
      value={replyContent}
      onChange={(e) => setReplyContent(e.target.value)}
      rows={2}
      placeholder="Write a reply..."
      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    />
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => handleReply(comment._id)}
        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
      >
        Reply
      </button>
      <button
        onClick={() => {
          setReplyingTo(null);
          setReplyContent("");
        }}
        className="px-3 py-1 border rounded text-sm"
      >
        Cancel
      </button>
    </div>
  </div>
)}

                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}