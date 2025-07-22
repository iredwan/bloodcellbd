'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  moderatorTeams: [],
  currentModeratorTeam: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const moderatorTeamSlice = createSlice({
  name: 'moderatorTeam',
  initialState,
  reducers: {
    setModeratorTeams: (state, action) => {
      state.moderatorTeams = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setCurrentModeratorTeam: (state, action) => {
      state.currentModeratorTeam = action.payload;
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
  setModeratorTeams, 
  setCurrentModeratorTeam, 
  setLoading, 
  setError, 
  reset 
} = moderatorTeamSlice.actions;

export default moderatorTeamSlice.reducer;

// Selectors
export const selectAllModeratorTeams = (state) => state.moderatorTeam.moderatorTeams;
export const selectCurrentModeratorTeam = (state) => state.moderatorTeam.currentModeratorTeam;
export const selectModeratorTeamLoading = (state) => state.moderatorTeam.isLoading;
export const selectModeratorTeamError = (state) => state.moderatorTeam.error; 