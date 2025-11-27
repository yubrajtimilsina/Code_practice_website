import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/slice/authSlice.js";
import api from "../../../utils/api.js";
import {
  Users,
  Code2,
  GitBranch,
  LogOut,
  BarChart3,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  UserCheck,
  FileText,
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const dashRes = await api.get("/dashboard/admin");
      console.log("Dashboard data:", dashRes.data);
      setData(dashRes.data);

      try {
        const usersRes = await api.get("/users/all");
        console.log("Users data:", usersRes.data);
        setUsers(usersRes.data || []);
      } catch (err) {
        console.warn("Could not fetch users:", err.message);
        setUsers([]);
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
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-200 font-semibold">Error Loading Dashboard</p>
              <p className="text-red-200/80 text-sm">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="ml-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-200 text-lg">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const stats = data?.dashboard?.stats || {
    totalUsers: 0,
    totalProblems: 0,
    totalSubmissions: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-purple-200">
              Welcome back, <span className="font-semibold">{currentUser?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
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


        {error && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <p className="text-xs text-purple-300 mt-2">Active accounts</p>
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

          {/* Total Submissions */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Total Submissions</p>
            <p className="text-4xl font-bold text-white mt-2">{stats.totalSubmissions}</p>
            <p className="text-xs text-purple-300 mt-2">User attempts</p>
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
            <p className="text-4xl font-bold text-white mt-2">
              {users.filter((u) => u.isActive)?.length || 0}
            </p>
            <p className="text-xs text-purple-300 mt-2">Currently active</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all group">
            <Code2 className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-2">Manage Problems</h3>
            <p className="text-purple-200 text-sm">Create, edit, and delete coding problems</p>
          </button>

          <button className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all group">
            <Users className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-2">User Management</h3>
            <p className="text-purple-200 text-sm">View and manage user accounts</p>
          </button>

          <button className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-pink-500/50 transition-all group">
            <BarChart3 className="w-8 h-8 text-pink-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-2">View Analytics</h3>
            <p className="text-purple-200 text-sm">Check system statistics and insights</p>
          </button>
        </div>

        {/* Users List */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              Recent Users
            </h2>
            <span className="text-purple-300 text-sm">Total: {users.length}</span>
          </div>

          {users.length > 0 ? (
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
                  {users.slice(0, 10).map((userItem, idx) => (
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

          {users.length > 10 && (
            <div className="mt-4 text-center">
              <p className="text-purple-300 text-sm">
                Showing 10 of {users.length} users
              </p>
              <button className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All Users →
              </button>
            </div>
          )}
        </div>

        {/* System Info Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20">
          <h3 className="text-xl font-bold text-white mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-purple-200">
            <div>
              <p className="text-sm text-purple-300 mb-1">Environment</p>
              <p className="font-semibold">Development</p>
            </div>
            <div>
              <p className="text-sm text-purple-300 mb-1">Last Updated</p>
              <p className="font-semibold">{new Date().toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300 mb-1">Server Status</p>
              <p className="font-semibold text-green-400">✓ Running</p>
            </div>
            <div>
              <p className="text-sm text-purple-300 mb-1">Database</p>
              <p className="font-semibold text-green-400">✓ Connected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}