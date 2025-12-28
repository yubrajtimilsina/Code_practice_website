import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiscussions } from "../api/discussionApi.js";
import { DiscussionSkeleton } from "../loading/DiscussionSkeleton.jsx";

import { getTimeSince, getCategoryColor } from "../../../utils/discussionHelpers.js";

import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Pin
} from "lucide-react";

import Pagination from "../../../components/Pagination.jsx";

export default function DiscussionList() {
    const navigate = useNavigate();

    const [discussions, setDiscussions] = useState([]);
     const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("-lastActivityAt");

   const categories = [
    { value: "all", label: "All Discussions" },
    { value: "general", label: "General" },
    { value: "problem-help", label: "Problem Help" },
    { value: "algorithm", label: "Algorithms" },
    { value: "interview", label: "Interview Prep" },
    { value: "bug-report", label: "Bug Reports" },
    { value: "feature-request", label: "Feature Requests" }
  ];

  useEffect(() => {
    fetchDiscussions();
  }, [page, category, sortBy]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDiscussions();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const fetchDiscussions = async() =>{
    setLoading(true);
    const params = { page, limit:20, sortBy};
    if (category !=="all") params.category = category;
    if (search.trim()) params.search = search.trim();

    const response = await getDiscussions(params);
    setDiscussions(response.data.discussions);
    setPagination(response.data.pagination);
    setLoading(false);
  };


  if (loading) {
    return <DiscussionSkeleton />;
  }
  
   return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Discussion Forum</h1>
            <p className="text-slate-600">Ask questions, share knowledge, and connect with the community</p>
          </div>
          <button
            onClick={() => navigate("/discussion/new")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Discussion
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search discussions..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="-lastActivityAt">Latest Activity</option>
              <option value="-createdAt">Newest First</option>
              <option value="-upvotes">Most Upvoted</option>
              <option value="-views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Discussions List */}
        {loading && discussions.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : discussions.length > 0 ? (
          <>
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div
                  key={discussion._id}
                  onClick={() => navigate(`/discussion/${discussion._id}`)}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-2 min-w-[60px]">
                      <ThumbsUp className="w-5 h-5 text-slate-400" />
                      <span className="text-lg font-bold text-slate-900">
                        {discussion.upvotes?.length || 0}
                      </span>
                      <span className="text-xs text-slate-500">votes</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        {discussion.isPinned && (
                          <Pin className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                        )}
                        <h3 className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                          {discussion.title}
                        </h3>
                      </div>

                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {discussion.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(discussion.category)}`}>
                          {discussion.category.replace('-', ' ')}
                        </span>

                        {discussion.isResolved && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            ✓ Resolved
                          </span>
                        )}

                        {discussion.tags?.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 mt-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{discussion.comments?.length || 0} comments</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{discussion.views} views</span>
                        </div>
                        <span>by {discussion.userId?.name}</span>
                        <span>{getTimeSince(discussion.lastActivityAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                itemsPerPage={20}
                onPageChange={setPage}
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No discussions found</h3>
            <p className="text-slate-600 mb-6">Be the first to start a discussion!</p>
            <button
              onClick={() => navigate("/discussion/new")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Discussion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}