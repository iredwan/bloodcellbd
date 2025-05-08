'use client';

import { createSlice } from '@reduxjs/toolkit';

// Initial state matches the WebsiteConfigModel structure
const initialState = {
  config: {
    logo: '',
    favicon: '',
    contactInfo: {
      email: 'info@bloodcellbd.org',
      phone: '+880 1234-567890',
      address: 'Dhaka, Bangladesh'
    },
    socialMedia: {
      facebook: 'https://facebook.com/bloodcellbd',
      instagram: 'https://instagram.com/bloodcellbd',
      linkedin: 'https://linkedin.com/company/bloodcellbd',
      youtube: 'https://youtube.com/bloodcellbd'
    },
    metaTags: {
      title: 'BloodCellBD - Blood Donation Platform',
      image: '',
      description: 'Connect with blood donors in Bangladesh',
      keywords: 'blood donation, Bangladesh, donors'
    },
    stats: {
      totalMembers: 0,
      totalEligibleMembers: 0,
      totalFulfilledRequests: 0,
      totalPendingRequests: 0
    }
  },
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig: (state, action) => {
      state.config = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetConfig: (state) => {
      return initialState;
    },
  },
});

export const { setConfig, setLoading, setError, resetConfig } = configSlice.actions;

export default configSlice.reducer;

// Selectors
export const selectWebsiteConfig = (state) => state.config.config;
export const selectConfigLoading = (state) => state.config.isLoading;
export const selectConfigError = (state) => state.config.error;
export const selectLastFetched = (state) => state.config.lastFetched; 