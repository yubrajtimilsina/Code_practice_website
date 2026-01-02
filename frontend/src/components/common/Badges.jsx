import React from 'react';
import { 
  getDifficultyColor, 
  getVerdictColor, 
  getVerdictIcon, 
  getRoleBadgeColor,
  getRankBadge,
  getRankBadgeColor
} from '../../utils/helpers';
import { Shield } from 'lucide-react';

export function DifficultyBadge({ difficulty, className = "" }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(difficulty)} ${className}`}>
      {difficulty}
    </span>
  );
}

export function VerdictBadge({ verdict, showIcon = true, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && getVerdictIcon(verdict, "w-4 h-4")}
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getVerdictColor(verdict)}`}>
        {verdict}
      </span>
    </div>
  );
}

export function RoleBadge({ role, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(role)} ${className}`}>
      <Shield className="w-3 h-3" />
      {role}
    </span>
  );
}

export function RankBadge({ rank, showNumber = true, className = "" }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getRankBadgeColor(rank)} ${className}`}>
      {getRankBadge(rank)}
      {showNumber && rank > 3 && <span className="text-xs font-semibold">TOP {rank}</span>}
    </div>
  );
}