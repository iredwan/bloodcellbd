'use client';

import { apiSlice } from '../api/apiSlice';

export const otpApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateOTP: builder.mutation({
      query: (email) => ({
        url: 'otp/generate',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: typeof email === 'string' ? { email } : email,
        credentials: 'include', 
      }),
    }),
    verifyOTP: builder.mutation({
      query: (credentialsData) => ({
        url: 'otp/verify',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: credentialsData,
        credentials: 'include', 
      }),
    }),
  }),
});

export const { 
  useGenerateOTPMutation, 
  useVerifyOTPMutation 
} = otpApiSlice;
