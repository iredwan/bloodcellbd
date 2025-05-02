'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  districts: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const districtSlice = createSlice({
  name: 'districts',
  initialState,
  reducers: {
    setDistricts: (state, action) => {
      state.districts = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    reset: (state) => {
      return initialState;
    },
  },
});

export const { setDistricts, setLoading, setError, reset } = districtSlice.actions;

export default districtSlice.reducer;

// Selectors
export const selectAllDistricts = (state) => state.districts.districts;
export const selectDistrictsLoading = (state) => state.districts.isLoading;
export const selectDistrictsError = (state) => state.districts.error; 