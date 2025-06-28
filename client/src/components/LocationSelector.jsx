import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDistrictUtils, useUpazilaUtils, formatLocationInfo } from '../utils/locationUtils';

/**
 * LocationSelector Component
 * A reusable component for selecting district and upazila
 */
const LocationSelector = ({ 
  initialDistrictName = '',
  initialUpazilaName = '',
  onLocationChange, 
  initialDistrictId = '',
  initialUpazilaId = '',
  required = false,
  className = ''
}) => {
  const isInitialMount = useRef(true);
  
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
  const [districtSearchTerm, setDistrictSearchTerm] = useState(initialDistrictName || '');
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
  const [upazilaSearchTerm, setUpazilaSearchTerm] = useState(initialUpazilaName || '');
  const [showUpazilaDropdown, setShowUpazilaDropdown] = useState(false);

  // Initialize both district and upazila on mount
  useEffect(() => {
    if (isInitialMount.current) {
      // Set initial district
      if (districts.length > 0 && initialDistrictId) {
        const district = districts.find(d => d._id === initialDistrictId);
        if (district) {
          setDistrictSearchTerm(district.name || initialDistrictName || '');
          setSelectedDistrictId(initialDistrictId);
        } else if (initialDistrictName) {
          setDistrictSearchTerm(initialDistrictName);
        }
      }

      // Set initial upazila name immediately, even before upazilas are loaded
      if (initialUpazilaName) {
        setUpazilaSearchTerm(initialUpazilaName);
      }
      
      isInitialMount.current = false;
    }
  }, [districts, initialDistrictId, initialDistrictName, initialUpazilaName]);

  // Update upazila ID when upazilas are loaded
  useEffect(() => {
    if (upazilas.length > 0 && initialUpazilaId) {
      const upazila = upazilas.find(u => u._id === initialUpazilaId);
      if (upazila) {
        setUpazilaSearchTerm(upazila.name || initialUpazilaName || '');
        setSelectedUpazilaId(initialUpazilaId);
      }
    }
  }, [upazilas, initialUpazilaId, initialUpazilaName]);

  // Notify parent of initial values
  useEffect(() => {
    if (isInitialMount.current && (initialDistrictId || initialUpazilaId)) {
      const selectedDistrict = districts.find(d => d._id === initialDistrictId);
      const selectedUpazila = upazilas.find(u => u._id === initialUpazilaId);
      
      if (onLocationChange) {
        onLocationChange({
          districtId: initialDistrictId || '',
          upazilaId: initialUpazilaId || '',
          district: selectedDistrict || null,
          upazila: selectedUpazila || null,
          ...formatLocationInfo(selectedDistrict, selectedUpazila)
        });
      }
    }
  }, [districts, upazilas, initialDistrictId, initialUpazilaId, onLocationChange]);

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
    
    // Only call onLocationChange if we have valid data that has changed
    const hasValidData = selectedDistrictId || selectedUpazilaId;
    
    if (hasValidData) {
      onLocationChange(locationData);
    }
  }, [districts, upazilas, selectedDistrictId, selectedUpazilaId, onLocationChange]);

  useEffect(() => {
    // Skip the initial render to prevent an infinite loop on component mount
    if (!isInitialMount.current) {
      // Only call when IDs have actually changed, not on every render
      if (selectedDistrictId || selectedUpazilaId) {
        // Add a small delay to prevent rapid consecutive updates
        const timeoutId = setTimeout(() => {
          notifyLocationChange();
        }, 50);
        
        // Clean up the timeout if the component unmounts or dependencies change
        return () => clearTimeout(timeoutId);
      }
    }
  }, [selectedDistrictId, selectedUpazilaId, notifyLocationChange]);

  // Reset upazila when district changes
  useEffect(() => {
    if (selectedDistrictId !== initialDistrictId && !isInitialMount.current) {
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

  // Handle clearing district
  const handleClearDistrict = useCallback(() => {
    setDistrictSearchTerm('');
    setSelectedDistrictId('');
    setUpazilaSearchTerm('');
    setSelectedUpazilaId('');
    if (onLocationChange) {
      onLocationChange({
        districtId: '',
        upazilaId: '',
        district: null,
        upazila: null,
        formattedLocation: ''
      });
    }
  }, [onLocationChange]);

  // Handle clearing upazila
  const handleClearUpazila = useCallback(() => {
    setUpazilaSearchTerm('');
    setSelectedUpazilaId('');
    if (onLocationChange) {
      const selectedDistrict = districts.find(d => d._id === selectedDistrictId);
      onLocationChange({
        districtId: selectedDistrictId,
        upazilaId: '',
        district: selectedDistrict,
        upazila: null,
        ...formatLocationInfo(selectedDistrict, null)
      });
    }
  }, [onLocationChange, selectedDistrictId, districts]);

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
          {districtSearchTerm && (
            <button
              type="button"
              onClick={handleClearDistrict}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              title="Clear district"
            >
              &#10005;
            </button>
          )}

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
          Upazila/Thana
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
          {upazilaSearchTerm && (
            <button
              type="button"
              onClick={handleClearUpazila}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              title="Clear upazila"
            >
              &#10005;
            </button>
          )}

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