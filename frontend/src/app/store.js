import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice/authSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
