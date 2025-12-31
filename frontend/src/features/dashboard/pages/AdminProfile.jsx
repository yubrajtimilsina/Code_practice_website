import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Shield, Mail, Calendar, Users, Code2, BarChart3, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../utils/api';

export default function AdminProfile() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      setStats(response.data.dashboard.stats);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 mb-8 shadow-lg text-white">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold border-4 border-white/30">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{user?.name}</h1>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5" />
                <span className="text-xl font-semibold">Administrator</span>
              </div>
              <p className="text-red-100">{user?.email}</p>
            </div>
            <Link
              to="/learner/profile/edit"
              className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Shield className="w-7 h-7 text-red-600" />
            Account Information
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-700">
              <Mail className="w-6 h-6 text-red-500" />
              <div>
                <p className="text-sm text-slate-500">Email Address</p>
                <p className="font-medium text-lg">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-700">
              <Calendar className="w-6 h-6 text-red-500" />
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
              <Shield className="w-6 h-6 text-red-500" />
              <div>
                <p className="text-sm text-slate-500">Role & Permissions</p>
                <p className="font-medium text-lg capitalize">{user?.role}</p>
                <p className="text-xs text-slate-500 mt-1">Full administrative access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Statistics */}
        {stats && (
          <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-red-600" />
              Platform Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-blue-600" />
                  <span className="text-3xl font-bold text-blue-600">{stats.totalUsers || 0}</span>
                </div>
                <p className="text-slate-700 font-medium">Total Users</p>
                <p className="text-xs text-slate-500 mt-1">{stats.activeUsers || 0} active</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <Code2 className="w-8 h-8 text-green-600" />
                  <span className="text-3xl font-bold text-green-600">{stats.totalProblems || 0}</span>
                </div>
                <p className="text-slate-700 font-medium">Problems Created</p>
                <p className="text-xs text-slate-500 mt-1">Available for learners</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <span className="text-3xl font-bold text-purple-600">{stats.totalSubmissions || 0}</span>
                </div>
                <p className="text-slate-700 font-medium">Total Submissions</p>
                <p className="text-xs text-slate-500 mt-1">{stats.accuracyRate || 0}% accuracy rate</p>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-orange-600" />
                  <span className="text-3xl font-bold text-orange-600">{stats.recentRegistrations || 0}</span>
                </div>
                <p className="text-slate-700 font-medium">New Users (7 days)</p>
                <p className="text-xs text-slate-500 mt-1">Recent growth</p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Capabilities */}
        <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Capabilities</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-slate-700">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <div>
                <p className="font-semibold">Problem Management</p>
                <p className="text-sm text-slate-600">Create, edit, and delete coding problems</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-700">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <div>
                <p className="font-semibold">User Management</p>
                <p className="text-sm text-slate-600">Block/unblock users and manage accounts</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-700">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <div>
                <p className="font-semibold">Analytics Dashboard</p>
                <p className="text-sm text-slate-600">View platform statistics and user activity</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-700">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <div>
                <p className="font-semibold">Discussion Moderation</p>
                <p className="text-sm text-slate-600">Pin discussions and moderate content</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}