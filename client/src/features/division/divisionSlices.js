'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    divisions: [],
    isLoading: false,
    error: null,
    lastFetched: null,
    };

export const divisionSlice = createSlice({
  name: 'divisions',
  initialState,
  reducers: {
    setDivisions: (state, action) => {
      state.divisions = action.payload;
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

export const { setDivision, setLoading, setError, reset } = divisionSlice.actions;

export default divisionSlice.reducer;

// Selectors
export const selectAllDivisions = (state) => state.divisions.divisions;
export const selectDivisionsLoading = (state) => state.divisions.isLoading;
export const selectDivisionsError = (state) => state.divisions.error; 