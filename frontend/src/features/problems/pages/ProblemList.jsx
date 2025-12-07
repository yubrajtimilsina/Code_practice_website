import { useEffect, useState } from "react";
import { listProblems } from "../api/problemApi";
import ProblemCard from "../components/ProblemCard";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProblemList({ adminView = false }) {
  const [problems, setProblems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetch = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: meta.limit };
      
      // FIX: Add difficulty filter
      if (filter !== "all") {
        params.difficulty = filter.charAt(0).toUpperCase() + filter.slice(1);
      }

      const { data } = await listProblems(params);
      
      setProblems(data.items || []);
      setMeta({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 20,
      });
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError(
        err.response?.data?.message || 
        "Failed to load problems. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(1);
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
          {adminView ? "Manage Problems" : "Explore Problems"}
        </h1>
        <p className="text-slate-600 text-lg">
          {adminView 
            ? "Create and manage coding challenges for learners" 
            : "Sharpen your coding skills with a variety of challenges"}
        </p>
      </div>

      {/* Admin Action Button */}
      {adminView && (
        <div className="mb-6">
          <Link
            to="/admin/problems/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create New Problem
          </Link>
        </div>
      )}

      {/* Difficulty Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["all", "easy", "medium", "hard"].map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => handleFilterChange(difficulty)}
            className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === difficulty
                ? difficulty === "easy"
                  ? "bg-green-600 text-white"
                  : difficulty === "medium"
                  ? "bg-yellow-600 text-white"
                  : difficulty === "hard"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => fetch(meta.page)}
            className="px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded transition-colors text-sm font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl shadow border border-slate-200 animate-pulse"
            >
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Problem List */}
      {!loading && problems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p) => (
            <ProblemCard key={p._id} problem={p} adminView={adminView} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && problems.length === 0 && !error && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center text-slate-500">
          <p className="text-lg font-medium">No problems found.</p>
          <p className="text-sm mt-2">
            {adminView
              ? "Create your first problem to get started!"
              : "Try adjusting your filters or check back later!"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && problems.length > 0 && (
        <div className="mt-8 flex justify-between items-center flex-wrap gap-4">
          <p className="text-slate-600 text-sm">
            Showing {(meta.page - 1) * meta.limit + 1}-
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} problems
          </p>

          <div className="flex gap-3">
            <button
              disabled={meta.page === 1 || loading}
              onClick={() => fetch(meta.page - 1)}
              className={`px-5 py-2 rounded-lg border font-semibold transition-colors ${
                meta.page === 1 || loading
                  ? "text-slate-400 bg-slate-100 cursor-not-allowed border-slate-300"
                  : "text-blue-600 bg-white hover:bg-slate-50 border-slate-300"
              }`}
            >
              Previous
            </button>

            <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold">
              {meta.page}
            </div>

            <button
              disabled={problems.length < meta.limit || loading}
              onClick={() => fetch(meta.page + 1)}
              className={`px-5 py-2 rounded-lg border font-semibold transition-colors ${
                problems.length < meta.limit || loading
                  ? "text-slate-400 bg-slate-100 cursor-not-allowed border-slate-300"
                  : "text-blue-600 bg-white hover:bg-slate-50 border-slate-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}