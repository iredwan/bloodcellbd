'use client';

import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../api/apiSlice';
import { 
  setMonitorTeams, 
  setCurrentMonitorTeam, 
  setLoading, 
  setError, 
  selectAllMonitorTeams, 
  selectCurrentMonitorTeam, 
  selectMonitorTeamLoading, 
  selectMonitorTeamError 
} from './monitorTeamSlice';

export const monitorTeamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMonitorTeams: builder.query({
      query: (params) => ({
        url: 'monitor-teams/all',
        params: params,
      }),
      providesTags: ['MonitorTeam'],
    }),
    
    getMonitorTeamById: builder.query({
      query: (id) => `monitor-teams/get/${id}`,
      providesTags: ['MonitorTeam'],
      transformResponse: (response) => {
        if (response.status && response.data) {
          return response;
        }
        
        console.warn('Unexpected monitor team API response format:', response);
        return { status: false, data: null };
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          
          // Store current monitor team in Redux state
          if (data.status && data.data) {
            dispatch(setCurrentMonitorTeam(data.data));
          } else {
            dispatch(setCurrentMonitorTeam(null));
          }
        } catch (error) {
          console.error(`Error fetching monitor team with ID ${id}:`, error);
          dispatch(setError(error.message || `Failed to fetch monitor team with ID ${id}`));
          dispatch(setCurrentMonitorTeam(null));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    getMonitorTeamByMonitorUserId: builder.query({
      query: () => 'monitor-teams/get-by-monitor-user-id',
      providesTags: ['MonitorTeam'],
    }),
    
    createMonitorTeam: builder.mutation({
      query: (monitorTeamData) => ({
        url: 'monitor-teams/create',
        method: 'POST',
        body: monitorTeamData,
      }),
      invalidatesTags: ['MonitorTeam'],
    }),
    
    updateMonitorTeam: builder.mutation({
      query: ({ id, ...monitorTeamData }) => ({
        url: `monitor-teams/update/${id}`,
        method: 'PUT',
        body: monitorTeamData,
      }),
      invalidatesTags: ['MonitorTeam'],
    }),
    
    deleteMonitorTeam: builder.mutation({
      query: (id) => ({
        url: `monitor-teams/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MonitorTeam'],
    }),
  }),
});

// Custom hook that combines Redux state and RTK Query for monitor teams
export const useMonitorTeams = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux selectors
  const monitorTeams = useSelector(selectAllMonitorTeams);
  const currentMonitorTeam = useSelector(selectCurrentMonitorTeam);
  const loading = useSelector(selectMonitorTeamLoading);
  const error = useSelector(selectMonitorTeamError);

  // Use RTK Query to fetch data
  const { 
    refetch,
    isFetching
  } = monitorTeamApiSlice.useGetAllMonitorTeamsQuery(undefined, {
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });

  // Combine local loading state with RTK Query fetching state
  const isLoading = loading || isFetching;

  return {
    monitorTeams,
    currentMonitorTeam,
    loading: isLoading,
    error,
    refreshMonitorTeams: refetch
  };
};

export const {
  useGetAllMonitorTeamsQuery,
  useGetMonitorTeamByIdQuery,
  useGetMonitorTeamByMonitorUserIdQuery,
  useCreateMonitorTeamMutation,
  useUpdateMonitorTeamMutation,
  useDeleteMonitorTeamMutation,
} = monitorTeamApiSlice; 