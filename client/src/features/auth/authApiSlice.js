// import { apiSlice } from '../api/apiSlice';

// export const authApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: 'users/login',
//         method: 'POST',
//         body: credentials,
//       }),
//     }),
//     register: builder.mutation({
//       query: (userData) => ({
//         url: 'users/register',
//         method: 'POST',
//         body: userData,
//       }),
//     }),
//     registerWithRef: builder.mutation({
//       query: (userData) => ({
//         url: 'users/register-with-ref',
//         method: 'POST',
//         body: userData,
//       }),
//     }),
//     getProfile: builder.query({
//       query: (id) => `users/profile/${id}`,
//       providesTags: ['User'],
//     }),
//     getProfileByUserId: builder.query({
//       query: () => 'users/profile-by-user-id',
//       providesTags: ['User'],
//     }),
//   }),
// });

// export const {
//   useLoginMutation,
//   useRegisterMutation,
//   useRegisterWithRefMutation,
//   useGetProfileQuery,
//   useGetProfileByUserIdQuery,
// } = authApiSlice; 