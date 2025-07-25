'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include', 
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
    'ModeratorTeam',
    'UserInfo',
    'WantToDonate',
    'Review',
    'Hospital',
    'BoardTeam',
    'Divisions',
  ],
  endpoints: () => ({}),
});
