'use client';
import { apiSlice } from '../api/apiSlice';

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: (reqBody) => ({
        url: 'events/all',
        method: 'GET',
        params: reqBody,
      }),
      providesTags: ['Event'],
    }),
    
    getUpcomingEvents: builder.query({
      query: (reqBody) => ({
        url: 'events/upcoming',
        method: 'GET',
        params: reqBody,
      }),
      providesTags: ['Event'],
    }),

    getCompletedEvents: builder.query({
      query: (reqBody) => ({
        url: 'events/completed',
        method: 'GET',
        params: reqBody,
      }),
      providesTags: ['Event'],
      
    }),
    
    // Get event by ID
    getEventById: builder.query({
      query: (id) => ({
        url: `events/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['Event'],
      
    }),
    
    // Create event
    createEvent: builder.mutation({
      query: (eventData) => {
        return {
          url: 'events/create',
          method: 'POST',
          body: eventData,
        };
      },
      invalidatesTags: ['Event'],
    }),
    
    // Update event
    updateEvent: builder.mutation({
      query: ({ id, eventData }) => {
        return {
          url: `events/update/${id}`,
          method: 'PATCH',
          body: eventData,
        };
      },
      invalidatesTags: ['Event'],
    }),
    
    // Delete event
    deleteEvent: builder.mutation({
      query: (id) => {
        return {
          url: `events/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Event'],
    }),
  }),
});


export const {
  useGetAllEventsQuery,
  useGetUpcomingEventsQuery,
  useGetCompletedEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApiSlice; 