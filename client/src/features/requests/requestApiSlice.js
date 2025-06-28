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
    removeProcessingBy: builder.mutation({
      query: (id) => ({
        url: `requests/remove-processing-by/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Request'],
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
    CancelRequest: builder.mutation({
      query: (id) => ({
        url: `requests/cancel/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Request'],
    }),
    RejectRequest: builder.mutation({
      query: (id) => ({
        url: `requests/reject/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Request'],
    }),
    deleteRequest: builder.mutation({
      query: (id) => ({
        url: `requests/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Request'],
    }),
    ResetRequest: builder.mutation({
      query: (id) => ({
        url: `requests/reset/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Request'],
    }),
    setVolunteerName: builder.mutation({
      query: (id) => ({
        url: `requests/set-volunteer-name/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Request'],
    }),
    getRequestsByVolunteerName: builder.query({
      query: (reqBody) => ({
        url: 'requests/get-volunteer-requests',
        params: reqBody,
      }),
      providesTags: ['Request'],
    }),
    removeVolunteerName: builder.mutation({
      query: (id) => ({
        url: `requests/remove-volunteer-name/${id}`,
        method: 'PATCH',
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
  useRemoveProcessingByMutation,
  useCancelRequestMutation,
  useRejectRequestMutation,
  useFulfillRequestMutation,
  useDeleteRequestMutation,
  useResetRequestMutation,
  useSetVolunteerNameMutation,
  useGetRequestsByVolunteerNameQuery,
  useRemoveVolunteerNameMutation,
} = requestApiSlice;