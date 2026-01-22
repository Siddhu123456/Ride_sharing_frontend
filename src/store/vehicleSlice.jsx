import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/fleet-owner';

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

// 1. Add Vehicle
export const addVehicle = createAsyncThunk(
  'vehicle/add',
  async ({ fleetId, vehicleData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/fleets/${fleetId}/vehicles`, 
        vehicleData, 
        getHeaders()
      );
      return response.data; // Returns the created vehicle object
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to add vehicle');
    }
  }
);

// 2. Fetch Vehicle Doc Status
export const fetchVehicleDocStatus = createAsyncThunk(
  'vehicle/fetchDocStatus',
  async (vehicleId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/vehicles/${vehicleId}/documents/status`, 
        getHeaders()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch status');
    }
  }
);

// 3. Upload Vehicle Document
export const uploadVehicleDoc = createAsyncThunk(
  'vehicle/uploadDoc',
  async ({ vehicleId, docData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_URL}/vehicles/${vehicleId}/documents`, 
        docData, 
        getHeaders()
      );
      // Refresh status immediately
      dispatch(fetchVehicleDocStatus(vehicleId));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Upload failed');
    }
  }
);

/* --- SLICE --- */
const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState: {
    currentVehicle: null, // The vehicle currently being onboarded
    docStatus: {
      uploaded: [],
      missing: [],
      all_uploaded: false,
      all_approved: false
    },
    loading: false,
    error: null,
    successMsg: null,
    step: 1, // 1: Vehicle Details, 2: Documents
  },
  reducers: {
    resetVehicleState: (state) => {
      state.currentVehicle = null;
      state.loading = false;
      state.error = null;
      state.successMsg = null;
      state.step = 1;
      state.docStatus = { uploaded: [], missing: [], all_uploaded: false };
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMsg = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Vehicle
      .addCase(addVehicle.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVehicle = action.payload;
        state.step = 2; // Move to docs
      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Doc Status
      .addCase(fetchVehicleDocStatus.fulfilled, (state, action) => {
        state.docStatus = action.payload;
      })

      // Upload Doc
      .addCase(uploadVehicleDoc.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadVehicleDoc.fulfilled, (state) => {
        state.loading = false;
        state.successMsg = "Document uploaded successfully";
      })
      .addCase(uploadVehicleDoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVehicleState, clearMessages } = vehicleSlice.actions;
export default vehicleSlice.reducer;