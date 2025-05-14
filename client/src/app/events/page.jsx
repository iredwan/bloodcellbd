'use client';

import { useState } from 'react';
import { useGetAllEventsQuery } from '@/features/events/eventApiSlice';
import EventCard from '@/components/EventCard';
import { FaSpinner } from 'react-icons/fa';
import Pagination from '@/components/Pagination';
import EventCardSkeleton from '@/components/ui/Skeletons/EventCardSkeleton';

export default function EventsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const { data: eventsData, isLoading, error } = useGetAllEventsQuery();

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
        default:
          return true;
      }
    });
  };

  const events = eventsData?.data || [];
  const filteredEvents = filterEvents(events);

  const startIndex = currentPage * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  const pageCount = Math.ceil(filteredEvents.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Filter */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Blood Donation Events
          </h1>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['all', 'upcoming', 'ongoing', 'completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                  setCurrentPage(0); // reset pagination on filter change
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer
                  ${selectedFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'}
                `}
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

        {/* Loading */}
        {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <EventCardSkeleton key={idx} />
              ))}
            </div>
          )}

        {/* Error */}
        {error && (
          <div className="text-center py-12 text-red-500">
            <p className="text-xl font-semibold">Error loading events</p>
            <p className="text-sm mt-2">Please refresh the page or try again later</p>
          </div>
        )}

        {/* Event Grid */}
        {!isLoading && !error && (
          filteredEvents.length > 0 ? (
            <>
              <div className="flex justify-center">
                <div className={`
                  grid 
                  ${paginatedEvents.length === 1 ? 'grid-cols-1 max-w-md' : ''}
                  ${paginatedEvents.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl' : ''}
                  ${paginatedEvents.length >= 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}
                  gap-6 w-full
                `}>
                  {paginatedEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <Pagination
                pageCount={pageCount}
                onPageChange={handlePageChange}
                currentPage={currentPage}
              />
            </>
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
