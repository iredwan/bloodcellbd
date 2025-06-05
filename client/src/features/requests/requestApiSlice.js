'use client';

import { apiSlice } from '../api/apiSlice';

export const requestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRequests: builder.query({
      query: (reqBody) => ({
        url: 'requests/all',
        method: 'GET',
        params: reqBody,
      }),
      providesTags: ['Request'],
    }),
    getAllRequestsForAdmin: builder.query({
      query: () => 'requests/all-requests-admin',
      providesTags: ['Request'],
    }),
    getRequestById: builder.query({
      query: (id) => `requests/${id}`,
      providesTags: ['Request'],
    }),
    getFulfilledRequests: builder.query({
      query: () => 'requests/fulfilled',
      providesTags: ['Request'],
    }),
    getUserRequests: builder.query({
      query: () => 'requests/user/requests',
      providesTags: ['Request'],
    }),
    getRequestsByBloodGroup: builder.query({
      query: (bloodGroup) => `requests/bloodgroup/${bloodGroup}`,
      providesTags: ['Request'],
    }),
    createRequest: builder.mutation({
      query: (requestData) => ({
        url: 'requests/create',
        method: 'POST',
        body: requestData,
      }),
      invalidatesTags: ['Request'],
    }),
    updateRequest: builder.mutation({
      query: ({ id, requestData }) => ({
        url: `requests/update/${id}`,
        method: 'PATCH',
        body: requestData,
      }),
      invalidatesTags: ['Request'],
    }),
    processRequest: builder.mutation({
      query: (id) => ({
        url: `requests/processing-by/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Request'],
    }),
    GetProcessingRequests: builder.query({
      query: () => 'requests/get-processing-requests',
      providesTags: ['Request'],
    }),
    fulfillRequest: builder.mutation({
      query: (id) => ({
        url: `requests/fulfill-by/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Request'],
    }),
    getUserDonateHistory: builder.query({
      query: () => 'requests/get-user-donate-history',
      providesTags: ['Request'],
    }),
    deleteRequest: builder.mutation({
      query: (id) => ({
        url: `requests/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Request'],
    }),
  }),
});

export const {
  useGetAllRequestsQuery,
  useGetAllRequestsForAdminQuery,
  useGetRequestByIdQuery,
  useGetFulfilledRequestsQuery,
  useGetUserDonateHistoryQuery,
  useGetUserRequestsQuery,
  useGetRequestsByBloodGroupQuery,
  useGetProcessingRequestsQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useProcessRequestMutation,
  useFulfillRequestMutation,
  useDeleteRequestMutation,
} = requestApiSlice;