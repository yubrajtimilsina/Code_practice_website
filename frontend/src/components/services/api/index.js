import api from '../../utils/api';

// ============= BASE SERVICE CLASS =============
class BaseService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint, params = {}) {
    try {
      const response = await api.get(`${this.baseUrl}${endpoint}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post(endpoint, payload) {
    try {
      const response = await api.post(`${this.baseUrl}${endpoint}`, payload);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put(endpoint, payload) {
    try {
      const response = await api.put(`${this.baseUrl}${endpoint}`, payload);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(endpoint) {
    try {
      const response = await api.delete(`${this.baseUrl}${endpoint}`);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleError(error) {
    const message = error.response?.data?.error || 
                    error.response?.data?.errors?.[0] || 
                    error.message || 
                    'An error occurred';
    return { success: false, error: message };
  }
}

// ============= AUTH SERVICE =============
class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }

  async register(credentials) {
    return this.post('/register', credentials);
  }

  async login(credentials) {
    const result = await this.post('/login', credentials);
    if (result.success && result.data.user?.token) {
      localStorage.setItem('token', result.data.user.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }
    return result;
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  }

  async getMe() {
    return this.get('/me');
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

  async get(params = {}) {
    return super.get('', params);
  }

  async getMyRank() {
    return this.get('/my-rank');
  }

  async getProgress() {
    return this.get('/my-progress');
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

  async getLeaderboard(challengeId) {
    return this.get(`/leaderboard/${challengeId}`);
  }

  async complete(data) {
    return this.post('/complete', data);
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

  async changePassword(currentPassword, newPassword) {
    return this.put('/change-password', { currentPassword, newPassword });
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
export const playgroundService = new PlaygroundService();

// Default export for convenience
export default {
  auth: authService,
  problem: problemService,
  submission: submissionService,
  leaderboard: leaderboardService,
  dashboard: dashboardService,
  discussion: discussionService,
  dailyChallenge: dailyChallengeService,
  user: userService,
  playground: playgroundService
};