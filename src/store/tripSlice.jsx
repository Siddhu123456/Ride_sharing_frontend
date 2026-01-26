import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/trips";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } };
};

const getErrorMsg = (err, fallback = "Something went wrong") => {
  const data = err?.response?.data;

  if (Array.isArray(data?.detail)) {
    return data.detail.map((e) => e?.msg).filter(Boolean).join(", ") || fallback;
  }
  if (Array.isArray(data)) {
    return data.map((e) => e?.msg).filter(Boolean).join(", ") || fallback;
  }
  if (typeof data?.detail === "string") return data.detail;

  return err?.message || fallback;
};

/* ---------------------------
   THUNKS
---------------------------- */

export const requestTrip = createAsyncThunk(
  "trip/requestTrip",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/request`, payload, getHeaders());
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err, "Trip request failed"));
    }
  }
);

export const fetchTripStatus = createAsyncThunk(
  "trip/fetchTripStatus",
  async (tripId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${tripId}`, getHeaders());
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err, "Failed to fetch trip status"));
    }
  }
);

export const cancelTrip = createAsyncThunk(
  "trip/cancelTrip",
  async ({ tripId, payload }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/${tripId}/cancel`, payload, getHeaders());
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err, "Failed to cancel trip"));
    }
  }
);

/* ---------------------------
   SLICE
---------------------------- */

const tripSlice = createSlice({
  name: "trip",
  initialState: {
    currentTrip: null,
    tripStatus: null,

    lastTripId: null,
    polling: false,

    loading: false,
    error: null,
    successMsg: null,
  },
  reducers: {
    clearTripMessages: (state) => {
      state.error = null;
      state.successMsg = null;
    },
    resetTripFlow: (state) => {
      state.currentTrip = null;
      state.tripStatus = null;
      state.lastTripId = null;
      state.polling = false;
      state.error = null;
      state.successMsg = null;
    },
    setLastTripId: (state, action) => {
      state.lastTripId = action.payload;
    },
    setPolling: (state, action) => {
      state.polling = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestTrip.fulfilled, (state, action) => {
        state.currentTrip = action.payload;
        state.lastTripId = action.payload.trip_id;
        state.successMsg = "Trip requested successfully ✅";
      })
      .addCase(fetchTripStatus.fulfilled, (state, action) => {
        state.tripStatus = action.payload;
      })
      .addCase(cancelTrip.fulfilled, (state) => {
        state.successMsg = "Trip cancelled successfully ❌";
      })
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = null;
      })
      .addMatcher((action) => action.type.endsWith("/fulfilled"), (state) => {
        state.loading = false;
      })
      .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTripMessages, resetTripFlow, setLastTripId, setPolling } = tripSlice.actions;
export default tripSlice.reducer;
