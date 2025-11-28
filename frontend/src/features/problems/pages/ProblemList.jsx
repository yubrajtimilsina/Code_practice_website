import { useEffect, useState } from "react";
import { listProblems } from "../api/problemApi";
import ProblemCard from "../components/ProblemCard";

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(false);

  const fetch = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await listProblems({ page, limit: meta.limit });
      setProblems(data.items || []);
      setMeta({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 20,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [ ]);

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Explore Problems</h1>
        <p className="text-slate-600 text-lg">Sharpen your coding skills with a variety of challenges</p>
      </div>

      {/* Filters/Categories */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button className="px-5 py-2 bg-white shadow-sm rounded-lg text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors font-medium">
          All
        </button>
        <button className="px-5 py-2 bg-green-100 shadow-sm rounded-lg text-green-700 border border-green-200 hover:bg-green-200 transition-colors font-medium">
          Easy
        </button>
        <button className="px-5 py-2 bg-yellow-100 shadow-sm rounded-lg text-yellow-700 border border-yellow-200 hover:bg-yellow-200 transition-colors font-medium">
          Medium
        </button>
        <button className="px-5 py-2 bg-red-100 shadow-sm rounded-lg text-red-700 border border-red-200 hover:bg-red-200 transition-colors font-medium">
          Hard
        </button>
      </div>

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
            <ProblemCard key={p._id} problem={p} />
          ))}
        </div>
      )}

      {!loading && problems.length === 0 && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center text-slate-500">
          <p className="text-lg font-medium">No problems found.</p>
          <p className="text-sm mt-2">Try adjusting your filters or check back later!</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-between items-center">
        <p className="text-slate-600 text-sm">
          Showing {problems.length} of {meta.total} problems
        </p>

        <div className="flex gap-3">
          <button
            disabled={meta.page === 1 || loading}
            onClick={() => fetch(meta.page - 1)}
            className={`px-5 py-2 rounded-lg border border-slate-300 font-semibold transition-colors ${
              meta.page === 1 || loading
                ? "text-slate-400 bg-slate-100 cursor-not-allowed"
                : "text-blue-600 bg-white hover:bg-slate-50"
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
            className={`px-5 py-2 rounded-lg border border-slate-300 font-semibold transition-colors ${
              problems.length < meta.limit || loading
                ? "text-slate-400 bg-slate-100 cursor-not-allowed"
                : "text-blue-600 bg-white hover:bg-slate-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
