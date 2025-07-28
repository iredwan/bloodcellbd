'use client';

import { apiSlice } from '../api/apiSlice';

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all reviews
    getAllReviews: builder.query({
      query: (params) => ({
        url: 'reviews/all',
        params: params
      }),
      providesTags: ['Review'],
    }),

    // Get all reviews for public
    getReviewsForPublic: builder.query({
      query: (params) => ({
        url: 'reviews/public',
        params: params
      }),
      providesTags: ['Review'],
    }),
    // Get review by ID
    getReviewById: builder.query({
      query: (id) => ({
        url: `reviews/get/${id}`,
      }),
      providesTags:  ['Review'],
    }),
    
    // Get user reviews
    getUserReviews: builder.query({
      query: () => ({
        url: 'reviews/user-id',
      }),
      providesTags: ['Review'],
    }),
    
    // Get approved reviews
    getApprovedReviews: builder.query({
      query: () => ({
        url: 'reviews/approved',
      }),
      providesTags: ['Review'],
    }),
    
    // Create a review
    createReview: builder.mutation({
      query: (data) => ({
        url: "reviews/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Review'],
    }),
    
    // Update a review
    updateReview: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `reviews/update/${id}`,
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: ['Review'],
    }),
    
    // Update review status
    updateReviewStatus: builder.mutation({
      query: ({ id, statusData }) => ({
        url: `reviews/status/${id}`,
        method: 'PUT',
        body: statusData
      }),
      invalidatesTags: ['Review'],
    }),
    
    // Delete a review
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `reviews/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Review'],
    })
  })
});

export const {
  useGetAllReviewsQuery,
  useGetReviewsForPublicQuery,
  useGetReviewByIdQuery,
  useGetUserReviewsQuery,
  useGetApprovedReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation
} = reviewApiSlice; 