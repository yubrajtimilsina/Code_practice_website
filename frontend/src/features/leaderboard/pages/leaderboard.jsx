import { useEffect, useState } from "react";
import { getLeaderboardApi, getMyRankApi } from "../api/leaderboardApi.js";

import { Trophy, Medal, Award, TrendingUp, Zap, Target, RefreshCw } from "lucide-react";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('rankPoints');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const [leaderboardRes, rankRes] = await Promise.all([
                getLeaderboardApi({ page, limit: 50, sortBy }),
                getMyRankApi().catch(() => null)
            ]);

            setLeaderboard(leaderboardRes.data.leaderboard);
            setPagination(leaderboardRes.data.pagination);
            if (rankRes) setMyRank(rankRes.data);
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [page, sortBy]);

    const getRankBadge = (rank) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
        return <span className="text-slate-600 font-bold">#{rank}</span>;
    };

    if (loading && leaderboard.length === 0) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-700 font-medium">Loading leaderboard...</p>
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
                        <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            <Trophy className="w-10 h-10 text-blue-600" />
                            Global Leaderboard
                        </h1>
                        <p className="text-slate-600">Compete with programmers worldwide</p>
                    </div>

                    <button
                        onClick={fetchLeaderboard}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
                {myRank && (
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 mb-8 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Your Rank</p>
                                <p className="text-4xl font-bold">#{myRank.rank}</p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Rank Points</p>
                                <p className="text-3xl font-bold">{myRank.rankPoints}</p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Problems Solved</p>
                                <p className="text-3xl font-bold">{myRank.solvedProblems}</p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Top Percentile</p>
                                <p className="text-3xl font-bold">{myRank.percentile}%</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3">
                        <span className="text-slate-700 font-medium">Sort by:</span>
                        {[
                            { value: 'rankPoints', label: 'Rank Points', icon: TrendingUp },
                            { value: 'solved', label: 'Problems Solved', icon: Target },
                            { value: 'accuracy', label: 'Accuracy', icon: Zap },
                            { value: 'streak', label: 'Streak', icon: Award }
                        ].map(option => (
                            <button
                                key={option.value}
                                onClick={() => setSortBy(option.value)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${sortBy === option.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                <option.icon className="w-4 h-4" />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Rank</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Rank Points</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Solved</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Accuracy</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Streak</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${myRank && user._id === myRank.userId ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        {/* Rank */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getRankBadge(user.rank)}
                                            </div>
                                        </td>

                                        {/* User */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{user.name}</p>
                                                <p className="text-sm text-slate-500">{user.email}</p>
                                            </div>
                                        </td>

                                        {/* Rank Points */}
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                {user.rankPoints}
                                            </span>
                                        </td>

                                        {/* Problems Solved */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900">{user.solvedProblemsCount}</span>
                                                <div className="flex gap-1 text-xs">
                                                    <span className="text-green-600">{user.easyProblemsSolved}E</span>
                                                    <span className="text-yellow-600">{user.mediumProblemsSolved}M</span>
                                                    <span className="text-red-600">{user.hardProblemsSolved}H</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Accuracy */}
                                        <td className="px-6 py-4">
                                            <span className="text-slate-700 font-medium">{user.accuracy}%</span>
                                        </td>

                                        {/* Streak */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <span className="text-orange-600 font-bold">{user.currentStreak}</span>
                                                <span className="text-slate-500 text-sm">🔥</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                const pageNum = page <= 3 ? i + 1 : page - 2 + i;
                                if (pageNum > pagination.pages) return null;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`px-4 py-2 rounded-lg font-semibold ${page === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white border border-slate-200 text-slate-700'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                            disabled={page === pagination.pages}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>

        </div>
    );

}