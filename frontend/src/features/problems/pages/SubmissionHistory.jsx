import { useEffect, useState } from "react";
import { getSubmissionHistoryApi } from "../api/submissionApi";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from "lucide-react";

export default function SubmissionHistory() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSubmissionHistoryApi({ limit: 50 });
            setSubmissions(response.data.submissions || []);
        } catch (err) {
            console.error("Failed to fetch submissions:", err);
            setError(err.response?.data?.error || "Failed to load submission history");
        } finally {
            setLoading(false);
        }
    };

    const getVerdictIcon = (verdict) => {
        if (verdict === "Accepted") return <CheckCircle className="w-5 h-5 text-green-600" />;
        if (verdict === "Pending") return <Clock className="w-5 h-5 text-yellow-600" />;
        if (verdict === "Compilation Error" || verdict === "Runtime Error")
            return <AlertTriangle className="w-5 h-5 text-red-600" />;
        return <XCircle className="w-5 h-5 text-red-600" />;
    };

    const getVerdictColor = (verdict) => {
        if (verdict === "Accepted") return "bg-green-100 text-green-700";
        if (verdict === "Pending") return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-700 font-medium">Loading submissions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100 p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-100 border border-red-300 rounded-lg p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            <div>
                                <p className="text-red-700 font-semibold">Error Loading Submissions</p>
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchSubmissions}
                            className="px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Submission History</h1>
                        <p className="text-slate-600">Track all your code submissions and results</p>
                    </div>
                    <button
                        onClick={fetchSubmissions}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Refresh
                    </button>
                </div>

                {/* Submissions Table */}
                {submissions.length > 0 ? (
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                            Problem
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                            Language
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                            Verdict
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                            Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                            Memory
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                            Submitted
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((submission) => (
                                        <tr
                                            key={submission._id}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                        >
                                            {/* Problem */}
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/problems/${submission.problemId?.slug || submission.problemId?._id}`}
                                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    {submission.problemId?.title || "Unknown Problem"}
                                                </Link>
                                            </td>

                                            {/* Language */}
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                                    {submission.language.toUpperCase()}
                                                </span>
                                            </td>

                                            {/* Verdict */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getVerdictIcon(submission.verdict)}
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getVerdictColor(
                                                            submission.verdict
                                                        )}`}
                                                    >
                                                        {submission.verdict}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Execution Time */}
                                            <td className="px-6 py-4 text-slate-700 text-sm">
                                                {submission.executionTime || "—"}
                                            </td>

                                            {/* Memory Used */}
                                            <td className="px-6 py-4 text-slate-700 text-sm">
                                                {submission.memoryUsed || "—"}
                                            </td>

                                            {/* Timestamp */}
                                            <td className="px-6 py-4 text-slate-600 text-sm">
                                                {new Date(submission.createdAt).toLocaleString()}
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/submissions/${submission._id}`}
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    View Details →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center">
                        <p className="text-slate-500 text-lg font-medium mb-2">No submissions yet</p>
                        <p className="text-slate-400 text-sm mb-6">
                            Start solving problems to see your submission history here
                        </p>
                        <Link
                            to="/problems"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Browse Problems →
                        </Link>
                    </div>
                )}

                {/* Summary Stats */}
                {submissions.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Total Submissions</p>
                            <p className="text-3xl font-bold text-slate-900">{submissions.length}</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Accepted</p>
                            <p className="text-3xl font-bold text-green-600">
                                {submissions.filter((s) => s.verdict === "Accepted").length}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Wrong Answer</p>
                            <p className="text-3xl font-bold text-red-600">
                                {submissions.filter((s) => s.verdict === "Wrong Answer").length}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Accuracy</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {submissions.length > 0
                                    ? (
                                        (submissions.filter((s) => s.verdict === "Accepted").length /
                                            submissions.length) *
                                        100
                                    ).toFixed(1)
                                    : 0}
                                %
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}