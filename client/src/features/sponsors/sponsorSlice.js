import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sponsors: [],
  filteredSponsors: [],
  sponsorsByType: {},
  selectedSponsor: null,
  isLoading: false,
  error: null,
};

export const sponsorSlice = createSlice({
  name: 'sponsor',
  initialState,
  reducers: {
    setSponsors: (state, { payload }) => {
      state.sponsors = payload;
    },
    setFilteredSponsors: (state, { payload }) => {
      state.filteredSponsors = payload;
    },
    setSponsorsByType: (state, { payload }) => {
      const { type, sponsors } = payload;
      state.sponsorsByType[type] = sponsors;
    },
    setSelectedSponsor: (state, { payload }) => {
      state.selectedSponsor = payload;
    },
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },
  },
});

export const {
  setSponsors,
  setFilteredSponsors,
  setSponsorsByType,
  setSelectedSponsor,
  setLoading,
  setError,
} = sponsorSlice.actions;

// Selectors
export const selectAllSponsors = (state) => state.sponsor.sponsors;
export const selectFilteredSponsors = (state) => state.sponsor.filteredSponsors;
export const selectSponsorsByType = (type) => (state) => state.sponsor.sponsorsByType[type] || [];
export const selectSelectedSponsor = (state) => state.sponsor.selectedSponsor;
export const selectSponsorLoading = (state) => state.sponsor.isLoading;
export const selectSponsorError = (state) => state.sponsor.error;

export default sponsorSlice.reducer; 