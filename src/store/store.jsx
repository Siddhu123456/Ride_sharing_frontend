import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice"; 
import adminReducer from "./adminSlice"; // 1. Import the new slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer, // 2. Add it here with the key 'admin'
  },
});

export default store;