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

// 1. Check Fleet Status (Existing)
export const checkFleetStatus = createAsyncThunk('fleet/checkStatus', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/me`, getHeaders());
    return response.data; 
  } catch (err) {
    if (err.response && err.response.status === 404) return null;
    return rejectWithValue(err.response?.data?.detail);
  }
});

// 2. Fetch Tenants (Existing)
export const fetchFleetTenants = createAsyncThunk('fleet/fetchTenants', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/tenants`, getHeaders());
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail);
  }
});

// 3. Apply for Fleet (Existing)
export const applyForFleet = createAsyncThunk('fleet/apply', async ({ tenantId, fleetName }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/apply`, { tenant_id: parseInt(tenantId), fleet_name: fleetName }, getHeaders());
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail);
  }
});

// ✅ 4. Fetch Document Status (NEW)
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

// ✅ 5. Upload Document (NEW)
export const uploadFleetDoc = createAsyncThunk(
  'fleet/uploadDoc',
  async ({ fleetId, docData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_URL}/fleets/${fleetId}/documents`, 
        docData, 
        getHeaders()
      );
      // Immediately refresh status to update UI
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
    
    // ✅ Document State
    docStatus: {
      uploaded: [],
      missing: [],
      all_uploaded: false,
      all_approved: false
    },
    
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
      // Check Status
      .addCase(checkFleetStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.fleet = action.payload;
          state.hasExistingFleet = true;
          state.step = 2; // ✅ If fleet exists, go to docs immediately (handled in component)
        } else {
          state.fleet = null;
          state.hasExistingFleet = false;
        }
      })
      
      // Fetch Tenants
      .addCase(fetchFleetTenants.fulfilled, (state, action) => { state.availableTenants = action.payload; })

      // Apply
      .addCase(applyForFleet.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(applyForFleet.fulfilled, (state, action) => {
        state.loading = false;
        state.fleet = action.payload;
        state.hasExistingFleet = true;
        state.step = 2; // ✅ Move to Step 2
      })
      .addCase(applyForFleet.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // ✅ Fetch Doc Status
      .addCase(fetchDocStatus.fulfilled, (state, action) => {
        state.docStatus = action.payload;
      })

      // ✅ Upload Doc
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