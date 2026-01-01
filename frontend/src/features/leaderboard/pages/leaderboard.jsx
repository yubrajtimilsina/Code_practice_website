import { useEffect, useState, useCallback } from "react";
import { getLeaderboardApi, getMyRankApi } from "../api/leaderboardApi.js";
import { Trophy, Medal, Award, TrendingUp, Zap, Target, RefreshCw, Shield, Info, Filter, Search, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import Pagination from "../../../components/Pagination";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);

    // Pagination & Filter State
    const [sortBy, setSortBy] = useState('rankPoints');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [pagination, setPagination] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        const params = {
            page,
            limit,
            sortBy
        };

        // Add search if present
        if (searchQuery.trim()) {
            params.search = searchQuery.trim();
        }

        const [leaderboardRes, rankRes] = await Promise.all([
            getLeaderboardApi(params),
            !isAdmin ? getMyRankApi().catch(() => null) : Promise.resolve(null)
        ]);

        setLeaderboard(leaderboardRes.data.leaderboard);
        setPagination(leaderboardRes.data.pagination);
        if (rankRes && !isAdmin) setMyRank(rankRes.data);
        setLoading(false);
    }, [page, limit, sortBy, searchQuery, isAdmin]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setPage(1); // Reset to first page when sort changes
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when limit changes
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
        return <span className="text-slate-600 font-bold">#{rank}</span>;
    };

    const getRankBadgeColor = (rank) => {
        if (rank === 1) return "bg-yellow-100 text-yellow-700 border-yellow-300";
        if (rank === 2) return "bg-gray-100 text-gray-700 border-gray-300";
        if (rank === 3) return "bg-orange-100 text-orange-700 border-orange-300";
        if (rank <= 10) return "bg-blue-100 text-blue-700 border-blue-300";
        return "bg-slate-100 text-slate-700 border-slate-300";
    };

    const LeaderboardSkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="px-6 py-4">
                <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                    <div>
                        <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 w-28 bg-slate-200 rounded"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 w-16 bg-slate-200 rounded"></div>
            </td>
        </tr>
    );


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
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            <Trophy className="w-10 h-10 text-blue-600" />
                            Global Leaderboard
                        </h1>
                        <p className="text-slate-600">
                            Compete with {pagination?.total || 0} programmers worldwide
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        <button
                            onClick={fetchLeaderboard}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* ADMIN NOTICE */}
                {isAdmin && (
                    <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-600 rounded-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
                                    <Info className="w-5 h-5" />
                                    Admin Viewing Mode
                                </h3>
                                <p className="text-amber-800">
                                    You are viewing the leaderboard as an administrator.
                                    <strong> Admins are not ranked</strong> to ensure fair competition for learners.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* My Rank Card - ONLY FOR LEARNERS */}
                {!isAdmin && myRank && myRank.rank && (
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 mb-8 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Your Rank</p>
                                <div className="flex items-center gap-3">
                                    <p className="text-4xl font-bold">#{myRank.rank}</p>
                                    {myRank.rank <= 3 && getRankBadge(myRank.rank)}
                                </div>
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

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Search Users
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by name or email..."
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="rankPoints">Rank Points</option>
                                    <option value="solved">Problems Solved</option>
                                    <option value="accuracy">Accuracy</option>
                                    <option value="streak">Current Streak</option>
                                </select>
                            </div>

                            {/* Items Per Page */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Items Per Page
                                </label>
                                <select
                                    value={limit}
                                    onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="10">10 per page</option>
                                    <option value="25">25 per page</option>
                                    <option value="50">50 per page</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Sort Buttons */}
                <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-200">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-slate-700 font-medium">Quick Sort:</span>
                        {[
                            { value: 'rankPoints', label: 'Rank Points', icon: TrendingUp },
                            { value: 'solved', label: 'Problems Solved', icon: Target },
                            { value: 'accuracy', label: 'Accuracy', icon: Zap },
                            { value: 'streak', label: 'Streak', icon: Award }
                        ].map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleSortChange(option.value)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${sortBy === option.value
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                <option.icon className="w-4 h-4" />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Leaderboard Table */}
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
                                {loading
                                    ? [...Array(limit)].map((_, i) => <LeaderboardSkeletonRow key={i} />)
                                    : leaderboard.map((userItem) => (
                                        <tr
                                            key={userItem._id}
                                            className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${!isAdmin && myRank && userItem._id === myRank.userId ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getRankBadgeColor(userItem.rank)}`}>
                                                    {getRankBadge(userItem.rank)}
                                                    {userItem.rank <= 10 && (
                                                        <span className="text-xs font-semibold">TOP {userItem.rank}</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                                                        {userItem.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{userItem.name}</p>
                                                        <p className="text-sm text-slate-500">{userItem.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                    {userItem.rankPoints}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-900">{userItem.solvedProblemsCount}</span>
                                                    <div className="flex gap-1 text-xs">
                                                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">{userItem.easyProblemsSolved}E</span>
                                                        <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">{userItem.mediumProblemsSolved}M</span>
                                                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded">{userItem.hardProblemsSolved}H</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-700 font-medium">{userItem.accuracy}%</span>
                                                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500 rounded-full"
                                                            style={{ width: `${Math.min(userItem.accuracy, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-red-700 font-bold">{userItem.currentStreak}</span>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {pagination && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                        totalItems={pagination.total}
                        itemsPerPage={limit}
                        onPageChange={handlePageChange}
                    />
                )}

                {/* Stats Summary */}
                {leaderboard.length > 0 && pagination && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Total Ranked Users</p>
                            <p className="text-3xl font-bold text-slate-900">{pagination.total}</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Current Page</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {pagination.page} / {pagination.pages}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Viewing</p>
                            <p className="text-3xl font-bold text-green-600">{leaderboard.length}</p>
                            <p className="text-xs text-slate-500 mt-1">users on this page</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-slate-600 text-sm mb-2">Sort Method</p>
                            <p className="text-xl font-bold text-purple-600 capitalize">
                                {sortBy.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}