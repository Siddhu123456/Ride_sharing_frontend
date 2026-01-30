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

export const requestTrip = createAsyncThunk(
  "trip/request",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/request`,
        payload,
        getHeaders()
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err, "Failed to request trip"));
    }
  }
);

export const fetchTripStatus = createAsyncThunk(
  "trip/fetchStatus",
  async (tripId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/${tripId}`,
        getHeaders()
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err, "Failed to fetch trip status"));
    }
  }
);

export const fetchTripOtp = createAsyncThunk(
  "trip/fetchOtp",
  async (tripId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/${tripId}/otp`,
        getHeaders()
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err, "Failed to fetch OTP"));
    }
  }
);

export const cancelTrip = createAsyncThunk(
  "trip/cancel",
  async ({ tripId, reason }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/${tripId}/cancel`,
        { reason },
        getHeaders()
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err, "Failed to cancel trip"));
    }
  }
);

/* -----------------------------------------
   SLICE
------------------------------------------ */

const tripSlice = createSlice({
  name: "trip",
  initialState: {
    currentTrip: null,
    tripId: null,
    status: null,
    driverId: null,
    vehicleId: null,

    requestedAt: null,
    assignedAt: null,
    pickedUpAt: null,
    completedAt: null,
    cancelledAt: null,

    otp: null,
    fareAmount: null,

    loading: false,
    requesting: false,
    cancelling: false,
    error: null,
  },

  reducers: {
    resetTripState: () => ({
      currentTrip: null,
      tripId: null,
      status: null,
      driverId: null,
      vehicleId: null,
      requestedAt: null,
      assignedAt: null,
      pickedUpAt: null,
      completedAt: null,
      cancelledAt: null,
      otp: null,
      fareAmount: null,
      loading: false,
      requesting: false,
      cancelling: false,
      error: null,
    }),

    clearOtp: (state) => {
      state.otp = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Request Trip
      .addCase(requestTrip.pending, (state) => {
        state.requesting = true;
        state.error = null;
      })
      .addCase(requestTrip.fulfilled, (state, action) => {
        state.requesting = false;
        state.currentTrip = action.payload;
        state.tripId = action.payload.trip_id;
        state.status = action.payload.status;
        state.fareAmount = action.payload.fare_amount;
      })
      .addCase(requestTrip.rejected, (state, action) => {
        state.requesting = false;
        state.error = action.payload;
      })

      // Fetch Trip Status
      .addCase(fetchTripStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTripStatus.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, {
          tripId: action.payload.trip_id,
          status: action.payload.status,
          driverId: action.payload.driver_id,
          vehicleId: action.payload.vehicle_id,
          requestedAt: action.payload.requested_at,
          assignedAt: action.payload.assigned_at,
          pickedUpAt: action.payload.picked_up_at,
          completedAt: action.payload.completed_at,
          cancelledAt: action.payload.cancelled_at,
        });
      })
      .addCase(fetchTripStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch OTP
      .addCase(fetchTripOtp.fulfilled, (state, action) => {
        state.otp = action.payload.otp;
      })

      // Cancel Trip
      .addCase(cancelTrip.pending, (state) => {
        state.cancelling = true;
      })
      .addCase(cancelTrip.fulfilled, (state) => {
        state.cancelling = false;
        state.status = "CANCELLED";
      })
      .addCase(cancelTrip.rejected, (state, action) => {
        state.cancelling = false;
        state.error = action.payload;
      });
  },
});

export const { resetTripState, clearOtp } = tripSlice.actions;

export default tripSlice.reducer;
