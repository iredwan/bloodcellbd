'use client';

import { apiSlice } from '../api/apiSlice';

export const divisionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all divisions
    getAllDivisions: builder.query({
      query: (params) => ({
        url: 'divisions/all',
        method: 'GET',
        params,
      }),
      providesTags: ['Divisions'],
    }),
  })
});

export const {
  useGetAllDivisionsQuery,
} = divisionApiSlice; 