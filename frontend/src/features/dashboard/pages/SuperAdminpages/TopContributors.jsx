import { Trophy, Medal, Award, Target, TrendingUp } from "lucide-react";

export default function TopContributors({ contributors = [] }) {
  const getRankBadge = (index) => {
    if (index === 0) return { emoji: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    if (index === 1) return { emoji: '🥈', color: 'text-slate-400', bg: 'bg-slate-50' };
    if (index === 2) return { emoji: '🥉', color: 'text-orange-500', bg: 'bg-orange-50' };
    return { emoji: `#${index + 1}`, color: 'text-slate-600', bg: 'bg-slate-50' };
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-slate-400" />;
    if (index === 2) return <Award className="w-5 h-5 text-orange-500" />;
    return <Target className="w-5 h-5 text-slate-400" />;
  };

  if (!contributors || contributors.length === 0) {
    return (
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600" />
          Top Contributors
        </h3>
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No contributors data available</p>
          <p className="text-slate-400 text-sm mt-2">Start solving problems to appear here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600" />
          Top Contributors
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <TrendingUp className="w-4 h-4" />
          <span>Top {contributors.length} users</span>
        </div>
      </div>

      <div className="space-y-3">
        {contributors.map((contributor, idx) => {
          const rankBadge = getRankBadge(idx);
          const isTopThree = idx < 3;

          return (
            <div 
              key={contributor._id || idx} 
              className={`flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md ${
                isTopThree 
                  ? `${rankBadge.bg} border-2 ${idx === 0 ? 'border-yellow-300' : idx === 1 ? 'border-slate-300' : 'border-orange-300'}` 
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {/* Left side - Rank and User Info */}
              <div className="flex items-center gap-4 flex-1">
                {/* Rank Badge */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${rankBadge.bg} border-2 ${
                  idx === 0 ? 'border-yellow-300' : 
                  idx === 1 ? 'border-slate-300' : 
                  idx === 2 ? 'border-orange-300' : 
                  'border-slate-200'
                }`}>
                  <span className={`text-xl font-bold ${rankBadge.color}`}>
                    {rankBadge.emoji}
                  </span>
                </div>

                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {contributor.name?.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 truncate">
                      {contributor.name}
                    </p>
                    {isTopThree && getRankIcon(idx)}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{contributor.email}</p>
                </div>
              </div>

              {/* Right side - Stats */}
              <div className="text-right ml-4">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <p className="font-bold text-blue-600 text-lg">
                    {contributor.solvedProblemsCount || 0}
                  </p>
                </div>
                <p className="text-xs text-slate-600">
                  {contributor.rankPoints || 0} points
                </p>
                {contributor.accuracy && (
                  <p className="text-xs text-green-600 mt-1">
                    {contributor.accuracy}% accuracy
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      {contributors.length > 3 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600 text-center">
            Showing top {contributors.length} contributors based on problems solved
          </p>
        </div>
      )}
    </div>
  );
}