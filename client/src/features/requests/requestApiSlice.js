'use client';

import { apiSlice } from '../api/apiSlice';

export const requestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRequests: builder.query({
      query: () => 'requests/all',
      providesTags: ['Request'],
    }),
    getRequestById: builder.query({
      query: (id) => `requests/${id}`,
      providesTags: ['Request'],
    }),
    getRequestsByBloodGroup: builder.query({
      query: (bloodGroup) => `requests/bloodgroup/${bloodGroup}`,
      providesTags: ['Request'],
    }),
    getUserRequests: builder.query({
      query: () => 'requests/user/requests',
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
    fulfillRequest: builder.mutation({
      query: (id) => ({
        url: `requests/fulfill-by/${id}`,
        method: 'PATCH',
        body: {},
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
  }),
});

export const {
  useGetAllRequestsQuery,
  useGetRequestByIdQuery,
  useGetRequestsByBloodGroupQuery,
  useGetUserRequestsQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useFulfillRequestMutation,
  useDeleteRequestMutation,
} = requestApiSlice; 