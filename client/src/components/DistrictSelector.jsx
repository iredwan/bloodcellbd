import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDistrictUtils } from '../utils/locationUtils';

const DistrictSelector = ({
  onDistrictChange,
  initialDistrictId = '',
  required = false,
  className = ''
}) => {
  const isInitialRender = useRef(true);

  const {
    districts,
    isLoading: districtsLoading,
    error: districtsError,
    filterDistricts,
  } = useDistrictUtils();

  const [selectedDistrictId, setSelectedDistrictId] = useState(initialDistrictId);
  const [districtSearchTerm, setDistrictSearchTerm] = useState('');
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  // Set initial value
  useEffect(() => {
    if (isInitialRender.current && districts.length > 0 && initialDistrictId) {
      const district = districts.find((d) => d._id === initialDistrictId);
      if (district) {
        setDistrictSearchTerm(district.name || '');
      }
      isInitialRender.current = false;
    }
  }, [districts, initialDistrictId]);

  const filteredDistricts = districtSearchTerm
    ? filterDistricts(districtSearchTerm)
    : districts;

  const handleDistrictSelect = useCallback((district) => {
    setSelectedDistrictId(district._id);
    setDistrictSearchTerm(district.name || '');
    setShowDistrictDropdown(false);

    if (onDistrictChange) {
      onDistrictChange(district); // return full district object
    }
  }, [onDistrictChange]);

  return (
    <div className={`district-selector ${className}`}>
      <div className="form-group mb-3">
        <label htmlFor="district" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
          District
        </label>
        <div className="relative">
          <input
            type="text"
            id="district"
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
            placeholder="Search for a district"
            value={districtSearchTerm}
            onChange={(e) => {
              setDistrictSearchTerm(e.target.value);
              setShowDistrictDropdown(true);
            }}
            onFocus={() => setShowDistrictDropdown(true)}
            onBlur={() => setTimeout(() => setShowDistrictDropdown(false), 200)}
            required={required}
          />

          {showDistrictDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-800">
              {districtsLoading ? (
                <div className="px-4 py-2 text-neutral-600 dark:text-gray-400">Loading districts...</div>
              ) : districtsError ? (
                <div className="px-4 py-2 text-red-600">Error loading districts</div>
              ) : filteredDistricts.length === 0 ? (
                <div className="px-4 py-2 text-neutral-600 dark:text-gray-400">No matching districts found</div>
              ) : (
                filteredDistricts.map((district, index) => (
                  <button
                    key={district._id || `district-${district.name || index}`}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-gray-700"
                    type="button"
                    onClick={() => handleDistrictSelect(district)}
                  >
                    {district.name || ''} {district.bengaliName ? `(${district.bengaliName})` : ''}
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

export default DistrictSelector;
