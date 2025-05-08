'use client';

import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../api/apiSlice';
import { setConfig, setLoading, setError, selectWebsiteConfig, selectConfigLoading, selectConfigError } from './configSlice';

// Default configuration values
const defaultConfig = {
  logo: '',
  favicon: '',
  contactInfo: {
    email: 'info@bloodcellbd.org',
    phone: '+880 1234-567890',
    address: 'Dhaka, Bangladesh'
  },
  socialMedia: {
    facebook: 'https://facebook.com/bloodcellbd',
    instagram: 'https://instagram.com/bloodcellbd',
    linkedin: 'https://linkedin.com/company/bloodcellbd',
    youtube: 'https://youtube.com/bloodcellbd'
  },
  metaTags: {
    title: 'BloodCellBD - Blood Donation Platform',
    image: '',
    description: 'Connect with blood donors in Bangladesh to save lives through voluntary blood donations.',
    keywords: 'blood donation, Bangladesh, donors, blood bank, save lives'
  },
  stats: {
    totalMembers: 0,
    totalEligibleMembers: 0,
    totalFulfilledRequests: 0,
    totalPendingRequests: 0
  }
};

// Helper to ensure all required properties exist
const ensureCompleteConfig = (config) => {
  if (!config) return defaultConfig;
  
  return {
    logo: config.logo || defaultConfig.logo,
    favicon: config.favicon || defaultConfig.favicon,
    contactInfo: {
      email: config.contactInfo?.email || defaultConfig.contactInfo.email,
      phone: config.contactInfo?.phone || defaultConfig.contactInfo.phone,
      address: config.contactInfo?.address || defaultConfig.contactInfo.address
    },
    socialMedia: {
      facebook: config.socialMedia?.facebook || defaultConfig.socialMedia.facebook,
      instagram: config.socialMedia?.instagram || defaultConfig.socialMedia.instagram,
      linkedin: config.socialMedia?.linkedin || defaultConfig.socialMedia.linkedin,
      youtube: config.socialMedia?.youtube || defaultConfig.socialMedia.youtube
    },
    metaTags: {
      title: config.metaTags?.title || defaultConfig.metaTags.title,
      image: config.metaTags?.image || defaultConfig.metaTags.image,
      description: config.metaTags?.description || defaultConfig.metaTags.description,
      keywords: config.metaTags?.keywords || defaultConfig.metaTags.keywords
    },
    stats: {
      totalMembers: config.stats?.totalMembers || defaultConfig.stats.totalMembers,
      totalEligibleMembers: config.stats?.totalEligibleMembers || defaultConfig.stats.totalEligibleMembers,
      totalFulfilledRequests: config.stats?.totalFulfilledRequests || defaultConfig.stats.totalFulfilledRequests,
      totalPendingRequests: config.stats?.totalPendingRequests || defaultConfig.stats.totalPendingRequests
    }
  };
};

export const configApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWebsiteConfig: builder.query({
      query: () => 'config/get',
      providesTags: ['WebsiteConfig'],
      transformResponse: (response) => {
        // Get the data from the API response
        const apiData = response.data || response;
        // Ensure all properties exist by merging with defaults
        return ensureCompleteConfig(apiData);
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setConfig(data));
        } catch (error) {
          dispatch(setError(error.message || 'Failed to fetch website configuration'));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    
    updateWebsiteConfig: builder.mutation({
      query: (configData) => ({
        url: 'config/upsert',
        method: 'POST',
        body: configData,
      }),
      invalidatesTags: ['WebsiteConfig'],
    }),
  }),
});

// Custom hook that combines Redux state and RTK Query for website config
export const useWebsiteConfig = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux selectors
  const config = useSelector(selectWebsiteConfig);
  const loading = useSelector(selectConfigLoading);
  const error = useSelector(selectConfigError);

  // Use RTK Query to fetch data
  const { 
    refetch,
    isFetching
  } = configApiSlice.useGetWebsiteConfigQuery(undefined, {
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
    // Only refetch every hour unless explicitly requested
    pollingInterval: 60 * 60 * 1000,
  });

  // Combine local loading state with RTK Query fetching state
  const isLoading = loading || isFetching;

  return {
    config,
    loading: isLoading,
    error,
    refreshConfig: refetch
  };
};

export const {
  useGetWebsiteConfigQuery,
  useUpdateWebsiteConfigMutation,
} = configApiSlice; 