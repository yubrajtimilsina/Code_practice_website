import { useEffect, useState } from "react";
import { getLearnerDashboardApi } from "../api/dashboardApi";
import { Trophy, Code2, Zap, TrendingUp, Award, BookOpen, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LearnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getLearnerDashboardApi().then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const CARD_BASE = "bg-white border border-slate-200 shadow-sm";
  const CARD_HOVER = "hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer";
  const TEXT_SUB = "text-slate-600";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-700 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <p className="text-red-500 text-xl font-semibold">Unable to load dashboard</p>
      </div>
    );
  }

  const stats = data.dashboard.stats;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-1">
            Welcome Back, <span className="text-blue-600">{data.user.name}</span>
          </h1>
          <p className="text-slate-600 text-lg">Keep pushing your coding skills to new heights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

    
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

          {/* Total Submissions - NAVIGATES TO SUBMISSION HISTORY */}
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

          {/* Current Rank - NAVIGATES TO LEADERBOARD */}
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

          {/* Accuracy - NAVIGATES TO PROGRESS PAGE */}
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
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {stats.solvedProblems > 0
                ? ((stats.solvedProblems / stats.submissions) * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-xs text-slate-500 mt-2">View detailed stats →</p>
          </div>
        </div>

        {/* Progress Section */}
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
                  <span className="text-slate-700 font-semibold">{data.dashboard.learningPath.beginner.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${data.dashboard.learningPath.beginner.progress}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className={TEXT_SUB}>Intermediate Level</span>
                  <span className="text-slate-700 font-semibold">{data.dashboard.learningPath.intermediate.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${data.dashboard.learningPath.intermediate.progress}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className={TEXT_SUB}>Advanced Level</span>
                  <span className="text-slate-700 font-semibold">{data.dashboard.learningPath.advanced.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${data.dashboard.learningPath.advanced.progress}%` }}></div>
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
                <span className="text-lg font-bold text-green-600">+{data.dashboard.thisWeek.problemsSolved}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={TEXT_SUB}>Streak</span>
                <span className="text-lg font-bold text-yellow-600">{data.dashboard.thisWeek.streak} days 🔥</span>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <button
                onClick={() => navigate("/problems")}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                View Challenges →
              </button>
            </div>
          </div>
        </div>

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

        {/* CTA Section */}
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