import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLearnerDashboardApi } from "../api/dashboardApi";
import { Trophy, Code2, Zap, TrendingUp, Award, BookOpen, Target } from "lucide-react";
import { logout } from '../../auth/slice/authSlice';

export default function LearnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getLearnerDashboardApi().then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-300/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-purple-200 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 text-xl font-semibold">Unable to load dashboard</p>
        </div>
      </div>
    );
  }

  const stats = data.dashboard.stats;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Welcome Back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{data.user.name}</span></h1>
          <div className="flex items-center justify-between">
            <p className="text-purple-200 text-lg">Keep pushing your coding skills to new heights</p>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Problems Solved */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Problems Solved</p>
            <p className="text-3xl font-bold text-white mt-2">{stats.solvedProblems}</p>
            <p className="text-xs text-purple-300 mt-2">Keep solving to improve</p>
          </div>

          {/* Total Submissions */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Total Submissions</p>
            <p className="text-3xl font-bold text-white mt-2">{stats.submissions}</p>
            <p className="text-xs text-purple-300 mt-2">Consistency is key</p>
          </div>

          {/* Current Rank */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Current Rank</p>
            <p className="text-3xl font-bold text-white mt-2">#{stats.rank}</p>
            <p className="text-xs text-purple-300 mt-2">Climb the leaderboard</p>
          </div>

          {/* Achievement Badge */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Accuracy Rate</p>
            <p className="text-3xl font-bold text-white mt-2">{stats.solvedProblems > 0 ? ((stats.solvedProblems / stats.submissions) * 100).toFixed(1) : 0}%</p>
            <p className="text-xs text-purple-300 mt-2">Quality over quantity</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Progress Card 1 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Learning Path</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-purple-200 text-sm">Beginner Level</span>
                  <span className="text-purple-300 text-sm font-semibold">75%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-purple-200 text-sm">Intermediate Level</span>
                  <span className="text-purple-300 text-sm font-semibold">45%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Card 2 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">This Week</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Problems Solved</span>
                <span className="text-lg font-bold text-green-400">+5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Streak</span>
                <span className="text-lg font-bold text-yellow-400">3 days 🔥</span>
              </div>
              <div className="w-full h-px bg-white/10 my-2"></div>
              <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                View Challenges →
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Ready to Level Up?</h3>
          <p className="text-purple-200 mb-6 max-w-2xl mx-auto">Start solving more problems today and climb the leaderboard. Every submission brings you closer to mastery.</p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50">
            Start Coding →
          </button>
        </div>
      </div>
    </div>
  );
}