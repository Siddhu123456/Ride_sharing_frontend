import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/fleet-owner';

// Helper for Auth Headers
const getHeaders = () => {
  const token = localStorage.getItem('token'); 
  return { 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } 
  };
};

/* --- THUNKS --- */

// 1. Apply for Fleet
export const applyForFleet = createAsyncThunk(
  'fleet/apply',
  async ({ tenantId, fleetName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/apply`, 
        { tenant_id: parseInt(tenantId), fleet_name: fleetName }, 
        getHeaders()
      );
      return response.data; // Returns fleet object
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Application failed');
    }
  }
);

// 2. Fetch Document Status
export const fetchDocStatus = createAsyncThunk(
  'fleet/fetchDocStatus',
  async (fleetId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/fleets/${fleetId}/documents/status`, 
        getHeaders()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch status');
    }
  }
);

// 3. Upload Document
export const uploadFleetDoc = createAsyncThunk(
  'fleet/uploadDoc',
  async ({ fleetId, docData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_URL}/fleets/${fleetId}/documents`, 
        docData, 
        getHeaders()
      );
      // Refresh status after upload
      dispatch(fetchDocStatus(fleetId));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Upload failed');
    }
  }
);

/* --- SLICE --- */
const fleetSlice = createSlice({
  name: 'fleet',
  initialState: {
    fleet: null, // Stores current fleet details
    docStatus: {
      uploaded: [],
      missing: [],
      all_uploaded: false,
      all_approved: false
    },
    loading: false,
    error: null,
    successMsg: null,
    step: 1, // 1: Apply Form, 2: Doc Uploads, 3: Success
  },
  reducers: {
    resetFleetState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMsg = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Apply
      .addCase(applyForFleet.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(applyForFleet.fulfilled, (state, action) => {
        state.loading = false;
        state.fleet = action.payload;
        state.step = 2; // Move to docs
      })
      .addCase(applyForFleet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Doc Status
      .addCase(fetchDocStatus.fulfilled, (state, action) => {
        state.docStatus = action.payload;
        // If all uploaded, maybe move to step 3 or show success message
        if (action.payload.all_uploaded) {
            state.successMsg = "All documents uploaded. Pending verification.";
        }
      })

      // Upload Doc
      .addCase(uploadFleetDoc.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadFleetDoc.fulfilled, (state) => {
        state.loading = false;
        state.successMsg = "Document uploaded successfully";
      })
      .addCase(uploadFleetDoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetFleetState } = fleetSlice.actions;
export default fleetSlice.reducer;