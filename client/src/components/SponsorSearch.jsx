import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGetAllSponsorsQuery } from '@/features/sponsors/sponsorApiSlice';
import { debounce } from 'lodash';
import Image from 'next/image';

const SponsorSearch = ({
  onSponsorSelect,
  initialSponsor = null,
  label = 'Sponsor Name',
  placeholder = 'Search sponsor...',
  filterByType = null,
  showLogo = true,
}) => {
  const [query, setQuery] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const wrapperRef = useRef(null);
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  const { data: apiResponse, isLoading, isError, error, refetch } = useGetAllSponsorsQuery(
    {
      page: 1,
      limit: 10,
      search: query,
      sponsorType: filterByType,
    },
    { skip: query.length < 3 }
  );

  // Log data structure for debugging
  useEffect(() => {
    if (apiResponse) {
      console.log('Sponsor API response:', apiResponse);
      if (apiResponse.data) {
        console.log('API response data content:', apiResponse.data);
      }
    }
  }, [apiResponse]);

  // Extract sponsors array from the API response
  let sponsors = [];
  if (apiResponse) {
    if (apiResponse.status === true && apiResponse.data) {
      // Handle the specific structure: { status: true, data: {...}, message: "..." }
      if (Array.isArray(apiResponse.data)) {
        // If data is directly an array
        sponsors = apiResponse.data;
        console.log('Found sponsors as direct array in data:', sponsors.length);
      } else if (typeof apiResponse.data === 'object') {
        // If data is an object that contains sponsors
        // Check if data has a sponsors property
        if (apiResponse.data.sponsors && Array.isArray(apiResponse.data.sponsors)) {
          sponsors = apiResponse.data.sponsors;
          console.log('Found sponsors in data.sponsors:', sponsors.length);
        } else if (apiResponse.data.data && Array.isArray(apiResponse.data.data)) {
          sponsors = apiResponse.data.data;
          console.log('Found sponsors in data.data:', sponsors.length);
        } else if (apiResponse.data.result && Array.isArray(apiResponse.data.result)) {
          sponsors = apiResponse.data.result;
          console.log('Found sponsors in data.result:', sponsors.length);
        } else if (apiResponse.data.docs && Array.isArray(apiResponse.data.docs)) {
          // Common pagination structure
          sponsors = apiResponse.data.docs;
          console.log('Found sponsors in data.docs:', sponsors.length);
        } else {
          // If data is an object but doesn't have a clear array property,
          // check if it's an object where each key is a sponsor object
          const possibleSponsors = Object.values(apiResponse.data).filter(item => 
            item && typeof item === 'object' && item.name && (item._id || item.id)
          );
          
          if (possibleSponsors.length > 0) {
            sponsors = possibleSponsors;
            console.log('Extracted sponsors from data object:', sponsors.length);
          } else {
            // Last resort: check if the data object itself is a sponsor object
            if (apiResponse.data.name && (apiResponse.data._id || apiResponse.data.id)) {
              sponsors = [apiResponse.data];
              console.log('Found single sponsor object in data');
            } else {
              console.warn('Could not find sponsors array in data:', apiResponse.data);
            }
          }
        }
      }
    } else if (Array.isArray(apiResponse)) {
      // Direct array response
      sponsors = apiResponse;
      console.log('Found sponsors as direct array in response:', sponsors.length);
    } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
      // { data: [...] } structure
      sponsors = apiResponse.data;
      console.log('Found sponsors in response.data array:', sponsors.length);
    } else {
      console.warn('Unexpected sponsor API response structure:', apiResponse);
    }
  }

  const debouncedSearch = useCallback(
    debounce((val) => {
      setQuery(val);
    }, 500),
    []
  );

  // Initial sponsor load
  useEffect(() => {
    if (initialSponsor && !selectedSponsor) {
      setSelectedSponsor(initialSponsor);
      setQuery(initialSponsor.name);
    }
  }, [initialSponsor, selectedSponsor]);

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

  const handleSelect = (sponsor) => {
    setSelectedSponsor(sponsor);
    setQuery(sponsor.name || '');
    setIsDropdownOpen(false);

    if (onSponsorSelect) {
      onSponsorSelect({
        name: sponsor.name || '',
        sponsorType: sponsor.sponsorType || '',
        logo: sponsor.logo || '',
        id: sponsor._id || sponsor.id || '',
        sponsorId: sponsor.sponsorId || ''
      });
    }
  };

  const handleImageError = (sponsorId) => {
    setImageErrors(prev => ({
      ...prev,
      [sponsorId]: true
    }));
  };

  // Filter sponsors by type if filterByType is provided
  const filteredSponsors = filterByType && sponsors.length > 0
    ? sponsors.filter(sponsor => sponsor.sponsorType === filterByType)
    : sponsors;

  console.log('Filtered sponsors for rendering:', filteredSponsors);

  return (
    <div ref={wrapperRef} className="w-full relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {filterByType && <span className="ml-2 text-xs text-gray-500">({filterByType} sponsors only)</span>}
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
              {error?.data?.message || 'Error loading sponsors'}
              <button onClick={refetch} className="block text-blue-500 mt-2 text-sm mx-auto">
                Retry
              </button>
            </div>
          )}
          {!isLoading && !isError && filteredSponsors && filteredSponsors.length > 0 ? (
            filteredSponsors.map((sponsor, index) => {
              const sponsorId = sponsor._id || sponsor.id || `sponsor-${index}`;
              return (
                <div
                  key={sponsorId}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600 border-b border-neutral-200 dark:border-gray-600 flex items-center"
                  onClick={() => handleSelect(sponsor)}
                >
                  {showLogo && sponsor.logo && !imageErrors[sponsorId] ? (
                    <div className="mr-3 flex-shrink-0">
                      <Image 
                        src={imageUrl + sponsor.logo} 
                        alt={sponsor.name || 'Sponsor'}
                        width={32}
                        height={32}
                        className="rounded-sm object-contain"
                        onError={() => handleImageError(sponsorId)}
                      />
                    </div>
                  ) : (
                    <div className="mr-3 flex-shrink-0 w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center">
                      <span className="text-xs text-gray-500">Logo</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {sponsor.name || 'Unknown Sponsor'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {sponsor.sponsorType || 'No type'}
                      {sponsor.sponsorId && <span className="ml-2">ID: {sponsor.sponsorId}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-2 text-center text-gray-500">No sponsors found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SponsorSearch; 