import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblem } from "../api/problemApi";
import { runCodeApi, submitSolutionApi, saveDraftApi } from "../api/submissionApi";
import CodeEditor from "../components/CodeEditor";
import { AlertCircle, CheckCircle, Loader, Code2, Clock } from "lucide-react";

export default function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const loadProblem = async () => {
      setLoading(true);
      try {
        const { data } = await getProblem(id);
        console.log("Loaded problem:", data);
        setProblem(data);
        setIsSolved(false);
      } catch (err) {
        console.error("Failed to load problem:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [id]);

  const handleRunCode = async (codeData) => {
    try {
      const response = await runCodeApi({
        code: codeData.code,
        language: codeData.language,
        problemId: problem._id,
      });
      return response.data.submission;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to run code");
    }
  };

  const handleSubmitCode = async (codeData) => {
    try {
      await saveDraftApi(problem._id, {
        code: codeData.code,
        language: codeData.language,
      });

      const response = await submitSolutionApi({
        code: codeData.code,
        language: codeData.language,
        problemId: problem._id,
      });
      
      setSubmission(response.data.submission);
      
      if (response.data.submission.isAccepted) {
        setIsSolved(true);
      }
      
      return response.data.submission;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to submit code");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-blue-700 font-medium">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-semibold text-lg">Problem not found</p>
        </div>
      </div>
    );
  }

  if (showEditor) {
    // FIXED: Log what we're passing to CodeEditor
    console.log("Passing to CodeEditor:");
    console.log("Examples:", problem.examples);
    console.log("Constraints:", problem.constraints);
    
    return (
      <CodeEditor
        problemId={problem._id}
        problemTitle={problem.title}
        problemDescription={problem.description}
        problemDifficulty={problem.difficulty}
        problemExamples={problem.examples || []}
        problemConstraints={problem.constraints || []}
        problemTopics={problem.tags || []}
        sampleInput={problem.sampleInput}
        sampleOutput={problem.sampleOutput}
        onRun={handleRunCode}
        onSubmit={handleSubmitCode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {problem.title}
              </h1>
              <p className="text-slate-600">Problem ID: {problem._id}</p>
            </div>
            <div className="flex items-center gap-2">
              {isSolved && (
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Solved
                </div>
              )}
              <span
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  problem.difficulty === "Hard"
                    ? "bg-red-100 text-red-700"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
          </div>

          {/* Constraints */}
          <div className="flex gap-6 text-sm text-slate-600 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">Time Limit:</span> {problem.timeLimitSec}s
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span className="font-semibold">Memory Limit:</span> {problem.memoryLimitMB}MB
            </div>
          </div>

          {/* Tags */}
          {problem.tags && problem.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Description</h2>
          <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">
            {problem.description}
          </div>
        </div>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Examples</h2>
            <div className="space-y-4">
              {problem.examples.map((example, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-600 mb-2">Example {idx + 1}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-slate-700">Input: </span>
                      <pre className="inline bg-white px-2 py-1 rounded text-sm font-mono">{example.input}</pre>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Output: </span>
                      <pre className="inline bg-white px-2 py-1 rounded text-sm font-mono">{example.output}</pre>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="font-semibold text-slate-700">Explanation: </span>
                        <span className="text-slate-600">{example.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Constraints</h2>
            <ul className="space-y-2">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-slate-700 font-mono text-sm">{constraint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sample Input/Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Sample Input</h3>
            <pre className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-64">
              {problem.sampleInput || "—"}
            </pre>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Sample Output</h3>
            <pre className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-64">
              {problem.sampleOutput || "—"}
            </pre>
          </div>
        </div>

        {/* Hints */}
        {problem.hints && problem.hints.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Hints 💡</h2>
            <ul className="space-y-2">
              {problem.hints.map((hint, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">💡</span>
                  <span className="text-slate-700">{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submission History */}
        {submission && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Last Submission</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span
                  className={`font-semibold ${
                    submission.isAccepted ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {submission.verdict}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Language:</span>
                <span className="font-semibold">{submission.language.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Execution Time:</span>
                <span className="font-semibold">{submission.executionTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Memory Used:</span>
                <span className="font-semibold">{submission.memoryUsed}</span>
              </div>
            </div>
          </div>
        )}

        {/* Start Coding Button */}
        <button
          onClick={() => setShowEditor(true)}
          className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          Start Coding →
        </button>
      </div>
    </div>
  );
}