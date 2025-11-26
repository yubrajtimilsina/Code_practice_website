import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi, meApi } from "../api/authApi";

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
const token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const initialState = {
  user: user,
  loading: false,
  error: null,
  token: token,
};

export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await registerApi(payload);
      if (data.user?.token && typeof data.user.token === 'string' && data.user.token.trim() !== '') {
        localStorage.setItem("token", data.user.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data.user;
    } catch (error) {
      const responseData = error.response?.data;
      if (responseData) {
        if (Array.isArray(responseData.errors)) {
          return rejectWithValue(responseData.errors.join(", "));
        }
        if (typeof responseData.error === "string") {
          return rejectWithValue(responseData.error);
        }
      }
      return rejectWithValue("Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await loginApi(payload);
      if (data.user?.token && typeof data.user.token === 'string' && data.user.token.trim() !== '') {
        localStorage.setItem("token", data.user.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data.user;
    } catch (error) {
      const message = error.response?.data?.error || "Login failed";
      return rejectWithValue(message);
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await meApi();
      return data;
    } catch (error) {
      // If the token is invalid or expired, clear it from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return rejectWithValue(error.response?.data?.error || "Failed to fetch user data");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // backend returns { message, user }
        state.user = action.payload;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
      })

      // Get Me (Fetch user on app load)
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        // Ensure token is still in localStorage for subsequent requests
        const storedToken = localStorage.getItem("token");
        if (storedToken && !state.token) {
          state.token = storedToken;
        }
        localStorage.setItem("user", JSON.stringify(action.payload)); // Update user in localStorage in case of changes
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;