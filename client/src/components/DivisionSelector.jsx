import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGetAllDivisionsQuery } from '../features/division/divisionApiSlice';

/**
 * DivisionSelector Component
 * A reusable component for selecting a division (styled like LocationSelector)
 */
const DivisionSelector = ({
  initialDivisionName = '',
  initialDivisionId = '',
  onDivisionChange,
  required = false,
  className = ''
}) => {
  const isInitialMount = useRef(true);

  // Fetch divisions from API
  const {
    data,
    isLoading: divisionsLoading,
    error: divisionsError
  } = useGetAllDivisionsQuery();

  const divisions = data?.data || [];

  // State for selected division
  const [selectedDivisionId, setSelectedDivisionId] = useState(initialDivisionId);
  const [divisionSearchTerm, setDivisionSearchTerm] = useState(initialDivisionName || '');
  const [showDivisionDropdown, setShowDivisionDropdown] = useState(false);

  // Set initial division on mount
  useEffect(() => {
    if (isInitialMount.current) {
      if (divisions.length > 0 && initialDivisionId) {
        const division = divisions.find(d => d._id === initialDivisionId);
        if (division) {
          setDivisionSearchTerm(division.name || initialDivisionName || '');
          setSelectedDivisionId(initialDivisionId);
        } else if (initialDivisionName) {
          setDivisionSearchTerm(initialDivisionName);
        }
      }
      isInitialMount.current = false;
    }
  }, [divisions, initialDivisionId, initialDivisionName]);

  // Notify parent of selection
  useEffect(() => {
    if (!isInitialMount.current && onDivisionChange) {
      onDivisionChange(selectedDivisionId || '');
    }
  }, [selectedDivisionId, onDivisionChange]);

  // Filtered divisions
  const filteredDivisions = divisionSearchTerm
    ? divisions.filter(d =>
        d.name.toLowerCase().includes(divisionSearchTerm.toLowerCase()) ||
        (d.bengaliName && d.bengaliName.includes(divisionSearchTerm))
      )
    : divisions;

  // Handlers
  const handleDivisionSelect = useCallback((division) => {
    setSelectedDivisionId(division._id);
    setDivisionSearchTerm(division.name || '');
    setShowDivisionDropdown(false);
  }, []);

  const handleDivisionFocus = useCallback(() => {
    setShowDivisionDropdown(true);
  }, []);

  const handleDivisionBlur = useCallback(() => {
    setTimeout(() => setShowDivisionDropdown(false), 200);
  }, []);

  const handleClearDivision = useCallback(() => {
    setDivisionSearchTerm('');
    setSelectedDivisionId('');
    if (onDivisionChange) {
      onDivisionChange('');
    }
  }, [onDivisionChange]);

  return (
    <div className={`division-selector ${className}`}>
      <div className="form-group mb-3">
        <label htmlFor="division" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
          Division
        </label>
        <div className="relative">
          <input
            type="text"
            id="division"
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
            placeholder="Search for a division"
            value={divisionSearchTerm}
            onChange={(e) => {
              setDivisionSearchTerm(e.target.value);
              setShowDivisionDropdown(true);
            }}
            onFocus={handleDivisionFocus}
            onBlur={handleDivisionBlur}
            required={required}
          />
          {divisionSearchTerm && (
            <button
              type="button"
              onClick={handleClearDivision}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              title="Clear division"
            >
              &#10005;
            </button>
          )}

          {showDivisionDropdown && (
            <div className="absolute z-10 w-full mt-1 border border-neutral-300 bg-white rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-700">
              {divisionsLoading ? (
                <div className="px-4 py-2 text-neutral-600 dark:text-gray-400">Loading divisions...</div>
              ) : divisionsError ? (
                <div className="px-4 py-2 text-red-600">Error loading divisions</div>
              ) : filteredDivisions.length === 0 ? (
                <div className="px-4 py-2 text-neutral-600 dark:text-gray-400">No matching divisions found</div>
              ) : (
                filteredDivisions.map((division, index) => (
                  <button
                    key={division._id || `division-${division.name || index}`}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-gray-600 dark:text-white"
                    type="button"
                    onClick={() => handleDivisionSelect(division)}
                  >
                    {division.name || ''} {division.bengaliName ? `(${division.bengaliName})` : ''}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DivisionSelector; 