'use client';

import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../api/apiSlice';
import { 
  setEvents, 
  setUpcomingEvents, 
  setCompletedEvents,
  setCurrentEvent, 
  setLoading, 
  setError,
  selectAllEvents,
  selectUpcomingEvents,
  selectCompletedEvents,
  selectCurrentEvent,
  selectEventsLoading,
  selectEventsError
} from './eventSlice';
import { getCookie } from 'cookies-next';

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all events
    getAllEvents: builder.query({
      query: () => 'events/all',
      providesTags: ['Event'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          if (data.status === false) {
            dispatch(setError(data.message));
            dispatch(setEvents([]));
          } else {
            dispatch(setEvents(data.data || []));
          }
        } catch (error) {
          dispatch(setError(error.message || 'Failed to fetch events'));
          dispatch(setEvents([]));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    // Get upcoming events
    getUpcomingEvents: builder.query({
      query: () => 'events/upcoming',
      providesTags: ['Event'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status === false) {
            dispatch(setError(data.message));
            dispatch(setUpcomingEvents([]));
          } else {
            dispatch(setUpcomingEvents(data.data || []));
          }
        } catch (error) {
          dispatch(setError(error.message || 'Failed to fetch upcoming events'));
          dispatch(setUpcomingEvents([]));
        }
      },
    }),

    // Get completed events
    getCompletedEvents: builder.query({
      query: () => 'events/completed',
      providesTags: ['Event'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status === false) {
            dispatch(setError(data.message));
            dispatch(setCompletedEvents([]));
          } else {
            dispatch(setCompletedEvents(data.data || []));
          }
        } catch (error) {
          dispatch(setError(error.message || 'Failed to fetch completed events'));
          dispatch(setCompletedEvents([]));
        }
      },
    }),
    
    // Get event by ID
    getEventById: builder.query({
      query: (id) => `events/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Event', id }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status === false) {
            dispatch(setError(data.message));
            dispatch(setCurrentEvent(null));
          } else {
            dispatch(setCurrentEvent(data.data || null));
          }
        } catch (error) {
          dispatch(setError(error.message || 'Failed to fetch event'));
          dispatch(setCurrentEvent(null));
        }
      },
    }),
    
    // Create event
    createEvent: builder.mutation({
      query: (eventData) => {
        const token = getCookie('token');
        
        return {
          url: 'events/create',
          method: 'POST',
          body: eventData,
          headers: token ? { token } : {},
        };
      },
      invalidatesTags: ['Event'],
    }),
    
    // Update event
    updateEvent: builder.mutation({
      query: ({ id, eventData }) => {
        const token = getCookie('token');
        
        return {
          url: `events/update/${id}`,
          method: 'PATCH',
          body: eventData,
          headers: token ? { token } : {},
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Event', id }, 'Event'],
    }),
    
    // Delete event
    deleteEvent: builder.mutation({
      query: (id) => {
        const token = getCookie('token');
        
        return {
          url: `events/delete/${id}`,
          method: 'DELETE',
          headers: token ? { token } : {},
        };
      },
      invalidatesTags: ['Event'],
    }),
  }),
});

// Custom hook that combines Redux state and RTK Query for events
export const useEvents = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux selectors
  const events = useSelector(selectAllEvents);
  const upcomingEvents = useSelector(selectUpcomingEvents);
  const completedEvents = useSelector(selectCompletedEvents);
  const currentEvent = useSelector(selectCurrentEvent);
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);

  // Use RTK Query to fetch data
  const { 
    refetch: refetchAllEvents,
    isFetching: isFetchingAll
  } = eventApiSlice.useGetAllEventsQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  
  const {
    refetch: refetchUpcomingEvents,
    isFetching: isFetchingUpcoming
  } = eventApiSlice.useGetUpcomingEventsQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const {
    refetch: refetchCompletedEvents,
    isFetching: isFetchingCompleted
  } = eventApiSlice.useGetCompletedEventsQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // Combine local loading state with RTK Query fetching state
  const isLoading = loading || isFetchingAll || isFetchingUpcoming || isFetchingCompleted;

  return {
    events,
    upcomingEvents,
    completedEvents,
    currentEvent,
    loading: isLoading,
    error,
    refreshEvents: refetchAllEvents,
    refreshUpcomingEvents: refetchUpcomingEvents,
    refreshCompletedEvents: refetchCompletedEvents
  };
};

export const {
  useGetAllEventsQuery,
  useGetUpcomingEventsQuery,
  useGetCompletedEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApiSlice; 