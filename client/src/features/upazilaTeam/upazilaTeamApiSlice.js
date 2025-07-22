'use client';

import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../api/apiSlice';
import { 
  setUpazilaTeams, 
  setCurrentUpazilaTeam, 
  setLoading, 
  setError, 
  selectAllUpazilaTeams, 
  selectCurrentUpazilaTeam, 
  selectUpazilaTeamLoading, 
  selectUpazilaTeamError 
} from './upazilaTeamSlice';

export const upazilaTeamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUpazilaTeams: builder.query({
      query: (params) => ({
        url: 'upazila-team/all',
        params: params,
      }),
      providesTags: ['UpazilaTeam'],
    }),
    
    getUpazilaTeamById: builder.query({
      query: (id) => `upazila-team/get/${id}`,
      providesTags: ['UpazilaTeam'],
      transformResponse: (response) => {
        if (response.status && response.data) {
          return response;
        }
        
        console.warn('Unexpected upazila team API response format:', response);
        return { status: false, data: null };
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          
          // Store current upazila team in Redux state
          if (data.status && data.data) {
            dispatch(setCurrentUpazilaTeam(data.data.upazilaTeam));
          } else {
            dispatch(setCurrentUpazilaTeam(null));
          }
        } catch (error) {
          console.error(`Error fetching upazila team with ID ${id}:`, error);
          dispatch(setError(error.message || `Failed to fetch upazila team with ID ${id}`));
          dispatch(setCurrentUpazilaTeam(null));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    getUpazilaTeamByCoordinatorId: builder.query({
      query: () => 'upazila-team/get-by-upazila-coordinators-user-id',
      providesTags: ['UpazilaTeam'],
    }),
    
    createUpazilaTeam: builder.mutation({
      query: (upazilaTeamData) => ({
        url: 'upazila-team/create',
        method: 'POST',
        body: upazilaTeamData,
      }),
      invalidatesTags: ['UpazilaTeam'],
    }),
    
    updateUpazilaTeam: builder.mutation({
      query: ({ id, ...upazilaTeamData }) => ({
        url: `upazila-team/update/${id}`,
        method: 'PUT',
        body: upazilaTeamData,
      }),
      invalidatesTags: ['UpazilaTeam'],
    }),
    
    deleteUpazilaTeam: builder.mutation({
      query: (id) => ({
        url: `upazila-team/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UpazilaTeam'],
    }),
  }),
});

// Custom hook that combines Redux state and RTK Query for upazila teams
export const useUpazilaTeams = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux selectors
  const upazilaTeams = useSelector(selectAllUpazilaTeams);
  const currentUpazilaTeam = useSelector(selectCurrentUpazilaTeam);
  const loading = useSelector(selectUpazilaTeamLoading);
  const error = useSelector(selectUpazilaTeamError);

  // Use RTK Query to fetch data
  const { 
    refetch,
    isFetching
  } = upazilaTeamApiSlice.useGetAllUpazilaTeamsQuery(undefined, {
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });

  // Combine local loading state with RTK Query fetching state
  const isLoading = loading || isFetching;

  return {
    upazilaTeams,
    currentUpazilaTeam,
    loading: isLoading,
    error,
    refreshUpazilaTeams: refetch
  };
};

export const {
  useGetAllUpazilaTeamsQuery,
  useGetUpazilaTeamByIdQuery,
  useGetUpazilaTeamByCoordinatorIdQuery,
  useCreateUpazilaTeamMutation,
  useUpdateUpazilaTeamMutation,
  useDeleteUpazilaTeamMutation,
} = upazilaTeamApiSlice; 