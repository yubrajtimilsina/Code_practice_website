import * as AuthApi from "../api/authApi";

export class AuthService {
  static async register(credentials) {
    try {
      const response = await AuthApi.registerApi(credentials);
      return {
        success: true,
        data: response.data,
        message: "Registration successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Registration failed",
      };
    }
  }

  static async login(credentials) {
    try {
      const response = await AuthApi.loginApi(credentials);
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
        error: error.response?.data?.error || error.message || "Login failed",
      };
    }
  }

  static async logout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        success: true,
        message: "Logout successful",
      };
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        success: true,
        message: "Logged out",
      };
    }
  }

  static async getCurrentUser() {
    try {
      const response = await AuthApi.meApi();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Token verification failed",
      };
    }
  }

  static async updateProfile(payload) {
    try {
      const response = await AuthApi.updateProfileApi(payload);
      localStorage.setItem("user", JSON.stringify(response.data));
      return {
        success: true,
        data: response.data,
        message: "Profile updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to update profile",
      };
    }
  }

  static async changePassword(currentPassword, newPassword) {
    try {
      await AuthApi.changePasswordApi(currentPassword, newPassword);
      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to change password",
      };
    }
  }

  static async forgotPassword(email) {
    try {
      const response = await AuthApi.forgotPasswordApi(email);
      return {
        success: true,
        message: response.data.message || response.data.data || "Password reset link sent to email",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to send reset link",
      };
    }
  }

  static async verifyResetToken(token) {
    try {
      const response = await AuthApi.verifyResetTokenApi(token);
      return {
        success: true,
        valid: response.data.valid,
        email: response.data.email,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        valid: false,
        error: error.response?.data?.error || error.message || "Invalid reset token",
      };
    }
  }

  static async resetPassword(token, password) {
    try {
      const response = await AuthApi.resetPasswordApi(token, password);
      return {
        success: true,
        message: response.data.message || response.data.data || "Password reset successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to reset password",
      };
    }
  }
}

export default AuthService;