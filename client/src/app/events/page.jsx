'use client';

import { useState } from 'react';
import { useGetAllEventsQuery } from '@/features/events/eventApiSlice';
import EventCard from '@/components/EventCard';
import { FaSpinner } from 'react-icons/fa';

export default function EventsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { data: eventsData, isLoading, error } = useGetAllEventsQuery();
  
  // Filter events based on status
  const filterEvents = (events) => {
    const now = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.date);
      switch(selectedFilter) {
        case 'upcoming':
          return eventDate > now;
        case 'ongoing':
          const endDate = new Date(event.endDate || event.date);
          return eventDate <= now && endDate >= now;
        case 'completed':
          return eventDate < now;
        default: // 'all'
          return true;
      }
    });
  };

  // Get filtered events
  const events = eventsData?.data || [];
  const filteredEvents = filterEvents(events);
  
  // Grid column logic
  const columnCount = 
    filteredEvents.length === 1 ? 'grid-cols-1' :
    filteredEvents.length === 2 ? 'md:grid-cols-2' :
    'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Filter */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Blood Donation Events
          </h1>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['all', 'upcoming', 'ongoing', 'completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer
                  ${
                    selectedFilter === filter
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400">
            {selectedFilter === 'all' 
              ? 'Showing all events'
              : `Showing ${selectedFilter} events`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 text-red-500">
            <p className="text-xl font-semibold">Error loading events</p>
            <p className="text-sm mt-2">Please refresh the page or try again later</p>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && (
          filteredEvents.length > 0 ? (
            <div className={`grid ${columnCount} gap-8`}>
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No {selectedFilter} events found
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}