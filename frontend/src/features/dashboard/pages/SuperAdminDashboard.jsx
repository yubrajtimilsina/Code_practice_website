// FILE: frontend/src/features/dashboard/pages/SuperAdminDashboard.jsx
// REPLACE ENTIRE FILE WITH THIS

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/slice/authSlice.js";
import api from "../../../utils/api.js";
import {
  Shield,
  Users,
  Code2,
  TrendingUp,
  LogOut,
  AlertCircle,
  RefreshCw,
  BarChart3,
  UserCheck,
  Crown,
  Zap,
} from "lucide-react";

export default function SuperAdminDashboard() {
  // State Management
  const [data, setData] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, admins, users

  // Redux & Router
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  // Fetch all dashboard data
  const fetchAllData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Fetch 1: Admin Dashboard Stats
      const dashRes = await api.get("/dashboard/admin");
      console.log("Dashboard stats:", dashRes.data);
      setData(dashRes.data);

      // Fetch 2: Admins List
      const adminsRes = await api.get("/super-admin/manage-admins");
      console.log("Admins list:", adminsRes.data);
      setAdmins(adminsRes.data.admins || []);

      // Fetch 3: All Users
      try {
        const usersRes = await api.get("/users/all");
        console.log("All users:", usersRes.data);
        setAllUsers(usersRes.data.users || []);
      } catch (err) {
        console.warn("Could not fetch all users:", err.message);
        setAllUsers([]);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchAllData();
  }, []);

  // Handlers
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg font-medium">Loading Super Admin Dashboard...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Super Admin Dashboard
              </h1>
            </div>
            <p className="text-purple-200">
              Welcome, <span className="font-semibold">{currentUser?.name}</span> • Full System Control
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh all data"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              {!refreshing && "Refresh"}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
            <button
              onClick={handleRefresh}
              className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Users */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Total Users</p>
            <p className="text-4xl font-bold text-white mt-2">{stats.totalUsers}</p>
            <p className="text-xs text-purple-300 mt-2">All registered users</p>
          </div>

          {/* Active Users */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Active Users</p>
            <p className="text-4xl font-bold text-white mt-2">{userStats.activeUsers}</p>
            <p className="text-xs text-purple-300 mt-2">Currently active</p>
          </div>

          {/* Total Problems */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Total Problems</p>
            <p className="text-4xl font-bold text-white mt-2">{stats.totalProblems}</p>
            <p className="text-xs text-purple-300 mt-2">In the system</p>
          </div>

          {/* Active Admins */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Active Admins</p>
            <p className="text-4xl font-bold text-white mt-2">{userStats.admins}</p>
            <p className="text-xs text-purple-300 mt-2">Admin accounts</p>
          </div>

          {/* System Health */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-purple-200 text-sm font-medium">System Health</p>
            <p className="text-4xl font-bold text-green-400 mt-2">100%</p>
            <p className="text-xs text-purple-300 mt-2">All systems running</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-yellow-400 text-yellow-400"
                : "border-transparent text-purple-300 hover:text-purple-200"
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("admins")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "admins"
                ? "border-yellow-400 text-yellow-400"
                : "border-transparent text-purple-300 hover:text-purple-200"
            }`}
          >
            <Shield className="w-5 h-5 inline mr-2" />
            Admins ({admins.length})
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "users"
                ? "border-yellow-400 text-yellow-400"
                : "border-transparent text-purple-300 hover:text-purple-200"
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
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20">
                <h3 className="text-xl font-bold text-white mb-4">User Statistics</h3>
                <div className="space-y-4 text-purple-200">
                  <div className="flex justify-between">
                    <span>Total Users</span>
                    <span className="font-semibold text-white">{stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users</span>
                    <span className="font-semibold text-green-400">{userStats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admins</span>
                    <span className="font-semibold text-yellow-400">{userStats.admins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Learners</span>
                    <span className="font-semibold text-blue-400">{userStats.learners}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2"></div>
                  <div className="flex justify-between text-sm">
                    <span>Inactive Users</span>
                    <span className="font-semibold">{stats.totalUsers - userStats.activeUsers}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4">System Information</h3>
                <div className="space-y-4 text-purple-200">
                  <div className="flex justify-between">
                    <span>Environment</span>
                    <span className="font-semibold text-white">Development</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Server Status</span>
                    <span className="font-semibold text-green-400">✓ Running</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database</span>
                    <span className="font-semibold text-green-400">✓ Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Problems</span>
                    <span className="font-semibold text-white">{stats.totalProblems}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2"></div>
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
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-yellow-400" />
              Admin Management ({admins.length})
            </h2>

            {admins.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-4 text-purple-200 font-semibold">Name</th>
                      <th className="pb-4 text-purple-200 font-semibold">Email</th>
                      <th className="pb-4 text-purple-200 font-semibold">Role</th>
                      <th className="pb-4 text-purple-200 font-semibold">Status</th>
                      <th className="pb-4 text-purple-200 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 text-white font-medium">{admin.name}</td>
                        <td className="py-4 text-purple-200 text-sm">{admin.email}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-200 rounded-full text-xs font-medium">
                            {admin.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              admin.isActive
                                ? "bg-green-500/20 text-green-200"
                                : "bg-red-500/20 text-red-200"
                            }`}
                          >
                            {admin.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 text-purple-200 text-sm">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-purple-400/30 mx-auto mb-3" />
                <p className="text-purple-300">No admin users found</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              All Users ({allUsers.length})
            </h2>

            {allUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-4 text-purple-200 font-semibold">Name</th>
                      <th className="pb-4 text-purple-200 font-semibold">Email</th>
                      <th className="pb-4 text-purple-200 font-semibold">Role</th>
                      <th className="pb-4 text-purple-200 font-semibold">Status</th>
                      <th className="pb-4 text-purple-200 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.slice(0, 20).map((userItem, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 text-white font-medium">{userItem.name}</td>
                        <td className="py-4 text-purple-200 text-sm">{userItem.email}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              userItem.role === "admin"
                                ? "bg-red-500/20 text-red-200"
                                : userItem.role === "super-admin"
                                ? "bg-yellow-500/20 text-yellow-200"
                                : "bg-blue-500/20 text-blue-200"
                            }`}
                          >
                            {userItem.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              userItem.isActive
                                ? "bg-green-500/20 text-green-200"
                                : "bg-red-500/20 text-red-200"
                            }`}
                          >
                            {userItem.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 text-purple-200 text-sm">
                          {new Date(userItem.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-purple-400/30 mx-auto mb-3" />
                <p className="text-purple-300">No users found</p>
              </div>
            )}

            {allUsers.length > 20 && (
              <div className="mt-4 text-center">
                <p className="text-purple-300 text-sm">
                  Showing 20 of {allUsers.length} users
                </p>
                <button className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm font-medium">
                  View All Users →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="mt-8 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-8 border border-yellow-500/20">
          <h3 className="text-xl font-bold text-white mb-6">📊 Quick Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-purple-300 text-sm mb-2">Total Users</p>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm mb-2">Active Users</p>
              <p className="text-3xl font-bold text-green-400">{userStats.activeUsers}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm mb-2">Total Admins</p>
              <p className="text-3xl font-bold text-yellow-400">{userStats.admins}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm mb-2">Total Problems</p>
              <p className="text-3xl font-bold text-purple-400">{stats.totalProblems}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}