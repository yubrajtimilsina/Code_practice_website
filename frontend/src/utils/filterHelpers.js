
export const buildQueryParams = (filters) => {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "" && value !== "all") {
      params[key] = value;
    }
  });
  return params;
};

export const SORT_OPTIONS = {
  leaderboard: [
    { value: "rankPoints", label: "Rank Points" },
    { value: "solved", label: "Problems Solved" },
    { value: "accuracy", label: "Accuracy" },
    { value: "streak", label: "Streak" }
  ],
  discussion: [
    { value: "-lastActivityAt", label: "Latest Activity" },
    { value: "-createdAt", label: "Newest First" },
    { value: "-upvotes", label: "Most Upvoted" },
    { value: "-views", label: "Most Viewed" }
  ]
};

export const LIMIT_OPTIONS = [
  { value: 10, label: "10 per page" },
  { value: 25, label: "25 per page" },
  { value: 50, label: "50 per page" }
];

export const ITEMS_PER_PAGE_OPTIONS = LIMIT_OPTIONS;
