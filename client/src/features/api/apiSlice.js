'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // For client-side requests
      const token = getState().auth?.token;
      if (token) {
        headers.set('token', token);
      }
      
      // For server-side rendering - check cookies directly
      if (typeof window === 'undefined') {
        // In server components, you can't access cookies directly
        // The token should be passed as part of the state through server actions
        // This is handled in middleware.js for protected routes
      }
      
      return headers;
    },
  }),
  tagTypes: ['User', 'Request', 'Event', 'Sponsor', 'WantToDonate', 'Review', 'Team'],
  endpoints: () => ({}),
}); 