
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAdminDashboardApi, getAdminsApi, setAdminApi, revokeAdminApi } from "../api/dashboardApi.js";
import api from "../../../utils/api.js";
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
} from "lucide-react";

export default function SuperAdminDashboard() {

  const [data, setData] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, admins, users

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const fetchAllData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const dashRes = await getAdminDashboardApi();
      setData(dashRes.data);

      const adminsRes = await getAdminsApi();
      setAdmins(adminsRes.data.admins || []);

      const usersRes = await api.get("/users/all");
      setAllUsers(usersRes.data.filter(u => u.role !== "super-admin") || []);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);


  const handleRefresh = () => {
    fetchAllData();
  };

  const handleSetAdmin = async (userId) => {
    if (!confirm("Are you sure you want to make this user an admin?")) return;
    try {
      setRefreshing(true);
      await setAdminApi(userId);
      fetchAllData(); 
    } catch (err) {
      console.error("Error setting admin:", err);
      setError(err.response?.data?.error || "Failed to set admin");
    } finally {
      setRefreshing(false);
    }
  };

  const handleRevokeAdmin = async (userId) => {
    if (!confirm("Are you sure you want to revoke admin status for this user?")) return;
    try {
      setRefreshing(true);
      await revokeAdminApi(userId);
      fetchAllData(); 
    } catch (err) {
      console.error("Error revoking admin:", err);
      setError(err.response?.data?.error || "Failed to revoke admin");
    } finally {
      setRefreshing(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 text-lg font-medium">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data?.dashboard?.stats || {
    totalUsers: 0,
    totalProblems: 0,
    totalSubmissions: 0,
  };

  const userStats = {
    admins: admins.filter((a) => a.isActive).length,
    learners: allUsers.filter((u) => u.role === "learner").length,
    activeUsers: allUsers.filter((u) => u.isActive).length,
  };

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
            <p className="text-4xl font-bold text-slate-900 mt-2">{stats.totalUsers}</p>
            <p className="text-xs text-slate-500 mt-2">All registered users</p>
          </div>

          
          <div className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-slate-600 text-sm font-medium">Active Users</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{userStats.activeUsers}</p>
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
            <p className={` text-slate-500 text-sm font-medium`}>Total Problems</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">
              {stats.totalProblems}
            </p>
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
            <p className="text-slate-600 text-sm font-medium">Active Admins</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{userStats.admins}</p>
            <p className="text-xs text-slate-500 mt-2">Admin accounts</p>
          </div>

          {/* System Health */}
          <div className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:border-red-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-slate-600 text-sm font-medium">System Health</p>
            <p className="text-4xl font-bold text-green-600 mt-2">100%</p>
            <p className="text-xs text-slate-500 mt-2">All systems running</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
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
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
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
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "users"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-blue-600"
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Users ({allUsers.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* System Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">User Statistics</h3>
                <div className="space-y-4 text-slate-600">
                  <div className="flex justify-between">
                    <span>Total Users</span>
                    <span className="font-semibold text-slate-900">{stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users</span>
                    <span className="font-semibold text-green-600">{userStats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admins</span>
                    <span className="font-semibold text-yellow-600">{userStats.admins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Learners</span>
                    <span className="font-semibold text-blue-600">{userStats.learners}</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2"></div>
                  <div className="flex justify-between text-sm">
                    <span>Inactive Users</span>
                    <span className="font-semibold">{stats.totalUsers - userStats.activeUsers}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">System Information</h3>
                <div className="space-y-4 text-slate-600">
                  <div className="flex justify-between">
                    <span>Environment</span>
                    <span className="font-semibold text-slate-900">Development</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Server Status</span>
                    <span className="font-semibold text-green-600">✓ Running</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database</span>
                    <span className="font-semibold text-green-600">✓ Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Problems</span>
                    <span className="font-semibold text-slate-900">{stats.totalProblems}</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2"></div>
                  <div className="flex justify-between text-sm">
                    <span>Last Updated</span>
                    <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
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
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 text-slate-900 font-medium">{admin.name}</td>
                        <td className="py-4 text-slate-600 text-sm">{admin.email}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
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
              All Users ({allUsers.length})
            </h2>

            {allUsers.length > 0 ? (
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
                              className="px-3 py-1 text-sm rounded-md font-medium bg-green-100 text-green-700 hover:bg-green-200"
                            >
                              Make Admin
                            </button>
                          )}
                          {userItem.role === "admin" && (
                            <button
                              onClick={() => handleRevokeAdmin(userItem._id)}
                              disabled={refreshing}
                              className="px-3 py-1 text-sm rounded-md font-medium bg-orange-100 text-orange-700 hover:bg-orange-200"
                            >
                              Revoke Admin
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500">No users found</p>
              </div>
            )}

            {allUsers.length > 20 && (
              <div className="mt-4 text-center">
                <p className="text-slate-500 text-sm">
                  Showing 20 of {allUsers.length} users
                </p>
                <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Users →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="mt-8 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">📊 Quick Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-slate-600 text-sm mb-2">Total Users</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-2">Active Users</p>
              <p className="text-3xl font-bold text-green-600">{userStats.activeUsers}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-2">Total Admins</p>
              <p className="text-3xl font-bold text-yellow-600">{userStats.admins}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-2">Total Problems</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalProblems}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}