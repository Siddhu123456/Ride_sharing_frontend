import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:8000";

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

/* ===================== DOCUMENTS ===================== */

export const fetchDriverDocStatus = createAsyncThunk(
    "driver/docStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API}/driver/documents/status`,
                authHeader()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || "Failed to fetch documents"
            );
        }
    }
);

export const uploadDriverDocument = createAsyncThunk(
    "driver/uploadDoc",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API}/driver/documents`,
                payload,
                authHeader()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || "Failed to upload document"
            );
        }
    }
);

/* ===================== SHIFT ===================== */

export const startShift = createAsyncThunk(
    "driver/startShift",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API}/drivers/shifts/start`,
                payload,
                authHeader()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || "Failed to start shift"
            );
        }
    }
);

export const endShift = createAsyncThunk(
    "driver/endShift",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API}/drivers/shifts/end`,
                payload,
                authHeader()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || "Failed to end shift"
            );
        }
    }
);

export const fetchCurrentShift = createAsyncThunk(
    "driver/currentShift",
    async (driverId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API}/drivers/${driverId}/shift/current`,
                authHeader()
            );
            return response.data;
        } catch (error) {
            // 404 is expected when no active shift exists
            if (error.response?.status === 404) {
                return rejectWithValue("No active shift");
            }
            return rejectWithValue(
                error.response?.data?.detail || "Failed to fetch shift"
            );
        }
    }
);

export const updateLocation = createAsyncThunk(
    "driver/updateLocation",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API}/drivers/location/update`,
                payload,
                authHeader()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || "Failed to update location"
            );
        }
    }
);

/* ===================== OFFERS ===================== */

export const fetchOffers = createAsyncThunk(
    "driver/offers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API}/driver/offers/pending`,
                authHeader()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || "Failed to fetch offers"
            );
        }
    }
);

export const respondOffer = createAsyncThunk(
    "driver/respondOffer",
    async ({ attemptId, accept }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API}/driver/offers/${attemptId}/respond`,
                { accept },
                authHeader()
            );
            return { data: response.data, attemptId };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || "Failed to respond to offer"
            );
        }
    }
);

/* ===================== OTP ===================== */

export const generateOtp = createAsyncThunk(
    "driver/generateOtp",
    async (tripId, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API}/trips/${tripId}/otp/generate`,
                {},
                authHeader()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || "Failed to generate OTP"
            );
        }
    }
);

export const verifyOtp = createAsyncThunk(
    "driver/verifyOtp",
    async ({ tripId, otp_code }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API}/trips/${tripId}/otp/verify`,
                { otp_code },
                authHeader()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || "Invalid OTP"
            );
        }
    }
);

/* ===================== TRIP ===================== */

export const completeTrip = createAsyncThunk(
    "driver/completeTrip",
    async (tripId, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API}/trips/${tripId}/complete`,
                {},
                authHeader()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || "Failed to complete trip"
            );
        }
    }
);

/* ===================== SLICE ===================== */

const driverSlice = createSlice({
    name: "driver",
    initialState: {
        docStatus: null,
        shift: null,
        offers: [],
        activeTrip: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setActiveTrip: (state, action) => {
            state.activeTrip = action.payload;
        },
        clearActiveTrip: (state) => {
            state.activeTrip = null;
        },
        // Clear shift when 404 or OFFLINE
        clearShift: (state) => {
            state.shift = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ========== DOCUMENT STATUS ==========
            .addCase(fetchDriverDocStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDriverDocStatus.fulfilled, (state, action) => {
                state.docStatus = action.payload;
                state.loading = false;
            })
            .addCase(fetchDriverDocStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ========== DOCUMENT UPLOAD ==========
            .addCase(uploadDriverDocument.pending, (state) => {
                state.loading = true;
            })
            .addCase(uploadDriverDocument.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(uploadDriverDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ========== CURRENT SHIFT ==========
            .addCase(fetchCurrentShift.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentShift.fulfilled, (state, action) => {
                state.shift = action.payload;
                state.loading = false;
            })
            .addCase(fetchCurrentShift.rejected, (state, action) => {
                // 404 is expected - driver hasn't started shift
                if (action.payload === "No active shift") {
                    state.shift = null;
                    state.error = null; // Don't show error for 404
                } else {
                    state.error = action.payload;
                }
                state.loading = false;
            })

            // ========== START SHIFT ==========
            .addCase(startShift.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(startShift.fulfilled, (state, action) => {
                state.shift = action.payload;
                state.loading = false;
            })
            .addCase(startShift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ========== END SHIFT ==========
            .addCase(endShift.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(endShift.fulfilled, (state) => {
                state.shift = null; // Clear shift after ending
                state.loading = false;
            })
            .addCase(endShift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ========== OFFERS ==========
            .addCase(fetchOffers.pending, (state) => {
                // Don't set loading for background polling
                if (state.offers.length === 0) {
                    state.loading = true;
                }
                state.error = null;
            })
            .addCase(fetchOffers.fulfilled, (state, action) => {
                state.offers = action.payload;
                state.loading = false;
            })
            .addCase(fetchOffers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ========== RESPOND TO OFFER ==========
            .addCase(respondOffer.pending, (state) => {
                state.error = null;
            })
            .addCase(respondOffer.fulfilled, (state, action) => {
                state.offers = state.offers.filter(
                    offer => offer.attempt_id !== action.payload.attemptId
                );

                // ✅ IMPORTANT: backend should return trip
                if (action.payload.data?.trip) {
                    state.activeTrip = action.payload.data.trip;
                }

                state.loading = false;
            })

            .addCase(respondOffer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ========== OTP ==========
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.activeTrip = action.payload;
                state.loading = false;
            })

            // ========== COMPLETE TRIP ==========
            .addCase(completeTrip.fulfilled, (state) => {
                state.activeTrip = null;
                state.loading = false;
            });
    }
});

export const { clearError, setActiveTrip, clearActiveTrip, clearShift } = driverSlice.actions;
export default driverSlice.reducer;