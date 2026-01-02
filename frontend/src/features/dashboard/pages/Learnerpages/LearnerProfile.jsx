import { useEffect, useState } from 'react';
import { getLearnerDashboardApi } from '../../api/dashboardApi';
import { User, Mail, Calendar, Hash, Award, Code2, TrendingUp, Zap, Flame, Activity, Target } from 'lucide-react';
import { ProfileSkeleton } from '../../../../core/Skeleton';
import { Link } from 'react-router-dom';

export default function LearnerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const response = await getLearnerDashboardApi();
      const dashboardData = response.data.dashboard;
      
      const learnerProfile = {
        ...dashboardData.user,
        solvedProblems: dashboardData.stats.solvedProblems,
        totalSubmissions: dashboardData.stats.submissions,
        rank: dashboardData.stats.rank,
        accuracy: dashboardData.stats.accuracy,
        currentStreak: dashboardData.stats.currentStreak,
        longestStreak: dashboardData.stats.longestStreak,
        lastActive: dashboardData.user.lastActiveDate,
      };
      setProfile(learnerProfile);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
  return <ProfileSkeleton />;
}

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-red-600 font-semibold text-lg">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600 font-semibold text-lg">No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-lg rounded-2xl p-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-5xl font-bold">
            {profile.name ? profile.name[0].toUpperCase() : '?'}
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">{profile.name}</h1>
            <p className="text-slate-600 text-lg">{profile.role || 'Learner'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 text-slate-700 text-lg">
            <Mail className="w-6 h-6 text-blue-500" />
            <span>{profile.email}</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-700 text-lg">
            <Calendar className="w-6 h-6 text-blue-500" />
            <span>Joined: {new Date(profile.createdAt).toLocaleDateString()}</span>
          </div>

          {profile.role && (
            <div className="flex items-center space-x-4 text-slate-700 text-lg">
              <Award className="w-6 h-6 text-blue-500" />
              <span>Role: <span className="font-medium capitalize">{profile.role}</span></span>
            </div>
          )}
        </div>

        {/* Coding Stats */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Code2 className="w-7 h-7 text-green-600" />
            Coding Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-medium mb-1">Problems Solved</p>
                <p className="text-3xl font-bold text-green-800">{profile.solvedProblems}</p>
              </div>
              <Target className="w-10 h-10 text-green-400" />
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium mb-1">Accuracy Rate</p>
                <p className="text-3xl font-bold text-blue-800">{profile.accuracy}%</p>
              </div>
              <Zap className="w-10 h-10 text-blue-400" />
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 flex items-center justify-between">
              <div>
                <p className="text-yellow-700 text-sm font-medium mb-1">Rank Points</p>
                <p className="text-3xl font-bold text-yellow-800">{profile.rankPoints}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-yellow-400" />
            </div>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 flex items-center justify-between">
              <div>
                <p className="text-orange-700 text-sm font-medium mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-orange-800">{profile.currentStreak} days</p>
                <p className="text-xs text-orange-600 mt-1">Longest: {profile.longestStreak} days</p>
              </div>
              <Flame className="w-10 h-10 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Activity className="w-7 h-7 text-purple-600" />
            Activity Summary
          </h2>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium mb-1">Last Active</p>
              <p className="text-xl font-bold text-purple-800">{new Date(profile.lastActive).toLocaleString()}</p>
            </div>
            <Calendar className="w-10 h-10 text-purple-400" />
          </div>
        </div>


         <Link
  to="/learner/profile/edit"
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
>
  Edit Profile
</Link>
      </div>
    </div>
  );
}
