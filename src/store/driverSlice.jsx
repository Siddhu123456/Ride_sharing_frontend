import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:8000";

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

/* ===================== DOCUMENTS ===================== */

export const fetchDriverDocStatus = createAsyncThunk(
    "driver/docStatus",
    async () => (await axios.get(`${API}/driver/documents/status`, authHeader())).data
);

export const uploadDriverDocument = createAsyncThunk(
    "driver/uploadDoc",
    async (payload) =>
        (await axios.post(`${API}/driver/documents`, payload, authHeader())).data
);

/* ===================== SHIFT ===================== */

export const startShift = createAsyncThunk(
    "driver/startShift",
    async (payload) =>
        (await axios.post(`${API}/drivers/shifts/start`, payload)).data
);

export const endShift = createAsyncThunk(
    "driver/endShift",
    async (payload) =>
        (await axios.post(`${API}/drivers/shifts/end`, payload)).data
);

export const fetchCurrentShift = createAsyncThunk(
    "driver/currentShift",
    async (driverId) =>
        (await axios.get(`${API}/drivers/${driverId}/shift/current`)).data
);

/* ===================== OFFERS ===================== */

export const fetchOffers = createAsyncThunk(
    "driver/offers",
    async () =>
        (await axios.get(`${API}/driver/offers/pending`, authHeader())).data
);

export const respondOffer = createAsyncThunk(
    "driver/respondOffer",
    async ({ attemptId, accept }) =>
        (await axios.post(
            `${API}/driver/offers/${attemptId}/respond`,
            { accept },
            authHeader()
        )).data
);

/* ===================== OTP ===================== */

export const generateOtp = createAsyncThunk(
    "driver/generateOtp",
    async (tripId) =>
        (await axios.post(`${API}/trips/${tripId}/otp/generate`, {}, authHeader())).data
);

export const verifyOtp = createAsyncThunk(
    "driver/verifyOtp",
    async ({ tripId, otp_code }) =>
        (await axios.post(
            `${API}/trips/${tripId}/otp/verify`,
            { otp_code },
            authHeader()
        )).data
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
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        /* ===================== EXPLICIT CASES FIRST ===================== */

        builder
            .addCase(fetchDriverDocStatus.fulfilled, (state, action) => {
                state.docStatus = action.payload;
            })
            .addCase(fetchOffers.fulfilled, (state, action) => {
                state.offers = action.payload;
            })
            .addCase(fetchCurrentShift.fulfilled, (state, action) => {
                state.shift = action.payload;
            })

            /* ===================== MATCHERS LAST ===================== */

            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/fulfilled"),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }

});

export default driverSlice.reducer;
