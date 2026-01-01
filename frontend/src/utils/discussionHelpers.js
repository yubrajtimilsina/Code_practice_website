export const getTimeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

export const getCategoryColor = (category) => {
  const colors = {
    general: "bg-blue-100 text-blue-700",
    "problem-help": "bg-green-100 text-green-700",
    algorithm: "bg-purple-100 text-purple-700",
    interview: "bg-yellow-100 text-yellow-700",
    "bug-report": "bg-red-100 text-red-700",
    "feature-request": "bg-indigo-100 text-indigo-700"
  };
  return colors[category] || "bg-slate-100 text-slate-700";
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    Easy: "bg-green-100 text-green-700 border-green-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Hard: "bg-red-100 text-red-700 border-red-300"
  };
  return colors[difficulty] || colors.Easy;
};

// Verdict colors moved to utils/verdictHelpers.js - use that instead

export const getRoleBadgeColor = (role) => {
  if (role === "super-admin") return "bg-yellow-100 text-yellow-700 border-yellow-300";
  if (role === "admin") return "bg-red-100 text-red-700 border-red-300";
  return "bg-blue-100 text-blue-700 border-blue-300";
};

export const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
};

export const getUserInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};
