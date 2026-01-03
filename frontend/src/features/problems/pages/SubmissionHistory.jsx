import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Filter, ChevronDown } from "lucide-react";
import { getVerdictIcon, getVerdictColor } from "../../../utils/verdictHelpers.js";
import Pagination from "../../../components/Pagination";
import { TableSkeleton } from "../../../core/Skeleton";
import { ErrorState, EmptyDataState } from "../../../components/StateComponents.jsx";
import { getSubmissionHistoryApi } from "../api/submissionApi";

export default function SubmissionHistory() {
    const [submissions, setSubmissions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const [itemsPerPage] = useState(20);
    const [verdictFilter, setVerdictFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const verdictOptions = ["all", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Compilation Error"];

    useEffect(() => {
        fetchSubmissions();
    }, [currentPage, verdictFilter]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const params = { page: currentPage, limit: itemsPerPage };
            if (verdictFilter !== "all") params.verdict = verdictFilter;
            
            const response = await getSubmissionHistoryApi(params);
            setSubmissions(response.data.submissions || []);
            setTotalSubmissions(response.data.total || 0);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(totalSubmissions / itemsPerPage);
    const acceptedCount = submissions.filter(s => s.verdict === "Accepted").length;
    const wrongCount = submissions.filter(s => s.verdict === "Wrong Answer").length;

    if (loading && submissions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-100 p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
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
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                            onClick={fetchSubmissions}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Filter by Verdict
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {verdictOptions.map(verdict => (
                                <button
                                    key={verdict}
                                    onClick={() => {
                                        setVerdictFilter(verdict);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                        verdictFilter === verdict
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                                >
                                    {verdict === "all" ? "All Submissions" : verdict}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Table */}
                {submissions.length > 0 ? (
                    <>
                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            {["Problem", "Language", "Verdict", "Time", "Memory", "Submitted", "Action"].map(header => (
                                                <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map((submission) => (
                                            <tr
                                                key={submission._id}
                                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <Link
                                                        to={`/problems/${submission.problemId?.slug || submission.problemId?._id}`}
                                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        {submission.problemId?.title || "Unknown Problem"}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                                        {submission.language.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {getVerdictIcon(submission.verdict)}
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getVerdictColor(submission.verdict)}`}>
                                                            {submission.verdict}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-700 text-sm">
                                                    {submission.executionTime || "—"}
                                                </td>
                                                <td className="px-6 py-4 text-slate-700 text-sm">
                                                    {submission.memoryUsed || "—"}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 text-sm">
                                                    {new Date(submission.createdAt).toLocaleString()}
                                                </td>
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

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalSubmissions}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <EmptyDataState
                        title={verdictFilter === "all" ? "No submissions yet" : `No ${verdictFilter} submissions found`}
                        description={verdictFilter === "all" 
                            ? "Start solving problems to see your submission history here"
                            : "Try a different filter or solve more problems"}
                        action={
                            verdictFilter !== "all" ? (
                                <button
                                    onClick={() => setVerdictFilter("all")}
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
                            )
                        }
                    />
                )}

                {/* Stats */}
                {submissions.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Total Submissions</p>
                            <p className="text-3xl font-bold text-slate-900">{totalSubmissions}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Accepted</p>
                            <p className="text-3xl font-bold text-green-600">{acceptedCount}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Wrong Answer</p>
                            <p className="text-3xl font-bold text-red-600">{wrongCount}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Current Page</p>
                            <p className="text-3xl font-bold text-blue-600">{currentPage} / {totalPages}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}