'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  donations: [],
  userDonations: [],
  currentDonation: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const wantToDonateSlice = createSlice({
  name: 'wantToDonate',
  initialState,
  reducers: {
    setDonations: (state, action) => {
      state.donations = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setUserDonations: (state, action) => {
      state.userDonations = action.payload;
    },
    setCurrentDonation: (state, action) => {
      state.currentDonation = action.payload;
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
  setDonations,
  setUserDonations,
  setCurrentDonation,
  setLoading,
  setError,
  reset,
} = wantToDonateSlice.actions;

export default wantToDonateSlice.reducer;

// Selectors
export const selectAllDonations = (state) => state.wantToDonate.donations;
export const selectUserDonations = (state) => state.wantToDonate.userDonations;
export const selectCurrentDonation = (state) => state.wantToDonate.currentDonation;
export const selectWantToDonateLoading = (state) => state.wantToDonate.isLoading;
export const selectWantToDonateError = (state) => state.wantToDonate.error; 