import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../utils/api";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Code2, 
  Calendar,
  ArrowLeft,
  Copy
} from "lucide-react";

export default function SubmissionDetails() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissionDetails();
  }, [submissionId]);

  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/submissions/${submissionId}`);
      setSubmission(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch submission:", err);
      setError(err.response?.data?.error || "Failed to load submission details");
    } finally {
      setLoading(false);
    }
  };

  const getVerdictIcon = (verdict) => {
    if (verdict === "Accepted") return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (verdict === "Pending") return <Clock className="w-6 h-6 text-yellow-600" />;
    if (verdict === "Compilation Error" || verdict === "Runtime Error")
      return <AlertTriangle className="w-6 h-6 text-red-600" />;
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  const getVerdictColor = (verdict) => {
    if (verdict === "Accepted") return "bg-green-100 text-green-700 border-green-300";
    if (verdict === "Pending") return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-red-100 text-red-700 border-red-300";
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-300 rounded-lg p-6 flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-red-700 font-semibold">Error Loading Submission</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => navigate("/submissions")}
              className="ml-auto px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded"
            >
              Back to History
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600 text-lg">Submission not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/submissions")}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Submission Details</h1>
            <p className="text-slate-600 text-sm">ID: {submission._id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Submission Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Verdict Card */}
            <div className={`border rounded-2xl p-6 shadow-sm ${getVerdictColor(submission.verdict)}`}>
              <div className="flex items-center gap-3 mb-4">
                {getVerdictIcon(submission.verdict)}
                <h2 className="text-xl font-bold">{submission.verdict}</h2>
              </div>
              {submission.isAccepted && (
                <p className="text-sm font-medium">🎉 Congratulations! Your solution passed all test cases.</p>
              )}
            </div>

            {/* Problem Info */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Problem</h3>
              <Link
                to={`/problems/${submission.problemId?.slug || submission.problemId?._id}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-lg"
              >
                {submission.problemId?.title || "Unknown Problem"}
              </Link>
            </div>

            {/* Stats */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Language</span>
                  <span className="font-semibold text-slate-900">{submission.language.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Execution Time</span>
                  <span className="font-semibold text-slate-900">{submission.executionTime || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Memory Used</span>
                  <span className="font-semibold text-slate-900">{submission.memoryUsed || "—"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Submitted</span>
                  <div className="flex items-center gap-2 text-slate-900">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{new Date(submission.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Code and Output */}
          <div className="lg:col-span-2 space-y-6">
            {/* Code */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Your Code</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(submission.code)}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded flex items-center gap-2 text-sm transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <div className="p-6">
                <pre className="bg-slate-50 p-4 rounded-lg border border-slate-200 overflow-x-auto">
                  <code className="text-sm font-mono text-slate-800">{submission.code}</code>
                </pre>
              </div>
            </div>

            {/* Output/Error Section */}
            {submission.output && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Output</h3>
                <pre className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm font-mono text-slate-800 whitespace-pre-wrap overflow-x-auto">
                  {submission.output}
                </pre>
              </div>
            )}

            {/* Expected Output (if wrong answer) */}
            {submission.expectedOutput && submission.verdict === "Wrong Answer" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Expected Output</h3>
                <pre className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm font-mono text-slate-800 whitespace-pre-wrap overflow-x-auto">
                  {submission.expectedOutput}
                </pre>
              </div>
            )}

            {/* Compilation Error */}
            {submission.compilationError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Compilation Error
                </h3>
                <pre className="bg-white p-4 rounded-lg border border-red-300 text-sm font-mono text-red-700 whitespace-pre-wrap overflow-x-auto">
                  {submission.compilationError}
                </pre>
              </div>
            )}

            {/* Runtime Error */}
            {submission.stderr && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Runtime Error
                </h3>
                <pre className="bg-white p-4 rounded-lg border border-red-300 text-sm font-mono text-red-700 whitespace-pre-wrap overflow-x-auto">
                  {submission.stderr}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => navigate(`/problems/${submission.problemId?.slug || submission.problemId?._id}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/submissions")}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
          >
            View All Submissions
          </button>
        </div>
      </div>
    </div>
  );
}