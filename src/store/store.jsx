import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice"; 
import adminReducer from "./adminSlice";
import fleetReducer from "./fleetSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer, 
    fleet: fleetReducer, 
  },
});

export default store;