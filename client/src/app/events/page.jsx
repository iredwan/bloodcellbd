'use client';

import { useState, useEffect } from 'react';
import { useGetAllEventsQuery } from '@/features/events/eventApiSlice';
import EventCard from '@/components/EventCard';
import { FaSearch } from 'react-icons/fa';
import Pagination from '@/components/Pagination';
import EventCardSkeleton from '@/components/ui/Skeletons/EventCardSkeleton';
import {useDebounce} from '@/hooks/useDebounce';

export default function EventsPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1); // API pagination is 1-based
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const itemsPerPage = 6;

  // Prepare query parameters for the API
  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
  };

  // Add status filter if not 'All'
  if (selectedFilter !== 'All') {
    queryParams.status = selectedFilter;
  }

  // Add search term if available
  if (debouncedSearchTerm) {
    queryParams.search = debouncedSearchTerm;
  }

  const { data: eventsData, isLoading, error } = useGetAllEventsQuery(queryParams);

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, debouncedSearchTerm]);

  // Extract events and pagination info from the API response
  const events = eventsData?.data || [];
  const pagination = eventsData?.pagination || {
    totalPages: 0,
    currentPage: 1,
    totalCount: 0
  };

  const handlePageChange = ({ selected }) => {
    // API pagination is 1-based, but react-paginate is 0-based
    setCurrentPage(selected + 1);
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

          {/* Search Bar */}
          <div className="mb-6 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['All', 'Upcoming', 'Ongoing', 'Completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer
                  ${selectedFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'}
                `}
              >
                {filter}
              </button>
            ))}
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400">
            {selectedFilter === 'All'
              ? 'Showing all events'
              : `Showing ${selectedFilter} events`}
            {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
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
          events.length > 0 ? (
            <>
              <div className="flex justify-center">
                <div className={`
                  grid 
                  ${events.length === 1 ? 'grid-cols-1 max-w-md' : ''}
                  ${events.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl' : ''}
                  ${events.length >= 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}
                  gap-6 w-full
                `}>
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Pagination
                  pageCount={pagination.totalPages}
                  onPageChange={handlePageChange}
                  currentPage={pagination.currentPage - 1} // Convert 1-based to 0-based for component
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No {selectedFilter.toLowerCase()} events found
                {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
