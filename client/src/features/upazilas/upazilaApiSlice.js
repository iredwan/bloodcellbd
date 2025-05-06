'use client';

import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../api/apiSlice';
import { 
  setUpazilas, 
  setUpazilasByDistrict, 
  setLoading, 
  setError, 
  selectAllUpazilas,
  selectUpazilasByDistrict,
  selectUpazilasLoading, 
  selectUpazilasError 
} from './upazilaSlice';

// Default upazilas in case API fails
const defaultUpazilas = [];

export const upazilaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUpazilas: builder.query({
      query: () => 'upazilas/all',
      providesTags: ['Upazila'],
      transformResponse: (response) => {
        // For HTTP 304 or invalid responses, handle properly
        if (!response) return { status: false, data: defaultUpazilas };
        
        // Handle API success response format
        if (response.status && response.data) {
          return response;
        }
        
        // Direct data format
        if (Array.isArray(response)) {
          return { status: true, data: response };
        }
        
        console.warn('Unexpected upazila API response format:', response);
        return { status: false, data: defaultUpazilas };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setUpazilas(data.data || defaultUpazilas));
        } catch (error) {
          console.error('Error fetching upazilas:', error);
          dispatch(setError(error.message || 'Failed to fetch upazilas'));
          // If the API fails, set default upazilas
          dispatch(setUpazilas(defaultUpazilas));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    getUpazilasByDistrict: builder.query({
      query: (districtId) => `upazilas-or-ps/by-district/${districtId}`,
      providesTags: (result, error, districtId) => [
        { type: 'Upazila', id: `DISTRICT_${districtId}` }
      ],
      transformResponse: (response) => {
        // For HTTP 304 or invalid responses, handle properly
        if (!response) return { status: false, data: defaultUpazilas };
        
        // Handle API success response format
        if (response.status && response.data) {
          return response;
        }
        
        // Direct data format
        if (Array.isArray(response)) {
          return { status: true, data: response };
        }
        
        console.warn('Unexpected upazila API response format:', response);
        return { status: false, data: defaultUpazilas };
      },
      async onQueryStarted(districtId, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          
          // Store upazilas for this district in the state
          dispatch(setUpazilasByDistrict({
            districtId,
            upazilas: data.data || defaultUpazilas
          }));
        } catch (error) {
          console.error(`Error fetching upazilas for district ${districtId}:`, error);
          dispatch(setError(error.message || `Failed to fetch upazilas for district ${districtId}`));
          
          // If the API fails, set empty array for this district
          dispatch(setUpazilasByDistrict({
            districtId,
            upazilas: []
          }));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    createUpazila: builder.mutation({
      query: (upazilaData) => ({
        url: 'upazilas/create',
        method: 'POST',
        body: upazilaData
      }),
      invalidatesTags: ['Upazila'],
    }),
  }),
});

// Custom hook that combines Redux state and RTK Query for upazilas
export const useUpazilas = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux selectors
  const upazilas = useSelector(selectAllUpazilas);
  const loading = useSelector(selectUpazilasLoading);
  const error = useSelector(selectUpazilasError);

  // Use RTK Query to fetch data
  const { 
    refetch,
    isFetching
  } = upazilaApiSlice.useGetAllUpazilasQuery(undefined, {
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });

  // Combine local loading state with RTK Query fetching state
  const isLoading = loading || isFetching;

  return {
    upazilas,
    loading: isLoading,
    error,
    refreshUpazilas: refetch
  };
};

// Custom hook for getting upazilas by district
export const useUpazilasByDistrict = (districtId) => {
  const dispatch = useDispatch();
  
  // Get state from Redux selectors
  const upazilas = useSelector((state) => selectUpazilasByDistrict(state, districtId));
  const loading = useSelector(selectUpazilasLoading);
  const error = useSelector(selectUpazilasError);

  // Use RTK Query to fetch data
  const { 
    refetch,
    isFetching
  } = upazilaApiSlice.useGetUpazilasByDistrictQuery(districtId, {
    // Skip if no district ID is provided
    skip: !districtId,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });

  // Combine local loading state with RTK Query fetching state
  const isLoading = loading || isFetching;

  return {
    upazilas,
    loading: isLoading,
    error,
    refreshUpazilas: refetch
  };
};

export const {
  useGetAllUpazilasQuery,
  useGetUpazilasByDistrictQuery,
  useCreateUpazilaMutation,
} = upazilaApiSlice; 