"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import {
  useGetAllMonitorTeamsQuery,
  useGetMonitorTeamByMonitorUserIdQuery,
  useCreateMonitorTeamMutation,
  useUpdateMonitorTeamMutation,
  useDeleteMonitorTeamMutation,
} from "@/features/monitorTeam/monitorTeamApiSlice";
import PersonSelector from "@/components/PersonSelector";
import Pagination from "@/components/Pagination";
import deleteConfirm from "@/utils/deleteConfirm";
import { useGetUserInfoQuery } from "@/features/userInfo/userInfoApiSlice";
import TeamSelector from "@/components/TeamSelector";
import { useGetAllModeratorTeamsQuery } from "@/features/moderatorTeam/moderatorTeamApiSlice";
import ProfileCard from "@/components/ProfileCard";
import LocationSelector from "@/components/LocationSelector";
import DistrictSelector from "@/components/DistrictSelector";
import TeamCard from "@/components/TeamCard";

const MonitorTeamPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    districtName: "",
    upazilaName: "",
    teamMonitor: "",
    moderatorTeamID: [],
  });
  const [selectedModeratorTeams, setSelectedModeratorTeams] = useState([]);
  const [moderatorTeamSearch, setModeratorTeamSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [monitorName, setMonitorName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [upazilaName, setUpazilaName] = useState("");
  const [districtNameSearch, setDistrictNameSearch] = useState("");
  const [upazilaNameSearch, setUpazilaNameSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  // Get user info for role-based permissions
  const { data: userInfoData } = useGetUserInfoQuery();
  const userRole = userInfoData?.user?.role || "";
  const userUpazila = userInfoData?.user?.upazila || "";
  const userDistrict = userInfoData?.user?.district || "";

  // Fetch monitor teams data
  const shouldFetch = [
    "Upazila Coordinator",
    "Admin",
    "Head of IT & Media",
    "Upazila Co-coordinator",
  ].includes(userRole);
  
  const queryParams = {
    limit: itemsPerPage,
    page: currentPage,
    ...(userRole === "Upazila Coordinator" || userRole === "Upazila Co-coordinator"
      ? { upazilaName: userUpazila }
      : {}),
    ...(districtNameSearch.length >= 2 && { districtName: districtNameSearch }),
    ...(upazilaNameSearch.length >= 2 && { upazilaName: upazilaNameSearch }),
  };
  
  const {
    data: monitorTeamsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllMonitorTeamsQuery(queryParams, {
    skip: !shouldFetch,
  });

  // Handle district name search with pagination reset
  const handleDistrictNameSearch = useCallback((district) => {
    if (district) {
      setDistrictNameSearch(district.name || "");
    } else {
      setDistrictNameSearch("");
    }
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  // Handle upazila name search with pagination reset
  const handleUpazilaNameSearch = (e) => {
    setUpazilaNameSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const shouldFetchMonitorTeam = userRole === "Monitor";
  const { data: monitorTeamData } = useGetMonitorTeamByMonitorUserIdQuery(undefined, { skip: !shouldFetchMonitorTeam });
  const monitorData = monitorTeamData?.data?.teamMonitor;
  const moderatorsTeams = monitorTeamData?.data?.moderatorTeamID || [];

  useEffect(() => {
    if (monitorTeamData?.data?.upazilaName) {
      setUpazilaName(monitorTeamData.data.upazilaName);
    }
  }, [monitorTeamData?.data?.upazilaName]);

  // Extract monitor teams from response
  const monitorTeams = monitorTeamsData?.data?.teams || [];
  const totalTeams = monitorTeamsData?.data?.totalTeams || 0;
  const totalModeratorTeams = monitorTeamsData?.data?.totalModeratorTeam || 0;
  const totalModerators = monitorTeamsData?.data?.totalModerator || 0;
  const totalMembers = monitorTeamsData?.data?.totalMembers || 0;

  // Update total pages from API response
  useEffect(() => {
    if (monitorTeamsData?.data?.pagination) {
      setTotalPages(monitorTeamsData.data.pagination.totalPages);
      setTotalItems(monitorTeamsData.data.pagination.totalItems);
    } else {
      // If pagination data is not available, calculate based on total teams
      setTotalPages(Math.ceil(totalTeams / itemsPerPage));
      setTotalItems(totalTeams);
    }
  }, [monitorTeamsData, totalTeams, itemsPerPage]);

  // Handle page change for ReactPaginate
  const handlePageChange = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
  };

  // Fetch moderator teams for TeamSelector
  const {
    data: moderatorTeamsData,
    isLoading: isModeratorTeamsLoading,
    isError: isModeratorTeamsError,
    refetch: refetchModeratorTeams,
  } = useGetAllModeratorTeamsQuery(
       {
          districtName: formData.districtName || "",
          upazilaName: formData.upazilaName || "",
        },
        { skip: !formData.districtName || !formData.upazilaName }
  );

  const allModeratorTeams = moderatorTeamsData?.data?.teams || [];
  const formattedModeratorTeams = allModeratorTeams.map((team) => ({
    _id: team._id,
    name: team.moderatorTeamName
    || "Unknown",
  })); 

  const handleMonitorChange = useCallback((value) => {
    setFormData((prevData) => ({
      ...prevData,
      teamMonitor: value,
    }));
  }, []);

  // Handle moderator team selection
  const handleModeratorTeamSelect = useCallback(
    (teamId) => {
      setFormData((prevData) => {
        if (!prevData.moderatorTeamID.includes(teamId)) {
          return {
            ...prevData,
            moderatorTeamID: [...prevData.moderatorTeamID, teamId],
          };
        }
        return prevData;
      });
      const team = formattedModeratorTeams.find((t) => t._id === teamId);
      if (team && !selectedModeratorTeams.some((t) => t._id === teamId)) {
        setSelectedModeratorTeams((prev) => [...prev, team]);
      }
    },
    [formattedModeratorTeams, selectedModeratorTeams]
  );

  const handleModeratorTeamRemove = (teamId) => {
    setFormData((prevData) => ({
      ...prevData,
      moderatorTeamID: prevData.moderatorTeamID.filter((id) => id !== teamId),
    }));
    setSelectedModeratorTeams((prev) => prev.filter((t) => t._id !== teamId));
  };

  const handleModeratorTeamSearch = useCallback((query) => {
    setModeratorTeamSearch(query);
  }, []);

  // Handle location change from LocationSelector
  const handleLocationChange = useCallback((locationData) => {
    setFormData((prevData) => ({
      ...prevData,
      districtName: locationData.districtName || "",
      upazilaName: locationData.upazilaName || "",
    }));
  }, []);

  // API mutations
  const [createMonitorTeam] = useCreateMonitorTeamMutation();
  const [updateMonitorTeam] = useUpdateMonitorTeamMutation();
  const [deleteMonitorTeam] = useDeleteMonitorTeamMutation();

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
        const result = await updateMonitorTeam({
          id: editId,
          ...dataToSubmit,
        }).unwrap();

        if (result.status === true) {
          toast.success(result.message);
          handleCloseModal();
          refetch();
        } else {
          toast.error(result.message || "Failed to update monitor team");
        }
      } else {
        const result = await createMonitorTeam(dataToSubmit).unwrap();

        if (result.status === true) {
          toast.success(result.message);
          handleCloseModal();
          refetch();
        } else {
          toast.error(result.message || "Failed to create monitor team");
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
      teamMonitor: team.teamMonitor?._id || "",
      moderatorTeamID: Array.isArray(team.moderatorTeamID)
        ? team.moderatorTeamID.map((mt) => mt._id || mt)
        : [],
    });
    setSelectedModeratorTeams(
      team.moderatorTeamID?.map((mt) => ({
        _id: mt._id,
        name: mt.moderatorTeamName
        || "Unknown",
      })) || []
    );
    setDistrictName(team.districtName || "");
    setUpazilaName(team.upazilaName || "");
    setMonitorName(team.teamMonitor?.name || "");
    setIsEditing(true);
    setEditId(team._id);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirmed = await deleteConfirm();
    if (!confirmed) return;

    try {
      const result = await deleteMonitorTeam(id).unwrap();
      if (result.status) {
        toast.success(result.message);
        refetch();
      } else {
        toast.error(result.message || "Failed to delete monitor team");
      }
    } catch (error) {
      toast.error(error.data?.message || "An error occurred");
    }
  };

  // Handle add new
  const handleAddNew = () => {
    setFormData({
      districtName: "",
      upazilaName: "",
      teamMonitor: "",
      moderatorTeamID: [],
    });
    setSelectedModeratorTeams([]);
    setDistrictName("");
    setUpazilaName("");
    setMonitorName("");
    setIsEditing(false);
    setEditId(null);
    setShowModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      districtName: "",
      upazilaName: "",
      teamMonitor: "",
      moderatorTeamID: [],
    });
    setSelectedModeratorTeams([]);
    setDistrictName("");
    setUpazilaName("");
    setMonitorName("");
    setIsEditing(false);
    setEditId(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading monitor teams</div>;
  }

  return (
    <div className="container mx-auto mt-10 md:mt-0">

  {userRole === 'Monitor' &&(
    <div> 
      <div>
    <h1 className="text-2xl font-bold text-center text-primary mb-6">
      Monitor Team Of {upazilaName} Upazila/Thana
      <p className="text-sm text-gray-500 dark:text-gray-400">
        You are monitoring {monitorTeamData?.data?.teamName}
      </p>
    </h1>
  </div>
  <div className="flex justify-center">
  <ProfileCard
  id = {monitorData?._id}
  name={monitorData?.name}
  phone={monitorData?.phone}
  imageUrl={monitorData?.profileImage}
  role={monitorData?.role}
  isVerified={monitorData?.isVerified}
  roleSuffix={monitorData?.roleSuffix}
  bloodGroup={monitorData?.bloodGroup}
  lastDonate={monitorData?.lastDonate}
  nextDonationDate={monitorData?.nextDonationDate}
  />
  </div>
  {
    moderatorsTeams ? (
      <>
  <h1 className="text-2xl font-bold text-center text-primary my-6 mb-10">
    Moderator Teams
  </h1>

  <div
    className={`grid gap-6 w-full mx-auto
      ${
        moderatorsTeams?.length === 1
          ? "grid-cols-1 max-w-md"
          : moderatorsTeams?.length === 2
          ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }`}
  >
    {moderatorsTeams.map((team, index) => (
      <TeamCard
        key={index}
        {...team}
        detailPageLink={`/dashboard/moderator-team`}
        teamName={team?.moderatorTeamName}
        name={team?.moderatorName?.name}
        phone={team?.moderatorName?.phone}
        imageUrl={team?.moderatorName?.profileImage}
        role={team?.moderatorName?.role}
        isVerified={team?.moderatorName?.isVerified}
        roleSuffix={team?.moderatorName?.roleSuffix}
        bloodGroup={team?.moderatorName?.bloodGroup}
        subTeamNumber={`${team.moderatorTeamMembers.length} Members`}
      />
    ))}
  </div>

{/* Stats Display */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-16">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">Total Moderator Teams</h3>
                <p className="text-2xl text-center">{moderatorsTeams.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">Total Moderators</h3>
                <p className="text-2xl text-center">{moderatorsTeams.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">Total Members</h3>
                <p className="text-2xl text-center">{moderatorsTeams.reduce((acc, team) => acc + team.moderatorTeamMembers.length, 0)}</p>
              </div>
            </div>

</>

    ):(
    <h1 className="text-2xl font-bold text-center text-primary my-6">
      You have no moderator team
    </h1>
  )}
  </div>
  )}

  {(
    userRole === "Admin" ||
    userRole === "Head of IT & Media" ||
    userRole === "Upazila Coordinator" ||
    userRole === "Upazila Co-coordinator"
  ) && (
    <>
      {/* Role check stored in a variable to avoid duplication */}
      {(() => {
        const canManage = ["Admin", "Head of IT & Media", "Upazila Coordinator", "Upazila Co-coordinator"].includes(userRole);

        return (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-center md:text-start">Monitor Teams Management</h1>
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

              {canManage && (
                <button onClick={handleAddNew} className="button mt-2">
                  Add New Monitor Team
                </button>
              )}
            </div>
            
            {/* Teams List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Name
                      </th>
                      <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Monitor
                      </th>
                      <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Moderator Teams
                      </th>
                      {canManage && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monitorTeams.map((team) => (
                      <tr key={team._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {team.teamName || "N/A"}
                          </div>
                          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {team.teamMonitor?.name || "Not provided"}
                          </div>
                          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {team.districtName}
                          <br />
                          {team.upazilaName}
                          </div>
                          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {team.teamMonitor?.phone}
                          </div>
                        </td>
                        <td className="hidden text-center md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap">
                          {team.teamMonitor?.name}
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {team.teamMonitor?.phone}
                          </div>
                          </td>
                        <td className="hidden text-center md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap">
                          {team.districtName}
                          <br />
                          {team.upazilaName}
                        </td>
                        <td className="hidden text-center md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap">
                          {team.moderatorTeamID.length}
                        </td>
                        {canManage && (
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleEdit(team)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <FaEdit className="inline" />
                            </button>
                            <button
                              onClick={() => handleDelete(team._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash className="inline" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
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

            {/* Stats Display */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-16">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">Total Teams</h3>
                <p className="text-2xl text-center">{totalTeams}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">Total Moderator Teams</h3>
                <p className="text-2xl text-center">{totalModeratorTeams}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">Total Moderators</h3>
                <p className="text-2xl text-center">{totalModerators}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">Total Members</h3>
                <p className="text-2xl text-center">{totalMembers}</p>
              </div>
            </div>

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-white p-8 rounded-lg w-full max-w-2xl mt-35 md:mt-0 border border-gray-300">
                  <h2 className="text-2xl font-bold mb-4">
                    {isEditing ? "Edit Monitor Team" : "Add New Monitor Team"}
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Location
                      </label>
                      <LocationSelector
                        onLocationChange={handleLocationChange}
                        initialDistrictName={districtName}
                        initialUpazilaName={upazilaName}
                      />
                    </div>

                    <div className="mb-4">
                      <PersonSelector
                        onSelect={handleMonitorChange}
                        initialValue={monitorName}
                        role="Monitor"
                        label="Monitor"
                        required={true}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Moderator Teams
                      </label>
                      <TeamSelector
                        onTeamSelect={handleModeratorTeamSelect}
                        onTeamRemove={handleModeratorTeamRemove}
                        onSearch={handleModeratorTeamSearch}
                        selectedTeams={selectedModeratorTeams}
                        teams={formattedModeratorTeams}
                        isLoading={isModeratorTeamsLoading}
                        placeholder="Search moderator teams..."
                      />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2">
                        Monitor Teams in {upazilaName} Upazila Team:
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedModeratorTeams.map((team) => (
                          <span
                            key={team._id}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1"
                          >
                            {team.name}
                            <button
                              type="button"
                              className="ml-1 text-red-500 hover:text-red-700"
                              onClick={() => handleModeratorTeamRemove(team._id)}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="button">
                        {isEditing ? "Update" : "Create"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </>
  )}
</div>

  );
};

export default MonitorTeamPage;
