import { useEffect, useState } from "react";
import { getMyProgressApi } from "../api/leaderboardApi.js";
import { TrendingUp, Target, Code2, Zap, Calendar, Award, BarChart3, Activity, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Progress() {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            setLoading(true);
            const response = await getMyProgressApi();
            setProgress(response.data);
        } catch (error) {
            console.error("Failed to fetch progress:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!progress) {
        return <div className="min-h-screen bg-slate-100 p-6">Error loading progress</div>;
    }

    const { user, problemsByDifficulty, languageStats, verdictStats, recentActivity, activityCalendar } = progress;
    const totalVerdict = Object.values(verdictStats).reduce((a, b) => a + b, 0);
    const verdictPercentages = Object.entries(verdictStats).map(([verdict, count]) => ({
        verdict,
        count,
        percentage: totalVerdict > 0 ? ((count / totalVerdict) * 100).toFixed(1) : 0
    })).sort((a, b) => b.count - a.count);

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

                    {/* Solved Problems */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Target className="w-6 h-6 text-blue-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-slate-600 text-sm mb-1">Problems Solved</p>
                        <p className="text-4xl font-bold text-slate-900">{user.solvedProblems}</p>
                    </div>

                    {/* Accuracy */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Zap className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-1">Accuracy Rate</p>
                        <p className="text-4xl font-bold text-slate-900">{user.accuracy}%</p>
                        <p className="text-xs text-slate-500 mt-1">{user.acceptedSubmissions}/{user.totalSubmissions} accepted</p>
                    </div>

                    {/* Rank Points */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Award className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-1">Rank Points</p>
                        <p className="text-4xl font-bold text-slate-900">{user.rankPoints}</p>
                    </div>

                    {/* Current Streak */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Activity className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-1">Current Streak</p>
                        <p className="text-4xl font-bold text-slate-900">{user.currentStreak} 🔥</p>
                        <p className="text-xs text-slate-500 mt-1">Longest: {user.longestStreak} days</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

             
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Problems by Difficulty</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-green-600 font-semibold">Easy</span>
                                    <span className="text-slate-700 font-semibold">{problemsByDifficulty.easy}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-3">
                                    <div
                                        className="bg-green-500 h-3 rounded-full transition-all"
                                        style={{ width: `${problemsByDifficulty.easy > 0 ? (problemsByDifficulty.easy / user.solvedProblems * 100) : 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-yellow-600 font-semibold">Medium</span>
                                    <span className="text-slate-700 font-semibold">{problemsByDifficulty.medium}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-3">
                                    <div
                                        className="bg-yellow-500 h-3 rounded-full transition-all"
                                        style={{ width: `${problemsByDifficulty.medium > 0 ? (problemsByDifficulty.medium / user.solvedProblems * 100) : 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-red-600 font-semibold">Hard</span>
                                    <span className="text-slate-700 font-semibold">{problemsByDifficulty.hard}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-3">
                                    <div
                                        className="bg-red-500 h-3 rounded-full transition-all"
                                        style={{ width: `${problemsByDifficulty.hard > 0 ? (problemsByDifficulty.hard / user.solvedProblems * 100) : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                   
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Language Usage</h3>
                        <div className="space-y-3">
                            {Object.entries(languageStats).slice(0, 5).map(([lang, count]) => (
                                <div key={lang} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Code2 className="w-4 h-4 text-blue-600" />
                                        <span className="text-slate-700 font-medium capitalize">{lang}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

             
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Submission Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {verdictPercentages.map(({ verdict, count, percentage }) => {
                            const getVerdictColor = (v) => {
                                if (v === 'Accepted') return 'bg-green-100 text-green-700 border-green-200';
                                if (v === 'Wrong Answer') return 'bg-red-100 text-red-700 border-red-200';
                                if (v === 'Time Limit Exceeded') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                                return 'bg-slate-100 text-slate-700 border-slate-200';
                            };

                            const getIcon = (v) => {
                                if (v === 'Accepted') return <CheckCircle className="w-5 h-5" />;
                                if (v === 'Wrong Answer') return <XCircle className="w-5 h-5" />;
                                if (v === 'Time Limit Exceeded') return <Clock className="w-5 h-5" />;
                                return <Activity className="w-5 h-5" />;
                            };

                            return (
                                <div key={verdict} className={`p-4 rounded-xl border-2 ${getVerdictColor(verdict)}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {getIcon(verdict)}
                                        <span className="font-semibold text-sm">{verdict}</span>
                                    </div>
                                    <p className="text-2xl font-bold">{count}</p>
                                    <p className="text-xs mt-1">{percentage}%</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

           
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        Recent Activity (Last 30 Days)
                    </h3>
                    <p className="text-slate-600 mb-4">
                        You made <span className="font-bold text-blue-600">{recentActivity.last30Days}</span> submissions in the last 30 days
                    </p>

                    
                    <div className="grid grid-cols-10 gap-1">
                        {Object.entries(activityCalendar).slice(-90).map(([date, count]) => (
                            <div
                                key={date}
                                title={`${date}: ${count} submissions`}
                                className={`w-full aspect-square rounded ${count === 0 ? 'bg-slate-100' :
                                        count <= 2 ? 'bg-green-200' :
                                            count <= 5 ? 'bg-green-400' :
                                                'bg-green-600'
                                    }`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}