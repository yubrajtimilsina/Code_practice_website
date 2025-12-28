import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api.js";
import { DashboardSkeleton } from "../loading/DasbboardSkeleton.jsx";
import {
  Shield,
  Users,
  Code2,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  BarChart3,
  UserCheck,
  Crown,
  Zap,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Award,
  Flame
} from "lucide-react";

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, admins, users, analytics

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  // Pagination state for users
  const [userPage, setUserPage] = useState(1);
  const [usersPagination, setUsersPagination] = useState(null);

  const fetchAllData = async () => {
    setRefreshing(true);
    setError(null);

    const dashRes = await api.get("/super-admin/dashboard");
    setData(dashRes.data);

    const adminsRes = await api.get("/super-admin/manage-admins");
    setAdmins(adminsRes.data.admins || []);

    const usersRes = await api.get("/super-admin/users", {
      params: { page: userPage, limit: 20 }
    });
    setAllUsers(usersRes.data.users || []);
    setUsersPagination(usersRes.data.pagination);

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAllData();
  }, [userPage]);

  const handleRefresh = () => {
    fetchAllData();
  };

  const handleSetAdmin = async (userId) => {
    if (!confirm("Are you sure you want to make this user an admin?")) return;
    setRefreshing(true);
    await api.put(`/super-admin/${userId}/set-admin`);
    fetchAllData();
    setRefreshing(false);
  };

  const handleRevokeAdmin = async (userId) => {
    if (!confirm("Are you sure you want to revoke admin status for this user?")) return;
    setRefreshing(true);
    await api.put(`/super-admin/${userId}/revoke-admin`);
    fetchAllData();
    setRefreshing(false);
  };

  const handleDeleteUser = async (userId) => {
  if (!confirm("⚠️ WARNING: This will permanently delete the user and ALL their data (submissions, discussions, progress, etc.). This action CANNOT be undone. Are you absolutely sure?")) {
    return;
  }

  try {
    setRefreshing(true);
    
    // ✅ FIXED: Call the correct super-admin endpoint
    await api.delete(`/super-admin/users/${userId}`);
    
    alert('User deleted successfully');
    
    // Refresh data
    fetchAllData();
  } catch (err) {
    console.error('Delete user error:', err);
    const errorMsg = err.response?.data?.error || 'Failed to delete user';
    alert(`Error: ${errorMsg}`);
  } finally {
    setRefreshing(false);
  }
};

  if (loading) {
  return <SuperAdminDashboardSkeleton />;
}


  const stats = data?.stats || {};
  const roleDistribution = data?.roleDistribution || {};
  const topContributors = data?.topContributors || [];
  const systemHealth = data?.systemHealth || {};

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Super Admin Dashboard
              </h1>
            </div>
            <p className="text-slate-600">
              Welcome, <span className="font-semibold">{currentUser?.name}</span> • Full System Control
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg disabled:opacity-50"
              title="Refresh all data"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              {!refreshing && "Refresh"}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={handleRefresh}
              className="ml-auto px-3 py-1 bg-red-200 hover:bg-red-300 text-red-700 text-sm rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Users */}
          <div className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-slate-600 text-sm font-medium">Total Users</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{stats.totalUsers || 0}</p>
            <p className="text-xs text-slate-500 mt-2">All registered users</p>
          </div>

          {/* Active Users */}
          <div className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-slate-600 text-sm font-medium">Active Users</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{stats.activeUsers || 0}</p>
            <p className="text-xs text-slate-500 mt-2">Currently active</p>
          </div>

          {/* Total Problems */}
          <div className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-slate-600 text-sm font-medium">Total Problems</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{stats.totalProblems || 0}</p>
            <p className="text-xs text-slate-500 mt-2">Listed problems</p>
          </div>

          {/* Active Admins */}
          <div className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500 rounded-lg group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-slate-600 text-sm font-medium">Total Admins</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{stats.totalAdmins || 0}</p>
            <p className="text-xs text-slate-500 mt-2">Admin accounts</p>
          </div>

          {/* System Health */}
          <div className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CheckCircle className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-slate-600 text-sm font-medium">System Health</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {systemHealth.status === "operational" ? "100%" : "—"}
            </p>
            <p className="text-xs text-slate-500 mt-2">All systems running</p>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Submissions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">Total Submissions</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalSubmissions || 0}</p>
          </div>

          {/* Platform Accuracy */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">Platform Accuracy</p>
            <p className="text-3xl font-bold text-slate-900">{stats.platformAccuracy || 0}%</p>
          </div>

          {/* Avg Problems/User */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">Avg Submissions/User</p>
            <p className="text-3xl font-bold text-slate-900">{stats.avgProblemsPerUser || 0}</p>
          </div>

          {/* Problem Engagement */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">Problem Engagement</p>
            <p className="text-3xl font-bold text-slate-900">{stats.problemEngagementRate || 0}%</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-blue-600"
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("admins")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "admins"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-blue-600"
            }`}
          >
            <Shield className="w-5 h-5 inline mr-2" />
            Admins ({admins.length})
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "users"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-blue-600"
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Users ({allUsers.length})
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "analytics"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-blue-600"
            }`}
          >
            <TrendingUp className="w-5 h-5 inline mr-2" />
            Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Role Distribution */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Role Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(roleDistribution).map(([role, data]) => (
                  <div key={role} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-600 text-sm capitalize mb-2">{role}</p>
                    <p className="text-2xl font-bold text-slate-900">{data.total || 0}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {data.active || 0} active
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {topContributors.map((contributor, idx) => (
                  <div key={contributor._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-orange-500' : 'text-slate-600'}`}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{contributor.name}</p>
                        <p className="text-xs text-slate-500">{contributor.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{contributor.solvedProblemsCount} solved</p>
                      <p className="text-xs text-slate-500">{contributor.rankPoints} points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Activity (7 days)</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">New Users</span>
                    <span className="text-2xl font-bold text-green-600">+{stats.recentUsers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">New Submissions</span>
                    <span className="text-2xl font-bold text-blue-600">+{stats.recentSubmissions || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">System Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status</span>
                    <span className="font-semibold text-green-600">
                      {systemHealth.status === "operational" ? "✓ Operational" : "Checking..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Uptime</span>
                    <span className="font-semibold text-slate-900">
                      {systemHealth.uptime ? `${Math.floor(systemHealth.uptime / 3600)}h ${Math.floor((systemHealth.uptime % 3600) / 60)}m` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Last Updated</span>
                    <span className="font-semibold text-slate-900">
                      {systemHealth.timestamp ? new Date(systemHealth.timestamp).toLocaleTimeString() : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admins Tab */}
        {activeTab === "admins" && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Admin Management ({admins.length})
            </h2>

            {admins.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-4 text-slate-600 font-semibold">Name</th>
                      <th className="pb-4 text-slate-600 font-semibold">Email</th>
                      <th className="pb-4 text-slate-600 font-semibold">Role</th>
                      <th className="pb-4 text-slate-600 font-semibold">Status</th>
                      <th className="pb-4 text-slate-600 font-semibold">Joined</th>
                      <th className="pb-4 text-slate-600 font-semibold">Stats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr
                        key={admin._id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 text-slate-900 font-medium">{admin.name}</td>
                        <td className="py-4 text-slate-600 text-sm">{admin.email}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              admin.role === "super-admin"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {admin.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              admin.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {admin.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 text-slate-600 text-sm">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-slate-600 text-sm">
                          {admin.solvedProblemsCount || 0} solved
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500">No admin users found</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              All Users ({usersPagination?.total || 0})
            </h2>

            {allUsers.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-4 text-slate-600 font-semibold">Name</th>
                        <th className="pb-4 text-slate-600 font-semibold">Email</th>
                        <th className="pb-4 text-slate-600 font-semibold">Role</th>
                        <th className="pb-4 text-slate-600 font-semibold">Status</th>
                        <th className="pb-4 text-slate-600 font-semibold">Joined</th>
                        <th className="pb-4 text-slate-600 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((userItem) => (
                        <tr
                          key={userItem._id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 text-slate-900 font-medium">{userItem.name}</td>
                          <td className="py-4 text-slate-600 text-sm">{userItem.email}</td>
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
                                userItem.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {userItem.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 text-slate-600 text-sm">
                            {new Date(userItem.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-right flex gap-2 justify-end items-center">
                            {userItem.role === "learner" && (
                              <button
                                onClick={() => handleSetAdmin(userItem._id)}
                                disabled={refreshing}
                                className="px-3 py-1 text-sm rounded-md font-medium bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                              >
                                Make Admin
                              </button>
                            )}
                            {userItem.role === "admin" && (
                              <button
                                onClick={() => handleRevokeAdmin(userItem._id)}
                                disabled={refreshing}
                                className="px-3 py-1 text-sm rounded-md font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 disabled:opacity-50"
                              >
                                Revoke Admin
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(userItem._id)}
                              disabled={refreshing}
                              className="px-3 py-1 text-sm rounded-md font-medium bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {usersPagination && usersPagination.pages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      Showing {((userPage - 1) * 20) + 1} to {Math.min(userPage * 20, usersPagination.total)} of {usersPagination.total}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUserPage(Math.max(1, userPage - 1))}
                        disabled={userPage === 1}
                        className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 font-semibold">
                        Page {userPage} of {usersPagination.pages}
                      </span>
                      <button
                        onClick={() => setUserPage(Math.min(usersPagination.pages, userPage + 1))}
                        disabled={userPage === usersPagination.pages}
                        className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500">No users found</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Platform Performance */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Platform Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-600 text-sm mb-2">Acceptance Rate</p>
                  <p className="text-4xl font-bold text-green-600">
                    {stats.platformAccuracy || 0}%
                  </p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-600 text-sm mb-2">Problem Engagement</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {stats.problemEngagementRate || 0}%
                  </p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-600 text-sm mb-2">Active Daily Challenges</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {stats.activeDailyChallenges || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                <p className="text-blue-100 text-sm mb-2">Total Submissions</p>
                <p className="text-4xl font-bold">{stats.totalSubmissions || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                <p className="text-green-100 text-sm mb-2">Accepted Solutions</p>
                <p className="text-4xl font-bold">{stats.acceptedSubmissions || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                <p className="text-purple-100 text-sm mb-2">Active Learners</p>
                <p className="text-4xl font-bold">{stats.activeLearners || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
                <p className="text-orange-100 text-sm mb-2">Daily Challenges</p>
                <p className="text-4xl font-bold">{stats.totalDailyChallenges || 0}</p>
              </div>
            </div>

            {/* User Activity */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">User Activity Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Active Users</span>
                    <span className="font-bold text-slate-900">
                      {stats.activeUsers || 0} / {stats.totalUsers || 0}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{
                        width: `${stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Problems with Submissions</span>
                    <span className="font-bold text-slate-900">
                      {stats.problemEngagementRate || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${stats.problemEngagementRate || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Platform Accuracy</span>
                    <span className="font-bold text-slate-900">
                      {stats.platformAccuracy || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${stats.platformAccuracy || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Summary Footer */}
        <div className="mt-8 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">📊 Quick Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-slate-600 text-sm mb-2">Total Users</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalUsers || 0}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-2">Active Users</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeUsers || 0}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-2">Total Admins</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.totalAdmins || 0}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-2">Total Problems</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalProblems || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}