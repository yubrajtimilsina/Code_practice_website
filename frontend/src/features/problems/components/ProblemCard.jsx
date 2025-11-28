
import { Link } from "react-router-dom";

export default function ProblemCard({ problem }) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-5 transition-all hover:shadow-md hover:-translate-y-1">
      <Link to={`/problems/${problem.slug || problem._id}`} className="block">
        <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors">{problem.title}</h3>
      </Link>
      <p className="text-slate-600 text-sm mt-2 line-clamp-2">{problem.description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          problem.difficulty === "Hard" ? "bg-red-100 text-red-700" :
          problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
          "bg-green-100 text-green-700"
        }`}>
          {problem.difficulty}
        </span>
        <div className="flex flex-wrap gap-2">
          {problem.tags?.map(t => (
            <span key={t} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
