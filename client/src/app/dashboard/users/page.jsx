"use client";

import { useState, useEffect } from "react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "@/features/users/userApiSlice";
import { useGetUserInfoQuery } from "@/features/userInfo/userInfoApiSlice";
import {
  FaUser,
  FaUserPlus,
  FaSearch,
  FaTrash,
  FaEye,
  FaBell,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import CustomSelect from "@/components/CustomSelect";
import { useRouter } from "next/navigation";
import deleteConfirm from "@/utils/deleteConfirm";
import AdminUserPageSkeleton from "@/components/dashboard-components/dashboardSkeletons/AdminUserPageSkeleton";

export default function UsersManagementPage() {
  // State for user search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  const [lastPendingCount, setLastPendingCount] = useState(0);
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  const { data: userInfoData, isLoading: isLoadingUserInfo } =
    useGetUserInfoQuery();
  const editorRole = userInfoData?.user.role || "";
  const editorUpazila = userInfoData?.user.upazila;
  const editorDistrict = userInfoData?.user.district;

  const allowedRoles = ["Technician", "Member", "Moderator", "Monitor"];

  const upazilaCoordinators = [
    "Upazila Coordinator",
    "Upazila Co-coordinator",
    "Upazila IT & Media Coordinator",
    "Upazila Logistics Coordinator",
  ];

  const districtCoordinators = [
    "District Coordinator",
    "District Co-coordinator",
    "District IT & Media Coordinator",
    "District Logistics Coordinator",
  ];

  const admin = [
    "Head of IT & Media",
    "Head of Logistics",
    "Admin",
    "Divisional Coordinator",
    "Divisional Co-coordinator",
  ];

  const isAllowed = allowedRoles.includes(editorRole);
  const isUpazilaCoordinator = upazilaCoordinators.includes(editorRole);
  const isDistrictCoordinator = districtCoordinators.includes(editorRole);
  const isAdmin = admin.includes(editorRole);

  const router = useRouter();

  const bloodGroupOptions = [
    "All",
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];

  // Query parameters for the API
  const queryParams = isAdmin
    ? {
        page: currentPage,
        limit: 10,
        sortBy: "createdAt",
        sort: -1,
        search: searchTerm || undefined,
        bloodGroup:
          bloodGroupFilter && bloodGroupFilter !== "All"
            ? bloodGroupFilter
            : undefined,
      }
    : isDistrictCoordinator
    ? {
        page: currentPage,
        limit: 10,
        sortBy: "createdAt",
        sort: -1,
        search: searchTerm || undefined,
        district: editorDistrict,
        bloodGroup:
          bloodGroupFilter && bloodGroupFilter !== "All"
            ? bloodGroupFilter
            : undefined,
      }
    : isAllowed || isUpazilaCoordinator
    ? {
        page: currentPage,
        limit: 10,
        sortBy: "createdAt",
        sort: -1,
        search: searchTerm || undefined,
        upazila: editorUpazila,
        bloodGroup:
          bloodGroupFilter && bloodGroupFilter !== "All"
            ? bloodGroupFilter
            : undefined,
      }
    : null;

  // Call API only if shouldFetch is true
  const {
    data: usersData = {},
    isLoading,
    isError,
    refetch,
  } = useGetAllUsersQuery(queryParams, {
    skip: !queryParams, // skip API call if condition fails
  });

  // Mutations for CRUD operations
  const [deleteUser] = useDeleteUserMutation();

  const totalPendingUsers = usersData?.data?.totalPendingUsers;
  const totalUsers = usersData?.data?.totalUsers;
  const totalDistrictUsers = usersData?.data?.totalDistrictUsers;
  const totalUpazilaUsers = usersData?.data?.totalUpazilaUsers;
  const totalFilteredUsers = usersData?.data?.totalFilteredUsers;
  const totalDistrictPendingUsers = usersData?.data?.totalDistrictPendingUsers;
  const totalUpazilaPendingUsers = usersData?.data?.totalUpazilaPendingUsers;

  // Track pending users and show notification when new ones are detected
  useEffect(() => {
    if (usersData?.data?.users) {
      const pendingCount = usersData.data.users.filter(
        (user) => !user.isApproved && !user.isBanned
      ).length;

      // Show notification if there are new pending users
      if (lastPendingCount > 0 && pendingCount > lastPendingCount) {
        const newPendingCount = pendingCount - lastPendingCount;
        toast.info(
          `${newPendingCount} new user${
            newPendingCount > 1 ? "s" : ""
          } pending for approval`
        );
      }
      setLastPendingCount(pendingCount);
    }
  }, [usersData]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, bloodGroupFilter]);

  // Handle page change
  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Handle delete user confirmation
  const handleDeleteUser = async (userId, userName) => {
    const isConfirmed = await deleteConfirm({
      title: "Are you sure?",
      text: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      confirmButtonText: "Yes, delete!",
    });

    if (isConfirmed) {
      try {
        const response = await deleteUser(userId).unwrap();
        if (response.status) {
          toast.success(`User ${userName} deleted successfully`);
          refetch(); // Refresh the users list
        } else {
          toast.error(response.message || "Failed to delete user");
        }
      } catch (error) {
        toast.error(error?.data?.message || "Error deleting user");
        console.error("Delete error:", error);
      }
    }
  };

  // Handle view user - navigate to Profile page
  const handleViewUser = (user) => {
    router.push(`/dashboard/users/details?id=${user._id}`);
  };

  // User status badge component
  const UserStatusBadge = ({ user }) => {
    if (user.isBanned) {
      return (
        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
          Banned
        </span>
      );
    } else if (!user.isApproved) {
      return (
        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
          Pending
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
          Approved
        </span>
      );
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white text-center md:text-left">
            User Management
          </h1>
          {isAdmin && totalUsers > 0 && (
            <div
              className="flex items-center"
              title={`${totalUsers} total users`}
            >
              <FaUser className="text-primary" />
              <span className="ml-1.5 bg-primary text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {totalUsers}
              </span>
            </div>
          )}
          {isDistrictCoordinator && totalDistrictUsers > 0 && (
            <div
              className="flex items-center"
              title={`Total ${totalDistrictUsers} users in ${editorDistrict}`}
            >
              <FaUser className="text-primary" />
              <span className="ml-1.5 bg-primary text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {totalDistrictUsers}
              </span>
            </div>
          )}
          {(isUpazilaCoordinator || (isAllowed && totalUpazilaUsers > 0)) && (
            <div
              className="flex items-center"
              title={`Total ${totalUpazilaUsers} users in ${editorUpazila}`}
            >
              <FaUser className="text-primary" />
              <span className="ml-1.5 bg-primary text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {totalUpazilaUsers}
              </span>
            </div>
          )}
          {isAdmin && totalPendingUsers > 0 && (
            <div
              className="flex items-center"
              title={`${totalPendingUsers} pending for approval`}
            >
              <FaBell className="text-yellow-500 animate-bounce" />
              <span className="ml-1.5 bg-yellow-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {totalPendingUsers}
              </span>
            </div>
          )}
          {isDistrictCoordinator && totalDistrictPendingUsers > 0 && (
            <div
              className="flex items-center"
              title={`${totalDistrictPendingUsers} pending for approval in ${editorDistrict}`}
            >
              <FaBell className="text-yellow-500 animate-bounce" />
              <span className="ml-1.5 bg-yellow-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {totalDistrictPendingUsers}
              </span>
            </div>
          )}
          {isUpazilaCoordinator && totalUpazilaPendingUsers > 0 && (
            <div
              className="flex items-center"
              title={`${totalUpazilaPendingUsers} pending for approval in ${editorUpazila}`}
            >
              <FaBell className="text-yellow-500 animate-bounce" />
              <span className="ml-1.5 bg-yellow-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {totalUpazilaPendingUsers}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push("/dashboard/add-new-user")}
          className="button"
        >
          <FaUserPlus className="mr-2" /> Add New User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-xl gap-3">
          <div className="relative flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search with name, email, phone, NID, or birth registration number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <FaSearch className="absolute left-3 top-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 pt-2">
              Total Filter {totalFilteredUsers}{" "}
            </p>
          </div>
          <div className="flex flex-col">
            <CustomSelect
              options={bloodGroupOptions}
              selected={bloodGroupFilter}
              setSelected={setBloodGroupFilter}
              label="Blood Group"
              placeholder="All Blood Groups"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {isLoading ? (
          <AdminUserPageSkeleton />
        ) : isError ? (
          <div className="bg-red-50 dark:bg-gray-800 p-4 rounded-lg text-red-500 dark:text-red-400 text-center">
            Failed to load users. Please try again.
          </div>
        ) : !usersData?.data?.users || usersData.data.users.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center text-gray-500 dark:text-gray-400">
            No users found matching your filters.
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-4">
              {usersData.data.users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-12 w-12">
                      {user.profileImage ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={`${imageUrl + user.profileImage}`}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <FaUser className="text-primary text-xl" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email || user.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary text-white">
                      {user.bloodGroup}
                    </span>
                    {user.isBanned ? (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Banned
                      </span>
                    ) : !user.isApproved ? (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Pending
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Approved
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      {user.district}
                      {user.upazila ? `, ${user.upazila}` : ""}
                    </span>
                  </div>
                  <div className="flex justify-end gap-4 mt-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {editorRole === "Admin" && (
                      <button
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Table Layout for sm and up */}
            <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Blood Group
                      </th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {usersData.data.users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.profileImage ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={`${imageUrl + user.profileImage}`}
                                  alt={user.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <FaUser className="text-primary" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email || user.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="w-9 h-9 px-2 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold mx-auto">
                            {user.bloodGroup}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                          {user.isBanned ? (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              Banned
                            </span>
                          ) : !user.isApproved ? (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Pending
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Approved
                            </span>
                          )}
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {user.district}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.upazila}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-4 md:gap-2">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {editorRole === "Admin" && (
                              <button
                                onClick={() =>
                                  handleDeleteUser(user._id, user.name)
                                }
                                className="text-red-600 hover:text-red-900"
                                title="Delete User"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination: always visible if more than one page */}
            {usersData.data.pagination.totalPages > 1 && (
              <div className="px-4 py-3 flex justify-center border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  pageCount={usersData.data.pagination.totalPages}
                  currentPage={currentPage - 1}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
