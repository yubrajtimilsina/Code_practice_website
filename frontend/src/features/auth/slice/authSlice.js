import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi, meApi } from "../api/authApi";

//  CRITICAL FIX: Secure token storage with validation
const setAuthData = (user, token) => {
  try {
    if (!user || !token) {
      console.error(" Cannot store auth data: missing user or token");
      return;
    }

    //  Validate token format (basic JWT check)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error(" Invalid token format");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    
    console.log(" Auth data stored successfully");
  } catch (error) {
    console.error(" Failed to store auth data:", error);
  }
};

const clearAuthData = () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log(" Auth data cleared");
  } catch (error) {
    console.error(" Failed to clear auth data:", error);
  }
};

const getUserFromLocalStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    
    if (!userStr || userStr === "null" || userStr === "undefined") {
      return null;
    }

    const user = JSON.parse(userStr);
    
    //  Validate user object
    if (!user || !user.id || !user.email) {
      console.warn(" Invalid user data in localStorage, clearing...");
      clearAuthData();
      return null;
    }

    return user;
  } catch (error) {
    console.error(" Error parsing user from localStorage:", error);
    clearAuthData();
    return null;
  }
};

const getTokenFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token || token === "null" || token === "undefined") {
      return null;
    }

    //  Basic JWT format validation
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      console.warn(" Invalid token format in localStorage, clearing...");
      clearAuthData();
      return null;
    }

    return token.trim();
  } catch (error) {
    console.error(" Error reading token from localStorage:", error);
    clearAuthData();
    return null;
  }
};

//  Initialize state from localStorage
const user = getUserFromLocalStorage();
const token = getTokenFromLocalStorage();

const initialState = {
  user: user,
  loading: false,
  error: null,
  token: token,
};

//  Register thunk with better error handling
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await registerApi(payload);
      
      if (!data || !data.user || !data.user.token) {
        throw new Error("Invalid response from server");
      }

      setAuthData(data.user, data.user.token);
      return data.user;
      
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.response?.data?.errors?.[0] || 
                     error.message || 
                     "Registration failed";
      return rejectWithValue(message);
    }
  }
);

//  Login thunk with better error handling
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await loginApi(payload);
      
      if (!data || !data.user || !data.user.token) {
        throw new Error("Invalid response from server");
      }

      setAuthData(data.user, data.user.token);
      return data.user;
      
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.response?.data?.errors?.[0] || 
                     error.message || 
                     "Login failed";
      return rejectWithValue(message);
    }
  }
);

//  Get Me thunk with better error handling
export const getMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      // Check if token exists before making request
      const token = getTokenFromLocalStorage();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const { data } = await meApi();
      
      if (!data || !data.id) {
        throw new Error("Invalid user data received");
      }

      return data;
      
    } catch (error) {
      clearAuthData();
      
      const message = error.response?.data?.error || 
                     error.message || 
                     "Failed to fetch user data";
      
      return rejectWithValue(message);
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
      state.error = null;
      clearAuthData();
    },
    clearError: (state) => {
      state.error = null;
    }
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
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
      })

      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = getTokenFromLocalStorage();
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;