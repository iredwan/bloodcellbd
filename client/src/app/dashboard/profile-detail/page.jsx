'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Profile from '@/components/dashboard-components/Profile';
import { useGetUserByIdQuery, useDeleteUserMutation } from '@/features/users/userApiSlice';
import NotFound from '@/app/not-found';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Redirect to home if no ID is provided
  useEffect(() => {
    if (!id) {
      router.push('/');
    }
  }, [id, router]);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Fetch user data with the provided ID
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetUserByIdQuery(id, {
    skip: !id, // Skip the query if no ID is provided
  });

  // Handle edit action - redirect to edit page
  const handleEdit = () => {
    router.push(`/dashboard/profile-edit?id=${id}`);
  };

  // Function to handle user deletion (can be implemented later)
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto space-y-8">
          {/* Loading skeleton for profile header */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="w-full">
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-3" />
                <Skeleton className="h-8 w-1/4" />
              </div>
            </div>
          </div>
          
          {/* Loading skeletons for information sections */}
          {[1, 2, 3].map((section) => (
            <div key={section} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-8 w-1/4" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    console.error('Error fetching user data:', error);
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
        <p className="text-gray-700">{error?.data?.message || 'Failed to load user data'}</p>
        <button 
          onClick={() => router.push('/')}
          className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  // Handle not found state
  if (!response?.data) {
    return <NotFound />;
  }

  // Render profile with user data
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto">
        <Profile 
          user={response.data} 
          onEdit={handleEdit} 
        />

        {/* Delete Confirmation Modal - Can be implemented as needed */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this account? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Delete functionality can be implemented here
                    setShowDeleteConfirm(false);
                    deleteUser(id);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;
