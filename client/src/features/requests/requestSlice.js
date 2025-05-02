import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  requests: [],
  userRequests: [],
  filteredRequests: [],
  selectedRequest: null,
  isLoading: false,
  error: null,
};

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    setRequests: (state, { payload }) => {
      state.requests = payload;
    },
    setUserRequests: (state, { payload }) => {
      state.userRequests = payload;
    },
    setFilteredRequests: (state, { payload }) => {
      state.filteredRequests = payload;
    },
    setSelectedRequest: (state, { payload }) => {
      state.selectedRequest = payload;
    },
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },
  },
});

export const {
  setRequests,
  setUserRequests,
  setFilteredRequests,
  setSelectedRequest,
  setLoading,
  setError,
} = requestSlice.actions;

export default requestSlice.reducer;

export const selectAllRequests = (state) => state.request.requests;
export const selectUserRequests = (state) => state.request.userRequests;
export const selectFilteredRequests = (state) => state.request.filteredRequests;
export const selectSelectedRequest = (state) => state.request.selectedRequest;
export const selectRequestLoading = (state) => state.request.isLoading;
export const selectRequestError = (state) => state.request.error; 