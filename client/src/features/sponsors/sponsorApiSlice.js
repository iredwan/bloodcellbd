'use client';

import { apiSlice } from '../api/apiSlice';
import { 
  setSponsors, 
  setSponsorsByType, 
  setSelectedSponsor, 
  setLoading, 
  setError 
} from './sponsorSlice';

export const sponsorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSponsors: builder.query({
      query: (params) => ({
        url: `/sponsors/all`,
        params: params,
      }),
      providesTags: ['Sponsor'],
    }),
    getSponsorById: builder.query({
      query: (id) => ({
        url: `/sponsors/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['Sponsor'],
    }),
    getSponsorsByType: builder.query({
      query: (sponsorType) => `sponsors/type/${sponsorType}`,
      providesTags: (result, error, sponsorType) => [
        { type: 'Sponsor', id: `TYPE_${sponsorType}` }
      ],
      transformResponse: (response) => {
        // Handle API response format
        if (response.status && response.data) {
          return response.data;
        }
        // Direct array format
        if (Array.isArray(response)) {
          return response;
        }
        
        console.warn('Unexpected sponsor API response format:', response);
        return [];
      },
      async onQueryStarted(sponsorType, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setSponsorsByType({ type: sponsorType, sponsors: data }));
        } catch (error) {
          console.error(`Error fetching ${sponsorType} sponsors:`, error);
          dispatch(setError(error.message || `Failed to fetch ${sponsorType} sponsors`));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    createSponsor: builder.mutation({
      query: (data) => ({
        url: '/sponsors',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Sponsor'],
    }),
    updateSponsor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/sponsors/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Sponsor'],
    }),
    deleteSponsor: builder.mutation({
      query: (id) => ({
        url: `/sponsors/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sponsor'],
    }),
  }),
});

export const {
  useGetAllSponsorsQuery,
  useGetSponsorByIdQuery,
  useGetSponsorsByTypeQuery,
  useCreateSponsorMutation,
  useUpdateSponsorMutation,
  useDeleteSponsorMutation,
} = sponsorApiSlice; 