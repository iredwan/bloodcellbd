'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import configReducer from '../features/wesiteConfig/configSlice';
import districtsReducer from '../features/districts/districtSlice';
import upazilasReducer from '../features/upazilas/upazilaSlice';
import { apiSlice } from '../features/api/apiSlice';
// import other reducers...

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    config: configReducer,
    districts: districtsReducer,
    upazilas: upazilasReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    // ...
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});