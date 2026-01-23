import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import adminReducer from "./adminSlice";
import fleetReducer from "./fleetSlice";
import vehicleReducer from "./vehicleSlice"; // ✅ Imported

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    fleet: fleetReducer,
    vehicle: vehicleReducer, // ✅ Added
  },
});

export default store;