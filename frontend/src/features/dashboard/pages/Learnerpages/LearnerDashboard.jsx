import { useEffect, useState } from "react";
import { getLearnerDashboardApi } from "../../api/dashboardApi.js";
import { Trophy, Code2, Zap, TrendingUp, Award, BookOpen, Target, Activity, CheckCircle, XCircle, Calendar, Flame } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { DashboardSkeleton } from "../../../../core/Skeleton.jsx";
import { ErrorState } from "../../../../components/StateComponents.jsx";

export default function LearnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getLearnerDashboardApi();
      setData(res.data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const CARD_BASE = "bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all";
  const CARD_HOVER = "hover:-translate-y-1 cursor-pointer";
  const TEXT_SUB = "text-slate-600";

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorState message={error} onRetry={fetchDashboard} />
        </div>
      </div>
    );
  }

  if (!data || !data.dashboard) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <p className="text-red-500 text-xl font-semibold">Unable to load dashboard</p>
      </div>
    );
  }  const { stats, learningPath, thisWeek, problemsByDifficulty, recentActivity, activityCalendar } = data.dashboard;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-1">
            Welcome Back, <span className="text-blue-600">{data.user.name}</span>
          </h1>
          <p className="text-slate-600 text-lg">Keep pushing your coding skills to new heights</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Problems Solved */}
          <div 
            onClick={() => navigate("/problems")}
            className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-500 text-white rounded-lg">
                <Code2 className="w-6 h-6" />
              </div>
            </div>
            <p className={TEXT_SUB + " text-sm font-medium"}>Problems Solved</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.solvedProblems}</p>
            <p className="text-xs text-slate-500 mt-2">Click to solve more →</p>
          </div>

          {/* Total Submissions */}
          <div 
            onClick={() => navigate("/submissions")} 
            className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-500 text-white rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
            </div>
            <p className={TEXT_SUB + " text-sm font-medium"}>Total Submissions</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.submissions}</p>
            <p className="text-xs text-slate-500 mt-2">View history →</p>
          </div>

          {/* Current Rank */}
          <div 
            onClick={() => navigate("/leaderboard")}
            className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-yellow-500 text-white rounded-lg">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
            <p className={TEXT_SUB + " text-sm font-medium"}>Current Rank</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">#{stats.rank}</p>
            <p className="text-xs text-slate-500 mt-2">View leaderboard →</p>
          </div>

          {/* Accuracy */}
          <div 
            onClick={() => navigate("/progress")}
            className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-500 text-white rounded-lg">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <p className={TEXT_SUB + " text-sm font-medium"}>Accuracy Rate</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.accuracy}%</p>
            <p className="text-xs text-slate-500 mt-2">View detailed stats →</p>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Streak */}
          <div className={`${CARD_BASE} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-3">
              <Flame className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-slate-900">Streak</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={TEXT_SUB}>Current Streak</span>
                <span className="text-2xl font-bold text-orange-600">{stats.currentStreak} days</span>
              </div>
              <div className="flex justify-between">
                <span className={TEXT_SUB}>Longest Streak</span>
                <span className="text-lg font-semibold text-slate-700">{stats.longestStreak} days</span>
              </div>
            </div>
          </div>

          {/* Daily Challenges */}
          <div 
            onClick={() => navigate("/daily-challenge")}
            className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900">Daily Challenges</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={TEXT_SUB}>Completed</span>
                <span className="text-2xl font-bold text-purple-600">{stats.dailyChallengesCompleted}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">View challenges →</p>
            </div>
          </div>

          {/* Rank Points */}
          <div className={`${CARD_BASE} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-slate-900">Rank Points</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={TEXT_SUB}>Total Points</span>
                <span className="text-2xl font-bold text-yellow-600">{stats.rankPoints}</span>
              </div>
              <p className="text-xs text-slate-500">Easy: 10 | Medium: 25 | Hard: 50</p>
            </div>
          </div>
        </div>

        {/* Learning Path & This Week */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Learning Path */}
          <div className={`${CARD_BASE} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-semibold text-slate-900">Learning Path</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className={TEXT_SUB}>Beginner Level</span>
                  <span className="text-slate-700 font-semibold">
                    {learningPath.beginner.completed}/{learningPath.beginner.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all" 
                    style={{ width: `${learningPath.beginner.progress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className={TEXT_SUB}>Intermediate Level</span>
                  <span className="text-slate-700 font-semibold">
                    {learningPath.intermediate.completed}/{learningPath.intermediate.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all" 
                    style={{ width: `${learningPath.intermediate.progress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className={TEXT_SUB}>Advanced Level</span>
                  <span className="text-slate-700 font-semibold">
                    {learningPath.advanced.completed}/{learningPath.advanced.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-yellow-500 h-full rounded-full transition-all" 
                    style={{ width: `${learningPath.advanced.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* This Week */}
          <div className={`${CARD_BASE} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-semibold text-slate-900">This Week</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={TEXT_SUB}>Problems Solved</span>
                <span className="text-lg font-bold text-green-600">+{thisWeek.problemsSolved}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={TEXT_SUB}>Submissions</span>
                <span className="text-lg font-bold text-blue-600">{thisWeek.submissions}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={TEXT_SUB}>Streak</span>
                <span className="text-lg font-bold text-yellow-600">{thisWeek.streak} days</span>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <button
                onClick={() => navigate("/daily-challenge")}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                View Daily Challenge →
              </button>
            </div>
          </div>
        </div>

        {/* Problems by Difficulty */}
        <div className={`${CARD_BASE} rounded-2xl p-6 mb-8`}>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-semibold text-slate-900">Problems by Difficulty</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 font-semibold mb-2">Easy</p>
              <p className="text-3xl font-bold text-green-600">{problemsByDifficulty.easy}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-700 font-semibold mb-2">Medium</p>
              <p className="text-3xl font-bold text-yellow-600">{problemsByDifficulty.medium}</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 font-semibold mb-2">Hard</p>
              <p className="text-3xl font-bold text-red-600">{problemsByDifficulty.hard}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity && recentActivity.length > 0 && (
          <div className={`${CARD_BASE} rounded-2xl p-6 mb-8`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-slate-900">Recent Activity</h3>
              </div>
              <Link 
                to="/submissions" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div 
                  key={activity._id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/problems/${activity.problemSlug}`)}
                >
                  <div className="flex items-center gap-3">
                    {activity.isAccepted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{activity.problemTitle}</p>
                      <p className="text-xs text-slate-500">
                        {activity.language} • {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.isAccepted 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {activity.verdict}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate("/problems")}
            className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6 text-left`}
          >
            <Code2 className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Solve Problems</h3>
            <p className="text-sm text-slate-600">Browse 500+ coding challenges</p>
          </button>

          <button
            onClick={() => navigate("/leaderboard")}
            className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6 text-left`}
          >
            <Trophy className="w-8 h-8 text-yellow-600 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">View Leaderboard</h3>
            <p className="text-sm text-slate-600">See where you rank globally</p>
          </button>

          <button
            onClick={() => navigate("/progress")}
            className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6 text-left`}
          >
            <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Track Progress</h3>
            <p className="text-sm text-slate-600">View detailed analytics</p>
          </button>
        </div>

        <div className={`${CARD_BASE} rounded-2xl p-8 text-center`}>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Level Up?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Start solving more problems today and climb the leaderboard. Every submission brings you closer to mastery.
          </p>
          <button
            onClick={() => navigate("/problems")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Start Coding →
          </button>
        </div>
      </div>
    </div>
  );
}