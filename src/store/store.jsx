import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice"; // ✅ or "./authSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
