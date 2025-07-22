import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';

const TeamSelector = ({
  teams = [], // Team data from parent
  onSearch, // Called when search input changes
  onTeamSelect, // Called when a team is selected
  initialTeam = null,
  label = 'Search Team',
  placeholder = 'Search team ...',
  isLoading = false,
  isError = false,
  errorMessage = '',
  onRetry = null,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((val) => {
      if (onSearch && val.length >= 2) {
        onSearch(val);
      }
    }, 500),
    [onSearch]
  );

  // Initial team load
  useEffect(() => {
    if (initialTeam && !selectedTeam) {
      setSelectedTeam(initialTeam);
      setQuery(initialTeam.name || '');
    }
  }, [initialTeam, selectedTeam]);

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

  // Handle team selection
  const handleSelect = (team) => {
    if (!team) return;
    
    setSelectedTeam(team);
    setQuery(team.name || '');
    setIsDropdownOpen(false);
    
    if (onTeamSelect) {
      onTeamSelect(team._id);
    }
  };

  return (
    <div ref={wrapperRef} className={`w-full relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={query || ''}
        onChange={(e) => {
          const val = e.target.value || '';
          setQuery(val);
          setIsDropdownOpen(true);
          debouncedSearch(val);
        }}
        onFocus={() => setIsDropdownOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
      {isDropdownOpen && query && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 border border-neutral-300 bg-white rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-700">
          {isLoading && (
            <div className="p-2 text-center text-gray-900 dark:text-gray-100">Loading...</div>
          )}
          {isError && (
            <div className="p-2 text-center text-red-500">
              {errorMessage || 'Error loading teams'}
              {onRetry && (
                <button onClick={onRetry} className="block text-blue-500 mt-2 text-sm mx-auto">
                  Retry
                </button>
              )}
            </div>
          )}
          {!isLoading && !isError && teams && teams.length > 0 && teams.map((team) => (
            <div
              key={team._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600 border-b border-neutral-200 dark:border-gray-600"
              onClick={() => handleSelect(team)}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">{team.name || team.districtName}</div>
            </div>
          ))}
          {!isLoading && !isError && (!teams || teams.length === 0) && (
            <div className="p-2 text-center text-gray-500">No team members found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamSelector;
