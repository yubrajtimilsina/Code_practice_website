import { useEffect, useState, useCallback } from "react";
import { getLeaderboardApi, getMyRankApi } from "../api/leaderboardApi.js";
import { Trophy, Medal, Award, TrendingUp, Zap, Target, RefreshCw, Shield, Info } from "lucide-react";
import { useSelector } from "react-redux";
import Pagination from "../../../components/Pagination";
import { TableSkeleton } from "../../../core/Skeleton";
import { LoadingState, ErrorState } from "../../../components/StateComponents";
import { FilterPanel } from "../../../components/FilterPanel";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rankPoints');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [pagination, setPagination] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit, sortBy };
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const [leaderboardRes, rankRes] = await Promise.all([
        getLeaderboardApi(params),
        !isAdmin ? getMyRankApi().catch(() => null) : Promise.resolve(null)
      ]);

      setLeaderboard(leaderboardRes.data.leaderboard);
      setPagination(leaderboardRes.data.pagination);
      if (rankRes && !isAdmin) setMyRank(rankRes.data);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, searchQuery, isAdmin]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const totalPages = Math.ceil(pagination?.total || 0 / limit);

  if (loading && leaderboard.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <LoadingState message="Loading leaderboard..." />
        </div>
      </div>
    );
  }

  const filterOptions = [
    {
      name: 'sortBy',
      label: 'Sort By',
      value: sortBy,
      options: [
        { value: 'rankPoints', label: 'Rank Points' },
        { value: 'solved', label: 'Problems Solved' },
        { value: 'accuracy', label: 'Accuracy' },
        { value: 'streak', label: 'Current Streak' }
      ]
    },
    {
      name: 'limit',
      label: 'Items Per Page',
      value: limit,
      options: [
        { value: '10', label: '10 per page' },
        { value: '25', label: '25 per page' },
        { value: '50', label: '50 per page' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Trophy className="w-10 h-10 text-blue-600" />
              Global Leaderboard
            </h1>
            <p className="text-slate-600">
              Compete with {pagination?.total || 0} programmers worldwide
            </p>
          </div>

          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Admin Notice */}
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

        {/* My Rank Card */}
        {!isAdmin && myRank?.rank && (
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

        {/* Filter Panel */}
        <FilterPanel
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filterOptions}
          onFilterChange={(name, value) => {
            if (name === 'sortBy') setSortBy(value);
            if (name === 'limit') {
              setLimit(parseInt(value));
              setPage(1);
            }
          }}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        >
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
                  onClick={() => setSortBy(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    sortBy === option.value
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
        </FilterPanel>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            {loading ? (
              <TableSkeleton rows={limit} columns={6} />
            ) : leaderboard.length > 0 ? (
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
                  {leaderboard.map((userItem) => (
                    <tr
                      key={userItem._id}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        !isAdmin && myRank && userItem._id === myRank.userId ? 'bg-blue-50' : ''
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
                        <span className="text-red-700 font-bold">{userItem.currentStreak}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-500">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
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