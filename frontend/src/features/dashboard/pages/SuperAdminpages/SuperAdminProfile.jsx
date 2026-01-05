import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Crown, Mail, Calendar, Shield, Users, Code2, BarChart3, Settings, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../../utils/api';

export default function SuperAdminProfile() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const fetchSuperAdminData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/super-admin/dashboard');
      setStats(response.data.stats);
      setSystemHealth(response.data.systemHealth);
    } catch (error) {
      console.error('Failed to fetch super admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header Card with Gradient */}
        <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-2xl p-8 mb-8 shadow-xl text-white">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold border-4 border-white/40 shadow-lg">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-8 h-8 text-yellow-200" />
                <h1 className="text-4xl font-bold">{user?.name}</h1>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5" />
                <span className="text-xl font-semibold">Super Administrator</span>
              </div>
              <p className="text-yellow-100">{user?.email}</p>
            </div>
            <Link
              to="/profile/edit"
              className="px-6 py-3 bg-white text-yellow-600 rounded-lg font-semibold hover:bg-yellow-50 transition-colors flex items-center gap-2 shadow-md"
            >
              <Settings className="w-5 h-5" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Crown className="w-7 h-7 text-yellow-600" />
            Account Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-700">
              <Mail className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-slate-500">Email Address</p>
                <p className="font-medium text-lg">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-700">
              <Calendar className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-slate-500">Account Created</p>
                <p className="font-medium text-lg">
                  {new Date(user?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-700">
              <Crown className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-slate-500">Role & Permissions</p>
                <p className="font-medium text-lg">Super Administrator</p>
                <p className="text-xs text-slate-500 mt-1">Highest level access - Full system control</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        {systemHealth && (
          <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Zap className="w-7 h-7 text-green-600" />
              System Health
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Status</span>
                  <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold">
                    {systemHealth.status === 'operational' ? '✓ ONLINE' : 'OFFLINE'}
                  </span>
                </div>
                <p className="text-slate-700 font-medium">System Operational</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Uptime</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.floor(systemHealth.uptime / 3600)}h
                  </span>
                </div>
                <p className="text-slate-700 font-medium">Server Uptime</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Updated</span>
                  <span className="text-sm font-bold text-purple-600">
                    {new Date(systemHealth.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-700 font-medium">Last Health Check</p>
              </div>
            </div>
          </div>
        )}

        {/* Platform Statistics */}
        {stats && (
          <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-yellow-600" />
              Platform Statistics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <Users className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers || 0}</p>
                <p className="text-slate-700 font-medium">Total Users</p>
                <p className="text-xs text-slate-500 mt-1">{stats.activeUsers || 0} active</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <Code2 className="w-8 h-8 text-green-600 mb-3" />
                <p className="text-3xl font-bold text-green-600">{stats.totalProblems || 0}</p>
                <p className="text-slate-700 font-medium">Total Problems</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
                <p className="text-3xl font-bold text-purple-600">{stats.totalSubmissions || 0}</p>
                <p className="text-slate-700 font-medium">Submissions</p>
                <p className="text-xs text-slate-500 mt-1">{stats.platformAccuracy || 0}% accuracy</p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <Shield className="w-8 h-8 text-yellow-600 mb-3" />
                <p className="text-3xl font-bold text-yellow-600">{stats.totalAdmins || 0}</p>
                <p className="text-slate-700 font-medium">Administrators</p>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <Users className="w-8 h-8 text-orange-600 mb-3" />
                <p className="text-3xl font-bold text-orange-600">{stats.activeLearners || 0}</p>
                <p className="text-slate-700 font-medium">Active Learners</p>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <Calendar className="w-8 h-8 text-red-600 mb-3" />
                <p className="text-3xl font-bold text-red-600">{stats.recentUsers || 0}</p>
                <p className="text-slate-700 font-medium">New Users (7d)</p>
              </div>
            </div>
          </div>
        )}

        {/* Super Admin Capabilities */}
        <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Capabilities</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 text-slate-700">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <div>
                <p className="font-semibold">Full System Access</p>
                <p className="text-sm text-slate-600">Complete control over all platform features</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-700">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <div>
                <p className="font-semibold">Admin Management</p>
                <p className="text-sm text-slate-600">Promote/demote administrators</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-700">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <div>
                <p className="font-semibold">User Management</p>
                <p className="text-sm text-slate-600">Delete users and all associated data</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-700">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <div>
                <p className="font-semibold">System Health Monitoring</p>
                <p className="text-sm text-slate-600">View real-time system metrics</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-700">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <div>
                <p className="font-semibold">Analytics Dashboard</p>
                <p className="text-sm text-slate-600">Comprehensive platform statistics</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-700">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <div>
                <p className="font-semibold">Content Moderation</p>
                <p className="text-sm text-slate-600">Pin/unpin discussions, manage all content</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}