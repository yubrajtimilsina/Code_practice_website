import { useEffect, useState } from "react";
import ProblemCard from "../components/ProblemCard";
import { RefreshCw, Filter, ChevronDown, Search, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import { CardGridSkeleton, PageHeaderSkeleton } from "../../../core/Skeleton.jsx";
import { ErrorState, LoadingState, EmptyDataState } from "../../../components/StateComponents.jsx";
import { useProblems } from "../hooks/useProblems";

export default function ProblemList({ adminView = false }) {
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const allTags = ["arrays", "strings", "dynamic-programming", "graphs", "trees", "sorting", "searching", "math", "greedy", "backtracking"];

  // Use clean architecture hook
  const {
    problems,
    loading,
    error,
    filters,
    totalProblems,
    fetchProblems,
    search,
    filterByTags,
    setPage,
    setLimit,
  } = useProblems({
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  // Simplified debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProblems();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.q]);

  const handlePageChange = (newPage) => setPage(newPage);
  const handleItemsPerPageChange = (newLimit) => setLimit(newLimit);

  const toggleTag = (tag) => {
    const currentTags = (filters.tags || "").split(",").filter(Boolean);
    if (currentTags.includes(tag)) {
      filterByTags(currentTags.filter(t => t !== tag));
    } else {
      filterByTags([...currentTags, tag]);
    }
  };

  const handleDifficultyChange = (difficulty) => {
    setDifficultyFilter(difficulty);
    if (difficulty !== "all") {
      search("");
      setPage(1);
    }
  };

  const clearFilters = () => {
    setDifficultyFilter("all");
    search("");
    filterByTags([]);
    setPage(1);
  };

  const selectedTags = (filters.tags || "").split(",").filter(Boolean);

  const totalPages = Math.ceil(totalProblems / filters.limit);

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              {adminView ? "Manage Problems" : "Explore Problems"}
            </h1>
            <p className="text-slate-600 text-lg">
              {adminView 
                ? "Create and manage coding challenges for learners" 
                : `Sharpen your coding skills with ${totalProblems} challenges`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={fetchProblems}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Admin Action Button */}
        {adminView && (
          <Link
            to="/admin/problems/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create New Problem
          </Link>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-200">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Problems
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={filters.q || ""}
                  onChange={(e) => search(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter by Tags
              </label>
              <div className="flex flex-wrap gap-2">  
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Per Page */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Items Per Page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="30">30 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(difficultyFilter !== "all" || filters.q || (filters.tags && filters.tags.length > 0)) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Difficulty Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["all", "easy", "medium", "hard"].map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => handleDifficultyChange(difficulty)}
            className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
              difficultyFilter === difficulty
                ? difficulty === "easy"
                  ? "bg-green-600 text-white shadow-md"
                  : difficulty === "medium"
                  ? "bg-yellow-600 text-white shadow-md"
                  : difficulty === "hard"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-blue-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>

      {/* Active Filters Display */}
      {(filters.q || (filters.tags && filters.tags.length > 0)) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Active Filters:</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            {filters.q && (
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                Search: "{filters.q}"
              </span>
            )}
            {filters.tags && filters.tags.split(",").filter(Boolean).map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                Tag: {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={fetchProblems}
            className="px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded transition-colors text-sm font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {loading && problems.length === 0 && (
  <div className="space-y-6">
    <PageHeaderSkeleton />
    <CardGridSkeleton count={6} />
  </div>
)}

      {/* Problem List */}
      {!loading && problems.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {problems.map((p) => (
              <ProblemCard key={p._id} problem={p} adminView={adminView} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            totalItems={totalProblems}
            itemsPerPage={filters.limit}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Empty State */}
      {!loading && problems.length === 0 && !error && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center text-slate-500">
          <p className="text-lg font-medium mb-2">
            {filters.q || (filters.tags && filters.tags.length > 0)
              ? "No problems match your filters"
              : "No problems found"}
          </p>
          <p className="text-sm mt-2 mb-6">
            {filters.q || (filters.tags && filters.tags.length > 0)
              ? "Try adjusting your search or filters"
              : adminView
              ? "Create your first problem to get started!"
              : "Check back later for new challenges!"}
          </p>
          {(filters.q || (filters.tags && filters.tags.length > 0)) && (
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Stats Summary */}
      {!loading && problems.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-600 text-sm mb-2">Total Problems</p>
            <p className="text-3xl font-bold text-slate-900">{totalProblems}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-600 text-sm mb-2">Current Page</p>
            <p className="text-3xl font-bold text-blue-600">
              {filters.page} / {totalPages}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-600 text-sm mb-2">Viewing</p>
            <p className="text-3xl font-bold text-green-600">{problems.length}</p>
            <p className="text-xs text-slate-500 mt-1">problems on this page</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-600 text-sm mb-2">Difficulty</p>
            <p className="text-xl font-bold text-purple-600 capitalize">
              {difficultyFilter}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}