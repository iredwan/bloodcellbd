'use client';

import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../api/apiSlice';
import { setDistricts, setLoading, setError, selectAllDistricts, selectDistrictsLoading, selectDistrictsError } from './districtSlice';

// Default Bangladesh districts (sample data - we'll get the real data from the API)
const defaultDistricts = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
];

export const districtApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDistricts: builder.query({
      query: () => 'districts/all',
      providesTags: ['District'],
      transformResponse: (response) => {
        // Get the data from the API response
        const districts = response.data || response || defaultDistricts;
        
        // If districts are objects with name property, extract the names
        if (Array.isArray(districts) && districts.length > 0 && typeof districts[0] === 'object') {
          const districtNames = districts.map(district => district.name || '');
          return districtNames.sort();
        }
        
        // Sort districts alphabetically if they're already strings
        return Array.isArray(districts) ? districts.sort() : defaultDistricts;
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setDistricts(data));
        } catch (error) {
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