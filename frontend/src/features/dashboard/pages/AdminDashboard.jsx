import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAdminDashboardApi } from "../api/dashboardApi.js";
import api from "../../../utils/api.js";
import {
  Users,
  Code2,
  BarChart3,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  UserCheck,
  FileText,
  TestTube,
  Info,
} from "lucide-react";
import Pagination from "../../../components/Pagination.jsx";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const dashRes = await getAdminDashboardApi();
      console.log("📊 Dashboard data received:", dashRes.data);
      setData(dashRes.data);

      try {
        const usersRes = await api.get("/admin/users", {
          params: { page: userPage, limit: usersPerPage },
        });
        setUsers(usersRes.data.users || []);
        setTotalUsers(usersRes.data.pagination?.total || 0);
      } catch (err) {
        console.warn("Could not fetch users:", err.message);
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userPage]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleBlockUser = async (userId) => {
    if (!confirm("Are you sure you want to toggle this user's status?")) return;
    try {
      setRefreshing(true);
      await api.put(`/admin/users/${userId}/toggle-status`);
      fetchDashboardData();
    } catch (err) {
      console.error("Error toggling user status:", err);
      setError(err.response?.data?.error || "Failed to toggle user status");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 text-lg font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-300 rounded-lg p-6 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-red-700 font-semibold">Error Loading Dashboard</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button onClick={handleRefresh} className="ml-auto px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-600 text-lg">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const stats = data?.dashboard?.stats || {};
  const usersByRole = data?.dashboard?.usersByRole || {};
  const problemsByDifficulty = data?.dashboard?.problemsByDifficulty || {};
  const submissionsByVerdict = data?.dashboard?.submissionsByVerdict || [];
  const popularProblems = data?.dashboard?.popularProblems || [];
  const userGrowth = data?.dashboard?.userGrowth || [];
  const languageStats = data?.dashboard?.languageStats || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
            </div>
            <p className="text-slate-600">
              Welcome back, <span className="font-semibold">{currentUser?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              {!refreshing && "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-blue-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600 text-white rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Users</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{stats.totalUsers || 0}</p>
            <p className="text-xs text-slate-500 mt-2">All registered users</p>
          </div>

          <div
            onClick={() => navigate("/problems")}
            className="bg-white border border-blue-200 shadow-md hover:shadow-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 text-white rounded-lg">
                <Code2 className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Problems</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{stats.totalProblems || 0}</p>
            <p className="text-xs text-slate-500 mt-2">Listed problems</p>
          </div>

          <div className="bg-white border border-blue-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-400 text-white rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Submissions</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{stats.totalSubmissions || 0}</p>
            <p className="text-xs text-slate-500 mt-2">
              {stats.accuracyRate || 0}% acceptance rate
            </p>
          </div>

          <div className="bg-white border border-blue-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 text-white rounded-lg">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Active Users</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{stats.activeUsers || 0}</p>
            <p className="text-xs text-slate-500 mt-2">Currently active</p>
          </div>
        </div>

        {/* Charts Section - CSS-based visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Problems by Difficulty */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Problems by Difficulty</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700 font-medium">Easy</span>
                  <span className="text-green-600 font-bold">{problemsByDifficulty.Easy || 0}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        stats.totalProblems > 0
                          ? ((problemsByDifficulty.Easy || 0) / stats.totalProblems) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700 font-medium">Medium</span>
                  <span className="text-yellow-600 font-bold">{problemsByDifficulty.Medium || 0}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        stats.totalProblems > 0
                          ? ((problemsByDifficulty.Medium || 0) / stats.totalProblems) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700 font-medium">Hard</span>
                  <span className="text-red-600 font-bold">{problemsByDifficulty.Hard || 0}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        stats.totalProblems > 0
                          ? ((problemsByDifficulty.Hard || 0) / stats.totalProblems) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Verdicts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Top Submission Verdicts</h3>
            <div className="space-y-3">
              {submissionsByVerdict.slice(0, 5).map((verdict, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-700 text-sm font-medium">{verdict.verdict}</span>
                      <span className="text-slate-900 font-bold">{verdict.count}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            stats.totalSubmissions > 0
                              ? (verdict.count / stats.totalSubmissions) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Language Stats */}
        {languageStats.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Popular Programming Languages</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {languageStats.slice(0, 6).map((lang, idx) => (
                <div key={idx} className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-2xl font-bold text-slate-900 mb-1">{lang.count}</p>
                  <p className="text-xs text-slate-600 uppercase font-medium">{lang.language}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Problems Table */}
        {popularProblems.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Most Popular Problems</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="pb-4 text-slate-600 text-left font-semibold">Title</th>
                    <th className="pb-4 text-slate-600 text-left font-semibold">Difficulty</th>
                    <th className="pb-4 text-slate-600 text-left font-semibold">Submissions</th>
                    <th className="pb-4 text-slate-600 text-left font-semibold">Accepted</th>
                    <th className="pb-4 text-slate-600 text-left font-semibold">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {popularProblems.slice(0, 10).map((problem) => (
                    <tr key={problem._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 text-slate-900 font-medium">{problem.title}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            problem.difficulty === "Easy"
                              ? "bg-green-100 text-green-700"
                              : problem.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="py-4 text-slate-700">{problem.submissionCount}</td>
                      <td className="py-4 text-green-600 font-semibold">{problem.acceptedCount}</td>
                      <td className="py-4 text-slate-700">{problem.acceptanceRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Management Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              User Management
            </h2>
            <span className="text-slate-500 text-sm">Total: {totalUsers}</span>
          </div>

          {users.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-4 text-slate-600 text-left font-semibold">Name</th>
                      <th className="pb-4 text-slate-600 text-left font-semibold">Email</th>
                      <th className="pb-4 text-slate-600 text-left font-semibold">Role</th>
                      <th className="pb-4 text-slate-600 text-left font-semibold">Status</th>
                      <th className="pb-4 text-slate-600 text-left font-semibold">Joined</th>
                      <th className="pb-4 text-slate-600 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 text-slate-900 font-medium">{userItem.name}</td>
                        <td className="py-4 text-slate-600">{userItem.email}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              userItem.role === "admin"
                                ? "bg-red-100 text-red-700"
                                : userItem.role === "super-admin"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {userItem.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              userItem.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {userItem.isActive ? "Active" : "Blocked"}
                          </span>
                        </td>
                        <td className="py-4 text-slate-600 text-sm">{new Date(userItem.createdAt).toLocaleDateString()}</td>
                        <td className="py-4">
                          <button
                            onClick={() => handleBlockUser(userItem._id)}
                            disabled={refreshing || !userItem.isActive}
                            className={`px-3 py-1 text-sm rounded-md font-medium ${
                              userItem.isActive
                                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                : "bg-slate-100 text-slate-500 cursor-not-allowed"
                            }`}
                          >
                            {userItem.isActive ? "Block" : "Blocked"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={userPage}
                totalPages={Math.ceil(totalUsers / usersPerPage)}
                totalItems={totalUsers}
                itemsPerPage={usersPerPage}
                onPageChange={setUserPage}
              />
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">No users found</div>
          )}
        </div>

        {/* Admin Notice */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Admin Test Mode
              </h3>
              <p className="text-blue-800 mb-3">As an admin, you can test the code editor and solve problems, but:</p>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Your submissions will be marked as <strong>"Test Runs"</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Your stats <strong>will NOT be counted</strong> in rankings
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  You <strong>will NOT appear</strong> on the leaderboard
                </li>
              </ul>
            </div>
            <button onClick={() => navigate("/problems")} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors whitespace-nowrap">
              Test Editor →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}