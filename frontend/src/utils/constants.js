export const USER_ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  LEARNER: 'learner'
};

export const DIFFICULTIES = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard'
};

export const VERDICTS = {
  ACCEPTED: 'Accepted',
  WRONG_ANSWER: 'Wrong Answer',
  TIME_LIMIT: 'Time Limit Exceeded',
  RUNTIME_ERROR: 'Runtime Error',
  COMPILATION_ERROR: 'Compilation Error',
  PENDING: 'Pending'
};

export const LANGUAGES = {
  JAVASCRIPT: 'javascript',
  PYTHON: 'python',
  CPP: 'cpp',
  JAVA: 'java',
  C: 'c',
  TYPESCRIPT: 'typescript',
  GO: 'go',
  RUBY: 'ruby',
  CSHARP: 'csharp'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMIT_OPTIONS: [10, 20, 30, 50]
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  DASHBOARD_LEARNER: '/dashboard/learner',
  DASHBOARD_ADMIN: '/dashboard/admin',
  DASHBOARD_SUPER_ADMIN: '/dashboard/super-admin',
  PROBLEMS: '/problems',
  LEADERBOARD: '/leaderboard',
  DISCUSSIONS: '/discussion',
  PLAYGROUND: '/playground',
  SUBMISSIONS: '/submissions',
  PROGRESS: '/progress',
  DAILY_CHALLENGE: '/daily-challenge'
};

export const DISCUSSION_CATEGORIES = [
  { value: "all", label: "All Discussions" },
  { value: "general", label: "General" },
  { value: "problem-help", label: "Problem Help" },
  { value: "algorithm", label: "Algorithms" },
  { value: "interview", label: "Interview Prep" },
  { value: "bug-report", label: "Bug Reports" },
  { value: "feature-request", label: "Feature Requests" }
];

export const PROBLEM_TAGS = [
  "arrays", "strings", "dynamic-programming", "graphs", 
  "trees", "sorting", "searching", "math", "greedy", "backtracking",
  "binary-search", "two-pointers", "sliding-window", "hash-table",
  "stack", "queue", "heap", "linked-list", "recursion", "bit-manipulation"
];

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
  ],
  problems: [
    { value: "title", label: "Title (A-Z)" },
    { value: "-difficulty", label: "Difficulty" },
    { value: "-acceptanceRate", label: "Acceptance Rate" }
  ]
};

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

export const EDITOR_THEMES = {
  LIGHT: 'vs-light',
  DARK: 'vs-dark'
};

export const TIME_LIMITS = {
  MIN: 1,
  MAX: 30,
  DEFAULT: 1
};

export const MEMORY_LIMITS = {
  MIN: 64,
  MAX: 1024,
  DEFAULT: 256
};

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50
};