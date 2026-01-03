import { Trophy, TrendingUp, Target } from "lucide-react";
import { 
  getRankBadge, 
  getRankIcon, 
  isTopRank 
} from "../../../../utils/rankHelpers.js";
import { 
  formatNumber, 
  getUserInitials, 
  getAvatarColor 
} from "../../../../utils/userHelper.js";

export default function TopContributors({ contributors = [] }) {
  
  if (!contributors || contributors.length === 0) {
    return (
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
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
          const rank = idx + 1;
          const isTop3 = isTopRank(rank);
          const badge = getRankBadge(rank);
          const Icon = getRankIcon(rank);
          const avatarColor = getAvatarColor(contributor._id);
          const initials = getUserInitials(contributor.name);

          return (
            <div 
              key={contributor._id || idx} 
              className={`flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md ${
                isTop3 
                  ? `${badge.bg} border-2 ${
                      rank === 1 ? 'border-yellow-300' : 
                      rank === 2 ? 'border-slate-300' : 
                      'border-orange-300'
                    }` 
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {/* Left side - Rank and User Info */}
              <div className="flex items-center gap-4 flex-1">
                {/* Rank Badge */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${badge.bg} border-2 ${
                  rank === 1 ? 'border-yellow-300' : 
                  rank === 2 ? 'border-slate-300' : 
                  rank === 3 ? 'border-orange-300' : 
                  'border-slate-200'
                }`}>
                  {isTop3 ? (
                    <Icon className={`w-6 h-6 ${badge.color}`} />
                  ) : (
                    <span className={`text-lg font-bold ${badge.color}`}>
                      {badge.emoji}
                    </span>
                  )}
                </div>

                {/* User Avatar */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {initials}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 truncate">
                      {contributor.name}
                    </p>
                    {isTop3 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${badge.bg} ${badge.color} font-bold`}>
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{contributor.email}</p>
                </div>
              </div>

              {/* Right side - Stats */}
              <div className="text-right ml-4">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <p className="font-bold text-blue-600 text-lg">
                    {formatNumber(contributor.solvedProblemsCount || 0)}
                  </p>
                </div>
                <p className="text-xs text-slate-600">
                  {formatNumber(contributor.rankPoints || 0)} points
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