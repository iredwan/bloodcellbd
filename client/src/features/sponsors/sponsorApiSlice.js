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
      query: () => 'sponsors/all',
      providesTags: ['Sponsor'],
      transformResponse: (response) => {
        // Handle API response format
        if (response && response.status && response.data) {
          // The backend returns { sponsors, totalSponsors } in the data property
          return response.data;
        }
        
        // Direct array format (fallback)
        if (Array.isArray(response)) {
          return { sponsors: response, totalSponsors: response.length };
        }
        
        console.warn('Unexpected sponsor API response format:', response);
        return { sponsors: [], totalSponsors: 0 };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setSponsors(data.sponsors || []));
        } catch (error) {
          console.error('Error fetching sponsors:', error);
          dispatch(setError(error.message || 'Failed to fetch sponsors'));
          dispatch(setSponsors([]));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    getSponsorById: builder.query({
      query: (id) => `sponsors/get/${id}`,
      providesTags: ['Sponsor'],
      transformResponse: (response) => {
        // Handle API response format
        if (response.status && response.data) {
          return response.data;
        }
        return response;
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setSelectedSponsor(data));
        } catch (error) {
          console.error(`Error fetching sponsor with ID ${id}:`, error);
          dispatch(setError(error.message || `Failed to fetch sponsor with ID ${id}`));
        } finally {
          dispatch(setLoading(false));
        }
      },
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
      query: (sponsorData) => ({
        url: 'sponsors/create',
        method: 'POST',
        body: sponsorData,
      }),
      invalidatesTags: ['Sponsor'],
    }),
    updateSponsor: builder.mutation({
      query: ({ id, sponsorData }) => ({
        url: `sponsors/update/${id}`,
        method: 'PUT',
        body: sponsorData,
      }),
      invalidatesTags: ['Sponsor'],
    }),
    deleteSponsor: builder.mutation({
      query: (id) => ({
        url: `sponsors/delete/${id}`,
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