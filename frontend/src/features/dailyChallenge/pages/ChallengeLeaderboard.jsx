import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChallengeLeaderboard } from "../api/dailyChallengeApi";
import { Trophy, Medal, Award, ArrowLeft, Clock } from "lucide-react";

export default function ChallengeLeaderboard() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [challengeId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await getChallengeLeaderboard(challengeId);
      setLeaderboard(res.data.leaderboard);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
    return <span className="text-slate-700 font-semibold">#{rank}</span>;
  };

  /* ---------------- Loading Skeleton ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 flex justify-center">
        <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 animate-pulse"
            >
              <div className="h-6 w-6 rounded bg-slate-200" />
              <div className="flex-1 h-4 bg-slate-200 rounded" />
              <div className="w-24 h-4 bg-slate-200 rounded" />
              <div className="w-20 h-4 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/daily-challenge")}
            className="p-2 rounded-lg hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Challenge Leaderboard
            </h1>
            <p className="text-slate-600 text-sm">
              Fastest verified submissions
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {leaderboard.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {["Rank", "User", "Language", "Time", "Completed"].map(h => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-sm font-semibold text-slate-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.userId._id || index}
                      className={`border-b last:border-0 transition ${
                        index < 3 ? "bg-slate-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        {getRankBadge(entry.rank)}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {entry.userId.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {entry.userId.email}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {entry.language?.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {entry.executionTime}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(entry.completedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-500">
              <Trophy className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No completions yet</p>
              <p className="text-sm">Solve the challenge to appear here</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/daily-challenge")}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
          >
            Back to Daily Challenge
          </button>
        </div>

      </div>
    </div>
  );
}
