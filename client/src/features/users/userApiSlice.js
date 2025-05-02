import { apiSlice } from '../api/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => 'users/all',
      providesTags: ['User'],
    }),
    getEligibleUsers: builder.query({
      query: () => 'users/eligible',
      providesTags: ['User'],
    }),
    getUsersByUpazila: builder.query({
      query: (upazila) => `users/upazila/${upazila}`,
      providesTags: ['User'],
    }),
    getUsersByDistrict: builder.query({
      query: (district) => `users/district/${district}`,
      providesTags: ['User'],
    }),
    getUsersByName: builder.query({
      query: (name) => `users/name/${name}`,
      providesTags: ['User'],
    }),
    getPendingUsers: builder.query({
      query: () => 'users/pending',
      providesTags: ['User'],
    }),
    getApprovedUsers: builder.query({
      query: () => 'users/approved',
      providesTags: ['User'],
    }),
    getBannedUsers: builder.query({
      query: () => 'users/banned',
      providesTags: ['User'],
    }),
    getUsersByBloodGroup: builder.query({
      query: (bloodGroup) => `users/bloodgroup/${bloodGroup}`,
      providesTags: ['User'],
    }),
    getUsersByNidOrBirthReg: builder.query({
      query: (number) => `users/nid-or-birth-registration/${number}`,
      providesTags: ['User'],
    }),
    getAllUsersForAdmin: builder.query({
      query: () => 'users/all-for-admin',
      providesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    updateUserProfile: builder.mutation({
      query: ({ id, userData }) => ({
        url: `users/profile-update/${id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserProfileWithRef: builder.mutation({
      query: ({ id, userData }) => ({
        url: `users/profile-update-ref/${id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetEligibleUsersQuery,
  useGetUsersByUpazilaQuery,
  useGetUsersByDistrictQuery,
  useGetUsersByNameQuery,
  useGetPendingUsersQuery,
  useGetApprovedUsersQuery,
  useGetBannedUsersQuery,
  useGetUsersByBloodGroupQuery,
  useGetUsersByNidOrBirthRegQuery,
  useGetAllUsersForAdminQuery,
  useDeleteUserMutation,
  useUpdateUserProfileMutation,
  useUpdateUserProfileWithRefMutation,
} = userApiSlice; 