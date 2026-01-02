import { authService } from '../../../services/apiService';

export class AuthService {

  static async register(credentials) {
    try {
      const response = await authService.register(credentials);
      return {
        success: true,
        data: response.data,
        message: "Registration successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Email and password
   * @returns {Promise<Object>} Login result with token
   */
  static async login(credentials) {
    try {
      const response = await authService.login(credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return {
        success: true,
        data: response.data,
        message: "Login successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  }

  /**
   * Logout user
   * @returns {Promise<Object>} Logout result
   */
  static async logout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      await authService.logout();
      return {
        success: true,
        message: "Logout successful",
      };
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        success: true,
        message: "Logged out",
      };
    }
  }

  /**
   * Verify token and get current user
   * @returns {Promise<Object>} Current user data
   */
  static async getCurrentUser() {
    try {
      const response = await authService.verifyToken();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        success: false,
        error: error.message || "Token verification failed",
      };
    }
  }

  /**
   * Update user profile
   * @param {Object} payload - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  static async updateProfile(payload) {
    try {
      const response = await authService.updateProfile(payload);
      localStorage.setItem("user", JSON.stringify(response.data));
      return {
        success: true,
        data: response.data,
        message: "Profile updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to update profile",
      };
    }
  }

  /**
   * Change password
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<Object>} Change password result
   */
  static async changePassword(currentPassword, newPassword) {
    try {
      await authService.changePassword(currentPassword, newPassword);
      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to change password",
      };
    }
  }

  /**
   * Request password reset
   * @param {string} email
   * @returns {Promise<Object>} Reset request result
   */
  static async requestPasswordReset(email) {
    try {
      await authService.requestPasswordReset(email);
      return {
        success: true,
        message: "Reset link sent to email",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to request reset",
      };
    }
  }
}

export default AuthService;
