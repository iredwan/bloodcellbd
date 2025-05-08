'use client';

import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../api/apiSlice';
import { setCarouselItems, setActiveCarouselItems, setLoading, setError, selectAllCarouselItems, selectActiveCarouselItems, selectCarouselLoading, selectCarouselError } from './carouselSlice';
import { getCookie } from 'cookies-next';

export const carouselApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all carousel items
    getAllCarousel: builder.query({
      query: () => 'carousel/all',
      providesTags: ['Carousel'],
      transformResponse: (response) => {
        // Handle API response
        if (!response) return { status: false, data: [] };
        
        // Handle API success response format
        if (response.status && response.data) {
          return response;
        }
        
        // Direct data format
        if (Array.isArray(response)) {
          return { status: true, data: response };
        }
        
        console.warn('Unexpected carousel API response format:', response);
        return { status: false, data: [] };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          // Store carousel items in Redux state
          dispatch(setCarouselItems(data.data || []));
        } catch (error) {
          console.error('Error fetching carousel items:', error);
          dispatch(setError(error.message || 'Failed to fetch carousel items'));
          // If the API fails, set empty carousel items
          dispatch(setCarouselItems([]));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    // Get active carousel items
    getActiveCarousel: builder.query({
      query: () => 'carousel/active',
      providesTags: ['Carousel'],
      transformResponse: (response) => {
        if (!response) return { status: false, data: [] };
        
        if (response.status && response.data) {
          return response;
        }
        
        if (Array.isArray(response)) {
          return { status: true, data: response };
        }
        
        return { status: false, data: [] };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setActiveCarouselItems(data.data || []));
        } catch (error) {
          console.error('Error fetching active carousel items:', error);
          dispatch(setActiveCarouselItems([]));
        }
      },
    }),
    
    // Get carousel item by ID
    getCarouselById: builder.query({
      query: (id) => `carousel/${id}`,
      providesTags: (result, error, id) => [{ type: 'Carousel', id }],
    }),
    
    // Create carousel item
    createCarousel: builder.mutation({
      query: (carouselData) => {
        const token = getCookie('token');
        
        return {
          url: 'carousel/create',
          method: 'POST',
          body: carouselData,
          headers: token ? { token } : {},
        };
      },
      invalidatesTags: ['Carousel'],
    }),
    
    // Update carousel item
    updateCarousel: builder.mutation({
      query: ({ id, carouselData }) => {
        const token = getCookie('token');
        
        return {
          url: `carousel/update/${id}`,
          method: 'PATCH',
          body: carouselData,
          headers: token ? { token } : {},
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Carousel', id }, 'Carousel'],
    }),
    
    // Delete carousel item
    deleteCarousel: builder.mutation({
      query: (id) => {
        const token = getCookie('token');
        
        return {
          url: `carousel/delete/${id}`,
          method: 'DELETE',
          headers: token ? { token } : {},
        };
      },
      invalidatesTags: ['Carousel'],
    }),
  }),
});

// Custom hook that combines Redux state and RTK Query for carousel
export const useCarousel = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux selectors
  const carouselItems = useSelector(selectAllCarouselItems);
  const activeCarouselItems = useSelector(selectActiveCarouselItems);
  const loading = useSelector(selectCarouselLoading);
  const error = useSelector(selectCarouselError);

  // Use RTK Query to fetch data
  const { 
    refetch: refetchAllCarousel,
    isFetching: isFetchingAll
  } = carouselApiSlice.useGetAllCarouselQuery(undefined, {
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
  
  const {
    refetch: refetchActiveCarousel,
    isFetching: isFetchingActive
  } = carouselApiSlice.useGetActiveCarouselQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // Combine local loading state with RTK Query fetching state
  const isLoading = loading || isFetchingAll || isFetchingActive;

  return {
    carouselItems,
    activeCarouselItems,
    loading: isLoading,
    error,
    refreshCarousel: refetchAllCarousel,
    refreshActiveCarousel: refetchActiveCarousel
  };
};

export const {
  useGetAllCarouselQuery,
  useGetActiveCarouselQuery,
  useGetCarouselByIdQuery,
  useCreateCarouselMutation,
  useUpdateCarouselMutation,
  useDeleteCarouselMutation,
} = carouselApiSlice; 