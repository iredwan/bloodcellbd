'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reviews: [],
  userReviews: [],
  approvedReviews: [],
  currentReview: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setUserReviews: (state, action) => {
      state.userReviews = action.payload;
    },
    setApprovedReviews: (state, action) => {
      state.approvedReviews = action.payload;
    },
    setCurrentReview: (state, action) => {
      state.currentReview = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addReview: (state, action) => {
      state.reviews.unshift(action.payload);
      state.userReviews.unshift(action.payload);
    },
    updateReviewInState: (state, action) => {
      const updatedReview = action.payload;
      
      // Update in reviews array
      const reviewIndex = state.reviews.findIndex(review => review._id === updatedReview._id);
      if (reviewIndex !== -1) {
        state.reviews[reviewIndex] = updatedReview;
      }
      
      // Update in userReviews array
      const userReviewIndex = state.userReviews.findIndex(review => review._id === updatedReview._id);
      if (userReviewIndex !== -1) {
        state.userReviews[userReviewIndex] = updatedReview;
      }
      
      // Update in approvedReviews array if status is approved
      if (updatedReview.status === 'approved') {
        const approvedIndex = state.approvedReviews.findIndex(review => review._id === updatedReview._id);
        if (approvedIndex !== -1) {
          state.approvedReviews[approvedIndex] = updatedReview;
        } else {
          state.approvedReviews.push(updatedReview);
        }
      } else {
        // Remove from approvedReviews if status is not approved
        state.approvedReviews = state.approvedReviews.filter(review => review._id !== updatedReview._id);
      }
      
      // Update currentReview if it's the same review
      if (state.currentReview && state.currentReview._id === updatedReview._id) {
        state.currentReview = updatedReview;
      }
    },
    removeReview: (state, action) => {
      const reviewId = action.payload;
      state.reviews = state.reviews.filter(review => review._id !== reviewId);
      state.userReviews = state.userReviews.filter(review => review._id !== reviewId);
      state.approvedReviews = state.approvedReviews.filter(review => review._id !== reviewId);
      
      if (state.currentReview && state.currentReview._id === reviewId) {
        state.currentReview = null;
      }
    },
    reset: (state) => {
      return initialState;
    },
  },
});

export const {
  setReviews,
  setUserReviews,
  setApprovedReviews,
  setCurrentReview,
  setLoading,
  setError,
  addReview,
  updateReviewInState,
  removeReview,
  reset,
} = reviewSlice.actions;

export default reviewSlice.reducer;

// Selectors
export const selectAllReviews = (state) => state.review.reviews;
export const selectUserReviews = (state) => state.review.userReviews;
export const selectApprovedReviews = (state) => state.review.approvedReviews;
export const selectCurrentReview = (state) => state.review.currentReview;
export const selectReviewLoading = (state) => state.review.isLoading;
export const selectReviewError = (state) => state.review.error;