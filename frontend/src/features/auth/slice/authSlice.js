import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { loginApi, registerApi } from "../api/authApi";

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
        return rejectWithValue(error.response?.data?.message || "Register failed");
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
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }); 
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;