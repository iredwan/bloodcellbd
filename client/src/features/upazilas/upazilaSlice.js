'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  upazilas: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  // Keep track of upazilas by district for caching
  upazilasByDistrict: {}
};

export const upazilaSlice = createSlice({
  name: 'upazilas',
  initialState,
  reducers: {
    setUpazilas: (state, action) => {
      state.upazilas = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setUpazilasByDistrict: (state, action) => {
      const { districtId, upazilas } = action.payload;
      state.upazilasByDistrict[districtId] = {
        data: upazilas,
        timestamp: new Date().toISOString()
      };
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

export const { 
  setUpazilas, 
  setUpazilasByDistrict, 
  setLoading, 
  setError, 
  reset 
} = upazilaSlice.actions;

export default upazilaSlice.reducer;

// Selectors
export const selectAllUpazilas = (state) => state.upazilas.upazilas;
export const selectUpazilasByDistrict = (state, districtId) => 
  state.upazilas.upazilasByDistrict[districtId]?.data || [];
export const selectUpazilasLoading = (state) => state.upazilas.isLoading;
export const selectUpazilasError = (state) => state.upazilas.error; 