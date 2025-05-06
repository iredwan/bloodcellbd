'use client';

import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../api/apiSlice';
import { setDistricts, setLoading, setError, selectAllDistricts, selectDistrictsLoading, selectDistrictsError } from './districtSlice';

// Default Bangladesh districts (sample data - we'll get the real data from the API)
const defaultDistricts = [
  { _id: 'dhaka', name: 'Dhaka', bengaliName: 'ঢাকা' },
  { _id: 'chittagong', name: 'Chittagong', bengaliName: 'চট্টগ্রাম' },
  { _id: 'rajshahi', name: 'Rajshahi', bengaliName: 'রাজশাহী' },
  { _id: 'khulna', name: 'Khulna', bengaliName: 'খুলনা' },
  { _id: 'barisal', name: 'Barisal', bengaliName: 'বরিশাল' },
  { _id: 'sylhet', name: 'Sylhet', bengaliName: 'সিলেট' },
  { _id: 'rangpur', name: 'Rangpur', bengaliName: 'রংপুর' },
  { _id: 'mymensingh', name: 'Mymensingh', bengaliName: 'ময়মনসিংহ' }
];

export const districtApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDistricts: builder.query({
      query: () => 'districts/all',
      providesTags: ['District'],
      transformResponse: (response) => {
        // For HTTP 304 or invalid responses, handle properly
        if (!response) return { status: false, data: defaultDistricts };
        
        // Handle API success response format
        if (response.status && response.data) {
          return response;
        }
        
        // Direct data format
        if (Array.isArray(response)) {
          return { status: true, data: response };
        }
        
        console.warn('Unexpected district API response format:', response);
        return { status: false, data: defaultDistricts };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          // Store full district objects in Redux state
          dispatch(setDistricts(data.data || defaultDistricts));
        } catch (error) {
          console.error('Error fetching districts:', error);
          dispatch(setError(error.message || 'Failed to fetch districts'));
          // If the API fails, set default districts
          dispatch(setDistricts(defaultDistricts));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    getDistrictsByDivision: builder.query({
      query: (division) => `districts/division/${division}`,
      providesTags: ['District'],
    }),
  }),
});

// Custom hook that combines Redux state and RTK Query for districts
export const useDistricts = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux selectors
  const districts = useSelector(selectAllDistricts);
  const loading = useSelector(selectDistrictsLoading);
  const error = useSelector(selectDistrictsError);

  // Use RTK Query to fetch data
  const { 
    refetch,
    isFetching
  } = districtApiSlice.useGetAllDistrictsQuery(undefined, {
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });

  // Combine local loading state with RTK Query fetching state
  const isLoading = loading || isFetching;

  return {
    districts,
    loading: isLoading,
    error,
    refreshDistricts: refetch
  };
};

export const {
  useGetAllDistrictsQuery,
  useGetDistrictsByDivisionQuery,
} = districtApiSlice; 