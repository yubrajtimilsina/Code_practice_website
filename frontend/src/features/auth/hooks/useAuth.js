import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../services/AuthService";
import { useApiCall } from "../../../hooks/useApiCall";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);

  const { execute: loginUser, loading: loginLoading, error: loginError } = useApiCall(
    async (credentials) => {
      const result = await AuthService.login(credentials);
      if (result.success) {
        // Dispatch to Redux store
        dispatch({ type: "auth/setUser", payload: result.data.user });
        dispatch({ type: "auth/setAuthenticated", payload: true });
        return result.data;
      } else {
        throw new Error(result.error);
      }
    }
  );

  const { execute: registerUser, loading: registerLoading, error: registerError } = useApiCall(
    async (credentials) => {
      const result = await AuthService.register(credentials);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    }
  );

  const { execute: logoutUser, loading: logoutLoading } = useApiCall(async () => {
    const result = await AuthService.logout();
    if (result.success) {
      dispatch({ type: "auth/clearUser" });
      return result;
    } else {
      throw new Error(result.error);
    }
  });

  const { execute: updateUserProfile, loading: updateLoading, error: updateError } = useApiCall(
    async (payload) => {
      const result = await AuthService.updateProfile(payload);
      if (result.success) {
        dispatch({ type: "auth/setUser", payload: result.data });
        return result.data;
      } else {
        throw new Error(result.error);
      }
    }
  );

  const { execute: changeUserPassword, loading: passwordLoading, error: passwordError } = useApiCall(
    async (currentPassword, newPassword) => {
      const result = await AuthService.changePassword(currentPassword, newPassword);
      if (result.success) {
        return result;
      } else {
        throw new Error(result.error);
      }
    }
  );

  return {
    // State
    user,
    isAuthenticated,
    role,

    // Login
    loginUser,
    loginLoading,
    loginError,

    // Register
    registerUser,
    registerLoading,
    registerError,

    // Logout
    logoutUser,
    logoutLoading,

    // Profile
    updateUserProfile,
    updateLoading,
    updateError,

    // Password
    changeUserPassword,
    passwordLoading,
    passwordError,
  };
};

export default useAuth;
