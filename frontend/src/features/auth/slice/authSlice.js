import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi, meApi } from "../api/authApi";

const setAuthData = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

const clearAuthData = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const getUserFromLocalStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

const getTokenFromLocalStorage = () => {
  const token = localStorage.getItem("token");
  return token && token !== "null" && token.trim() !== "" ? token : null;
};

const user = getUserFromLocalStorage();
const token = getTokenFromLocalStorage();

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
      if (data.user?.token) {
        setAuthData(data.user, data.user.token);
      }
      return data.user;
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed";
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await loginApi(payload);
      if (data.user?.token) {
        setAuthData(data.user, data.user.token);
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
      clearAuthData();
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
      clearAuthData();
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

      
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = getTokenFromLocalStorage(); // Ensure token is always synced from localStorage
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