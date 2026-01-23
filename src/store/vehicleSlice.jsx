import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/fleet-owner';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token'); 
  const headers = { 
    'Authorization': `Bearer ${token}`
  };
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return { headers };
};

/* --- THUNKS --- */

export const addVehicle = createAsyncThunk(
  'vehicle/add',
  async ({ fleetId, vehicleData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/fleets/${fleetId}/vehicles`, 
        vehicleData, 
        getHeaders()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to add vehicle');
    }
  }
);

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

export const uploadVehicleDoc = createAsyncThunk(
  'vehicle/uploadDoc',
  async ({ vehicleId, docData }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('document_type', docData.document_type);
      formData.append('file', docData.file); // File Object

      const response = await axios.post(
        `${API_URL}/vehicles/${vehicleId}/documents`, 
        formData, 
        getHeaders(true)
      );

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
    currentVehicle: null,
    docStatus: { uploaded: [], missing: [], all_uploaded: false },
    loading: false,
    error: null,
    successMsg: null,
    step: 1, // 1: Details, 2: Docs
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
      .addCase(addVehicle.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVehicle = action.payload;
        state.step = 2;
      })
      .addCase(addVehicle.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchVehicleDocStatus.fulfilled, (state, action) => { state.docStatus = action.payload; })
      .addCase(uploadVehicleDoc.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadVehicleDoc.fulfilled, (state) => { state.loading = false; state.successMsg = "Document uploaded successfully"; })
      .addCase(uploadVehicleDoc.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { resetVehicleState, clearMessages } = vehicleSlice.actions;
export default vehicleSlice.reducer;