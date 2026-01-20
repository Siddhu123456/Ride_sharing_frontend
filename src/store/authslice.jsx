import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Base URL

// Fetch available countries for the registration dropdown
export const fetchCountries = createAsyncThunk(
  'auth/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/countries/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to load countries');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    countries: [],
    loading: false,
    countriesLoading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* Fetch Countries */
      .addCase(fetchCountries.pending, (state) => {
        state.countriesLoading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countriesLoading = false;
        state.countries = action.payload;
      })
      /* Register User */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;