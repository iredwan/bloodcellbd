// 'use client';

// import { createSlice } from '@reduxjs/toolkit';
// import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// // Helper to get token either from Redux state or cookie
// const getToken = () => {
//   if (typeof window !== 'undefined') {
//     return getCookie('token') || null;
//   }
//   return null;
// };

// const initialState = {
//   user: null,
//   token: getToken(),
//   isAuthenticated: !!getToken(),
//   isLoading: false,
//   error: null,
// };

// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (state, { payload }) => {
//       const { user, token } = payload;
//       state.user = user;
//       state.token = token;
//       state.isAuthenticated = true;
//       // Cookie is set in login component
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       // Remove token cookie
//       if (typeof window !== 'undefined') {
//         deleteCookie('token');
//       }
//     },
//     setLoading: (state, { payload }) => {
//       state.isLoading = payload;
//     },
//     setError: (state, { payload }) => {
//       state.error = payload;
//     },
//   },
// });

// export const { setCredentials, logout, setLoading, setError } = authSlice.actions;

// export default authSlice.reducer;

// export const selectCurrentUser = (state) => state.auth.user;
// export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
// export const selectAuthToken = (state) => state.auth.token; 