// src/utils/helpers.js
// Unified helper functions from all deleted files

import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Trophy, Medal, Award, Shield } from 'lucide-react';
import { VERDICTS, DIFFICULTIES, USER_ROLES, ROUTES } from './constants';

// ============= TIME & DATE =============
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

export const formatDate = (date, options = {}) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ============= VERDICT HELPERS =============
export const getVerdictColor = (verdict) => {
  const colors = {
    [VERDICTS.ACCEPTED]: "bg-green-100 text-green-700 border-green-300",
    [VERDICTS.WRONG_ANSWER]: "bg-red-100 text-red-700 border-red-300",
    [VERDICTS.TIME_LIMIT]: "bg-yellow-100 text-yellow-700 border-yellow-300",
    [VERDICTS.PENDING]: "bg-yellow-100 text-yellow-700 border-yellow-300",
    [VERDICTS.RUNTIME_ERROR]: "bg-red-100 text-red-700 border-red-300",
    [VERDICTS.COMPILATION_ERROR]: "bg-orange-100 text-orange-700 border-orange-300"
  };
  return colors[verdict] || "bg-red-100 text-red-700 border-red-300";
};

export const getVerdictIcon = (verdict, className = "w-5 h-5") => {
  const icons = {
    [VERDICTS.ACCEPTED]: <CheckCircle className={`${className} text-green-600`} />,
    [VERDICTS.WRONG_ANSWER]: <XCircle className={`${className} text-red-600`} />,
    [VERDICTS.TIME_LIMIT]: <Clock className={`${className} text-yellow-600`} />,
    [VERDICTS.PENDING]: <Clock className={`${className} text-yellow-600`} />,
    [VERDICTS.RUNTIME_ERROR]: <AlertTriangle className={`${className} text-red-600`} />,
    [VERDICTS.COMPILATION_ERROR]: <AlertTriangle className={`${className} text-orange-600`} />
  };
  return icons[verdict] || <XCircle className={`${className} text-red-600`} />;
};

// ============= DIFFICULTY HELPERS =============
export const getDifficultyColor = (difficulty) => {
  const colors = {
    [DIFFICULTIES.EASY]: "bg-green-100 text-green-700 border-green-300",
    [DIFFICULTIES.MEDIUM]: "bg-yellow-100 text-yellow-700 border-yellow-300",
    [DIFFICULTIES.HARD]: "bg-red-100 text-red-700 border-red-300"
  };
  return colors[difficulty] || colors[DIFFICULTIES.EASY];
};

export const getDifficultyPoints = (difficulty) => {
  const points = {
    [DIFFICULTIES.EASY]: 10,
    [DIFFICULTIES.MEDIUM]: 25,
    [DIFFICULTIES.HARD]: 50
  };
  return points[difficulty] || 0;
};

// ============= ROLE HELPERS =============
export const getRoleBadgeColor = (role) => {
  const colors = {
    [USER_ROLES.SUPER_ADMIN]: "bg-yellow-100 text-yellow-700 border-yellow-300",
    [USER_ROLES.ADMIN]: "bg-red-100 text-red-700 border-red-300",
    [USER_ROLES.LEARNER]: "bg-blue-100 text-blue-700 border-blue-300"
  };
  return colors[role] || colors[USER_ROLES.LEARNER];
};

export const getRoleIcon = (role) => {
  return <Shield className="w-3 h-3" />;
};

// ============= CATEGORY HELPERS =============
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

// ============= RANK HELPERS =============
export const getRankBadge = (rank, size = "w-6 h-6") => {
  if (rank === 1) return <Trophy className={`${size} text-yellow-500`} />;
  if (rank === 2) return <Medal className={`${size} text-gray-400`} />;
  if (rank === 3) return <Award className={`${size} text-orange-600`} />;
  return <span className="text-slate-700 font-bold">#{rank}</span>;
};

export const getRankBadgeColor = (rank) => {
  if (rank === 1) return "bg-yellow-100 text-yellow-700 border-yellow-300";
  if (rank === 2) return "bg-gray-100 text-gray-700 border-gray-300";
  if (rank === 3) return "bg-orange-100 text-orange-700 border-orange-300";
  if (rank <= 10) return "bg-blue-100 text-blue-700 border-blue-300";
  return "bg-slate-100 text-slate-700 border-slate-300";
};

// ============= TEXT HELPERS =============
export const formatNumber = (num) => {
  if (!num && num !== 0) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getUserInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// ============= CLIPBOARD =============
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};

// ============= QUERY PARAMS =============
export const buildQueryParams = (filters) => {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "" && value !== "all") {
      params[key] = value;
    }
  });
  return params;
};

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

// ============= DEBOUNCE & THROTTLE =============
export const debounce = (func, delay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit = 1000) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ============= NAVIGATION =============
export const navigateToDashboard = (user, navigate) => {
  if (!user || !navigate) return;
  
  const dashboardRoutes = {
    [USER_ROLES.SUPER_ADMIN]: ROUTES.DASHBOARD_SUPER_ADMIN,
    [USER_ROLES.ADMIN]: ROUTES.DASHBOARD_ADMIN,
    [USER_ROLES.LEARNER]: ROUTES.DASHBOARD_LEARNER
  };
  
  navigate(dashboardRoutes[user.role] || ROUTES.LOGIN);
};

export const getDashboardPath = (role) => {
  const paths = {
    [USER_ROLES.SUPER_ADMIN]: ROUTES.DASHBOARD_SUPER_ADMIN,
    [USER_ROLES.ADMIN]: ROUTES.DASHBOARD_ADMIN,
    [USER_ROLES.LEARNER]: ROUTES.DASHBOARD_LEARNER
  };
  return paths[role] || ROUTES.LOGIN;
};

// ============= VALIDATION =============
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isStrongPassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value, fieldName = "Field") => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateLength = (value, min, max, fieldName = "Field") => {
  const length = value ? value.length : 0;
  if (length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (max && length > max) {
    return `${fieldName} must not exceed ${max} characters`;
  }
  return null;
};

// ============= ARRAY HELPERS =============
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });
};

export const unique = (array) => {
  return [...new Set(array)];
};

// ============= STORAGE HELPERS =============
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('localStorage setItem error:', error);
    return false;
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('localStorage getItem error:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('localStorage removeItem error:', error);
    return false;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('localStorage clear error:', error);
    return false;
  }
};

// ============= ERROR HANDLING =============
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data?.errors?.[0]) return error.response.data.errors[0];
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return error?.message === 'Network Error' || !error?.response;
};

// ============= PERFORMANCE =============
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay * 2);
  }
};

// ============= FILE HELPERS =============
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// ============= PERCENTAGE & MATH =============
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
};

export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

// Export all helpers as default object for convenience
export default {
  getTimeSince,
  formatDate,
  formatDateTime,
  getVerdictColor,
  getVerdictIcon,
  getDifficultyColor,
  getDifficultyPoints,
  getRoleBadgeColor,
  getRoleIcon,
  getCategoryColor,
  getRankBadge,
  getRankBadgeColor,
  formatNumber,
  getUserInitials,
  truncateText,
  capitalize,
  slugify,
  copyToClipboard,
  buildQueryParams,
  parseQueryString,
  debounce,
  throttle,
  navigateToDashboard,
  getDashboardPath,
  isValidEmail,
  isStrongPassword,
  validateRequired,
  validateLength,
  groupBy,
  sortBy,
  unique,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  getErrorMessage,
  isNetworkError,
  sleep,
  retry,
  getFileExtension,
  formatFileSize,
  calculatePercentage,
  clamp
};