/**
 * Client-side utility functions for handling district and upazila data
 */
import { useGetAllDistrictsQuery } from '../features/districts/districtApiSlice';
import { useGetUpazilasByDistrictQuery } from '../features/upazilas/upazilaApiSlice';
import { useCallback } from 'react';

// Default fallback data
const defaultDistricts = [];
const defaultUpazilas = [];

/**
 * Custom hook to get and filter districts
 * @returns {Object} District utility functions and data
 */
export const useDistrictUtils = () => {
  const { data, isLoading, error, refetch } = useGetAllDistrictsQuery();

  // Safely extract district data from response
  // Handle all possible response formats including 304 Not Modified
  const extractDistricts = () => {
    if (!data) return defaultDistricts;
    
    // Handle response.data format
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    // Handle direct array format
    if (Array.isArray(data)) {
      return data;
    }
    
    console.warn('Unexpected district data format:', data);
    return defaultDistricts;
  };
  
  const districts = extractDistricts();

  /**
   * Find a district by its ID
   * @param {string} districtId - The ID of the district to find
   * @returns {Object|null} The district object or null if not found
   */
  const findDistrictById = useCallback((districtId) => {
    if (!districtId || !Array.isArray(districts) || districts.length === 0) {
      return null;
    }
    
    return districts.find(district => district._id === districtId) || null;
  }, [districts]);

  /**
   * Find a district by its name
   * @param {string} districtName - The name of the district to find
   * @returns {Object|null} The district object or null if not found
   */
  const findDistrictByName = useCallback((districtName) => {
    if (!districtName || !Array.isArray(districts) || districts.length === 0) {
      return null;
    }
    
    // Case insensitive search
    const normalizedName = districtName.toLowerCase();
    return districts.find(district => 
      district.name?.toLowerCase() === normalizedName || 
      district.bengaliName?.toLowerCase() === normalizedName
    ) || null;
  }, [districts]);

  /**
   * Filter districts by search term
   * @param {string} searchTerm - The search term to filter districts by
   * @returns {Array} Filtered districts
   */
  const filterDistricts = useCallback((searchTerm) => {
    if (!searchTerm || !Array.isArray(districts) || districts.length === 0) {
      return districts;
    }
    
    const normalizedTerm = searchTerm.toLowerCase();
    return districts.filter(district => 
      (district.name && district.name.toLowerCase().includes(normalizedTerm)) || 
      (district.bengaliName && district.bengaliName.toLowerCase().includes(normalizedTerm))
    );
  }, [districts]);

  return {
    districts,
    isLoading,
    error,
    refetch,
    findDistrictById,
    findDistrictByName,
    filterDistricts
  };
};

/**
 * Custom hook to get and filter upazilas by district
 * @param {string} districtId - The ID of the district
 * @returns {Object} Upazila utility functions and data
 */
export const useUpazilaUtils = (districtId) => {
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useGetUpazilasByDistrictQuery(districtId, {
    skip: !districtId
  });
  
  // Safely extract upazila data from response
  // Handle all possible response formats including 304 Not Modified
  const extractUpazilas = () => {
    if (!data) return defaultUpazilas;
    
    // Handle response.data format
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    // Handle direct array format
    if (Array.isArray(data)) {
      return data;
    }
    
    console.warn('Unexpected upazila data format:', data);
    return defaultUpazilas;
  };
  
  const upazilas = extractUpazilas();

  /**
   * Find a upazila by its ID
   * @param {string} upazilaId - The ID of the upazila to find
   * @returns {Object|null} The upazila object or null if not found
   */
  const findUpazilaById = useCallback((upazilaId) => {
    if (!upazilaId || !Array.isArray(upazilas) || upazilas.length === 0) {
      return null;
    }
    
    return upazilas.find(upazila => upazila._id === upazilaId) || null;
  }, [upazilas]);

  /**
   * Find a upazila by its name
   * @param {string} upazilaName - The name of the upazila to find
   * @returns {Object|null} The upazila object or null if not found
   */
  const findUpazilaByName = useCallback((upazilaName) => {
    if (!upazilaName || !Array.isArray(upazilas) || upazilas.length === 0) {
      return null;
    }
    
    // Case insensitive search
    const normalizedName = upazilaName.toLowerCase();
    return upazilas.find(upazila => 
      (upazila.name && upazila.name.toLowerCase() === normalizedName) ||
      (upazila.bengaliName && upazila.bengaliName.toLowerCase() === normalizedName)
    ) || null;
  }, [upazilas]);

  /**
   * Filter upazilas by search term
   * @param {string} searchTerm - The search term to filter upazilas by
   * @returns {Array} Filtered upazilas
   */
  const filterUpazilas = useCallback((searchTerm) => {
    if (!searchTerm || !Array.isArray(upazilas) || upazilas.length === 0) {
      return upazilas;
    }
    
    const normalizedTerm = searchTerm.toLowerCase();
    return upazilas.filter(upazila => 
      (upazila.name && upazila.name.toLowerCase().includes(normalizedTerm)) || 
      (upazila.bengaliName && upazila.bengaliName.toLowerCase().includes(normalizedTerm))
    );
  }, [upazilas]);

  return {
    upazilas,
    isLoading,
    error,
    refetch,
    findUpazilaById,
    findUpazilaByName,
    filterUpazilas
  };
};

/**
 * Format district and upazila information for display
 * @param {Object} district - The district object
 * @param {Object} upazila - The upazila object
 * @returns {Object} Formatted location information
 */
export const formatLocationInfo = (district, upazila) => {
  if (!district) {
    return {
      districtName: '',
      districtBengaliName: '',
      upazilaName: upazila?.name || '',
      upazilaBengaliName: upazila?.bengaliName || '',
      fullLocationText: upazila?.name || '',
      fullLocationBengaliText: upazila?.bengaliName || ''
    };
  }
  
  if (!upazila) {
    return {
      districtName: district.name || '',
      districtBengaliName: district.bengaliName || '',
      upazilaName: '',
      upazilaBengaliName: '',
      fullLocationText: district.name || '',
      fullLocationBengaliText: district.bengaliName || ''
    };
  }
  
  return {
    districtName: district.name || '',
    districtBengaliName: district.bengaliName || '',
    upazilaName: upazila.name || '',
    upazilaBengaliName: upazila.bengaliName || '',
    fullLocationText: `${upazila.name || ''}, ${district.name || ''}`,
    fullLocationBengaliText: `${upazila.bengaliName || ''}, ${district.bengaliName || ''}`
  };
}; 