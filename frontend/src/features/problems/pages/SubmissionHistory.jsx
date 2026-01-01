import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Filter } from "lucide-react";
import { getVerdictIcon, getVerdictColor } from "../../../utils/verdictHelpers.js";
import Pagination from "../../../components/Pagination";
import { TableSkeleton, PageHeaderSkeleton } from "../../../core/Skeleton";
import { ErrorState, LoadingState, EmptyDataState } from "../../../components/StateComponents.jsx";
import { getSubmissionHistoryApi } from "../api/submissionApi";

 

export default function SubmissionHistory() {
    const [submissions, setSubmissions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const [itemsPerPage] = useState(20);
    const [verdictFilter, setVerdictFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoading(true);
                const params = { page: currentPage, limit: itemsPerPage };
                if (verdictFilter !== "all") {
                    params.verdict = verdictFilter;
                }
                const response = await getSubmissionHistoryApi(params);
                setSubmissions(response.data.submissions || []);
                setTotalSubmissions(response.data.total || response.data.submissions?.length || 0);
            } catch (err) {
                setError(err.message || "Failed to load submissions");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [currentPage, verdictFilter, itemsPerPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleVerdictFilterChange = (verdict) => {
        setVerdictFilter(verdict);
        setCurrentPage(1);
    };

    const handleRefresh = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.reload();
    };

    const totalPages = Math.ceil(totalSubmissions / itemsPerPage);

    if (loading && submissions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-100 p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <PageHeaderSkeleton />
                    <TableSkeleton rows={10} columns={7} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100 p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <ErrorState message={error} onRetry={fetchSubmissions} />
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
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Verdict Filters */}
                <div className="mb-6 flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Filter className="w-5 h-5" />
                        Filter by verdict:
                    </div>
                    {["all", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Compilation Error"].map(verdict => (
                        <button
                            key={verdict}
                            onClick={() => handleVerdictFilterChange(verdict)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                verdictFilter === verdict
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            {verdict === "all" ? "All Submissions" : verdict}
                        </button>
                    ))}
                </div>

                {/* Submissions Table */}
                {submissions.length > 0 ? (
                    <>
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

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalSubmissions}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center">
                        <p className="text-slate-500 text-lg font-medium mb-2">
                            {verdictFilter === "all" ? "No submissions yet" : `No ${verdictFilter} submissions found`}
                        </p>
                        <p className="text-slate-400 text-sm mb-6">
                            {verdictFilter === "all" 
                                ? "Start solving problems to see your submission history here"
                                : "Try a different filter or solve more problems"}
                        </p>
                        {verdictFilter !== "all" ? (
                            <button
                                onClick={() => handleVerdictFilterChange("all")}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                View All Submissions
                            </button>
                        ) : (
                            <Link
                                to="/problems"
                                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Browse Problems →
                            </Link>
                        )}
                    </div>
                )}

                {/* Summary Stats */}
                {submissions.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Total Submissions</p>
                            <p className="text-3xl font-bold text-slate-900">{totalSubmissions}</p>
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
                            <p className="text-slate-600 text-sm mb-2">Current Page</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {currentPage} / {totalPages}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}