import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/fleet-owner';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token'); 
  const headers = { 
    'Authorization': `Bearer ${token}`
  };
  // Axios automatically sets Content-Type to multipart/form-data with boundary 
  // when FormData is passed, so we only strictly need JSON header for normal requests
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return { headers };
};

/* --- THUNKS --- */

export const checkFleetStatus = createAsyncThunk(
  'fleet/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/me`, getHeaders());
      return response.data; 
    } catch (err) {
      if (err.response && err.response.status === 404) return null;
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

export const fetchFleetTenants = createAsyncThunk(
  'fleet/fetchTenants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tenants`, getHeaders());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

export const applyForFleet = createAsyncThunk(
  'fleet/apply',
  async ({ tenantId, fleetName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/apply`, 
        { tenant_id: parseInt(tenantId), fleet_name: fleetName }, 
        getHeaders()
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

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
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

// ✅ UPDATED: Uses FormData
export const uploadFleetDoc = createAsyncThunk(
  'fleet/uploadDoc',
  async ({ fleetId, docData }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('document_type', docData.document_type);
      formData.append('file', docData.file); // Actual File Object
      
      if (docData.document_number) {
        formData.append('document_number', docData.document_number);
      }

      const response = await axios.post(
        `${API_URL}/fleets/${fleetId}/documents`, 
        formData, 
        getHeaders(true) // Multipart headers
      );
      
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
    fleet: null, 
    availableTenants: [],
    hasExistingFleet: null,
    docStatus: { uploaded: [], missing: [], all_uploaded: false, all_approved: false },
    loading: false,
    error: null,
    successMsg: null,
    step: 1, 
  },
  reducers: {
    resetFleetState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMsg = null;
      state.step = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkFleetStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.fleet = action.payload;
          state.hasExistingFleet = true;
          state.step = 2; 
        } else {
          state.fleet = null;
          state.hasExistingFleet = false;
        }
      })
      .addCase(fetchFleetTenants.fulfilled, (state, action) => { state.availableTenants = action.payload; })
      .addCase(applyForFleet.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(applyForFleet.fulfilled, (state, action) => {
        state.loading = false;
        state.fleet = action.payload;
        state.hasExistingFleet = true;
        state.step = 2;
      })
      .addCase(applyForFleet.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchDocStatus.fulfilled, (state, action) => { state.docStatus = action.payload; })
      .addCase(uploadFleetDoc.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadFleetDoc.fulfilled, (state) => { state.loading = false; state.successMsg = "Document uploaded successfully"; })
      .addCase(uploadFleetDoc.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { resetFleetState } = fleetSlice.actions;
export default fleetSlice.reducer;