import { apiSlice } from '../api/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: 'users/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    registerUserWithRef: builder.mutation({
      query: (userData) => ({
        url: 'users/register-with-ref',
        method: 'POST',
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: 'users/login',
        method: 'POST',
        body: userData,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: 'users/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    getAllUsers: builder.query({
      query: (params ) => ({
        url: 'users/all',
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `users/profile/${id}`,
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
      query: (queryParams) => ({
        url: 'users/all-for-admin',
        method: 'GET',
        params: queryParams,
      }),
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
    uploadProfileImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `users/upload-profile-image/${id}`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useRegisterUserWithRefMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
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
  useUploadProfileImageMutation,
} = userApiSlice;
