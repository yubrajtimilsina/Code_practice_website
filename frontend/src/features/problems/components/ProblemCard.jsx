import { Link } from "react-router-dom";
import { Edit2, Eye } from "lucide-react";

export default function ProblemCard({ problem, adminView = false }) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-5 transition-all hover:shadow-md hover:-translate-y-1">
      <Link to={`/problems/${problem.slug || problem._id}`} className="block">
        <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          {problem.title}
        </h3>
      </Link>
      
      <p className="text-slate-600 text-sm mt-2 line-clamp-2">
        {problem.description}
      </p>

      <div className="mt-4 space-y-3">
        {/* Difficulty Badge */}
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              problem.difficulty === "Hard"
                ? "bg-red-100 text-red-700"
                : problem.difficulty === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {problem.difficulty}
          </span>
          
          {/* Problem Stats - FIX: Added constraints display */}
          <span className="text-xs text-slate-500">
            {problem.timeLimitSec}s / {problem.memoryLimitMB}MB
          </span>
        </div>

        {/* Tags */}
        {problem.tags && problem.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Admin Action Buttons - FIX: Added edit/view actions */}
        {adminView && (
          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <Link
              to={`/problems/${problem.slug || problem._id}`}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View
            </Link>
            <Link
              to={`/admin/problems/${problem._id}/edit`}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}