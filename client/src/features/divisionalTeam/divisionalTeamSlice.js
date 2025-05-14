'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  divisionalTeams: [],
  currentDivisionalTeam: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const divisionalTeamSlice = createSlice({
  name: 'divisionalTeam',
  initialState,
  reducers: {
    setDivisionalTeams: (state, action) => {
      state.divisionalTeams = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setCurrentDivisionalTeam: (state, action) => {
      state.currentDivisionalTeam = action.payload;
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
  setDivisionalTeams, 
  setCurrentDivisionalTeam, 
  setLoading, 
  setError, 
  reset 
} = divisionalTeamSlice.actions;

export default divisionalTeamSlice.reducer;

// Selectors
export const selectAllDivisionalTeams = (state) => state.divisionalTeam.divisionalTeams;
export const selectCurrentDivisionalTeam = (state) => state.divisionalTeam.currentDivisionalTeam;
export const selectDivisionalTeamLoading = (state) => state.divisionalTeam.isLoading;
export const selectDivisionalTeamError = (state) => state.divisionalTeam.error; 