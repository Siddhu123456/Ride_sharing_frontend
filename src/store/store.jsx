import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import adminReducer from "./adminSlice";
import fleetReducer from "./fleetSlice";
import vehicleReducer from "./vehicleSlice";
import tripReducer from "./tripSlice";
import driverReducer from "./driverSlice";
import tenantAdminReducer from "./tenantAdminSlice"; // ✅ ADD THIS

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    fleet: fleetReducer,
    vehicle: vehicleReducer,
    trip: tripReducer,
    driver: driverReducer,
    tenantAdmin: tenantAdminReducer, // ✅ REGISTERED
  },
});

export default store;