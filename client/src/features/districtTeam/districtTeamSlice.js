'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  districtTeams: [],
  currentDistrictTeam: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const districtTeamSlice = createSlice({
  name: 'districtTeam',
  initialState,
  reducers: {
    setDistrictTeams: (state, action) => {
      state.districtTeams = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setCurrentDistrictTeam: (state, action) => {
      state.currentDistrictTeam = action.payload;
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
  setDistrictTeams, 
  setCurrentDistrictTeam, 
  setLoading, 
  setError, 
  reset 
} = districtTeamSlice.actions;

export default districtTeamSlice.reducer;

// Selectors
export const selectAllDistrictTeams = (state) => state.districtTeam.districtTeams;
export const selectCurrentDistrictTeam = (state) => state.districtTeam.currentDistrictTeam;
export const selectDistrictTeamLoading = (state) => state.districtTeam.isLoading;
export const selectDistrictTeamError = (state) => state.districtTeam.error; 