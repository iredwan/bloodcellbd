import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDistrictUtils, useUpazilaUtils, formatLocationInfo } from '../utils/locationUtils';

/**
 * LocationSelector Component
 * A reusable component for selecting district and upazila
 */
const LocationSelector = ({ 
  onLocationChange, 
  initialDistrictId = '',
  initialUpazilaId = '',
  required = false,
  className = ''
}) => {
  const isInitialRender = useRef(true);
  
  // Get districts using the custom hook
  const { 
    districts, 
    isLoading: districtsLoading, 
    error: districtsError,
    filterDistricts
  } = useDistrictUtils();

  // Log districts data for debugging
  useEffect(() => {
  }, [districts, districtsLoading, districtsError]);

  // District state
  const [selectedDistrictId, setSelectedDistrictId] = useState(initialDistrictId);
  const [districtSearchTerm, setDistrictSearchTerm] = useState('');
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  
  // Get upazilas based on selected district
  const { 
    upazilas, 
    isLoading: upazilasLoading, 
    error: upazilasError,
    filterUpazilas 
  } = useUpazilaUtils(selectedDistrictId);

  // Log upazilas data for debugging
  useEffect(() => {
    if (selectedDistrictId) {
    }
  }, [upazilas, upazilasLoading, upazilasError, selectedDistrictId]);

  // Upazila state
  const [selectedUpazilaId, setSelectedUpazilaId] = useState(initialUpazilaId);
  const [upazilaSearchTerm, setUpazilaSearchTerm] = useState('');
  const [showUpazilaDropdown, setShowUpazilaDropdown] = useState(false);

  // Fill in search terms from initial values when data is available
  useEffect(() => {
    if (isInitialRender.current && districts.length > 0) {
      if (initialDistrictId) {
        const district = districts.find(d => d._id === initialDistrictId);
        if (district) {
          setDistrictSearchTerm(district.name || '');
        }
      }
      isInitialRender.current = false;
    }
  }, [districts, initialDistrictId]);

  useEffect(() => {
    if (selectedDistrictId && upazilas.length > 0 && initialUpazilaId) {
      const upazila = upazilas.find(u => u._id === initialUpazilaId);
      if (upazila) {
        setUpazilaSearchTerm(upazila.name || '');
      }
    }
  }, [upazilas, initialUpazilaId, selectedDistrictId]);

  // Filtered lists
  const filteredDistricts = districtSearchTerm ? filterDistricts(districtSearchTerm) : districts;
  const filteredUpazilas = upazilaSearchTerm ? filterUpazilas(upazilaSearchTerm) : upazilas;

  // Memoize the location change callback to prevent unnecessary re-renders
  const notifyLocationChange = useCallback(() => {
    if (!onLocationChange) return;
    
    // Find the selected district and upazila objects
    const selectedDistrict = districts.find(d => d._id === selectedDistrictId);
    const selectedUpazila = upazilas.find(u => u._id === selectedUpazilaId);
    
    // Create the location data object once
    const locationData = {
      districtId: selectedDistrictId || '',
      upazilaId: selectedUpazilaId || '',
      district: selectedDistrict || null,
      upazila: selectedUpazila || null,
      ...formatLocationInfo(selectedDistrict, selectedUpazila)
    };
    

    // Store the last sent data in a ref to avoid this becoming a dependency
    // Only call onLocationChange if we have valid data that has changed
    const hasValidData = selectedDistrictId || selectedUpazilaId;
    
    if (hasValidData) {
      onLocationChange(locationData);
    }
  }, [districts, upazilas, selectedDistrictId, selectedUpazilaId, onLocationChange]);

  // Effect to notify parent of changes to selection
  useEffect(() => {
    // Skip the initial render to prevent an infinite loop on component mount
    if (!isInitialRender.current) {
      // Only call when IDs have actually changed, not on every render
      if (selectedDistrictId || selectedUpazilaId) {
        notifyLocationChange();
      }
    }
  }, [notifyLocationChange, selectedDistrictId, selectedUpazilaId]);

  // Reset upazila when district changes
  useEffect(() => {
    if (selectedDistrictId !== initialDistrictId && !isInitialRender.current) {
      setSelectedUpazilaId('');
      setUpazilaSearchTerm('');
    }
  }, [selectedDistrictId, initialDistrictId]);

  // Handle district selection
  const handleDistrictSelect = useCallback((district) => {
    setSelectedDistrictId(district._id);
    setDistrictSearchTerm(district.name || '');
    setShowDistrictDropdown(false);
  }, []);

  // Handle upazila selection
  const handleUpazilaSelect = useCallback((upazila) => {
    setSelectedUpazilaId(upazila._id);
    setUpazilaSearchTerm(upazila.name || '');
    setShowUpazilaDropdown(false);
  }, []);

  // Handle focus and blur events
  const handleDistrictFocus = useCallback(() => {
    setShowDistrictDropdown(true);
  }, []);

  const handleDistrictBlur = useCallback(() => {
    setTimeout(() => setShowDistrictDropdown(false), 200);
  }, []);

  const handleUpazilaFocus = useCallback(() => {
    setShowUpazilaDropdown(true);
  }, []);

  const handleUpazilaBlur = useCallback(() => {
    setTimeout(() => setShowUpazilaDropdown(false), 200);
  }, []);

  return (
    <div className={`location-selector ${className}`}>
      {/* District Selection */}
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
            onFocus={handleDistrictFocus}
            onBlur={handleDistrictBlur}
            required={required}
          />
          
          {showDistrictDropdown && (
            <div className="absolute z-10 w-full mt-1 border border-neutral-300 bg-white rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-700">
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
                    className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-gray-600 dark:text-white"
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

      {/* Upazila Selection */}
      <div className="form-group">
        <label htmlFor="upazila" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
          Upazila
        </label>
        <div className="relative">
          <input
            type="text"
            id="upazila"
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
            placeholder={selectedDistrictId ? "Search for an upazila" : "Select a district first"}
            value={upazilaSearchTerm}
            onChange={(e) => {
              setUpazilaSearchTerm(e.target.value);
              setShowUpazilaDropdown(true);
            }}
            onFocus={handleUpazilaFocus}
            onBlur={handleUpazilaBlur}
            disabled={!selectedDistrictId}
            required={required}
          />
          
          {showUpazilaDropdown && selectedDistrictId && (
            <div className="absolute z-10 w-full mt-1 border border-neutral-300 bg-white rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-700">
              {upazilasLoading ? (
                <div className="px-4 py-2 text-neutral-600 dark:text-gray-400">Loading upazilas...</div>
              ) : upazilasError ? (
                <div className="px-4 py-2 text-red-600">Error loading upazilas</div>
              ) : filteredUpazilas.length === 0 ? (
                <div className="px-4 py-2 text-neutral-600 dark:text-gray-400">No matching upazilas found</div>
              ) : (
                filteredUpazilas.map((upazila, index) => (
                  <button
                    key={upazila._id || `upazila-${upazila.name || index}`}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-gray-600 dark:text-white"
                    type="button"
                    onClick={() => handleUpazilaSelect(upazila)}
                  >
                    {upazila.name || ''} {upazila.bengaliName ? `(${upazila.bengaliName})` : ''}
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

export default LocationSelector; 