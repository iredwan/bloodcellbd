import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ambassadors: [],
  activeAmbassadors: [],
  goodwillAmbassadors: [], // specifically for "Goodwill Ambassador" designation
  honorableMembers: [], // specifically for "Honorable Member" designation
  selectedAmbassador: null,
  isLoading: false,
  error: null,
};

export const goodwillAmbassadorSlice = createSlice({
  name: 'goodwillAmbassador',
  initialState,
  reducers: {
    setAmbassadors: (state, { payload }) => {
      state.ambassadors = payload;
    },
    setActiveAmbassadors: (state, { payload }) => {
      state.activeAmbassadors = payload;
    },
    setGoodwillAmbassadors: (state, { payload }) => {
      state.goodwillAmbassadors = payload;
    },
    setHonorableMembers: (state, { payload }) => {
      state.honorableMembers = payload;
    },
    setSelectedAmbassador: (state, { payload }) => {
      state.selectedAmbassador = payload;
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
  setAmbassadors,
  setActiveAmbassadors,
  setGoodwillAmbassadors,
  setHonorableMembers,
  setSelectedAmbassador,
  setLoading,
  setError,
} = goodwillAmbassadorSlice.actions;

export default goodwillAmbassadorSlice.reducer;

// Selectors
export const selectAllAmbassadors = (state) => state.goodwillAmbassador.ambassadors;
export const selectActiveAmbassadors = (state) => state.goodwillAmbassador.activeAmbassadors;
export const selectGoodwillAmbassadors = (state) => state.goodwillAmbassador.goodwillAmbassadors;
export const selectHonorableMembers = (state) => state.goodwillAmbassador.honorableMembers;
export const selectSelectedAmbassador = (state) => state.goodwillAmbassador.selectedAmbassador;
export const selectAmbassadorLoading = (state) => state.goodwillAmbassador.isLoading;
export const selectAmbassadorError = (state) => state.goodwillAmbassador.error; 