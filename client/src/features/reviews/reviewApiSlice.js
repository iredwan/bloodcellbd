'use client';

import { apiSlice } from '../api/apiSlice';
import { 
  setReviews, 
  setUserReviews, 
  setApprovedReviews,
  setCurrentReview,
  setLoading, 
  setError,
  addReview,
  updateReviewInState,
  removeReview 
} from './reviewSlice';

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all reviews
    getAllReviews: builder.query({
      query: () => 'reviews/all',
      providesTags: ['Review'],
      transformResponse: (response) => {
        // Handle API success response format
        if (response.status && response.data) {
          return response;
        }
        
        // Direct data format
        if (Array.isArray(response)) {
          return { status: true, data: response };
        }
        
        console.warn('Unexpected review API response format:', response);
        return { status: false, data: [] };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          
          // Store reviews in Redux state
          if (data.status && data.data) {
            dispatch(setReviews(data.data));
          } else if (Array.isArray(data)) {
            dispatch(setReviews(data));
          } else {
            dispatch(setReviews([]));
          }
        } catch (error) {
          console.error('Error fetching reviews:', error);
          dispatch(setError(error.message || 'Failed to fetch reviews'));
          dispatch(setReviews([]));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    // Get review by ID
    getReviewById: builder.query({
      query: (id) => `reviews/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Review', id }],
      transformResponse: (response) => {
        if (response && response.status && response.data) {
          return response.data;
        }
        return null;
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setCurrentReview(data));
        } catch (error) {
          console.error(`Error fetching review with ID ${id}:`, error);
          dispatch(setError(error.message || `Failed to fetch review with ID ${id}`));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    // Get user reviews
    getUserReviews: builder.query({
      query: () => 'reviews/user-id',
      providesTags: ['Review'],
      transformResponse: (response) => {
        if (response && response.status && response.data) {
          return response.data;
        }
        return [];
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setUserReviews(data));
        } catch (error) {
          console.error('Error fetching user reviews:', error);
          dispatch(setError(error.message || 'Failed to fetch your reviews'));
          dispatch(setUserReviews([]));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    // Get approved reviews
    getApprovedReviews: builder.query({
      query: () => 'reviews/approved',
      providesTags: ['Review'],
      transformResponse: (response) => {
        if (response && response.status && response.data) {
          return response.data;
        }
        return [];
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setApprovedReviews(data));
        } catch (error) {
          console.error('Error fetching approved reviews:', error);
          dispatch(setError(error.message || 'Failed to fetch approved reviews'));
          dispatch(setApprovedReviews([]));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    // Create a review
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: 'reviews/create',
        method: 'POST',
        body: reviewData
      }),
      invalidatesTags: ['Review'],
      async onQueryStarted(reviewData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status && data.data) {
            dispatch(addReview(data.data));
          }
        } catch (error) {
          console.error('Error creating review:', error);
        }
      }
    }),
    
    // Update a review
    updateReview: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `reviews/update/${id}`,
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Review', id },
        'Review'
      ],
      async onQueryStarted({ id, ...updateData }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status && data.data) {
            dispatch(updateReviewInState(data.data));
          }
        } catch (error) {
          console.error(`Error updating review with ID ${id}:`, error);
        }
      }
    }),
    
    // Update review status
    updateReviewStatus: builder.mutation({
      query: ({ id, ...statusData }) => ({
        url: `reviews/status/${id}`,
        method: 'PUT',
        body: statusData
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Review', id },
        'Review'
      ]
    }),
    
    // Delete a review
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `reviews/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Review'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(removeReview(id));
        } catch (error) {
          console.error(`Error deleting review with ID ${id}:`, error);
        }
      }
    })
  })
});

export const {
  useGetAllReviewsQuery,
  useGetReviewByIdQuery,
  useGetUserReviewsQuery,
  useGetApprovedReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation
} = reviewApiSlice; 