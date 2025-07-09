'use client';

import { apiSlice } from '../api/apiSlice';

export const boardTeamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all board team members
    getAllBoardTeamMembers: builder.query({
      query: (params) => ({
        url: 'board-team/all',
        method: 'GET',
        params,
      }),
      providesTags: ['BoardTeam'],
    }),
    
    // Get only active board members
    getActiveBoardMembers: builder.query({
      query: () => ({
        url: 'board-team/all',
        method: 'GET',
        params: { active: true },
      }),
      providesTags: ['BoardTeam'],
    }),
    
    // Get only featured board members
    getFeaturedBoardMembers: builder.query({
      query: () => ({
        url: 'board-team/all',
        method: 'GET',
        params: { featured: true },
      }),
      providesTags: ['BoardTeam'],
    }),
    
    // Get board team by ID
    getBoardTeamById: builder.query({
      query: (id) => ({
        url: `board-team/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['BoardTeam'],
    }),
    
    // Create a board team
    createBoardTeam: builder.mutation({
      query: (boardTeamData) => {
        return {
          url: 'board-team/create',
          method: 'POST',
          body: boardTeamData,
        };
      },
      invalidatesTags: ['BoardTeam'],
    }),
    
    // Update a board team
    updateBoardTeam: builder.mutation({
      query: ({ id, boardTeamData }) => {
        return {
          url: `board-team/update/${id}`,
          method: 'PUT',
          body: boardTeamData
        };
      },
      invalidatesTags: ['BoardTeam'],
    }),
    
    // Delete a board team
    deleteBoardTeam: builder.mutation({
      query: (id) => {
        return {
          url: `board-team/delete/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['BoardTeam'],
      
    }),
    
    // Toggle board team active status
    toggleBoardTeamActive: builder.mutation({
      query: (id) => {
        return {
          url: `board-team/toggle-active/${id}`,
          method: 'PATCH'
        };
      },
      invalidatesTags: ['BoardTeam'],
      
    }),
    
    // Toggle board team featured status
    toggleBoardTeamFeatured: builder.mutation({
      query: (id) => {
        return {
          url: `board-team/toggle-featured/${id}`,
          method: 'PATCH'
        };
      },
      invalidatesTags: ['BoardTeam'],
      
      
    }),
    
    // Update board team order
    updateBoardTeamOrder: builder.mutation({
      query: ({ id, order }) => {
        return {
          url: `board-team/update-order/${id}`,
          method: 'PATCH',
          body: { order }
        };
      },
      invalidatesTags: ['BoardTeam'],
      
      
    })
  })
});

export const {
  useGetAllBoardTeamMembersQuery,
  useGetActiveBoardMembersQuery,
  useGetFeaturedBoardMembersQuery,
  useGetBoardTeamByIdQuery,
  useCreateBoardTeamMutation,
  useUpdateBoardTeamMutation,
  useDeleteBoardTeamMutation,
  useToggleBoardTeamActiveMutation,
  useToggleBoardTeamFeaturedMutation,
  useUpdateBoardTeamOrderMutation
} = boardTeamApiSlice; 