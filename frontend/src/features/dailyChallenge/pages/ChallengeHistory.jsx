import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyHistory } from "../api/dailyChallengeApi";
import { 
  Calendar, 
  Trophy, 
  Target, 
  CheckCircle,
  Flame,
  Award
} from "lucide-react";
import { LoadingState, ErrorState, EmptyDataState } from "../../../components/StateComponents.jsx";

export default function ChallengeHistory() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    byDifficulty: { Easy: 0, Medium: 0, Hard: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getMyHistory(30);
      const historyData = response.data.history || [];
      const statsData = response.data.stats || {
        totalCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        byDifficulty: { Easy: 0, Medium: 0, Hard: 0 }
      };
      setHistory(historyData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {loading ? (
          <LoadingState message="Loading challenge history..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchHistory} />
        ) : (
          <>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Daily Challenge History
          </h1>
          <p className="text-slate-600">Your daily challenge completion record</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">Total Completed</p>
            <p className="text-4xl font-bold text-slate-900">{stats?.totalCompleted || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">Current Streak</p>
            <p className="text-4xl font-bold text-slate-900">{stats?.currentStreak || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">Longest Streak</p>
            <p className="text-4xl font-bold text-slate-900">{stats?.longestStreak || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">Easy Problems</p>
            <p className="text-4xl font-bold text-slate-900">{stats?.byDifficulty?.Easy || 0}</p>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        {stats && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">By Difficulty</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700">Easy</span>
                  <span className="font-bold text-green-600">{stats.byDifficulty.Easy}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${(stats.byDifficulty.Easy / stats.totalCompleted) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700">Medium</span>
                  <span className="font-bold text-yellow-600">{stats.byDifficulty.Medium}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-full rounded-full"
                    style={{ width: `${(stats.byDifficulty.Medium / stats.totalCompleted) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700">Hard</span>
                  <span className="font-bold text-red-600">{stats.byDifficulty.Hard}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${(stats.byDifficulty.Hard / stats.totalCompleted) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-xl font-bold text-slate-900">Completed Challenges</h3>
          </div>

          {history.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {history.map((challenge) => (
                <div 
                  key={challenge._id}
                  className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/problems/${challenge.problemId?._id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {new Date(challenge.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">
                        {challenge.problemId?.title || "Problem"}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          challenge.difficulty === "Easy" 
                            ? "bg-green-100 text-green-700" 
                            : challenge.difficulty === "Medium" 
                            ? "bg-yellow-100 text-yellow-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {challenge.difficulty}
                        </span>
                        {challenge.problemId?.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Completed</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No completed challenges yet</p>
              <p className="text-sm mb-6">Start solving daily challenges to build your streak!</p>
              <button
                onClick={() => navigate("/daily-challenge")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View Today's Challenge →
              </button>
            </div>
          )}
        </div>
          </>
        )}

      </div>
    </div>
  );
}