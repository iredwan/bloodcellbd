"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import {
  useGetAllUpazilaTeamsQuery,
  useCreateUpazilaTeamMutation,
  useUpdateUpazilaTeamMutation,
  useDeleteUpazilaTeamMutation,
  useGetUpazilaTeamByCoordinatorIdQuery,
} from "@/features/upazilaTeam/upazilaTeamApiSlice";
import DistrictSelector from "@/components/DistrictSelector";
import PersonSelector from "@/components/PersonSelector";
import Pagination from "@/components/Pagination";
import deleteConfirm from "@/utils/deleteConfirm";
import { useGetUserInfoQuery } from "@/features/userInfo/userInfoApiSlice";
import TeamSelector from "@/components/TeamSelector";
import { useGetAllMonitorTeamsQuery } from "@/features/monitorTeam/monitorTeamApiSlice";
import ProfileCard from "@/components/ProfileCard";
import LocationSelector from "@/components/LocationSelector";

const UpazilaTeamPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    districtName: "",
    upazilaName: "",
    upazilaCoordinator: "",
    upazilaCoCoordinator: "",
    upazilaITMediaCoordinator: "",
    upazilaLogisticsCoordinator: "",
    monitorTeams: [],
  });
  const [selectedMonitorTeams, setSelectedMonitorTeams] = useState([]);
  const [monitorTeamSearch, setMonitorTeamSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [initialDistrictName, setInitialDistrictName] = useState("");
  const [initialUpazilaName, setInitialUpazilaName] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [coCoordinatorName, setCoCoordinatorName] = useState("");
  const [itMediaCoordinatorName, setITMediaCoordinatorName] = useState("");
  const [logisticsCoordinatorName, setLogisticsCoordinatorName] = useState("");
  const [districtNameSearch, setDistrictNameSearch] = useState("");
  const [upazilaNameSearch, setUpazilaNameSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  
  // Fetch upazila teams data with pagination parameters
  const {
    data: upazilaTeamsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllUpazilaTeamsQuery({
    ...(upazilaNameSearch.length >= 2 && { upazilaName: upazilaNameSearch }),
    ...(districtNameSearch.length >= 2 && { districtName: districtNameSearch }),
    page: currentPage,
    limit: itemsPerPage
  });

  // Handle district name search with pagination reset
  const handleDistrictNameSearch = useCallback((district) => {
    if (district) {
      setDistrictNameSearch(district.name || '');
    } else {
      setDistrictNameSearch('');
    }
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  // Handle upazila name search with pagination reset
  const handleUpazilaNameSearch = (e) => {
    setUpazilaNameSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Get user info for role-based permissions
  const { data: userInfoData } = useGetUserInfoQuery();
  const userRole = userInfoData?.user?.role || "";

  const {
    data: upazilaCoordinatorsData,
    isLoading: isUpazilaLoading,
    isError: isUpazilaError,
    error: upazilaError,
  } = useGetUpazilaTeamByCoordinatorIdQuery(undefined, {
    skip: !["Upazila Coordinator", "Upazila Co-Coordinator", "Upazila IT & Media Coordinator", "Upazila Logistics Coordinator"].includes(userRole)
  });

  // Extract upazila teams from response
  const upazilaTeams = upazilaTeamsData?.data?.upazilaTeams || [];
  const totalMonitorTeams = upazilaTeamsData?.data?.totalMonitorTeams || 0;

  // Update total pages and items from API response
  useEffect(() => {
    if (upazilaTeamsData?.data?.pagination) {
      setTotalPages(upazilaTeamsData.data.pagination.totalPages);
      setTotalItems(upazilaTeamsData.data.pagination.totalItems);
    }
  }, [upazilaTeamsData]);

  // Update coordinator data access
  const upazilaCoordinatorsDataArray =
    upazilaCoordinatorsData?.data?.[0] || null;
  const upazilaName = upazilaCoordinatorsDataArray?.upazilaName;
  const upazilaCoordinatorData =
    upazilaCoordinatorsDataArray?.upazilaCoordinator;
  const upazilaCoCoordinatorData =
    upazilaCoordinatorsDataArray?.upazilaCoCoordinator;
  const upazilaITMediaCoordinatorData =
    upazilaCoordinatorsDataArray?.upazilaITMediaCoordinator;
  const upazilaLogisticsCoordinatorData =
    upazilaCoordinatorsDataArray?.upazilaLogisticsCoordinator;
  const monitorTeamsCount =
    upazilaCoordinatorsDataArray?.monitorTeams?.length || 0;

  // Handle page change for ReactPaginate
  const handlePageChange = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
  };

  // Fetch monitor teams for TeamSelector
  const {
    data: monitorTeamsData,
    isLoading: isMonitorTeamsLoading,
    isError: isMonitorTeamsError,
    refetch: refetchMonitorTeams,
  } = useGetAllMonitorTeamsQuery(
    monitorTeamSearch.length >= 2
      ? {
          teamName: monitorTeamSearch.length >= 2 ? monitorTeamSearch : "",
          districtName: formData.districtName || "",
          upazilaName: formData.upazilaName || "",
        }
      : {},
    { skip: monitorTeamSearch.length < 2 }
  );
  const allMonitorTeams = monitorTeamsData?.data?.teams || [];
  const formattedMonitorTeams = allMonitorTeams.map((team) => ({
    _id: team._id,
    name: team.teamName || "Unknown",
  }));

  const handleCoordinatorChange = useCallback((value) => {
    setFormData((prevData) => ({
      ...prevData,
      upazilaCoordinator: value,
    }));
  }, []);

  const handleCoCoordinatorChange = useCallback((value) => {
    setFormData((prevData) => ({
      ...prevData,
      upazilaCoCoordinator: value,
    }));
  }, []);

  const handleITMediaCoordinatorChange = useCallback((value) => {
    setFormData((prevData) => ({
      ...prevData,
      upazilaITMediaCoordinator: value,
    }));
  }, []);

  const handleLogisticsCoordinatorChange = useCallback((value) => {
    setFormData((prevData) => ({
      ...prevData,
      upazilaLogisticsCoordinator: value,
    }));
  }, []);

  // Add handler for TeamSelector multi-select
  const handleMonitorTeamSelect = useCallback(
    (teamId) => {
      setFormData((prevData) => {
        if (!prevData.monitorTeams.includes(teamId)) {
          return {
            ...prevData,
            monitorTeams: [...prevData.monitorTeams, teamId],
          };
        }
        return prevData;
      });
      const team = formattedMonitorTeams.find((t) => t._id === teamId);
      if (team && !selectedMonitorTeams.some((t) => t._id === teamId)) {
        setSelectedMonitorTeams((prev) => [...prev, team]);
      }
    },
    [formattedMonitorTeams, selectedMonitorTeams]
  );

  const handleMonitorTeamRemove = (teamId) => {
    setFormData((prevData) => ({
      ...prevData,
      monitorTeams: prevData.monitorTeams.filter((id) => id !== teamId),
    }));
    setSelectedMonitorTeams((prev) => prev.filter((t) => t._id !== teamId));
  };

  const handleMonitorTeamSearch = useCallback((query) => {
    setMonitorTeamSearch(query);
  }, []);

  // Handle location change from LocationSelector
  const handleLocationChange = useCallback((locationData) => {
    setFormData(prevData => ({
      ...prevData,
      districtName: locationData.districtName || "",
      upazilaName: locationData.upazilaName || "",
    }));
  }, []);

  // Prepare data for API submission
  const prepareDataForSubmission = (data) => {
    const submissionData = { ...data };
    Object.keys(submissionData).forEach((key) => {
      if (submissionData[key] === "") {
        delete submissionData[key];
      }
    });
    return submissionData;
  };
  
  
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSubmit = prepareDataForSubmission(formData);

      if (isEditing) {
        const result = await updateUpazilaTeam({
          id: editId,
          ...dataToSubmit,
        }).unwrap();

        if (result.status) {
          toast.success(result.message);
          handleCloseModal();
          refetch();
        } else {
          toast.error(result.message || "Failed to update upazila team");
        }
      } else {
        const result = await createUpazilaTeam(dataToSubmit).unwrap();

        if (result.status) {
          toast.success(result.message);
          handleCloseModal();
          refetch();
        } else {
          toast.error(result.message || "Failed to create upazila team");
        }
      }
    } catch (error) {
      toast.error(error.data?.message || "An error occurred");
    }
  };
  // Handle edit button click
  const handleEdit = (team) => {
    setFormData({
      districtName: team.districtName || "",
      upazilaName: team.upazilaName || "",
      upazilaCoordinator: team.upazilaCoordinator?._id || "",
      upazilaCoCoordinator: team.upazilaCoCoordinator?._id || "",
      upazilaITMediaCoordinator: team.upazilaITMediaCoordinator?._id || "",
      upazilaLogisticsCoordinator: team.upazilaLogisticsCoordinator?._id || "",
      monitorTeams: Array.isArray(team.monitorTeams)
        ? team.monitorTeams.map((mt) => mt._id || mt)
        : [],
    });
    setInitialDistrictName(team.districtName || "");
    setInitialUpazilaName(team.upazilaName || "");
    setCoordinatorName(team.upazilaCoordinator?.name || "");
    setCoCoordinatorName(team.upazilaCoCoordinator?.name || "");
    setITMediaCoordinatorName(team.upazilaITMediaCoordinator?.name || "");
    setLogisticsCoordinatorName(team.upazilaLogisticsCoordinator?.name || "");
    setSelectedMonitorTeams(
      Array.isArray(team.monitorTeams)
        ? team.monitorTeams.map((mt) => ({
            _id: mt._id || mt,
            name: mt.teamName || "Unknown",
          }))
        : []
    );
    setEditId(team._id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    const confirmed = await deleteConfirm({
      title: "Delete Upazila Team?",
      text: "Are you sure you want to delete this upazila team? This action cannot be undone!",
      confirmButtonText: "Yes, delete team",
    });

    if (confirmed) {
      try {
        const result = await deleteUpazilaTeam(id).unwrap();

        if (result.status) {
          toast.success(`${result.message}`);
          refetch();
        } else {
          toast.error(result.message || "Failed to delete upazila team");
        }
      } catch (error) {
        toast.error(error.data?.message || "An error occurred");
      }
    }
  };

  // Reset form when modal is opened for creating new team
  const handleAddNew = () => {
    setFormData({
      districtName: "",
      upazilaName: "",
      upazilaCoordinator: "",
      upazilaCoCoordinator: "",
      upazilaITMediaCoordinator: "",
      upazilaLogisticsCoordinator: "",
      monitorTeams: [],
    });
    setInitialDistrictName("");
    setInitialUpazilaName("");
    setCoordinatorName("");
    setCoCoordinatorName("");
    setITMediaCoordinatorName("");
    setLogisticsCoordinatorName("");
    setSelectedMonitorTeams([]);
    setEditId(null);
    setIsEditing(false);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Check if user has permission to manage teams
  const canManageTeams = [
    "Admin",
    "Head of IT & Media",
    "District Coordinator",
    "District Co-Coordinator",
  ].includes(userRole);
  const upazilaCoordinator = [
    "Upazila Coordinator",
    "Upazila Co-Coordinator",
    "Upazila IT & Media Coordinator",
    "Upazila Logistics Coordinator",
  ].includes(userRole);

  const [createUpazilaTeam, { isLoading: isCreating }] =
    useCreateUpazilaTeamMutation();
  const [updateUpazilaTeam, { isLoading: isUpdating }] =
    useUpdateUpazilaTeamMutation();
  const [deleteUpazilaTeam] = useDeleteUpazilaTeamMutation();

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading upazila teams. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4">
      {canManageTeams && (
        <>
          {isLoading && (
            <div>
              <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-1/4 mb-4 rounded"></div>
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-1/4 mb-4 rounded"></div>
              </div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 w-full rounded"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 w-full rounded"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 w-full rounded"></div>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Upazila Teams
            </h1>
            <div>
                  <DistrictSelector
                 onDistrictChange={handleDistrictNameSearch}
                 label="Select District"
                 required={false}
               />
            </div>
            <div className="relative flex flex-col">
            <label className="mb-1 text-sm font-medium text-center md:text-left text-gray-700 dark:text-gray-300">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search with upazila name"
                value={upazilaNameSearch}
                onChange={handleUpazilaNameSearch}
                className="w-full px-4 py-2.5 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-3"
              />
              <FaSearch className="absolute left-3 top-4 text-gray-400" />                                                     
            </div>
          </div>
            {canManageTeams && (
              <button onClick={handleAddNew} className="button">
                Add New Upazila Team
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Upazila
                    </th>
                    <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Coordinator
                    </th>
                    <th className="hidden lg:table-cell px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Co-Coordinator
                    </th>
                    <th className="hidden xl:table-cell px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      IT & Media Coordinator
                    </th>
                    <th className="hidden xl:table-cell px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Logistics Coordinator
                    </th>
                    <th className="hidden sm:table-cell px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Monitor Teams
                    </th>
                    {canManageTeams && (
                      <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {upazilaTeams.length > 0 ? (
                    upazilaTeams.map((team) => (
                      <tr
                        key={team._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-3 sm:px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {team.upazilaName || "N/A"}
                          </div>
                          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Coordinator:{" "}
                            {team.upazilaCoordinator?.name || "Not provided"}
                          </div>
                          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Phone:{" "}
                            {team.upazilaCoordinator?.phone || "Not provided"}
                          </div>
                          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Monitor Teams: {team.monitorTeams?.length || 0}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {team.upazilaCoordinator?.name || "Not assigned"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Phone:{" "}
                            {team.upazilaCoordinator?.phone || "Not provided"}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {team.upazilaCoCoordinator?.name || "Not assigned"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Phone:{" "}
                            {team.upazilaCoCoordinator?.phone || "Not provided"}
                          </div>
                        </td>
                        <td className="hidden xl:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {team.upazilaITMediaCoordinator?.name ||
                              "Not assigned"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Phone:{" "}
                            {team.upazilaITMediaCoordinator?.phone ||
                              "Not provided"}
                          </div>
                        </td>
                        <td className="hidden xl:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {team.upazilaLogisticsCoordinator?.name ||
                              "Not assigned"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Phone:{" "}
                            {team.upazilaLogisticsCoordinator?.phone ||
                              "Not provided"}
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {team.monitorTeams?.length || 0}
                          </div>
                        </td>
                        {canManageTeams && (
                          <td className="px-3 sm:px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 justify-center">
                              <button
                                onClick={() => handleEdit(team)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(team._id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={canManageTeams ? 7 : 6}
                        className="px-3 sm:px-4 py-4 text-center text-gray-500 dark:text-gray-300"
                      >
                        No upazila teams found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                pageCount={totalPages}
                onPageChange={handlePageChange}
                currentPage={currentPage - 1}
              />
            </div>
          )}

          {/* Modal for Add/Edit */}
          {showModal && (
            <div className="fixed inset-0 z-10 overflow-y-auto backdrop-blur-sm flex justify-center items-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 mt-35 md:mt-0">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isEditing ? "Edit Upazila Team" : "Add New Upazila Team"}
                  </h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="px-6 py-4">
                    {/* Replace DistrictSelector with LocationSelector */}
                    <div className="mb-4">
                      <LocationSelector
                        initialDistrictName={initialDistrictName}
                        initialUpazilaName={initialUpazilaName}
                        onLocationChange={handleLocationChange}
                        className="w-full"
                      />
                    </div>

                    {/* Upazila Coordinator */}
                      <div className="mb-4"> 
                      <PersonSelector
                        onSelect={handleCoordinatorChange}
                        initialValue={coordinatorName}
                        role="Upazila Coordinator"
                        label="Upazila Coordinator"
                        required={true}
                      />
                    </div>

                    {/* Co-Coordinator */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Co-Coordinator
                      </label>
                      <PersonSelector
                        onSelect={handleCoCoordinatorChange}
                        initialValue={coCoordinatorName}
                        role="Upazila Co-coordinator"
                      />
                    </div>

                    {/* IT & Media Coordinator */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        IT & Media Coordinator
                      </label>
                      <PersonSelector
                        onSelect={handleITMediaCoordinatorChange}
                        initialValue={itMediaCoordinatorName}
                        role="Upazila IT & Media Coordinator"
                      />
                    </div>

                    {/* Logistics Coordinator */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Logistics Coordinator
                      </label>
                      <PersonSelector
                        onSelect={handleLogisticsCoordinatorChange}
                        initialValue={logisticsCoordinatorName}
                        role="Upazila Logistics Coordinator"
                      />
                    </div>

                    {/* Monitor Teams */}
                    <div 
                    onClick={() => {
                      if (formData.districtName === "" || formData.upazilaName === "") {
                        toast.error("Please select a district and upazila first");
                        return;
                      }
                    }}
                    className="mb-4">
                      <TeamSelector
                        teams={formattedMonitorTeams}
                        onSearch={handleMonitorTeamSearch}
                        onTeamSelect={handleMonitorTeamSelect}
                        label="Add Monitor Team(s)"
                        placeholder={
                          !formData.districtName ? "Please select a district first" : 
                          !formData.upazilaName ? "Please select a upazila first" : "Search monitor team ..."}
                        isLoading={isMonitorTeamsLoading}
                        isError={isMonitorTeamsError}
                        errorMessage={
                          isMonitorTeamsError
                            ? "Error loading monitor teams"
                            : ""
                        }
                        onRetry={refetchMonitorTeams}
                        className={`${!formData.districtName ? "pointer-events-none opacity-50 cursor-not-allowed" : !formData.upazilaName ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}`}
                      />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2">
                        Monitor Teams in {initialUpazilaName} Upazila Team:
                      </label>
                      {/* Show selected monitor teams as chips/tags */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedMonitorTeams.map((team) => (
                          <span
                            key={team._id}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1"
                          >
                            {team.name}
                            <button
                              type="button"
                              className="ml-1 text-red-500 hover:text-red-700"
                              onClick={() => handleMonitorTeamRemove(team._id)}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-2 rounded-b-lg">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating || isUpdating}
                      className="button"
                    >
                      {isCreating || isUpdating
                        ? "Saving..."
                        : isEditing
                        ? "Update"
                        : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {upazilaCoordinator && (
        <div className="mx-auto">
          {isUpazilaLoading ? (
            <div className="flex justify-center">Loading...</div>
          ) : upazilaCoordinatorsDataArray ? (
            <div>
              {/* Upazila Name */}
              <div>
                <h1 className="text-2xl font-bold text-center text-primary mb-6">
                  Coordinators Of {upazilaName} Upazila/Thana
                </h1>
              </div>

              {/* Upazila coordinator cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 border-b-2 border-gray-200 dark:border-gray-700 pb-8">
                {/* Upazila Coordinator */}
                {upazilaCoordinatorData && (
                  <ProfileCard
                    id={upazilaCoordinatorData._id}
                    imageUrl={upazilaCoordinatorData.profileImage || ""}
                    name={upazilaCoordinatorData.name}
                    isVerified={upazilaCoordinatorData.isVerified}
                    role="Upazila Coordinator"
                    roleSuffix={upazilaCoordinatorData.roleSuffix || ""}
                    bloodGroup={upazilaCoordinatorData.bloodGroup || "N/A"}
                    phone={upazilaCoordinatorData.phone}
                  />
                )}

                {/* Upazila Co-Coordinator */}
                {upazilaCoCoordinatorData && (
                  <ProfileCard
                    id={upazilaCoCoordinatorData._id}
                    imageUrl={upazilaCoCoordinatorData.profileImage || ""}
                    name={upazilaCoCoordinatorData.name}
                    isVerified={upazilaCoCoordinatorData.isVerified}
                    role="Upazila Co-Coordinator"
                    roleSuffix={upazilaCoCoordinatorData.roleSuffix || ""}
                    bloodGroup={upazilaCoCoordinatorData.bloodGroup || "N/A"}
                    phone={upazilaCoCoordinatorData.phone}
                  />
                )}

                {/* Upazila IT Media Coordinator */}
                {upazilaITMediaCoordinatorData && (
                  <ProfileCard
                    id={upazilaITMediaCoordinatorData._id}
                    imageUrl={upazilaITMediaCoordinatorData.profileImage || ""}
                    name={upazilaITMediaCoordinatorData.name}
                    isVerified={upazilaITMediaCoordinatorData.isVerified}
                    role="Upazila IT & Media Coordinator"
                    roleSuffix={upazilaITMediaCoordinatorData.roleSuffix || ""}
                    bloodGroup={
                      upazilaITMediaCoordinatorData.bloodGroup || "N/A"
                    }
                    phone={upazilaITMediaCoordinatorData.phone}
                  />
                )}

                {/* Upazila Logistics Coordinator */}
                {upazilaLogisticsCoordinatorData && (
                  <div className="lg:col-start-2">
                    <ProfileCard
                      id={upazilaLogisticsCoordinatorData._id}
                      imageUrl={
                        upazilaLogisticsCoordinatorData.profileImage || ""
                      }
                      name={upazilaLogisticsCoordinatorData.name}
                      isVerified={upazilaLogisticsCoordinatorData.isVerified}
                      role="Upazila Logistics Coordinator"
                      roleSuffix={
                        upazilaLogisticsCoordinatorData.roleSuffix || ""
                      }
                      bloodGroup={
                        upazilaLogisticsCoordinatorData.bloodGroup || "N/A"
                      }
                      phone={upazilaLogisticsCoordinatorData.phone}
                    />
                  </div>
                )}
              </div>

              {/* Monitor Teams Summary */}
              <div className="mt-5 bg-primary p-4 w-full">
                <h1 className="text-white text-2xl font-bold text-center">
                  {monitorTeamsCount} Monitor Teams In {upazilaName} Upazila/Thana
                </h1>
                <div className="flex justify-center my-4">
                  <button
                    onClick={() => router.push(`/dashboard/monitor-team`)}
                    className="text-white border-2 border-white rounded-full py-2 px-3 hover:bg-white hover:text-red-800 cursor-pointer"
                  >
                    <FaEdit className="w-4 h-4 inline-block mr-2" />
                    Edit Monitor Team
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No upazila team data found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpazilaTeamPage;
