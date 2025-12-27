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

export const getCategoryColor = (cat) => {
  const colors = {
    general: "bg-blue-100 text-blue-700",
    "problem-help": "bg-green-100 text-green-700",
    algorithm: "bg-purple-100 text-purple-700",
    interview: "bg-yellow-100 text-yellow-700",
    "bug-report": "bg-red-100 text-red-700",
    "feature-request": "bg-indigo-100 text-indigo-700"
  };
  return colors[cat] || "bg-slate-100 text-slate-700";
};

