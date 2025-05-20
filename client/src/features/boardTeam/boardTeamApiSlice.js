'use client';

import { apiSlice } from '../api/apiSlice';
import { 
  setBoardMembers, 
  setActiveMembers,
  setFeaturedMembers,
  setCurrentMember,
  setLoading, 
  setError,
  addBoardMember,
  updateBoardMember,
  removeBoardMember,
  toggleMemberActive,
  toggleMemberFeatured,
  updateMemberOrder
} from './boardTeamSlice';

export const boardTeamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all board team members
    getAllBoardMembers: builder.query({
      query: () => 'board-team/all',
      providesTags: ['BoardTeam'],
      transformResponse: (response) => {
        // Handle API success response format
        if (response.status && response.data) {
          return response;
        }
        
        // Direct data format
        if (Array.isArray(response)) {
          return { status: true, data: response };
        }
        
        console.warn('Unexpected board team API response format:', response);
        return { status: false, data: [] };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          
          // Store board members in Redux state
          if (data.status && data.data) {
            const members = data.data;
            dispatch(setBoardMembers(members));
            
            // Filter active and featured members
            const activeMembers = members.filter(member => member.active);
            const featuredMembers = members.filter(member => member.featured);
            
            dispatch(setActiveMembers(activeMembers));
            dispatch(setFeaturedMembers(featuredMembers));
          } else if (Array.isArray(data)) {
            dispatch(setBoardMembers(data));
            
            // Filter active and featured members
            const activeMembers = data.filter(member => member.active);
            const featuredMembers = data.filter(member => member.featured);
            
            dispatch(setActiveMembers(activeMembers));
            dispatch(setFeaturedMembers(featuredMembers));
          } else {
            dispatch(setBoardMembers([]));
            dispatch(setActiveMembers([]));
            dispatch(setFeaturedMembers([]));
          }
        } catch (error) {
          console.error('Error fetching board members:', error);
          dispatch(setError(error.message || 'Failed to fetch board members'));
          dispatch(setBoardMembers([]));
          dispatch(setActiveMembers([]));
          dispatch(setFeaturedMembers([]));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    // Get only active board members
    getActiveBoardMembers: builder.query({
      query: () => 'board-team/all?active=true',
      providesTags: ['BoardTeam'],
      transformResponse: (response) => {
        if (response && response.status && response.data) {
          return response.data;
        }
        return [];
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setActiveMembers(data));
        } catch (error) {
          console.error('Error fetching active board members:', error);
          dispatch(setError(error.message || 'Failed to fetch active board members'));
          dispatch(setActiveMembers([]));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    // Get only featured board members
    getFeaturedBoardMembers: builder.query({
      query: () => 'board-team/all?featured=true',
      providesTags: ['BoardTeam'],
      transformResponse: (response) => {
        if (response && response.status && response.data) {
          return response.data;
        }
        return [];
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setFeaturedMembers(data));
        } catch (error) {
          console.error('Error fetching featured board members:', error);
          dispatch(setError(error.message || 'Failed to fetch featured board members'));
          dispatch(setFeaturedMembers([]));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    // Get board member by ID
    getBoardMemberById: builder.query({
      query: (id) => `board-team/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'BoardTeam', id }],
      transformResponse: (response) => {
        if (response && response.status && response.data) {
          return response.data;
        }
        return null;
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setCurrentMember(data));
        } catch (error) {
          console.error(`Error fetching board member with ID ${id}:`, error);
          dispatch(setError(error.message || `Failed to fetch board member with ID ${id}`));
          dispatch(setCurrentMember(null));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    // Create a board member
    createBoardMember: builder.mutation({
      query: (memberData) => ({
        url: 'board-team/create',
        method: 'POST',
        body: memberData
      }),
      invalidatesTags: ['BoardTeam'],
      async onQueryStarted(memberData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status && data.data) {
            dispatch(addBoardMember(data.data));
          }
        } catch (error) {
          console.error('Error creating board member:', error);
        }
      }
    }),
    
    // Update a board member
    updateBoardMember: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `board-team/update/${id}`,
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'BoardTeam', id },
        'BoardTeam'
      ],
      async onQueryStarted({ id, ...updateData }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status && data.data) {
            dispatch(updateBoardMember(data.data));
          }
        } catch (error) {
          console.error(`Error updating board member with ID ${id}:`, error);
        }
      }
    }),
    
    // Delete a board member
    deleteBoardMember: builder.mutation({
      query: (id) => ({
        url: `board-team/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['BoardTeam'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(removeBoardMember(id));
        } catch (error) {
          console.error(`Error deleting board member with ID ${id}:`, error);
        }
      }
    }),
    
    // Toggle board member active status
    toggleActive: builder.mutation({
      query: (id) => ({
        url: `board-team/toggle-active/${id}`,
        method: 'PATCH'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'BoardTeam', id },
        'BoardTeam'
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status && data.data) {
            const active = data.data.active;
            dispatch(toggleMemberActive({ memberId: id, active }));
          }
        } catch (error) {
          console.error(`Error toggling active status for board member with ID ${id}:`, error);
        }
      }
    }),
    
    // Toggle board member featured status
    toggleFeatured: builder.mutation({
      query: (id) => ({
        url: `board-team/toggle-featured/${id}`,
        method: 'PATCH'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'BoardTeam', id },
        'BoardTeam'
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status && data.data) {
            const featured = data.data.featured;
            dispatch(toggleMemberFeatured({ memberId: id, featured }));
          }
        } catch (error) {
          console.error(`Error toggling featured status for board member with ID ${id}:`, error);
        }
      }
    }),
    
    // Update board member order
    updateOrder: builder.mutation({
      query: ({ id, order }) => ({
        url: `board-team/update-order/${id}`,
        method: 'PATCH',
        body: { order }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'BoardTeam', id },
        'BoardTeam'
      ],
      async onQueryStarted({ id, order }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status && data.data) {
            dispatch(updateMemberOrder({ memberId: id, order }));
          }
        } catch (error) {
          console.error(`Error updating order for board member with ID ${id}:`, error);
        }
      }
    })
  })
});

export const {
  useGetAllBoardMembersQuery,
  useGetActiveBoardMembersQuery,
  useGetFeaturedBoardMembersQuery,
  useGetBoardMemberByIdQuery,
  useCreateBoardMemberMutation,
  useUpdateBoardMemberMutation,
  useDeleteBoardMemberMutation,
  useToggleActiveMutation,
  useToggleFeaturedMutation,
  useUpdateOrderMutation
} = boardTeamApiSlice; 