'use client';

import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../api/apiSlice';
import { 
  setDivisionalTeams, 
  setCurrentDivisionalTeam, 
  setLoading, 
  setError, 
  selectAllDivisionalTeams, 
  selectCurrentDivisionalTeam, 
  selectDivisionalTeamLoading, 
  selectDivisionalTeamError 
} from './divisionalTeamSlice';

export const divisionalTeamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDivisionalTeams: builder.query({
      query: () => 'divisional-teams/all',
      providesTags: ['DivisionalTeam'],
      transformResponse: (response) => {
        // Handle API success response format
        if (response.status && response.data) {
          return response;
        } 
        // Direct data format
        if (Array.isArray(response)) {
          return { status: true, data: response };
        }
        
        console.warn('Unexpected divisionalTeam API response format:', response);
        return { status: false, data: [] };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          
          // Store divisional teams in Redux state
          if (data.status && data.data && data.data.divisionalTeams) {
            dispatch(setDivisionalTeams(data.data.divisionalTeams));
          } else if (Array.isArray(data)) {
            dispatch(setDivisionalTeams(data));
          } else if (data.data) {
            dispatch(setDivisionalTeams(data.data));
          } else {
            dispatch(setDivisionalTeams([]));
          }
        } catch (error) {
          console.error('Error fetching divisional teams:', error);
          dispatch(setError(error.message || 'Failed to fetch divisional teams'));
          dispatch(setDivisionalTeams([]));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    getDivisionalTeamById: builder.query({
      query: (id) => `divisional-teams/get/${id}`,
      providesTags: ['DivisionalTeam'],
      transformResponse: (response) => {
        if (response.status && response.data) {
          return response;
        }
        
        console.warn('Unexpected divisional team API response format:', response);
        return { status: false, data: null };
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          
          // Store current divisional team in Redux state
          if (data.status && data.data) {
            dispatch(setCurrentDivisionalTeam(data.data));
          } else {
            dispatch(setCurrentDivisionalTeam(null));
          }
        } catch (error) {
          console.error(`Error fetching divisional team with ID ${id}:`, error);
          dispatch(setError(error.message || `Failed to fetch divisional team with ID ${id}`));
          dispatch(setCurrentDivisionalTeam(null));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    getDivisionalTeamByCoordinatorId: builder.query({
      query: () => 'divisional-teams/get-by-divisional-coordinators-user-id',
      providesTags: ['DivisionalTeam'],
    }),
    
    createDivisionalTeam: builder.mutation({
      query: (divisionalTeamData) => ({
        url: 'divisional-teams/create',
        method: 'POST',
        body: divisionalTeamData,
      }),
      invalidatesTags: ['DivisionalTeam'],
    }),
    
    updateDivisionalTeam: builder.mutation({
      query: ({ id, ...divisionalTeamData }) => ({
        url: `divisional-teams/update/${id}`,
        method: 'PUT',
        body: divisionalTeamData,
      }),
      invalidatesTags: ['DivisionalTeam'],
    }),
    
    deleteDivisionalTeam: builder.mutation({
      query: (id) => ({
        url: `divisional-teams/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DivisionalTeam'],
    }),
  }),
});

// Custom hook that combines Redux state and RTK Query for divisional teams
export const useDivisionalTeams = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux selectors
  const divisionalTeams = useSelector(selectAllDivisionalTeams);
  const currentDivisionalTeam = useSelector(selectCurrentDivisionalTeam);
  const loading = useSelector(selectDivisionalTeamLoading);
  const error = useSelector(selectDivisionalTeamError);

  // Use RTK Query to fetch data
  const { 
    refetch,
    isFetching
  } = divisionalTeamApiSlice.useGetAllDivisionalTeamsQuery(undefined, {
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });

  // Combine local loading state with RTK Query fetching state
  const isLoading = loading || isFetching;

  return {
    divisionalTeams,
    currentDivisionalTeam,
    loading: isLoading,
    error,
    refreshDivisionalTeams: refetch
  };
};

export const {
  useGetAllDivisionalTeamsQuery,
  useGetDivisionalTeamByIdQuery,
  useGetDivisionalTeamByCoordinatorIdQuery,
  useCreateDivisionalTeamMutation,
  useUpdateDivisionalTeamMutation,
  useDeleteDivisionalTeamMutation,
} = divisionalTeamApiSlice; 