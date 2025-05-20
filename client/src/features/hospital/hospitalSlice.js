'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hospitals: [],
  filteredHospitals: [],
  hospitalsByDistrict: {},
  hospitalsByUpazila: {},
  currentHospital: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {
    setHospitals: (state, action) => {
      state.hospitals = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setFilteredHospitals: (state, action) => {
      state.filteredHospitals = action.payload;
    },
    setHospitalsByDistrict: (state, action) => {
      const { district, hospitals } = action.payload;
      state.hospitalsByDistrict[district] = {
        data: hospitals,
        timestamp: new Date().toISOString()
      };
    },
    setHospitalsByUpazila: (state, action) => {
      const { upazila, hospitals } = action.payload;
      state.hospitalsByUpazila[upazila] = {
        data: hospitals,
        timestamp: new Date().toISOString()
      };
    },
    setCurrentHospital: (state, action) => {
      state.currentHospital = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addHospital: (state, action) => {
      state.hospitals.push(action.payload);
      
      // Also add to filtered lists if appropriate
      const district = action.payload.district;
      const upazila = action.payload.upazila;
      
      if (state.hospitalsByDistrict[district]) {
        state.hospitalsByDistrict[district].data.push(action.payload);
      }
      
      if (state.hospitalsByUpazila[upazila]) {
        state.hospitalsByUpazila[upazila].data.push(action.payload);
      }
    },
    updateHospital: (state, action) => {
      const updatedHospital = action.payload;
      
      // Update in main hospitals array
      const index = state.hospitals.findIndex(hospital => hospital._id === updatedHospital._id);
      if (index !== -1) {
        state.hospitals[index] = updatedHospital;
      }
      
      // Update in filtered hospitals
      const filteredIndex = state.filteredHospitals.findIndex(hospital => hospital._id === updatedHospital._id);
      if (filteredIndex !== -1) {
        state.filteredHospitals[filteredIndex] = updatedHospital;
      }
      
      // Update in district-specific lists
      const district = updatedHospital.district;
      if (state.hospitalsByDistrict[district]) {
        const districtIndex = state.hospitalsByDistrict[district].data.findIndex(
          hospital => hospital._id === updatedHospital._id
        );
        if (districtIndex !== -1) {
          state.hospitalsByDistrict[district].data[districtIndex] = updatedHospital;
        }
      }
      
      // Update in upazila-specific lists
      const upazila = updatedHospital.upazila;
      if (state.hospitalsByUpazila[upazila]) {
        const upazilaIndex = state.hospitalsByUpazila[upazila].data.findIndex(
          hospital => hospital._id === updatedHospital._id
        );
        if (upazilaIndex !== -1) {
          state.hospitalsByUpazila[upazila].data[upazilaIndex] = updatedHospital;
        }
      }
      
      // Update current hospital if it's the same one
      if (state.currentHospital && state.currentHospital._id === updatedHospital._id) {
        state.currentHospital = updatedHospital;
      }
    },
    removeHospital: (state, action) => {
      const hospitalId = action.payload;
      
      // Find the hospital before removing it (to get district and upazila)
      const hospitalToRemove = state.hospitals.find(hospital => hospital._id === hospitalId);
      
      if (hospitalToRemove) {
        const district = hospitalToRemove.district;
        const upazila = hospitalToRemove.upazila;
        
        // Remove from main hospitals array
        state.hospitals = state.hospitals.filter(hospital => hospital._id !== hospitalId);
        
        // Remove from filtered hospitals
        state.filteredHospitals = state.filteredHospitals.filter(hospital => hospital._id !== hospitalId);
        
        // Remove from district-specific lists
        if (state.hospitalsByDistrict[district]) {
          state.hospitalsByDistrict[district].data = state.hospitalsByDistrict[district].data.filter(
            hospital => hospital._id !== hospitalId
          );
        }
        
        // Remove from upazila-specific lists
        if (state.hospitalsByUpazila[upazila]) {
          state.hospitalsByUpazila[upazila].data = state.hospitalsByUpazila[upazila].data.filter(
            hospital => hospital._id !== hospitalId
          );
        }
        
        // Clear current hospital if it's the same one
        if (state.currentHospital && state.currentHospital._id === hospitalId) {
          state.currentHospital = null;
        }
      }
    },
    reset: (state) => {
      return initialState;
    },
  },
});

export const {
  setHospitals,
  setFilteredHospitals,
  setHospitalsByDistrict,
  setHospitalsByUpazila,
  setCurrentHospital,
  setLoading,
  setError,
  addHospital,
  updateHospital,
  removeHospital,
  reset,
} = hospitalSlice.actions;

export default hospitalSlice.reducer;

// Selectors
export const selectAllHospitals = (state) => state.hospital.hospitals;
export const selectFilteredHospitals = (state) => state.hospital.filteredHospitals;
export const selectHospitalsByDistrict = (state, district) => 
  state.hospital.hospitalsByDistrict[district]?.data || [];
export const selectHospitalsByUpazila = (state, upazila) => 
  state.hospital.hospitalsByUpazila[upazila]?.data || [];
export const selectCurrentHospital = (state) => state.hospital.currentHospital;
export const selectHospitalLoading = (state) => state.hospital.isLoading;
export const selectHospitalError = (state) => state.hospital.error; 