'use client';

import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import configReducer from '../features/websiteConfig/configSlice';
import districtsReducer from '../features/districts/districtSlice';
import upazilasReducer from '../features/upazilas/upazilaSlice';
import carouselReducer from '../features/carousel/carouselSlice';
import eventsReducer from '../features/events/eventSlice';
import goodwillAmbassadorReducer from '../features/goodwillAmbassador/goodwillAmbassadorSlice';
import { apiSlice } from '../features/api/apiSlice';
import sponsorReducer from '../features/sponsors/sponsorSlice';
import divisionalTeamReducer from '../features/divisionalTeam/divisionalTeamSlice';
import districtTeamReducer from '../features/districtTeam/districtTeamSlice';
import upazilaTeamReducer from '../features/upazilaTeam/upazilaTeamSlice';
import monitorTeamReducer from '../features/monitorTeam/monitorTeamSlice';
import userInfoReducer from '../features/userInfo/userInfoSlice';
import wantToDonateReducer from '../features/wantToDonate/wantToDonateSlice';
import reviewReducer from '../features/reviews/reviewSlice';
import hospitalReducer from '../features/hospital/hospitalSlice';
import boardTeamReducer from '../features/boardTeam/boardTeamSlice';
// import other reducers...

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    users: userReducer,
    config: configReducer,
    districts: districtsReducer,
    upazilas: upazilasReducer,
    carousel: carouselReducer,
    events: eventsReducer,
    goodwillAmbassador: goodwillAmbassadorReducer,
    sponsor: sponsorReducer,
    divisionalTeam: divisionalTeamReducer,
    districtTeam: districtTeamReducer,
    upazilaTeam: upazilaTeamReducer,
    monitorTeam: monitorTeamReducer,
    userInfo: userInfoReducer,
    wantToDonate: wantToDonateReducer,
    review: reviewReducer,
    hospital: hospitalReducer,
    boardTeam: boardTeamReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    // ...
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});