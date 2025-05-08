'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  upcomingEvents: [],
  completedEvents: [],
  currentEvent: null,
  isLoading: false,
  error: null
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setUpcomingEvents: (state, action) => {
      state.upcomingEvents = action.payload;
    },
    setCompletedEvents: (state, action) => {
      state.completedEvents = action.payload;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    reset: (state) => {
      return initialState;
    }
  }
});

export const {
  setEvents,
  setUpcomingEvents,
  setCompletedEvents,
  setCurrentEvent,
  setLoading,
  setError,
  reset
} = eventSlice.actions;

// Selectors
export const selectAllEvents = (state) => state.events.events;
export const selectUpcomingEvents = (state) => state.events.upcomingEvents;
export const selectCompletedEvents = (state) => state.events.completedEvents;
export const selectCurrentEvent = (state) => state.events.currentEvent;
export const selectEventsLoading = (state) => state.events.isLoading;
export const selectEventsError = (state) => state.events.error;

export default eventSlice.reducer; 