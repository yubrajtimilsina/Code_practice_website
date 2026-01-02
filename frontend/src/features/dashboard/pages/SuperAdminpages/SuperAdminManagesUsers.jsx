import { useState } from "react";
import { Users, Shield, Activity } from "lucide-react";
import UserManagement from "../../../dashboard/pages/Adminpages/UserManagement.jsx";

export default function SuperAdminManageUsers() {
  const [activeTab, setActiveTab] = useState("users");

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
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
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
              <Analytics />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Analytics Component
function Analytics() {
  // This would fetch data from your API
  const stats = {
    platformAccuracy: 75,
    problemEngagementRate: 68,
    activeDailyChallenges: 12,
    totalSubmissions: 15420,
    acceptedSubmissions: 11565,
    activeLearners: 342,
    totalDailyChallenges: 45
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
              {stats.platformAccuracy}%
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-slate-600 text-sm mb-2">Problem Engagement</p>
            <p className="text-4xl font-bold text-blue-600">
              {stats.problemEngagementRate}%
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-slate-600 text-sm mb-2">Active Daily Challenges</p>
            <p className="text-4xl font-bold text-purple-600">
              {stats.activeDailyChallenges}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <p className="text-blue-100 text-sm mb-2">Total Submissions</p>
          <p className="text-4xl font-bold">{stats.totalSubmissions.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <p className="text-green-100 text-sm mb-2">Accepted Solutions</p>
          <p className="text-4xl font-bold">{stats.acceptedSubmissions.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <p className="text-purple-100 text-sm mb-2">Active Learners</p>
          <p className="text-4xl font-bold">{stats.activeLearners}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
          <p className="text-orange-100 text-sm mb-2">Daily Challenges</p>
          <p className="text-4xl font-bold">{stats.totalDailyChallenges}</p>
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
                {stats.activeLearners} / 500
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-green-500 h-full rounded-full transition-all"
                style={{ width: `${(stats.activeLearners / 500) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-600">Problems with Submissions</span>
              <span className="font-bold text-slate-900">
                {stats.problemEngagementRate}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-full rounded-full transition-all"
                style={{ width: `${stats.problemEngagementRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-600">Platform Accuracy</span>
              <span className="font-bold text-slate-900">
                {stats.platformAccuracy}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-full rounded-full transition-all"
                style={{ width: `${stats.platformAccuracy}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}