'use client';

import { apiSlice } from '../api/apiSlice';
import { setAmbassadors, setActiveAmbassadors, setGoodwillAmbassadors, setHonorableMembers, setLoading, setError } from './goodwillAmbassadorSlice';
import { getCookie } from 'cookies-next';

export const goodwillAmbassadorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all goodwill ambassadors
    getAllAmbassadors: builder.query({
      query: (params = {}) => {
        const { page, limit, designation, search, active } = params;
        
        // Build query string with parameters
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (designation) queryParams.append('designation', designation);
        if (search) queryParams.append('search', search);
        if (active !== undefined) queryParams.append('active', active.toString());
        
        const queryString = queryParams.toString();
        return `ambassadors/all${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['GoodwillAmbassador'],
      transformResponse: (response) => {
        if (!response) return { status: false, data: { ambassadors: [], pagination: {} } };
        
        if (response.status && response.data) {
          return response;
        }
        
        console.warn('Unexpected goodwill ambassador API response format:', response);
        return { status: false, data: { ambassadors: [], pagination: {} } };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setAmbassadors(data.data?.ambassadors || []));
        } catch (error) {
          console.error('Error fetching goodwill ambassadors:', error);
          dispatch(setError(error.message || 'Failed to fetch goodwill ambassadors'));
          dispatch(setAmbassadors([]));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),

    // Get goodwill ambassadors by designation
    getAmbassadorsByDesignation: builder.query({
      query: ({ designation, page, limit, search }) => {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        
        const queryString = queryParams.toString();
        return `ambassadors/designation/${designation}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['GoodwillAmbassador'],
      transformResponse: (response) => {
        if (!response) return { status: false, data: { ambassadors: [], pagination: {} } };
        
        if (response.status && response.data) {
          return response;
        }
        
        console.warn('Unexpected goodwill ambassador API response format:', response);
        return { status: false, data: { ambassadors: [], pagination: {} } };
      },
      async onQueryStarted({ designation }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (designation === 'Goodwill Ambassador') {
            dispatch(setGoodwillAmbassadors(data.data?.ambassadors || []));
          } else if (designation === 'Honorable Member') {
            dispatch(setHonorableMembers(data.data?.ambassadors || []));
          }
        } catch (error) {
          console.error(`Error fetching ${designation}s:`, error);
          if (designation === 'Goodwill Ambassador') {
            dispatch(setGoodwillAmbassadors([]));
          } else if (designation === 'Honorable Member') {
            dispatch(setHonorableMembers([]));
          }
        }
      },
    }),

    // Get goodwill ambassador by ID
    getAmbassadorById: builder.query({
      query: (id) => `ambassadors/details/${id}`,
      providesTags: (result, error, id) => [{ type: 'GoodwillAmbassador', id }],
    }),

    // Create goodwill ambassador
    createAmbassador: builder.mutation({
      query: (ambassadorData) => {
        const token = getCookie('token');
        
        return {
          url: 'ambassadors/create',
          method: 'POST',
          body: ambassadorData,
          headers: token ? { token } : {},
        };
      },
      invalidatesTags: ['GoodwillAmbassador'],
    }),

    // Update goodwill ambassador
    updateAmbassador: builder.mutation({
      query: ({ id, ambassadorData }) => {
        const token = getCookie('token');
        
        return {
          url: `ambassadors/update/${id}`,
          method: 'PUT',
          body: ambassadorData,
          headers: token ? { token } : {},
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'GoodwillAmbassador', id }, 'GoodwillAmbassador'],
    }),

    // Delete goodwill ambassador
    deleteAmbassador: builder.mutation({
      query: (id) => {
        const token = getCookie('token');
        
        return {
          url: `ambassadors/delete/${id}`,
          method: 'DELETE',
          headers: token ? { token } : {},
        };
      },
      invalidatesTags: ['GoodwillAmbassador'],
    }),
  }),
});

export const {
  useGetAllAmbassadorsQuery,
  useGetAmbassadorsByDesignationQuery,
  useGetAmbassadorByIdQuery,
  useCreateAmbassadorMutation,
  useUpdateAmbassadorMutation,
  useDeleteAmbassadorMutation,
} = goodwillAmbassadorApiSlice; 