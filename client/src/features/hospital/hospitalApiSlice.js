'use client';

import { apiSlice } from '../api/apiSlice';
import { 
  setHospitals, 
  setHospitalsByDistrict, 
  setHospitalsByUpazila,
  setCurrentHospital,
  setLoading, 
  setError,
  addHospital,
  updateHospital,
  removeHospital
} from './hospitalSlice';

export const hospitalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all hospitals
    getAllHospitals: builder.query({
      query: ({ page = 1, limit = 10, search = '' }) => {
        const params = new URLSearchParams({ page, limit, search });
        return `hospital/all?${params.toString()}`;
      },
      providesTags: ['Hospital'],
      transformResponse: (response) => {
        if (response.status && response.data) {
          return response;
        }
    
        if (Array.isArray(response)) {
          return { status: true, data: response };
        }
    
        console.warn('Unexpected hospital API response format:', response);
        return { status: false, data: [] };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
    
          if (data.status && data.data) {
            dispatch(setHospitals(data.data));
          } else if (Array.isArray(data)) {
            dispatch(setHospitals(data));
          } else {
            dispatch(setHospitals([]));
          }
        } catch (error) {
          console.error('Error fetching hospitals:', error);
          dispatch(setError(error.message || 'Failed to fetch hospitals'));
          dispatch(setHospitals([]));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    
    // Get hospital by ID
    getHospitalById: builder.query({
      query: (id) => `hospital/get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Hospital', id }],
      transformResponse: (response) => {
        if (response && response.status && response.data) {
          return response.data;
        }
        return null;
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setCurrentHospital(data));
        } catch (error) {
          console.error(`Error fetching hospital with ID ${id}:`, error);
          dispatch(setError(error.message || `Failed to fetch hospital with ID ${id}`));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    // Get hospitals by district
    getHospitalsByDistrict: builder.query({
      query: (district) => `hospital/district/${district}`,
      providesTags: (result, error, district) => [{ type: 'Hospital', id: `district-${district}` }],
      transformResponse: (response) => {
        if (response && response.status && response.data) {
          return response.data;
        }
        return [];
      },
      async onQueryStarted(district, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setHospitalsByDistrict({ district, hospitals: data }));
        } catch (error) {
          console.error(`Error fetching hospitals for district ${district}:`, error);
          dispatch(setError(error.message || `Failed to fetch hospitals for district ${district}`));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    // Get hospitals by upazila
    getHospitalsByUpazila: builder.query({
      query: (upazila) => `hospital/upazila/${upazila}`,
      providesTags: (result, error, upazila) => [{ type: 'Hospital', id: `upazila-${upazila}` }],
      transformResponse: (response) => {
        if (response && response.status && response.data) {
          return response.data;
        }
        return [];
      },
      async onQueryStarted(upazila, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setHospitalsByUpazila({ upazila, hospitals: data }));
        } catch (error) {
          console.error(`Error fetching hospitals for upazila ${upazila}:`, error);
          dispatch(setError(error.message || `Failed to fetch hospitals for upazila ${upazila}`));
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    
    // Create a hospital
    createHospital: builder.mutation({
      query: (hospitalData) => ({
        url: 'hospital/create',
        method: 'POST',
        body: hospitalData
      }),
      invalidatesTags: ['Hospital'],
      async onQueryStarted(hospitalData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status && data.data) {
            dispatch(addHospital(data.data));
          }
        } catch (error) {
          console.error('Error creating hospital:', error);
        }
      }
    }),
    
    // Update a hospital
    updateHospital: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `hospital/update/${id}`,
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Hospital', id },
        'Hospital',
        { type: 'Hospital', id: `district-${result?.data?.district}` },
        { type: 'Hospital', id: `upazila-${result?.data?.upazila}` }
      ],
      async onQueryStarted({ id, ...updateData }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status && data.data) {
            dispatch(updateHospital(data.data));
          }
        } catch (error) {
          console.error(`Error updating hospital with ID ${id}:`, error);
        }
      }
    }),
    
    // Delete a hospital
    deleteHospital: builder.mutation({
      query: (id) => ({
        url: `hospital/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Hospital'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(removeHospital(id));
        } catch (error) {
          console.error(`Error deleting hospital with ID ${id}:`, error);
        }
      }
    })
  })
});

export const {
  useGetAllHospitalsQuery,
  useGetHospitalByIdQuery,
  useGetHospitalsByDistrictQuery,
  useGetHospitalsByUpazilaQuery,
  useCreateHospitalMutation,
  useUpdateHospitalMutation,
  useDeleteHospitalMutation
} = hospitalApiSlice; 