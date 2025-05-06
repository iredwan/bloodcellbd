'use client';

import { apiSlice } from '../api/apiSlice';

export const otpApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateOTP: builder.mutation({
      query: (email) => ({
        url: 'otp/generate',
        method: 'POST',
        body: typeof email === 'string' ? { email } : email,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (credentials) => ({
        url: 'otp/verify',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { 
  useGenerateOTPMutation, 
  useVerifyOTPMutation 
} = otpApiSlice; 