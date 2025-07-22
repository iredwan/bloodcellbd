'use client';

import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../api/apiSlice';
import { 
  setDistrictTeams, 
  setCurrentDistrictTeam, 
  setLoading, 
  setError, 
  selectAllDistrictTeams, 
  selectCurrentDistrictTeam, 
  selectDistrictTeamLoading, 
  selectDistrictTeamError 
} from './districtTeamSlice';

export const districtTeamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDistrictTeams: builder.query({
      query: (params) => ({
        url: 'district-teams/all',
        params: params,
      }),
      providesTags: ['DistrictTeam'],
    }),
    
    getDistrictTeamById: builder.query({
      query: (id) => `district-teams/get/${id}`,
      providesTags: ['DistrictTeam'],
      transformResponse: (response) => {
        if (response.status && response.data) {
          return response;
        }
        
        console.warn('Unexpected district team API response format:', response);
        return { status: false, data: null };
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          
          // Store current district team in Redux state
          if (data.status && data.data) {
            dispatch(setCurrentDistrictTeam(data.data));
          } else {
            dispatch(setCurrentDistrictTeam(null));
          }
        } catch (error) {
          console.error(`Error fetching district team with ID ${id}:`, error);
          dispatch(setError(error.message || `Failed to fetch district team with ID ${id}`));
          dispatch(setCurrentDistrictTeam(null));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    getDistrictTeamByCoordinatorId: builder.query({
      query: () => 'district-teams/get-by-district-coordinators-user-id',
      providesTags: ['DistrictTeam'],
    }),
    
    createDistrictTeam: builder.mutation({
      query: (districtTeamData) => ({
        url: 'district-teams/create',
        method: 'POST',
        body: districtTeamData,
      }),
      invalidatesTags: ['DistrictTeam'],
    }),
    
    updateDistrictTeam: builder.mutation({
      query: ({ id, ...districtTeamData }) => ({
        url: `district-teams/update/${id}`,
        method: 'PUT',
        body: districtTeamData,
      }),
      invalidatesTags: ['DistrictTeam'],
    }),
    
    deleteDistrictTeam: builder.mutation({
      query: (id) => ({
        url: `district-teams/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DistrictTeam'],
    }),
  }),
});

// Custom hook that combines Redux state and RTK Query for district teams
export const useDistrictTeams = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux selectors
  const districtTeams = useSelector(selectAllDistrictTeams);
  const currentDistrictTeam = useSelector(selectCurrentDistrictTeam);
  const loading = useSelector(selectDistrictTeamLoading);
  const error = useSelector(selectDistrictTeamError);

  // Use RTK Query to fetch data
  const { 
    refetch,
    isFetching
  } = districtTeamApiSlice.useGetAllDistrictTeamsQuery(undefined, {
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });

  // Combine local loading state with RTK Query fetching state
  const isLoading = loading || isFetching;

  return {
    districtTeams,
    currentDistrictTeam,
    loading: isLoading,
    error,
    refreshDistrictTeams: refetch
  };
};

export const {
  useGetAllDistrictTeamsQuery,
  useGetDistrictTeamByIdQuery,
  useGetDistrictTeamByCoordinatorIdQuery,
  useCreateDistrictTeamMutation,
  useUpdateDistrictTeamMutation,
  useDeleteDistrictTeamMutation,
} = districtTeamApiSlice; 