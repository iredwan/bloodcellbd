import { apiSlice } from '../api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: 'users/register',
        method: 'POST',
        body: userData,
      }),
    }),
    registerWithRef: builder.mutation({
      query: (userData) => ({
        url: 'users/register-with-ref',
        method: 'POST',
        body: userData,
      }),
    }),
    generateOTP: builder.mutation({
      query: (email) => ({
        url: 'otp/generate',
        method: 'POST',
        body: email,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: 'otp/verify',
        method: 'POST',
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: (id) => `users/profile/${id}`,
      providesTags: ['User'],
    }),
    getProfileByUserId: builder.query({
      query: () => 'users/profile-by-user-id',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRegisterWithRefMutation,
  useGenerateOTPMutation,
  useVerifyOTPMutation,
  useGetProfileQuery,
  useGetProfileByUserIdQuery,
} = authApiSlice; 