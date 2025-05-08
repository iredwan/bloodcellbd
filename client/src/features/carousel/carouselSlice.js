'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  carouselItems: [],
  activeCarouselItems: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const carouselSlice = createSlice({
  name: 'carousel',
  initialState,
  reducers: {
    setCarouselItems: (state, action) => {
      state.carouselItems = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setActiveCarouselItems: (state, action) => {
      state.activeCarouselItems = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addCarouselItem: (state, action) => {
      state.carouselItems.push(action.payload);
    },
    updateCarouselItem: (state, action) => {
      const index = state.carouselItems.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.carouselItems[index] = action.payload;
      }
    },
    removeCarouselItem: (state, action) => {
      state.carouselItems = state.carouselItems.filter(item => item._id !== action.payload);
    },
    reset: () => initialState,
  },
});

export const {
  setCarouselItems,
  setActiveCarouselItems,
  setLoading,
  setError,
  addCarouselItem,
  updateCarouselItem,
  removeCarouselItem,
  reset
} = carouselSlice.actions;

// Selectors
export const selectAllCarouselItems = (state) => state.carousel.carouselItems;
export const selectActiveCarouselItems = (state) => state.carousel.activeCarouselItems;
export const selectCarouselLoading = (state) => state.carousel.isLoading;
export const selectCarouselError = (state) => state.carousel.error;

export default carouselSlice.reducer; 