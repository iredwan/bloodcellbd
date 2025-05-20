'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  boardMembers: [],
  activeMembers: [],
  featuredMembers: [],
  currentMember: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const boardTeamSlice = createSlice({
  name: 'boardTeam',
  initialState,
  reducers: {
    setBoardMembers: (state, action) => {
      state.boardMembers = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setActiveMembers: (state, action) => {
      state.activeMembers = action.payload;
    },
    setFeaturedMembers: (state, action) => {
      state.featuredMembers = action.payload;
    },
    setCurrentMember: (state, action) => {
      state.currentMember = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addBoardMember: (state, action) => {
      const newMember = action.payload;
      state.boardMembers.push(newMember);
      
      // Also add to active/featured lists if appropriate
      if (newMember.active) {
        state.activeMembers.push(newMember);
      }
      
      if (newMember.featured) {
        state.featuredMembers.push(newMember);
      }
      
      // Sort by order
      state.boardMembers.sort((a, b) => a.order - b.order);
      state.activeMembers.sort((a, b) => a.order - b.order);
      state.featuredMembers.sort((a, b) => a.order - b.order);
    },
    updateBoardMember: (state, action) => {
      const updatedMember = action.payload;
      
      // Update in main members array
      const index = state.boardMembers.findIndex(member => member._id === updatedMember._id);
      if (index !== -1) {
        state.boardMembers[index] = updatedMember;
      }
      
      // Update in active members
      const activeIndex = state.activeMembers.findIndex(member => member._id === updatedMember._id);
      if (updatedMember.active) {
        if (activeIndex === -1) {
          // Add to active if not there
          state.activeMembers.push(updatedMember);
        } else {
          // Update existing
          state.activeMembers[activeIndex] = updatedMember;
        }
      } else if (activeIndex !== -1) {
        // Remove from active if no longer active
        state.activeMembers.splice(activeIndex, 1);
      }
      
      // Update in featured members
      const featuredIndex = state.featuredMembers.findIndex(member => member._id === updatedMember._id);
      if (updatedMember.featured) {
        if (featuredIndex === -1) {
          // Add to featured if not there
          state.featuredMembers.push(updatedMember);
        } else {
          // Update existing
          state.featuredMembers[featuredIndex] = updatedMember;
        }
      } else if (featuredIndex !== -1) {
        // Remove from featured if no longer featured
        state.featuredMembers.splice(featuredIndex, 1);
      }
      
      // Update current member if it's the same one
      if (state.currentMember && state.currentMember._id === updatedMember._id) {
        state.currentMember = updatedMember;
      }
      
      // Sort by order
      state.boardMembers.sort((a, b) => a.order - b.order);
      state.activeMembers.sort((a, b) => a.order - b.order);
      state.featuredMembers.sort((a, b) => a.order - b.order);
    },
    removeBoardMember: (state, action) => {
      const memberId = action.payload;
      
      // Remove from all arrays
      state.boardMembers = state.boardMembers.filter(member => member._id !== memberId);
      state.activeMembers = state.activeMembers.filter(member => member._id !== memberId);
      state.featuredMembers = state.featuredMembers.filter(member => member._id !== memberId);
      
      // Clear current member if it's the same one
      if (state.currentMember && state.currentMember._id === memberId) {
        state.currentMember = null;
      }
    },
    toggleMemberActive: (state, action) => {
      const { memberId, active } = action.payload;
      
      // Update in all arrays
      const member = state.boardMembers.find(m => m._id === memberId);
      if (member) {
        member.active = active;
        
        // Update active members list
        if (active) {
          const exists = state.activeMembers.some(m => m._id === memberId);
          if (!exists) {
            state.activeMembers.push(member);
          }
        } else {
          state.activeMembers = state.activeMembers.filter(m => m._id !== memberId);
        }
        
        // Update current member if it's the same one
        if (state.currentMember && state.currentMember._id === memberId) {
          state.currentMember.active = active;
        }
        
        // Sort by order
        state.activeMembers.sort((a, b) => a.order - b.order);
      }
    },
    toggleMemberFeatured: (state, action) => {
      const { memberId, featured } = action.payload;
      
      // Update in all arrays
      const member = state.boardMembers.find(m => m._id === memberId);
      if (member) {
        member.featured = featured;
        
        // Update featured members list
        if (featured) {
          const exists = state.featuredMembers.some(m => m._id === memberId);
          if (!exists) {
            state.featuredMembers.push(member);
          }
        } else {
          state.featuredMembers = state.featuredMembers.filter(m => m._id !== memberId);
        }
        
        // Update current member if it's the same one
        if (state.currentMember && state.currentMember._id === memberId) {
          state.currentMember.featured = featured;
        }
        
        // Sort by order
        state.featuredMembers.sort((a, b) => a.order - b.order);
      }
    },
    updateMemberOrder: (state, action) => {
      const { memberId, order } = action.payload;
      
      // Update in all arrays
      const member = state.boardMembers.find(m => m._id === memberId);
      if (member) {
        member.order = order;
        
        // Update in active/featured arrays if present
        const activeMember = state.activeMembers.find(m => m._id === memberId);
        if (activeMember) {
          activeMember.order = order;
        }
        
        const featuredMember = state.featuredMembers.find(m => m._id === memberId);
        if (featuredMember) {
          featuredMember.order = order;
        }
        
        // Update current member if it's the same one
        if (state.currentMember && state.currentMember._id === memberId) {
          state.currentMember.order = order;
        }
        
        // Sort all arrays by order
        state.boardMembers.sort((a, b) => a.order - b.order);
        state.activeMembers.sort((a, b) => a.order - b.order);
        state.featuredMembers.sort((a, b) => a.order - b.order);
      }
    },
    reset: (state) => {
      return initialState;
    },
  },
});

export const {
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
  updateMemberOrder,
  reset,
} = boardTeamSlice.actions;

export default boardTeamSlice.reducer;

// Selectors
export const selectAllBoardMembers = (state) => state.boardTeam.boardMembers;
export const selectActiveMembers = (state) => state.boardTeam.activeMembers;
export const selectFeaturedMembers = (state) => state.boardTeam.featuredMembers;
export const selectCurrentMember = (state) => state.boardTeam.currentMember;
export const selectBoardTeamLoading = (state) => state.boardTeam.isLoading;
export const selectBoardTeamError = (state) => state.boardTeam.error; 