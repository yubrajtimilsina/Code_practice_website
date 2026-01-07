import { useState, useEffect } from "react";
import { Users, Shield, Activity, RefreshCw } from "lucide-react";
import api from "../../../../utils/api.js";
import UserManagement from "../../../dashboard/pages/Adminpages/UserManagement.jsx";
import { TableSkeleton } from "../../../../core/Skeleton.jsx";

export default function SuperAdminManageUsers() {
  const [activeTab, setActiveTab] = useState("users");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      setAnalyticsError(null);
      const res = await api.get("/super-admin/dashboard");
      setAnalyticsData(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setAnalyticsError("Failed to load platform analytics");
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (activeTab === "analytics" && !analyticsData) {
      fetchAnalytics();
    }
  }, [activeTab]);

  const tabs = [
    { id: "users", label: "User Management", icon: Users },
    { id: "admins", label: "Admin Management", icon: Shield },
    { id: "analytics", label: "Analytics", icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Manage Users
          </h1>
          <p className="text-slate-600">
            Manage users, admins, and view analytics
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-slate-200 overflow-x-auto bg-white rounded-t-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl shadow-sm">
          {activeTab === "users" && (
            <div className="p-6">
              <UserManagement isAdmin={false} showRoleManagement={true} />
            </div>
          )}

          {activeTab === "admins" && (
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Admin Management</h3>
                <p className="text-slate-600 text-sm">
                  View and manage admin accounts. You can promote learners to admins or revoke admin privileges.
                </p>
              </div>
              <UserManagement isAdmin={true} showRoleManagement={true} />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={fetchAnalytics}
                  disabled={loadingAnalytics}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingAnalytics ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {loadingAnalytics && !analyticsData ? (
                <div className="space-y-6 animate-pulse">
                  <div className="h-40 bg-slate-100 rounded-xl"></div>
                  <div className="grid grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>)}
                  </div>
                  <div className="h-60 bg-slate-100 rounded-xl"></div>
                </div>
              ) : analyticsError ? (
                <div className="p-12 text-center bg-red-50 rounded-xl border border-red-200">
                  <p className="text-red-600 font-medium">{analyticsError}</p>
                  <button onClick={fetchAnalytics} className="mt-4 text-blue-600 hover:underline">Try Again</button>
                </div>
              ) : (
                <Analytics data={analyticsData} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Analytics({ data }) {
  if (!data) return null;
  const { stats = {}, systemHealth = {} } = data;

  const analyticsStats = {
    platformAccuracy: stats.platformAccuracy || 0,
    problemEngagementRate: stats.problemEngagementRate || 0,
    activeDailyChallenges: stats.activeDailyChallenges || 0,
    totalSubmissions: stats.totalSubmissions || 0,
    acceptedSubmissions: stats.acceptedSubmissions || 0,
    activeLearners: stats.activeLearners || 0,
    totalDailyChallenges: stats.totalDailyChallenges || 0,
    totalUsers: stats.totalUsers || 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Platform Analytics</h3>
        <p className="text-slate-600 text-sm">
          Comprehensive overview of platform performance and user engagement
        </p>
      </div>

      {/* Platform Performance */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Platform Performance</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-slate-600 text-sm mb-2">Acceptance Rate</p>
            <p className="text-4xl font-bold text-green-600">
              {analyticsStats.platformAccuracy}%
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-slate-600 text-sm mb-2">Problem Engagement</p>
            <p className="text-4xl font-bold text-blue-600">
              {analyticsStats.problemEngagementRate}%
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-slate-600 text-sm mb-2">Active Daily Challenges</p>
            <p className="text-4xl font-bold text-purple-600">
              {analyticsStats.activeDailyChallenges}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <p className="text-blue-100 text-sm mb-2">Total Submissions</p>
          <p className="text-4xl font-bold">{analyticsStats.totalSubmissions.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <p className="text-green-100 text-sm mb-2">Accepted Solutions</p>
          <p className="text-4xl font-bold">{analyticsStats.acceptedSubmissions.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <p className="text-purple-100 text-sm mb-2">Active Learners</p>
          <p className="text-4xl font-bold">{analyticsStats.activeLearners}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
          <p className="text-orange-100 text-sm mb-2">Daily Challenges</p>
          <p className="text-4xl font-bold">{analyticsStats.totalDailyChallenges}</p>
        </div>
      </div>

      {/* User Activity Chart Placeholder */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">User Activity Overview</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-600">Active Users</span>
              <span className="font-bold text-slate-900">
                {analyticsStats.activeLearners} / {analyticsStats.totalUsers}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-green-500 h-full rounded-full transition-all"
                style={{ width: `${analyticsStats.totalUsers > 0 ? (analyticsStats.activeLearners / analyticsStats.totalUsers) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-600">Problems with Submissions</span>
              <span className="font-bold text-slate-900">
                {analyticsStats.problemEngagementRate}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-full rounded-full transition-all"
                style={{ width: `${analyticsStats.problemEngagementRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-600">Platform Accuracy</span>
              <span className="font-bold text-slate-900">
                {analyticsStats.platformAccuracy}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-full rounded-full transition-all"
                style={{ width: `${analyticsStats.platformAccuracy}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
