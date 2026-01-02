import * as AuthApi from "../api/authApi";

export class AuthService {
 
  static async register(credentials) {
    try {
      const response = await AuthApi.register(credentials);
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


  static async login(credentials) {
    try {
      const response = await AuthApi.login(credentials);
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

  static async logout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      await AuthApi.logout();
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

  static async getCurrentUser() {
    try {
      const response = await AuthApi.verifyToken();
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

 
  static async updateProfile(payload) {
    try {
      const response = await AuthApi.updateProfile(payload);
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

  static async changePassword(currentPassword, newPassword) {
    try {
      await AuthApi.changePassword(currentPassword, newPassword);
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


  static async requestPasswordReset(email) {
    try {
      await AuthApi.requestPasswordReset(email);
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