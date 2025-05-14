'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  upazilaTeams: [],
  currentUpazilaTeam: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const upazilaTeamSlice = createSlice({
  name: 'upazilaTeam',
  initialState,
  reducers: {
    setUpazilaTeams: (state, action) => {
      state.upazilaTeams = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setCurrentUpazilaTeam: (state, action) => {
      state.currentUpazilaTeam = action.payload;
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
  setUpazilaTeams, 
  setCurrentUpazilaTeam, 
  setLoading, 
  setError, 
  reset 
} = upazilaTeamSlice.actions;

export default upazilaTeamSlice.reducer;

// Selectors
export const selectAllUpazilaTeams = (state) => state.upazilaTeam.upazilaTeams;
export const selectCurrentUpazilaTeam = (state) => state.upazilaTeam.currentUpazilaTeam;
export const selectUpazilaTeamLoading = (state) => state.upazilaTeam.isLoading;
export const selectUpazilaTeamError = (state) => state.upazilaTeam.error; 