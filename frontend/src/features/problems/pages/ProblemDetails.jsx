import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblem } from "../api/problemApi";

export default function ProblemDetails() {
  const { id } = useParams(); // slug or id
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getProblem(id);
        setProblem(data);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-blue-700">Loading problem...</p>
      </div>
    );
  }
  if (!problem) return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <p className="text-red-600 font-semibold text-lg">Problem not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{problem.title}</h1>
        <span className={`px-4 py-1 rounded-full text-sm font-medium ${
          problem.difficulty === "Hard" ? "bg-red-100 text-red-700" :
          problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
          "bg-green-100 text-green-700"
        }`}>
          {problem.difficulty}
        </span>

        <div className="mt-6 text-slate-700 leading-relaxed prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: problem.description }} />
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Sample Input</h3>
            <pre className="bg-slate-200 p-4 rounded-md text-slate-800 font-mono text-sm whitespace-pre-wrap">{problem.sampleInput || "—"}</pre>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Sample Output</h3>
            <pre className="bg-slate-200 p-4 rounded-md text-slate-800 font-mono text-sm whitespace-pre-wrap">{problem.sampleOutput || "—"}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
