import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAdminDashboardApi } from "../../api/dashboardApi.js";
import { DashboardSkeleton } from "../../../../core/Skeleton.jsx";
import { Users, BarChart3, Code2, RefreshCw, FileText, UserCheck, TrendingUp, AlertCircle, Info, TestTube } from "lucide-react";
import { ErrorState } from "../../../../components/StateComponents.jsx";
import UserManagement from "./UserManagement.jsx";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const dashRes = await getAdminDashboardApi();
      setData(dashRes.data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <DashboardSkeleton />;

  if (error && !data) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const stats = data?.dashboard?.stats || {};
  const problemsByDifficulty = data?.dashboard?.problemsByDifficulty || {};
  const submissionsByVerdict = data?.dashboard?.submissionsByVerdict || [];
  const popularProblems = data?.dashboard?.popularProblems || [];
  const languageStats = data?.dashboard?.languageStats || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header & Refresh */}
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

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            {!loading && "Refresh"}
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            onClick={() => navigate("/users")}
            className="bg-white border border-blue-200 shadow-md hover:shadow-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 text-white rounded-lg">
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

          <div
            onClick={() => navigate("/admin/total-submissions")}
            className="bg-white border border-blue-200 shadow-md hover:shadow-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-500"
          >
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
                      width: `${stats.totalProblems > 0
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
                      width: `${stats.totalProblems > 0
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
                      width: `${stats.totalProblems > 0
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
                          width: `${stats.totalSubmissions > 0
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
                          className={`px-3 py-1 rounded-full text-xs font-medium ${problem.difficulty === "Easy"
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