import { Trophy, Icon, Medal, Award, Target } from "lucide-react";


export const getRankIcon = (rank) => {
  if (rank === 1) return Trophy;
  if (rank === 2) return Medal;
  if (rank === 3) return Award;
  return Target;
};


export const getRankBadge = (rank) => {
  if (rank === 1) return { emoji: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-50' };
  if (rank === 2) return { emoji: '🥈', color: 'text-slate-400', bg: 'bg-slate-50' };
  if (rank === 3) return { emoji: '🥉', color: 'text-orange-500', bg: 'bg-orange-50' };
  return { emoji: `#${rank}`, color: 'text-slate-600', bg: 'bg-slate-50' };
};

export const getRankBadgeColor = (rank) => {
  if (rank === 1) return "bg-yellow-100 text-yellow-700 border-yellow-300";
  if (rank === 2) return "bg-gray-100 text-gray-700 border-gray-300";
  if (rank === 3) return "bg-orange-100 text-orange-700 border-orange-300";
  if (rank <= 10) return "bg-blue-100 text-blue-700 border-blue-300";
  return "bg-slate-100 text-slate-700 border-slate-300";
};

export const isTopRank = (rank) => {
  return rank >= 1 && rank <= 3;
};

export const isTop10 = (rank) => {
  return rank >= 1 && rank <= 10;
};

export const getRankText = (rank) => {
  if (isTop10(rank)) return `TOP ${rank}`;
  return `#${rank}`;
};

export const getPercentile = (rank, total) => {
  if (!total || total === 0) return "N/A";
  const percentile = ((rank / total) * 100).toFixed(1);
  return `Top ${percentile}%`;
};

export const RankBadgeIcon = ({ rank, size = 'md' }) => {
  const Icon = getRankIcon(rank);
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const colorClasses = {
    1: 'text-yellow-500',
    2: 'text-slate-400',
    3: 'text-orange-600',
  };
  
  return (
    <Icon className={`${sizeClasses[size]} ${colorClasses[rank] || 'text-slate-400'}`} />
  );
};