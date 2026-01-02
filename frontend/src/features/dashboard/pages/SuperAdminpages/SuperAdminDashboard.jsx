import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import api from "../../../../utils/api.js";
import { DashboardSkeleton } from "../../../../core/Skeleton.jsx";
import { Crown, RefreshCw } from "lucide-react";
import SuperAdminStats from "./SuperAdminStats.jsx";
import RoleDistribution from "./RoleDistribution.jsx";
import TopContributors from "./TopContributors.jsx";
import SystemHealth from "./SystemHealth.jsx";

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);

  const fetchAllData = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      const dashRes = await api.get("/super-admin/dashboard");
      setData(dashRes.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading) {
    return <DashboardSkeleton />;
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

          <button
            onClick={fetchAllData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            {!refreshing && "Refresh"}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 rounded-lg p-4 flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={fetchAllData}
              className="px-3 py-1 bg-red-200 hover:bg-red-300 text-red-700 text-sm rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Stats */}
        <SuperAdminStats stats={stats} />

        {/* Overview Content */}
        <div className="space-y-6">
          <RoleDistribution roleDistribution={roleDistribution} />
          <TopContributors contributors={topContributors} />
          <SystemHealth systemHealth={systemHealth} stats={stats} />
        </div>

        {/* Summary Footer */}
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