"use client";

import React, { useState, useMemo } from "react";
import {
  useGetAllRequestsQuery,
  useGetAllRequestsForAdminQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
  useGetProcessingRequestsQuery,
  useGetUserDonateHistoryQuery,
  useGetRequestsByVolunteerNameQuery,
} from "@/features/requests/requestApiSlice";
import { useGetUserInfoQuery } from "@/features/userInfo/userInfoApiSlice";
import { FaEye, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "@/components/dashboard-components/Request/Modal";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/CustomSelect";
import RequestTable from "@/components/dashboard-components/Request/RequestTable";
import RequestForm from "@/components/dashboard-components/Request/RequestForm";

const RequestsPage = () => {
  const router = useRouter();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);

  const { data: userInfoData, isLoading: isLoadingUserInfo } =
    useGetUserInfoQuery();
  const userRole = userInfoData?.user.role || "";
  const useDistrict = userInfoData?.user.district || "";
  const userUpazila = userInfoData?.user.upazila || "";
  const eligible = userInfoData?.user.eligible;
  const processingRequest = userInfoData?.user.processingRequest || false;
  const userIdInRequest =
    userInfoData?.user?.userHaveRequest?.userId?._id || "";
  const requestId = userInfoData?.user?.userHaveRequest?._id;
  const userHaveRequest = userInfoData?.user.userHaveRequest ? true : false;

  const [isProcessingRequest, setIsProcessingRequest] =
    useState(processingRequest);

  // Update state when API data changes
  React.useEffect(() => {
    if (userInfoData?.user) {
      setIsProcessingRequest(userInfoData.user.processingRequest || false);
    }
  }, [userInfoData?.user]);

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

  const divisionalCoordinators = [
    "Divisional Coordinator",
    "Divisional Co-coordinator",
  ];

  const admin = ["Head of IT & Media", "Head of Logistics", "Admin"];

  const isAllowed = allowedRoles.includes(userRole);
  const isUpazilaCoordinator = upazilaCoordinators.includes(userRole);
  const isDistrictCoordinator = districtCoordinators.includes(userRole);
  const isDivisionalCoordinator = divisionalCoordinators.includes(userRole);
  const isAdmin = admin.includes(userRole);

  // Query hooks
  const {
    data: requestsData,
    isLoading,
    refetch,
  } = useGetAllRequestsForAdminQuery(undefined, {
    skip: !isAdmin && !isDivisionalCoordinator,
  });

  const {
    data: districtRequestsData,
    isLoading: isLoadingDistrictRequests,
    refetch: refetchDistrictRequests,
  } = useGetAllRequestsQuery(
    useDistrict
      ? {
          district: useDistrict,
          status:
            userRole === "user"
              ? "pending"
              : isAllowed || isUpazilaCoordinator
              ? ["pending", "processing"]
              : undefined,
        }
      : undefined,
    {
      skip:
        !useDistrict ||
        isAdmin ||
        isDivisionalCoordinator ||
        isUpazilaCoordinator,
    }
  );

  const {
    data: upazilaRequestsData,
    isLoading: isLoadingUpazilaRequests,
    refetch: refetchUpazilaRequests,
  } = useGetAllRequestsQuery(
    userUpazila
      ? {
          upazila: userUpazila,
          status:
            userRole === "user"
              ? "pending"
              : isAllowed || isUpazilaCoordinator
              ? ["pending", "processing"]
              : undefined,
        }
      : undefined,
    {
      skip:
        !userUpazila ||
        isAdmin ||
        isDivisionalCoordinator ||
        isDistrictCoordinator,
    }
  );

  const {
    data: userRequestsData,
    isLoading: isLoadingUserRequests,
    refetch: refetchUserRequests,
  } = useGetAllRequestsQuery(
    userIdInRequest && userIdInRequest !== null
      ? { userId: userIdInRequest }
      : undefined,
    { skip: !userIdInRequest }
  );

  const {
    data: processingRequestsData,
    isLoading: isLoadingProcessingRequests,
    refetch: refetchProcessingRequests,
  } = useGetProcessingRequestsQuery();
  
  const {
    data: UserDonateHistoryData,
    isLoading: isLoadingUserDonateHistory,
    refetch: refetchUserDonateHistory,
  } = useGetUserDonateHistoryQuery();

  const [ currentPageVolunteer, setCurrentPageVolunteer ] = useState(0);
  const REQUESTS_PER_PAGE_VOLUNTEER = 10;
  const {
    data: UserVolunteerHistoryData,
    isLoading: isLoadingUserVolunteerHistory,
    refetch: refetchUserVolunteerHistory,
  } = useGetRequestsByVolunteerNameQuery({
    page: currentPageVolunteer + 1,
    limit: REQUESTS_PER_PAGE_VOLUNTEER
  });

  // Add new query for requestId search
  const {
    data: searchRequestData,
    isLoading: isLoadingSearch,
  } = useGetAllRequestsQuery(
    searchTerm ? { requestId: searchTerm } : undefined,
    { skip: !searchTerm }
  );

  // Mutations
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const [updateRequest, { isLoading: isUpdating }] = useUpdateRequestMutation();
  const [deleteRequest] = useDeleteRequestMutation();

  const handleSubmit = async (formData) => {
    try {
      if (selectedRequest) {
        const response = await updateRequest({
          id: selectedRequest._id,
          requestData: formData,
        }).unwrap();
        if (response.status) {
          toast.success("Request updated successfully");
        }
      } else {
        const response = await createRequest(formData).unwrap();
        router.push(`/dashboard/requests/details/${response?.data._id}`);
        if (response.status) {
          toast.success("Request created successfully");
        }
      }
      handleCloseModal();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message);
      throw error;
    }
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteRequest(id).unwrap();
      if (response.status) {
        toast.success("Request deleted successfully");
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete request");
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleCreateNew = () => {
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleRowClick = (id) => {
    router.push(`/dashboard/requests/details/${id}`);
  };

  // Filter by location
  const filteredByLocation = useMemo(() => {
    // Create a Set of user request IDs for faster lookup
    const userRequestIds = new Set();
    if (userRequestsData?.data && userRequestsData.data.length > 0) {
      userRequestsData.data.forEach((request) => {
        userRequestIds.add(request._id);
      });
    }

    // Upazila data filter (pending only)
    const upazilaFiltered =
      upazilaRequestsData?.data?.filter(
        (request) =>
          request.upazila?.toLowerCase() === userUpazila.toLowerCase() &&
          request.status === "pending" &&
          (searchTerm === "" ||
            request.requestId
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            request.district
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            request.upazila?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.userId?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            request.bloodGroup
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            new Date(request.createdAt)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .includes(searchTerm)) &&
          // Exclude all user's own requests
          !userRequestIds.has(request._id)
      ) || [];

    // If upazila data exists, return it
    if (upazilaFiltered.length > 0) {
      return upazilaFiltered;
    }

    // Else, fallback to district data filter (pending only)
    const districtFiltered =
      districtRequestsData?.data?.filter(
        (request) =>
          request.district?.toLowerCase() === useDistrict.toLowerCase() &&
          request.status === "pending" &&
          (searchTerm === "" ||
            request.requestId
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            request.district
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            request.upazila?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.userId?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            request.bloodGroup
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            new Date(request.createdAt)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .includes(searchTerm)) &&
          // Exclude all user's own requests
          !userRequestIds.has(request._id)
      ) || [];

    return districtFiltered;
  }, [
    upazilaRequestsData?.data,
    districtRequestsData?.data,
    userUpazila,
    useDistrict,
    searchTerm,
    userRequestsData?.data,
  ]);

  // Pagination for filtered by location data
  const [currentPageLocation, setCurrentPageLocation] = useState(0);
  const REQUESTS_PER_PAGE_LOCATION = 10;
  const totalPagesLocation = Math.ceil(
    filteredByLocation.length / REQUESTS_PER_PAGE_LOCATION
  );
  const currentRequestsLocation = useMemo(() => {
    const startIndex = currentPageLocation * REQUESTS_PER_PAGE_LOCATION;
    return filteredByLocation.slice(
      startIndex,
      startIndex + REQUESTS_PER_PAGE_LOCATION
    );
  }, [filteredByLocation, currentPageLocation]);

  // Handle page change for location-based requests
  const handlePageChangeLocation = (selectedItem) => {
    setCurrentPageLocation(selectedItem.selected);
  };

  // Filter for isAdmin
  const filteredRequests = useMemo(() => {
    if (!requestsData?.data) return [];

    // Create a Set of user request IDs for faster lookup
    const userRequestIds = new Set();
    if (userRequestsData?.data && userRequestsData.data.length > 0) {
      userRequestsData.data.forEach((request) => {
        userRequestIds.add(request._id);
      });
    }

    let filteredData = requestsData.data;

    // Apply search filter
    filteredData = filteredData.filter((request) => {
      const matchesSearch =
        searchTerm === "" ||
        request.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.upazila?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(request.createdAt)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .includes(searchTerm);

      // Apply status filter
      const matchesStatus =
        filterStatus === "all" || request.status === filterStatus;

      // Exclude all of user's own requests
      const isNotUsersRequest = !userRequestIds.has(request._id);

      return matchesSearch && matchesStatus && isNotUsersRequest;
    });

    return filteredData;
  }, [requestsData, searchTerm, filterStatus, userRequestsData?.data]);

  const filteredData = filteredRequests;

  // Pagination
  const REQUESTS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredRequests.length / REQUESTS_PER_PAGE);

  const currentRequests = useMemo(() => {
    const startIndex = currentPage * REQUESTS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + REQUESTS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  // Filter for district coordinators
  const filteredDistrictRequests = useMemo(() => {
    if (!districtRequestsData?.data) return [];
    let filteredData = districtRequestsData.data;
    // Apply search filter
    filteredData = filteredData.filter((request) => {
      const matchesSearch =
        searchTerm === "" ||
        request.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.upazila?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(request.createdAt)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .includes(searchTerm);
      // Apply status filter
      const matchesStatus =
        filterStatus === "all" || request.status === filterStatus;
      // Check if it's not the user's own request
      const isNotUsersRequest = !requestId || request._id !== requestId;

      return matchesSearch && matchesStatus && isNotUsersRequest;
    });
    return filteredData;
  }, [districtRequestsData, searchTerm, filterStatus, requestId]);

  const handlePageChangeDistrict = (selectedItem) => {
    setCurrentPageDistrict(selectedItem.selected);
  };

  const filterDistrictData = filteredDistrictRequests;

  // Pagination for district requests
  const [currentPageDistrict, setCurrentPageDistrict] = useState(0);
  const REQUESTS_PER_PAGE_DISTRICT = 10;
  const totalPagesDistrict = Math.ceil(
    filteredDistrictRequests.length / REQUESTS_PER_PAGE_DISTRICT
  );
  const currentRequestsDistrict = useMemo(() => {
    const startIndex = currentPageDistrict * REQUESTS_PER_PAGE_DISTRICT;
    return filteredDistrictRequests.slice(
      startIndex,
      startIndex + REQUESTS_PER_PAGE_DISTRICT
    );
  }, [filteredDistrictRequests, currentPageDistrict]);

  // Filter for upazila coordinators
  const filteredUpazilaRequests = useMemo(() => {
    if (!upazilaRequestsData?.data) return [];

    // Create a Set of user request IDs for faster lookup
    const userRequestIds = new Set();
    if (userRequestsData?.data && userRequestsData.data.length > 0) {
      userRequestsData.data.forEach((request) => {
        userRequestIds.add(request._id);
      });
    }

    let filteredData = upazilaRequestsData.data;
    // Apply search filter
    filteredData = filteredData.filter((request) => {
      const matchesSearch =
        searchTerm === "" ||
        request.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.upazila?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(request.createdAt)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .includes(searchTerm);
      // Apply status filter
      const matchesStatus =
        filterStatus === "all" || request.status === filterStatus;
      // Exclude all user's own requests
      const isNotUsersRequest = !userRequestIds.has(request._id);

      return matchesSearch && matchesStatus && isNotUsersRequest;
    });
    return filteredData;
  }, [upazilaRequestsData, searchTerm, filterStatus, userRequestsData?.data]);

  // Pagination for upazila requests
  const [currentPageForUpazila, setCurrentPageForUpazila] = useState(0);
  const REQUESTS_PER_PAGE_FOR_UPAZILA = 10;
  const totalPagesForUpazila = Math.ceil(
    filteredUpazilaRequests.length / REQUESTS_PER_PAGE_FOR_UPAZILA
  );
  const currentRequestsUpazila = useMemo(() => {
    const startIndex = currentPageForUpazila * REQUESTS_PER_PAGE_FOR_UPAZILA;
    return filteredUpazilaRequests.slice(
      startIndex,
      startIndex + REQUESTS_PER_PAGE_FOR_UPAZILA
    );
  }, [filteredUpazilaRequests, currentPageForUpazila]);

  const handlePageChangeForUpazila = (selectedItem) => {
    setCurrentPageForUpazila(selectedItem.selected);
  };

  // Filter for user's requests get form upazilaRequestsData
  const userRequestsFilter = useMemo(() => {
    if (!userRequestsData?.data || !userInfoData?.user?.id) return [];
    return userRequestsData.data.filter(
      (request) =>
        request.userId._id === userInfoData.user.id &&
        (filterStatus === "all" || request.status === filterStatus) &&
        (searchTerm === "" ||
          request.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.upazila?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.bloodGroup
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          new Date(request.createdAt)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .includes(searchTerm))
    );
  }, [userRequestsData, userInfoData?.user?.id, filterStatus, searchTerm]);

  // Pagination for user's requests
  const [currentPageForUser, setCurrentPageForUser] = useState(0);
  const REQUESTS_PER_PAGE_FOR_USER = 10;
  const totalPagesForUser = Math.ceil(
    userRequestsFilter.length / REQUESTS_PER_PAGE_FOR_USER
  );
  const currentRequestsForUser = useMemo(() => {
    const startIndex = currentPageForUser * REQUESTS_PER_PAGE_FOR_USER;
    return userRequestsFilter.slice(
      startIndex,
      startIndex + REQUESTS_PER_PAGE_FOR_USER
    );
  }, [userRequestsFilter, currentPageForUser]);

  const handlePageChangeForUser = (selectedItem) => {
    setCurrentPageForUser(selectedItem.selected);
  };

  // Get user processing request
  const userProcessingRequest = useMemo(()=>{
    if(!processingRequestsData?.data) return [];
    return processingRequestsData.data
  })
  
  // Get user donation history
  const userDonationHistory = useMemo(()=>{
    if(!UserDonateHistoryData?.data) return [];
    return UserDonateHistoryData.data
  })

  // Get user volunteer history
  const userVolunteerHistory = useMemo(()=>{
    if(!UserVolunteerHistoryData?.data) return [];
    return UserVolunteerHistoryData.data
  })

  const totalPagesVolunteer = UserVolunteerHistoryData?.totalPages;
  const volunteerTotalRequestsCount = UserVolunteerHistoryData?.totalCount;

  const handlePageChangeVolunteer = (selectedItem) => {
    setCurrentPageVolunteer(selectedItem.selected);
  };

  // if user role is not user or isAllowed then show the delete button in the user's requests this pass with onDelete={handleDelete} props
  const showDeleteButton = userRole !== "user" || isAllowed;
  const deleteButtonForUser = showDeleteButton
    ? { onDelete: handleDelete }
    : {};

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <h2 className="text-xl text-center pb-3 font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Blood Requests
        </h2>
        <div className="flex flex-col justify-center item-center sm:flex-row mb-4 gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="sm:w-70 w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="sm:w-50 w-full">
                <CustomSelect
                  options={["all", "pending", "fulfilled", "processing"]}
                  selected={filterStatus}
                  setSelected={setFilterStatus}
                  placeholder="Filter by Status"
                />
              </div>
            </div>

            <button onClick={handleCreateNew} className="button">
              <FaPlus className="text-base" />
              Create New
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchTerm && searchRequestData?.data && (
        <div>
          <div className="mt-6 bg-primary p-4 rounded-t-lg shadow">
            <h3 className="text-lg text-center font-semibold text-white mb-2">
              Search Results for Request ID: {searchTerm}
            </h3>
            <p className="text-sm text-white text-center">
              Found {searchRequestData.data.length} matching request
            </p>
          </div>

          <RequestTable
            requests={searchRequestData.data}
            isLoading={isLoadingSearch}
            onEdit={handleEdit}
            onRowClick={handleRowClick}
            onDelete={handleDelete}
            userRole={userRole}
          />
        </div>
      )}

      {/* Only show other sections if there's no search term */}
      {!searchTerm && (
        <>
          {/* Location Content for isAllowed role */}
          {currentRequestsLocation.length > 0 && isAllowed && (
            <div>
              <div className="mt-6 bg-primary p-4 rounded-t-lg shadow">
                <h3 className="text-lg text-center font-semibold text-white mb-2">
                  <span className="inline-block bg-white text-primary font-bold w-8 h-8 leading-8 text-center rounded-full mr-2">
                    {filteredByLocation.length}
                  </span>
                  {searchTerm
                    ? `Search Results for "${searchTerm}" in `
                    : "Patient Need Blood In "}
                  {filteredByLocation.length > 0 &&
                  filteredByLocation[0].upazila?.toLowerCase() ===
                    userUpazila.toLowerCase()
                    ? userUpazila
                    : useDistrict}
                </h3>
                <p className="text-sm text-white text-center">
                  {searchTerm
                    ? `Found ${filteredByLocation.length} requests matching your search.`
                    : "Please help them to save their lives."}
                </p>
              </div>

              <RequestTable
                requests={currentRequestsLocation}
                isLoading={isLoading}
                onEdit={handleEdit}
                onRowClick={handleRowClick}
                totalPages={totalPagesLocation}
                currentPage={currentPageLocation}
                onPageChange={handlePageChangeLocation}
                userRole={userRole}
              />
            </div>
          )}

          {/* Location Content for user */}
          {isProcessingRequest === false &&
            eligible === true &&
            userRole === "user" && (
              <div>
                <div className="mt-6 bg-primary p-4 rounded-t-lg shadow">
                  <h3 className="text-lg text-center font-semibold text-white mb-2">
                    <span className="inline-block bg-white text-primary font-bold w-8 h-8 leading-8 text-center rounded-full mr-2">
                      {filteredByLocation.length}
                    </span>
                    {searchTerm
                      ? `Search Results for "${searchTerm}" in `
                      : "Patient Need Blood In "}
                    {filteredByLocation.length > 0 &&
                    filteredByLocation[0].upazila?.toLowerCase() ===
                      userUpazila.toLowerCase()
                      ? userUpazila
                      : useDistrict}
                  </h3>
                  <p className="text-sm text-white text-center">
                    {searchTerm
                      ? `Found ${filteredByLocation.length} requests matching your search.`
                      : "Please help them to save their lives."}
                  </p>
                </div>

                <RequestTable
                  requests={currentRequestsLocation}
                  isLoading={isLoading}
                  onRowClick={handleRowClick}
                  totalPages={totalPagesLocation}
                  currentPage={currentPageLocation}
                  onPageChange={handlePageChangeLocation}
                  userRole={userRole}
                />
              </div>
            )}

          {/* Admin Content */}
          {isAdmin && (
            <div>
              <div className="mt-6 bg-primary p-4 rounded-t-lg shadow">
                <h3 className="text-lg text-center font-semibold text-white mb-2">
                  All Blood Requests
                </h3>
                <p className="text-sm text-white text-center">
                  {filterStatus} requests: {filteredData.length || 0}
                </p>
              </div>

              <RequestTable
                requests={currentRequests}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRowClick={handleRowClick}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                userRole={userRole}
              />
            </div>
          )}

          {isDivisionalCoordinator && (
            <div>
              <div className="mt-6 bg-primary p-4 rounded-t-lg shadow">
                <h3 className="text-lg text-center font-semibold text-white mb-2">
                  All Blood Requests
                </h3>
                <p className="text-sm text-white text-center">
                  {filterStatus} requests: {filteredData.length || 0}
                </p>
              </div>

              <RequestTable
                requests={currentRequests}
                isLoading={isLoading}
                onEdit={handleEdit}
                onRowClick={handleRowClick}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                userRole={userRole}
              />
            </div>
          )}

          {/* District Coordinator Content */}
          {isDistrictCoordinator && (
            <div>
              <div className="mt-6 bg-primary p-4 rounded-t-lg shadow">
                <h3 className="text-lg text-center font-semibold text-white mb-2">
                  {searchTerm
                    ? `Search Results for "${searchTerm}" in ${useDistrict} District Blood Requests`
                    : `${useDistrict} District Blood Requests`}
                </h3>
                <p className="text-sm text-white text-center">
                  {searchTerm
                    ? `Found ${filterDistrictData.length} matching requests`
                    : filterStatus !== "all"
                    ? `${filterStatus} requests: ${filterDistrictData.length}`
                    : `Total requests: ${filterDistrictData.length}`}
                </p>
              </div>
              <RequestTable
                requests={currentRequestsDistrict}
                isLoading={isLoadingDistrictRequests}
                onEdit={handleEdit}
                onRowClick={handleRowClick}
                totalPages={totalPagesDistrict}
                currentPage={currentPageDistrict}
                onPageChange={handlePageChangeDistrict}
                userRole={userRole}
              />
            </div>
          )}

          {/* Upazila Coordinator Content */}
          {isUpazilaCoordinator && (
            <div>
              <div className="mt-6 bg-primary p-4 rounded-t-lg shadow">
                <h3 className="text-lg text-center font-semibold text-white mb-2">
                  {searchTerm
                    ? `Search Results for "${searchTerm}" in ${userUpazila} Upazila Blood Requests`
                    : `${userUpazila} Upazila Blood Requests`}
                </h3>
                <p className="text-sm text-white text-center">
                  {searchTerm
                    ? `Found ${filteredUpazilaRequests.length} matching requests`
                    : filterStatus !== "all"
                    ? `${filterStatus} requests: ${filteredUpazilaRequests.length}`
                    : `${filterStatus} requests in ${userUpazila} ${filteredUpazilaRequests.length}`}
                </p>
              </div>

              <RequestTable
                requests={currentRequestsUpazila}
                isLoading={isLoadingUpazilaRequests}
                onEdit={handleEdit}
                onRowClick={handleRowClick}
                totalPages={totalPagesForUpazila}
                currentPage={currentPageForUpazila}
                onPageChange={handlePageChangeForUpazila}
                userRole={userRole}
              />
            </div>
          )}

          {/* User Processing Content */}
          {isProcessingRequest && (
            <div>
              <div className="mt-6 bg-primary p-4 rounded-t-lg shadow">
                <h3 className="text-lg text-center font-semibold text-white mb-2">
                  You donating blood in this request.
                </h3>
                <p className="text-sm text-white text-center">
                  Do you completed your blood donation?
                </p>
              </div>

              <RequestTable
                requests={userProcessingRequest}
                isLoading={isLoadingUserRequests}
                onRowClick={handleRowClick}
              />
            </div>
          )}

          {/* User's Requests */}
          {userHaveRequest === true && (
            <div>
              <div className="mt-6 bg-primary p-4 rounded-t-lg shadow">
                <h3 className="text-lg text-center font-semibold text-white mb-2">
                  Your Blood Requests List
                </h3>
                <p className="text-sm text-white text-center">
                  {filterStatus} requests in {userRequestsFilter.length}
                </p>
              </div>

              <RequestTable
                requests={currentRequestsForUser}
                isLoading={isLoadingUserRequests}
                onEdit={handleEdit}
                onRowClick={handleRowClick}
                totalPages={totalPagesForUser}
                currentPage={currentPageForUser}
                onPageChange={handlePageChangeForUser}
                userRole={userRole}
                {...deleteButtonForUser}
              />
            </div>
          )}

          {/* User's Donation History */}
          {userDonationHistory.length > 0 && (
            <div>
              <div className="mt-6 bg-primary p-4 rounded-t-lg shadow">
                <h3 className="text-lg text-center font-semibold text-white mb-2">
                  Your Blood Donation History
                </h3>
              </div>

              <RequestTable
                requests={userDonationHistory}
                isLoading={isLoadingUserDonateHistory}
                onRowClick={handleRowClick}
                fulfilled={true}
              />
            </div>
          )}

          {/* User's Volunteer History */}
          {volunteerTotalRequestsCount > 0 && (
            <div>
              <div className="mt-6 bg-primary p-4 rounded-t-lg shadow">
                <h3 className="text-lg text-center font-semibold text-white mb-2">
                Your volunteer history
                </h3>
                <p className="text-sm text-white text-center">
                  You have volunteered for {volunteerTotalRequestsCount} blood requests
                </p>
              </div>

              <RequestTable
                requests={userVolunteerHistory}
                isLoading={isLoadingUserVolunteerHistory}
                onRowClick={handleRowClick}
                fulfilled={true}
                totalPages={totalPagesVolunteer}
                currentPage={currentPageVolunteer}
                onPageChange={handlePageChangeVolunteer}
              />
            </div>
          )}
        </>
      )}

      {/* Modal for Create/Edit Request */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedRequest ? "Edit Blood Request From" : "Create New Request"
        }
        initialData={selectedRequest}
      >
        <RequestForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          initialData={selectedRequest}
          isLoading={isCreating || isUpdating}
        />
      </Modal>
    </div>
  );
};

export default RequestsPage;
