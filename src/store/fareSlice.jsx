import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/trips";

/* -----------------------------------------
   Helpers
------------------------------------------ */

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const getErrorMsg = (err, fallback = "Something went wrong") => {
  const data = err?.response?.data;

  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail))
    return data.detail.map((e) => e?.msg).filter(Boolean).join(", ");

  return err?.message || fallback;
};

/* -----------------------------------------
   ASYNC THUNKS
------------------------------------------ */

export const fetchFareEstimates = createAsyncThunk(
  "fare/fetchEstimates",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/fare-estimate`,
        payload,
        getHeaders()
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err, "Failed to fetch fare estimates"));
    }
  }
);

/* -----------------------------------------
   SLICE
------------------------------------------ */

const fareSlice = createSlice({
  name: "fare",
  initialState: {
    estimates: [],
    cityId: null,
    pickupAddress: "",
    dropAddress: "",
    distanceKm: 0,
    vehicleCategory: "CAB",
    selectedTenant: null,
    loading: false,
    error: null,
  },

  reducers: {
    setVehicleCategory: (state, action) => {
      state.vehicleCategory = action.payload;
    },

    selectTenant: (state, action) => {
      state.selectedTenant = action.payload;
    },

    setPickupLocationAddress: (state, action) => {
        state.pickupAddress = action.payload
    },

    setDropLocationAddress: (state, action) => {
        state.dropAddress = action.payload
    },

    resetFareState: () => ({
      estimates: [],
      cityId: null,
      pickupAddress: "",
      dropAddress: "",
      distanceKm: 0,
      vehicleCategory: "CAB",
      selectedTenant: null,
      loading: false,
      error: null,
    }),
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFareEstimates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFareEstimates.fulfilled, (state, action) => {
        state.loading = false;
        state.estimates = action.payload.estimates || [];
        state.cityId = action.payload.city_id;
        state.pickupAddress = action.payload.pickup_address;
        state.dropAddress = action.payload.drop_address;
        state.distanceKm = action.payload.distance_km;
        state.vehicleCategory = action.payload.vehicle_category;

        // Auto-sort by price
        state.estimates.sort((a, b) => a.fare - b.fare);
      })
      .addCase(fetchFareEstimates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setVehicleCategory,
  selectTenant,
  resetFareState,
  setPickupLocationAddress,
  setDropLocationAddress
} = fareSlice.actions;

export default fareSlice.reducer;
