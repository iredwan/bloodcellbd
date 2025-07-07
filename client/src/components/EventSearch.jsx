import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGetAllEventsQuery } from '@/features/events/eventApiSlice';
import { debounce } from 'lodash';

const EventSearch = ({
  onEventSelect,
  initialEvent = null,
  label = 'Event Name',
  placeholder = 'Search event...',
}) => {
  const [query, setQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const { data, isLoading, isError, error, refetch } = useGetAllEventsQuery(
    {
      page: 1,
      limit: 10,
      search: query,
    },
    { skip: query.length < 3 }
  );

  const events = data?.data || [];

  const debouncedSearch = useCallback(
    debounce((val) => {
      setQuery(val);
    }, 500),
    []
  );

  // Initial event load
  useEffect(() => {
    if (initialEvent && !selectedEvent) {
      setSelectedEvent(initialEvent);
      setQuery(initialEvent.title);
    }
  }, [initialEvent, selectedEvent]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (event) => {
    setSelectedEvent(event);
    setQuery(event.title);
    setIsDropdownOpen(false);

    if (onEventSelect) {
      onEventSelect({
        title: event.title,
        upazila: event.upazila,
        district: event.district,
        date: event.date,
        id: event._id,
        eventID: event.eventID,
      });
    }
  };

  return (
    <div ref={wrapperRef} className="w-full relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          setIsDropdownOpen(true);
          debouncedSearch(val);
        }}
        onFocus={() => setIsDropdownOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
      {isDropdownOpen && query.length >= 3 && (
        <div className="absolute z-10 w-full mt-1 border border-neutral-300 bg-white rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-700">
          {isLoading && (
            <div className="p-2 text-center text-gray-900 dark:text-gray-100">Loading...</div>
          )}
          {isError && (
            <div className="p-2 text-center text-red-500">
              {error?.data?.message || 'Error loading events'}
              <button onClick={refetch} className="block text-blue-500 mt-2 text-sm mx-auto">
                Retry
              </button>
            </div>
          )}
          {!isLoading &&
            !isError &&
            events.map((event) => (
              <div
                key={event._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600 border-b border-neutral-200 dark:border-gray-600"
                onClick={() => handleSelect(event)}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">{event.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {event.upazila}, {event.district} - {event.date}
                </div>
              </div>
            ))}
          {!isLoading && !isError && events.length === 0 && (
            <div className="p-2 text-center text-gray-500">No events found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventSearch; 