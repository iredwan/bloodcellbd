'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  monitorTeams: [],
  currentMonitorTeam: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const monitorTeamSlice = createSlice({
  name: 'monitorTeam',
  initialState,
  reducers: {
    setMonitorTeams: (state, action) => {
      state.monitorTeams = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setCurrentMonitorTeam: (state, action) => {
      state.currentMonitorTeam = action.payload;
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
  setMonitorTeams, 
  setCurrentMonitorTeam, 
  setLoading, 
  setError, 
  reset 
} = monitorTeamSlice.actions;

export default monitorTeamSlice.reducer;

// Selectors
export const selectAllMonitorTeams = (state) => state.monitorTeam.monitorTeams;
export const selectCurrentMonitorTeam = (state) => state.monitorTeam.currentMonitorTeam;
export const selectMonitorTeamLoading = (state) => state.monitorTeam.isLoading;
export const selectMonitorTeamError = (state) => state.monitorTeam.error; 