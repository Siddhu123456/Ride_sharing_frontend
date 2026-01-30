import { configureStore } from "@reduxjs/toolkit";

/* ================= AUTH & CORE ================= */
import authReducer from "./authslice";
import adminReducer from "./adminSlice";

/* ================= FLEET ================= */
import fleetReducer from "./fleetSlice";
import vehicleReducer from "./vehicleSlice";

/* ================= RIDER ================= */
import locationReducer from "./locationSlice";
import fareReducer from "./fareSlice";
import tripReducer from "./tripSlice"; // Rider trip lifecycle

/* ================= DRIVER ================= */
import driverReducer from "./driverSlice";

/* ================= TENANT ADMIN ================= */
import tenantAdminReducer from "./tenantAdminSlice";

const store = configureStore({
  reducer: {
    /* Auth */
    auth: authReducer,

    /* Admin */
    admin: adminReducer,
    tenantAdmin: tenantAdminReducer,

    /* Fleet */
    fleet: fleetReducer,
    vehicle: vehicleReducer,

    /* Rider */
    location: locationReducer,
    fare: fareReducer,
    trip: tripReducer,

    /* Driver */
    driver: driverReducer,
  },
});

export default store;
