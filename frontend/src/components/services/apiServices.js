// src/services/apiService.js
// Unified API service layer - replaces all individual API files

import api from '../utils/api';
import { getErrorMessage } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

// ============= BASE SERVICE CLASS =============
class BaseService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint = '', params = {}) {
    try {
      const response = await api.get(`${this.baseUrl}${endpoint}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post(endpoint = '', payload = {}) {
    try {
      const response = await api.post(`${this.baseUrl}${endpoint}`, payload);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put(endpoint = '', payload = {}) {
    try {
      const response = await api.put(`${this.baseUrl}${endpoint}`, payload);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(endpoint = '') {
    try {
      const response = await api.delete(`${this.baseUrl}${endpoint}`);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleError(error) {
    const message = getErrorMessage(error);
    console.error(`API Error [${this.baseUrl}]:`, message);
    return { success: false, error: message };
  }
}

// ============= AUTH SERVICE =============
class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }

  async register(credentials) {
    const result = await this.post('/register', credentials);
    if (result.success && result.data.user?.token) {
      this.storeAuth(result.data.user);
    }
    return result;
  }

  async login(credentials) {
    const result = await this.post('/login', credentials);
    if (result.success && result.data.user?.token) {
      this.storeAuth(result.data.user);
    }
    return result;
  }

  async logout() {
    this.clearAuth();
    return { success: true };
  }

  async getMe() {
    return this.get('/me');
  }

  storeAuth(user) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, user.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

// ============= PROBLEM SERVICE =============
class ProblemService extends BaseService {
  constructor() {
    super('/problems');
  }

  async list(filters = {}) {
    return this.get('', filters);
  }

  async getById(idOrSlug) {
    return this.get(`/${idOrSlug}`);
  }

  async create(data) {
    return this.post('', data);
  }

  async update(id, data) {
    return this.put(`/${id}`, data);
  }

  async remove(id) {
    return this.delete(`/${id}`);
  }
}

// ============= SUBMISSION SERVICE =============
class SubmissionService extends BaseService {
  constructor() {
    super('/submissions');
  }

  async submit(data) {
    return this.post('/submit', data);
  }

  async run(data) {
    return this.post('/run', data);
  }

  async getHistory(params = {}) {
    return this.get('', params);
  }

  async getById(id) {
    return this.get(`/${id}`);
  }

  async getDraft(problemId) {
    return this.get(`/draft/${problemId}`);
  }

  async saveDraft(problemId, data) {
    return this.put(`/draft/${problemId}`, { ...data, problemId });
  }
}

// ============= LEADERBOARD SERVICE =============
class LeaderboardService extends BaseService {
  constructor() {
    super('/leaderboard');
  }

  async list(params = {}) {
    return this.get('', params);
  }

  async getMyRank() {
    return this.get('/my-rank');
  }

  async getMyProgress() {
    return this.get('/my-progress');
  }

  async getProblemStats(problemId) {
    return this.get(`/problem/${problemId}/stats`);
  }

  async getSystemHealth() {
    return this.get('/system/health');
  }
}

// ============= DASHBOARD SERVICE =============
class DashboardService extends BaseService {
  constructor() {
    super('/dashboard');
  }

  async getLearner() {
    return this.get('/learner');
  }

  async getAdmin() {
    return this.get('/admin');
  }

  async getSuperAdmin() {
    return this.get('/super-admin');
  }
}

// ============= DISCUSSION SERVICE =============
class DiscussionService extends BaseService {
  constructor() {
    super('/discussion');
  }

  async list(params = {}) {
    return this.get('', params);
  }

  async getById(id) {
    return this.get(`/${id}`);
  }

  async create(data) {
    return this.post('', data);
  }

  async update(id, data) {
    return this.put(`/${id}`, data);
  }

  async remove(id) {
    return this.delete(`/${id}`);
  }

  async vote(id) {
    return this.post(`/${id}/vote`, { voteType: 'upvote' });
  }

  async addComment(id, content, parentId = null) {
    return this.post(`/${id}/comments`, { content, parentCommentId: parentId });
  }

  async updateComment(id, commentId, content) {
    return this.put(`/${id}/comments/${commentId}`, { content });
  }

  async deleteComment(id, commentId) {
    return this.delete(`/${id}/comments/${commentId}`);
  }

  async voteComment(id, commentId) {
    return this.post(`/${id}/comments/${commentId}/vote`, { voteType: 'upvote' });
  }

  async pin(id) {
    return this.post(`/${id}/pin`);
  }
}

// ============= DAILY CHALLENGE SERVICE =============
class DailyChallengeService extends BaseService {
  constructor() {
    super('/daily-challenge');
  }

  async getToday() {
    return this.get('/today');
  }

  async getHistory(limit = 30) {
    return this.get('/history', { limit });
  }

  async getMyHistory(limit = 30) {
    return this.get('/my-history', { limit });
  }

  async getByDate(date) {
    return this.get(`/date/${date}`);
  }

  async getLeaderboard(challengeId) {
    return this.get(`/leaderboard/${challengeId}`);
  }

  async complete(data) {
    return this.post('/complete', data);
  }

  async generate() {
    return this.post('/generate');
  }
}

// ============= USER SERVICE =============
class UserService extends BaseService {
  constructor() {
    super('/users');
  }

  async getProfile() {
    return this.get('');
  }

  async updateProfile(data) {
    return this.put('/profile', data);
  }

  async changePassword(data) {
    return this.put('/change-password', data);
  }
}

// ============= ADMIN USER SERVICE =============
class AdminUserService extends BaseService {
  constructor() {
    super('/admin/users');
  }

  async list(params = {}) {
    return this.get('', params);
  }

  async toggleBlock(userId) {
    return this.post(`/${userId}/toggle-block`);
  }

  async remove(userId) {
    return this.delete(`/${userId}`);
  }
}

// ============= SUPER ADMIN SERVICE =============
class SuperAdminService extends BaseService {
  constructor() {
    super('/super-admin');
  }

  async getDashboard() {
    return this.get('/dashboard');
  }

  async getAdmins() {
    return this.get('/manage-admins');
  }

  async getUsers(params = {}) {
    return this.get('/users', params);
  }

  async setAdmin(userId) {
    return this.put(`/${userId}/set-admin`);
  }

  async revokeAdmin(userId) {
    return this.put(`/${userId}/revoke-admin`);
  }

  async deleteUser(userId) {
    return this.delete(`/users/${userId}`);
  }
}

// ============= PLAYGROUND SERVICE =============
class PlaygroundService extends BaseService {
  constructor() {
    super('/playground');
  }

  async execute(data) {
    return this.post('/execute', data);
  }

  async getStats() {
    return this.get('/stats');
  }
}

// ============= EXPORT SINGLETON INSTANCES =============
export const authService = new AuthService();
export const problemService = new ProblemService();
export const submissionService = new SubmissionService();
export const leaderboardService = new LeaderboardService();
export const dashboardService = new DashboardService();
export const discussionService = new DiscussionService();
export const dailyChallengeService = new DailyChallengeService();
export const userService = new UserService();
export const adminUserService = new AdminUserService();
export const superAdminService = new SuperAdminService();
export const playgroundService = new PlaygroundService();

// Default export for convenience
const apiService = {
  auth: authService,
  problem: problemService,
  submission: submissionService,
  leaderboard: leaderboardService,
  dashboard: dashboardService,
  discussion: discussionService,
  dailyChallenge: dailyChallengeService,
  user: userService,
  adminUser: adminUserService,
  superAdmin: superAdminService,
  playground: playgroundService
};

export default apiService;