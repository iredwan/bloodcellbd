import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGetAllHospitalsQuery } from '@/features/hospital/hospitalApiSlice';
import { debounce } from 'lodash';

const HospitalSearch = ({
  onHospitalSelect,
  initialHospital = null,
  label = 'Hospital Name',
  placeholder = 'Search hospital...',
}) => {
  const [query, setQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(initialHospital);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const { data, isLoading, isError, error, refetch } = useGetAllHospitalsQuery(
    {
      page: 1,
      limit: 10,
      search: query,
    },
    {
      skip: query.length < 3,
    }
  );

  const hospitals = data?.data || [];

  const debouncedSearch = useCallback(
    debounce((val) => {
      setQuery(val);
    }, 500),
    []
  );

  useEffect(() => {
    if (initialHospital) {
      setSelectedHospital(initialHospital);
      setQuery(initialHospital.name);
    }
  }, [initialHospital]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (hospital) => {
    setSelectedHospital(hospital);
    setQuery(hospital.name);
    setIsDropdownOpen(false);
    if (onHospitalSelect) {
      onHospitalSelect({
        name: hospital.name,
        district: hospital.district,
        upazila: hospital.upazila,
        id: hospital._id,
      });
    }
  };

  return (
    <div ref={wrapperRef} className="w-full relative">
      <label htmlFor="bloodUnit"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsDropdownOpen(true);
          debouncedSearch(e.target.value);
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
              {error?.data?.message || 'Error loading hospitals'}
              <button
                onClick={refetch}
                className="block text-blue-500 mt-2 text-sm mx-auto"
              >
                Retry
              </button>
            </div>
          )}
          {!isLoading &&
            !isError &&
            hospitals.map((hospital) => (
              <div
                key={hospital._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600 border-b-2 border-neutral-300 dark:border-gray-600"
                onClick={() => handleSelect(hospital)}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">{hospital.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {hospital.district}, {hospital.upazila}
                </div>
              </div>
            ))}
          {!isLoading && !isError && hospitals.length === 0 && (
            <div className="p-2 text-center text-gray-500">No hospitals found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HospitalSearch;
