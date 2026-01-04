import { useEffect, useState } from "react";
import { getMyProgressApi } from "../api/leaderboardApi.js";
import { TrendingUp, Target, Code2, Zap, Calendar, Award, BarChart3, Activity, CheckCircle, XCircle, Filter } from "lucide-react";
import { getVerdictIcon, getVerdictColor } from "../../../utils/verdictHelpers.js";
import Pagination from "../../../components/Pagination";
import { ProfileSkeleton } from "../../../core/Skeleton.jsx";
import { FilterPanel } from "../../../components/FilterPanel.jsx";
import { StatCard } from "../../../core/UI.jsx";
import { GitHubStyleCalendar } from "./Activitycalender.jsx";

export default function Progress() {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Pagination
    const [activityPage, setActivityPage] = useState(1);
    const [activityPerPage] = useState(10);
    const [activityFilter, setActivityFilter] = useState("all");

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        setLoading(true);
        const response = await getMyProgressApi();
        const d = response.data || {};
        const u = d.user || {};
        
        const normalizedUser = {
            solvedProblems: u.solvedProblems ?? u.solvedProblemsCount ?? 0,
            accuracy: (u.accuracy !== undefined && u.accuracy !== null)
                ? String(u.accuracy)
                : (u.acceptedSubmissions != null && u.totalSubmissions != null && u.totalSubmissions > 0)
                    ? ((u.acceptedSubmissions / u.totalSubmissions) * 100).toFixed(2)
                    : "0.00",
            acceptedSubmissions: u.acceptedSubmissions ?? u.acceptedSubmissionsCount ?? 0,
            totalSubmissions: u.totalSubmissions ?? u.totalSubmissionsCount ?? 0,
            rankPoints: u.rankPoints ?? 0,
            currentStreak: u.currentStreak ?? 0,
            longestStreak: u.longestStreak ?? 0,
        };

        const normalized = {
            user: normalizedUser,
            problemsByDifficulty: {
                easy: d.problemsByDifficulty?.easy ?? u.easyProblemsSolved ?? 0,
                medium: d.problemsByDifficulty?.medium ?? u.mediumProblemsSolved ?? 0,
                hard: d.problemsByDifficulty?.hard ?? u.hardProblemsSolved ?? 0,
            },
            languageStats: d.languageStats || {},
            verdictStats: d.verdictStats || {},
            recentActivity: d.recentActivity || { last30Days: 0, submissions: [] },
            activityCalendar: d.activityCalendar || {},
        };

        setProgress(normalized);
        setLoading(false);
    };

    if (loading) return <ProfileSkeleton />;
    if (!progress) return null;

    const { user, problemsByDifficulty, languageStats, verdictStats, recentActivity, activityCalendar } = progress;
    
    // Calculate verdict percentages
    const totalVerdict = Object.values(verdictStats).reduce((a, b) => a + b, 0);
    const verdictPercentages = Object.entries(verdictStats)
        .map(([verdict, count]) => ({
            verdict,
            count,
            percentage: totalVerdict > 0 ? ((count / totalVerdict) * 100).toFixed(1) : 0
        }))
        .sort((a, b) => b.count - a.count);

    // Filter submissions
    const filteredSubmissions = recentActivity.submissions.filter(sub => {
        if (activityFilter === "accepted") return sub.isAccepted;
        if (activityFilter === "failed") return !sub.isAccepted;
        return true;
    });

    // Paginate
    const totalActivityPages = Math.ceil(filteredSubmissions.length / activityPerPage);
    const startIdx = (activityPage - 1) * activityPerPage;
    const paginatedSubmissions = filteredSubmissions.slice(startIdx, startIdx + activityPerPage);

    const handleActivityPageChange = (newPage) => {
        setActivityPage(newPage);
        document.getElementById('recent-activity')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        <BarChart3 className="w-10 h-10 text-blue-600" />
                        My Progress
                    </h1>
                    <p className="text-slate-600">Track your coding journey and achievements</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={Target} label="Problems Solved" value={user.solvedProblems} color="blue" />
                    <StatCard 
                        icon={Zap} 
                        label="Accuracy Rate" 
                        value={`${user.accuracy}%`}
                        subtitle={`${user.acceptedSubmissions}/${user.totalSubmissions} accepted`}
                        color="green" 
                    />
                    <StatCard icon={Award} label="Rank Points" value={user.rankPoints} color="yellow" />
                    <StatCard 
                        icon={Activity} 
                        label="Current Streak" 
                        value={user.currentStreak}
                        subtitle={`Longest: ${user.longestStreak} days`}
                        color="orange" 
                    />
                </div>

                {/* Problems & Languages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Problems by Difficulty */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-green-500" />
                            Problems by Difficulty
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(problemsByDifficulty).map(([difficulty, count]) => {
                                const colors = {
                                    easy: 'bg-green-500',
                                    medium: 'bg-yellow-500',
                                    hard: 'bg-red-500'
                                };
                                const totalSolved = Math.max(user.solvedProblems, 1);
                                const percentage = (count / totalSolved) * 100;
                                
                                return (
                                    <div key={difficulty}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-slate-600 capitalize">{difficulty}</span>
                                            <span className="text-slate-700 font-semibold">{count}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`${colors[difficulty]} h-full rounded-full transition-all`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Language Usage */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Code2 className="w-6 h-6 text-blue-500" />
                            Language Usage
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(languageStats).slice(0, 5).map(([lang, count]) => (
                                <div key={lang}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-slate-600">{lang.toUpperCase()}</span>
                                        <span className="text-slate-700 font-semibold">{count}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-full rounded-full"
                                            style={{
                                                width: `${user.totalSubmissions > 0
                                                    ? (count / user.totalSubmissions) * 100
                                                    : 0
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submission Statistics */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Submission Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {verdictPercentages.map(({ verdict, count, percentage }) => (
                            <div key={verdict} className={`p-4 rounded-xl border-2 ${getVerdictColor(verdict)}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {getVerdictIcon(verdict)}
                                    <span className="font-semibold text-sm">{verdict}</span>
                                </div>
                                <p className="text-2xl font-bold">{count}</p>
                                <p className="text-xs mt-1">{percentage}%</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div id="recent-activity" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-blue-600" />
                            Recent Activity (Last 30 Days)
                        </h3>
                    </div>
                    <p className="text-slate-600 mb-4">
                        You made <span className="font-bold text-blue-600">{recentActivity.last30Days}</span> submissions
                    </p>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 mb-4">
                        {["all", "accepted", "failed"].map(filter => (
                            <button
                                key={filter}
                                onClick={() => {
                                    setActivityFilter(filter);
                                    setActivityPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                    activityFilter === filter
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Submissions List */}
                    {paginatedSubmissions.length > 0 ? (
                        <>
                            <div className="space-y-2 mb-4">
                                {paginatedSubmissions.map((sub, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            {sub.isAccepted ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {sub.problemId?.title || 'Problem'}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {sub.language} • {new Date(sub.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            sub.isAccepted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {sub.verdict}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {totalActivityPages > 1 && (
                                <Pagination
                                    currentPage={activityPage}
                                    totalPages={totalActivityPages}
                                    totalItems={filteredSubmissions.length}
                                    itemsPerPage={activityPerPage}
                                    onPageChange={handleActivityPageChange}
                                />
                            )}
                        </>
                    ) : (
                        <p className="text-center text-slate-500 py-8">No submissions found for selected filter</p>
                    )}
                </div>

                {/* Activity Calendar */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        Activity Calendar
                    </h3>
                    <GitHubStyleCalendar activityCalendar={activityCalendar} />
                </div>
            </div>
        </div>
    );
}