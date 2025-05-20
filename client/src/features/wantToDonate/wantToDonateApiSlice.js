'use client';

import { apiSlice } from '../api/apiSlice';
import { 
  setDonations, 
  setUserDonations, 
  setCurrentDonation, 
  setLoading, 
  setError 
} from './wantToDonateSlice';

export const wantToDonateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDonations: builder.query({
      query: () => 'want-to-donate/all',
      providesTags: ['WantToDonate'],
      transformResponse: (response) => {
        // Handle API success response format
        if (response.status && response.data) {
          return response;
        }
        
        // Direct data format
        if (Array.isArray(response)) {
          return { status: true, data: response };
        }
        
        console.warn('Unexpected want-to-donate API response format:', response);
        return { status: false, data: [] };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          
          // Store donations in Redux state
          if (data.status && data.data) {
            dispatch(setDonations(data.data));
          } else if (Array.isArray(data)) {
            dispatch(setDonations(data));
          } else {
            dispatch(setDonations([]));
          }
        } catch (error) {
          console.error('Error fetching donations:', error);
          dispatch(setError(error.message || 'Failed to fetch donations'));
          dispatch(setDonations([]));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    getDonationById: builder.query({
      query: (id) => `want-to-donate/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'WantToDonate', id }],
      transformResponse: (response) => {
        if (response && response.status && response.data) {
          return response.data;
        }
        return null;
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setCurrentDonation(data));
        } catch (error) {
          console.error(`Error fetching donation with ID ${id}:`, error);
          dispatch(setError(error.message || `Failed to fetch donation with ID ${id}`));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    getUserDonations: builder.query({
      query: () => 'want-to-donate/user',
      providesTags: ['WantToDonate'],
      transformResponse: (response) => {
        if (response && response.status && response.data) {
          return response.data;
        }
        return [];
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setUserDonations(data));
        } catch (error) {
          console.error('Error fetching user donations:', error);
          dispatch(setError(error.message || 'Failed to fetch your donations'));
          dispatch(setUserDonations([]));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    createDonation: builder.mutation({
      query: (donationData) => ({
        url: 'want-to-donate/create',
        method: 'POST',
        body: donationData
      }),
      invalidatesTags: ['WantToDonate']
    }),
    
    updateDonation: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `want-to-donate/update/${id}`,
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WantToDonate', id },
        'WantToDonate'
      ]
    }),
    
    updateBloodCollectedBy: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `want-to-donate/update-blood-collected-by/${id}`,
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WantToDonate', id },
        'WantToDonate'
      ]
    }),
    
    deleteDonation: builder.mutation({
      query: (id) => ({
        url: `want-to-donate/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['WantToDonate']
    })
  })
});

export const {
  useGetAllDonationsQuery,
  useGetDonationByIdQuery,
  useGetUserDonationsQuery,
  useCreateDonationMutation,
  useUpdateDonationMutation,
  useUpdateBloodCollectedByMutation,
  useDeleteDonationMutation
} = wantToDonateApiSlice;