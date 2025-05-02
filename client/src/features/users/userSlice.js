import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  eligibleDonors: [],
  filteredUsers: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, { payload }) => {
      state.users = payload;
    },
    setEligibleDonors: (state, { payload }) => {
      state.eligibleDonors = payload;
    },
    setFilteredUsers: (state, { payload }) => {
      state.filteredUsers = payload;
    },
    setSelectedUser: (state, { payload }) => {
      state.selectedUser = payload;
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
  setUsers,
  setEligibleDonors,
  setFilteredUsers,
  setSelectedUser,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;

export const selectAllUsers = (state) => state.user.users;
export const selectEligibleDonors = (state) => state.user.eligibleDonors;
export const selectFilteredUsers = (state) => state.user.filteredUsers;
export const selectSelectedUser = (state) => state.user.selectedUser;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error; 