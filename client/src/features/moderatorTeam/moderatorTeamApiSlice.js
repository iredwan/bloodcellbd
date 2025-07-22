'use client';

import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../api/apiSlice';

export const moderatorTeamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllModeratorTeams: builder.query({
      query: (params) => ({
        url: 'moderator-teams/all',
        params: params,
      }),
      providesTags: ['ModeratorTeam'],
    }),
    
    getModeratorTeamById: builder.query({
      query: (id) => `moderator-teams/get/${id}`,
      providesTags: ['ModeratorTeam'],
    }),
    
    getModeratorTeamByModeratorUserId: builder.query({
      query: () => 'moderator-teams/get-by-moderator-user-id',
      providesTags: ['ModeratorTeam'],
    }),
    
    getAllModeratorTeamsByMonitorUserId: builder.query({
      query: () => 'moderator-teams/get-all-by-monitor-user-id',
      providesTags: ['ModeratorTeam'],
    }),

    getModeratorTeamByMemberUserId: builder.query({
      query: () => 'moderator-teams/get-by-member-user-id',
      providesTags: ['ModeratorTeam'],
    }),

    createModeratorTeam: builder.mutation({
      query: (moderatorTeamData) => ({
        url: 'moderator-teams/create',
        method: 'POST',
        body: moderatorTeamData,
      }),
      invalidatesTags: ['ModeratorTeam'],
    }),
    
    updateModeratorTeam: builder.mutation({
      query: ({ id, ...moderatorTeamData }) => ({
        url: `moderator-teams/update/${id}`,
        method: 'PUT',
        body: moderatorTeamData,
      }),
      invalidatesTags: ['ModeratorTeam'],
    }),
    
    deleteModeratorTeam: builder.mutation({
      query: (id) => ({
        url: `moderator-teams/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ModeratorTeam'],
    }),

    addTeamMember: builder.mutation({
      query: ({teamId, memberId}) => ({
        url: `moderator-teams/add-member/${teamId}`,
        method: 'POST',
        body: { memberId },
      }),
      invalidatesTags: ['ModeratorTeam'],
    }),

    removeTeamMember: builder.mutation({
      query: ({teamId, memberId}) => ({
        url: `moderator-teams/remove-member/${teamId}`,
        method: 'DELETE',
        body: { memberId },
      }),
      invalidatesTags: ['ModeratorTeam'],
    }),

  }),
});


export const {
  useGetAllModeratorTeamsQuery,
  useGetModeratorTeamByIdQuery,
  useGetModeratorTeamByModeratorUserIdQuery,
  useGetAllModeratorTeamsByMonitorUserIdQuery,
  useGetModeratorTeamByMemberUserIdQuery,
  useCreateModeratorTeamMutation,
  useUpdateModeratorTeamMutation,
  useDeleteModeratorTeamMutation,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
} = moderatorTeamApiSlice; 