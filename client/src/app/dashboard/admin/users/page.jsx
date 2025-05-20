'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  useGetAllUsersForAdminQuery, 
  useDeleteUserMutation
} from '@/features/users/userApiSlice';
import { FaUser, FaUserPlus, FaSearch, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Pagination from '@/components/Pagination';
import CustomSelect from '@/components/CustomSelect';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function UsersManagementPage() {
  // State for user search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const router = useRouter();

  // Fetch all users data
  const { data: usersData = {}, isLoading, isError, refetch } = useGetAllUsersForAdminQuery();
  
  // Mutations for CRUD operations
  const [deleteUser] = useDeleteUserMutation();

  // Extract users array from the nested structure returned by the API
  const users = useMemo(() => {
    if (usersData && usersData.data && Array.isArray(usersData.data.users)) {
      return usersData.data.users;
    }
    return [];
  }, [usersData]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, bloodGroupFilter, statusFilter]);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    if (!users || users.length === 0) return [];
    
    return users.filter(user => {
      // Apply search filter
      const matchesSearch = searchTerm === '' || (
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
      
      // Apply blood group filter
      const matchesBloodGroup = bloodGroupFilter === '' || user.bloodGroup === bloodGroupFilter;
      
      // Apply status filter
      let matchesStatus = true;
      if (statusFilter === 'approved') {
        matchesStatus = user.isApproved && !user.isBanned;
      } else if (statusFilter === 'pending') {
        matchesStatus = !user.isApproved;
      } else if (statusFilter === 'banned') {
        matchesStatus = user.isBanned;
      }
      
      return matchesSearch && matchesBloodGroup && matchesStatus;
    });
  }, [users, searchTerm, bloodGroupFilter, statusFilter]);

  // Pagination
  const USERS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  
  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle delete user confirmation
  const handleDeleteUser = async (userId, userName) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete ${userName}. This action cannot be undone!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await deleteUser(userId).unwrap();
        toast.success(`User ${userName} deleted successfully`);
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete user');
      console.error('Delete error:', error);
    }
  };

  // Handle view user - navigate to Profile page
  const handleViewUser = (user) => {
    router.push(`/dashboard/profile?id=${user._id}`);
  };

  // User status badge component
  const UserStatusBadge = ({ user }) => {
    if (user.isBanned) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Banned</span>;
    } else if (!user.isApproved) {
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
    } else {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Approved</span>;
    }
  };

  // Blood group badge component
  const BloodGroupBadge = ({ bloodGroup }) => {
    return (
      <span className="px-2 py-1 text-xs bg-primary/10 text-primary font-semibold rounded-full">
        {bloodGroup}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex md:flex-row flex-col justify-between items-center mb-6">
        <h1 className="text-2xl text-center font-bold text-gray-800 dark:text-white">User Management</h1>
        
        <button
          onClick={() => router.push('/dashboard/add-new-user')}
          className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <FaUserPlus className="mr-2" /> Add New User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div>
            <CustomSelect
              options={['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
              selected={bloodGroupFilter}
              setSelected={setBloodGroupFilter}
              label="Blood Group"
              placeholder="All Blood Groups"
            />
          </div>
          
          <div>
            <CustomSelect
              options={['', 'approved', 'pending', 'banned']}
              selected={statusFilter}
              setSelected={setStatusFilter}
              label="Status"
              placeholder="All Statuses"
            />
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => {
                setSearchTerm('');
                setBloodGroupFilter('');
                setStatusFilter('');
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="bg-red-50 dark:bg-gray-800 p-4 rounded-lg text-red-500 dark:text-red-400 text-center">
            Failed to load users. Please try again.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center text-gray-500 dark:text-gray-400">
            No users found matching your filters.
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Blood</th>
                    <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 overflow-hidden">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                              <FaUser />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <BloodGroupBadge bloodGroup={user.bloodGroup} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <UserStatusBadge user={user} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {user.role} {user.roleSuffix}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}