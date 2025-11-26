import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { loginApi, registerApi } from "../api/authApi";
import { meApi } from "../api/authApi";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (playload, { rejectWithValue }) => {
    try {
        const {data} = await registerApi(playload);
        return data;
    } catch (error) {
        const data = error.response?.data;
        if (data) {
          if (Array.isArray(data.errors)) {
            // Return all validation errors as joined string
            return rejectWithValue(data.errors.join(", "));
          }
          if (typeof data.error === "string") {
            return rejectWithValue(data.error);
          }
        }
        return rejectWithValue("Register failed");
    }
  }
);


export const login = createAsyncThunk(
  "auth/login",
  async (playload, { rejectWithValue }) => {    
    try {
        const {data} = await loginApi(playload);
        return data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await meApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
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
            localStorage.removeItem("token");
        }
    },  
    extraReducers: (builder) => {   
        builder
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token);
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(login.pending, (state) => {
            state.loading = true;   
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token);
        })
                .addCase(fetchCurrentUser.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                    state.loading = false;
                    // action.payload contains { id, name, email, role }
                    state.user = action.payload;
                })
                .addCase(fetchCurrentUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                    // if token invalid, clear it
                    state.token = null;
                    localStorage.removeItem("token");
                })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }); 
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;