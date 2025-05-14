'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from 'cookies-next';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include', 
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state
      let token = getState().auth?.token;

      // If not found in Redux, check cookies (client-side only)
      if (!token && typeof window !== 'undefined') {
        token = getCookie('token');
      }

      // Attach token to headers if found
      if (token) {
        headers.set('token', token);
      }

      return headers;
    },
  }),
  tagTypes: [
    'User',
    'Request',
    'Event',
    'Sponsor',
    'WantToDonate',
    'Review',
    'Team',
    'WebsiteConfig',
    'District',
    'Files',
    'Upazila',
    'Carousel',
    'GoodwillAmbassador',
    'DivisionalTeam',
    'DistrictTeam',
    'UpazilaTeam',
    'MonitorTeam',
    'UserInfo',
  ],
  endpoints: () => ({}),
});
