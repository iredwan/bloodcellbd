"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import {
  useGetAllModeratorTeamsQuery,
  useGetModeratorTeamByModeratorUserIdQuery,
  useGetAllModeratorTeamsByMonitorUserIdQuery,
  useGetModeratorTeamByMemberUserIdQuery,
  useCreateModeratorTeamMutation,
  useUpdateModeratorTeamMutation,
  useDeleteModeratorTeamMutation,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
} from "@/features/moderatorTeam/moderatorTeamApiSlice";
import PersonSelector from "@/components/PersonSelector";
import Pagination from "@/components/Pagination";
import deleteConfirm from "@/utils/deleteConfirm";
import { useGetUserInfoQuery } from "@/features/userInfo/userInfoApiSlice";
import ProfileCard from "@/components/ProfileCard";
import LocationSelector from "@/components/LocationSelector";
import DistrictSelector from "@/components/DistrictSelector";

const ModeratorTeamPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    districtName: "",
    upazilaName: "",
    moderatorName: "",
    moderatorTeamName: "",
    moderatorTeamMembers: [],
  });
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [teamMemberSearch, setTeamMemberSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [moderatorName, setModeratorName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [upazilaName, setUpazilaName] = useState("");
  const [districtNameSearch, setDistrictNameSearch] = useState("");
  const [upazilaNameSearch, setUpazilaNameSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  // Get user info for role-based permissions
  const { data: userInfoData } = useGetUserInfoQuery();
  const userRole = userInfoData?.user?.role || "";
  const userUpazila = userInfoData?.user?.upazila || "";
  const userDistrict = userInfoData?.user?.district || "";

  // Fetch moderator teams data
  const shouldFetch = [
      "Admin",
      "Head of IT & Media",
      "Upazila Coordinator",
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
    data: moderatorTeamsData,
    isLoading,
    isError,
    refetch: refetchAllTeams,
  } = useGetAllModeratorTeamsQuery(queryParams, {
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

  const shouldFetchModeratorTeam = userRole === "Moderator";
  const {
    data: moderatorTeamData,
    refetch: refetchModeratorTeam
  } = useGetModeratorTeamByModeratorUserIdQuery(undefined, { skip: !shouldFetchModeratorTeam });
  const moderatorData = moderatorTeamData?.data?.[0]?.moderatorName;
  const teamMembers = moderatorTeamData?.data?.[0]?.moderatorTeamMembers || [];

  useEffect(() => {
    if (moderatorTeamData?.data?.[0]?.upazilaName) {
      setUpazilaName(moderatorTeamData.data[0].upazilaName);
    }
  }, [moderatorTeamData?.data]);

  // Extract moderator teams from response
  const moderatorTeams = moderatorTeamsData?.data?.moderatorTeams || [];
  const totalTeamMembers = moderatorTeamsData?.data?.totalTeamMembers || 0;

  // Update total pages from API response
  useEffect(() => {
    if (moderatorTeamsData?.data?.pagination) {
      setTotalPages(moderatorTeamsData.data.pagination.totalPages);
      setTotalItems(moderatorTeamsData.data.pagination.totalItems);
    }
  }, [moderatorTeamsData]);

  const {
    data: moderatorTeamsByMonitorUserId,
    refetch: refetchMonitorTeams,
  } = useGetAllModeratorTeamsByMonitorUserIdQuery(undefined, { skip: userRole !== "Monitor" });

  const {
    data: teamData,
  } = useGetModeratorTeamByMemberUserIdQuery()
  // Add mutations
  const [addTeamMember] = useAddTeamMemberMutation();
  const [removeTeamMember] = useRemoveTeamMemberMutation();

  // Handle add member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) {
      toast.error("Please select a member");
      return;
    }

    try {
      const result = await addTeamMember({
        teamId: moderatorTeamData?.data?.[0]?._id,
        memberId: selectedMemberId,
      }).unwrap();

      if (result.status === true) {
        setShowAddMemberModal(false);
        setSelectedMemberId("");
        if (userRole === "Moderator") {
          refetchModeratorTeam && refetchModeratorTeam();
        }
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to add member");
      }
    } catch (error) {
      // Only show error if modal is still open and we haven't already handled success
      if (showAddMemberModal && selectedMemberId) {
        toast.error(error.data?.message || "An error occurred");
      }
    }
  };

  // Handle remove member
  const handleRemoveMember = async (memberId) => {
    let isSuccess = false;
    try {
      const result = await removeTeamMember({
        teamId: moderatorTeamData?.data?.[0]?._id,
        memberId,
      }).unwrap();

      if (result.status === true) {
        isSuccess = true;
        if (userRole === "Moderator") {
          refetchModeratorTeam && refetchModeratorTeam();
        }
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to remove member");
      }
    } catch (error) {
      // Only show error if we haven't already handled success
      if (!isSuccess) {
        toast.error(error.data?.message || "An error occurred");
      }
    }
  };

  // Handle page change for ReactPaginate
  const handlePageChange = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
  };

  const handleModeratorChange = useCallback((value) => {
    setFormData((prevData) => ({
      ...prevData,
      moderatorName: value,
    }));
  }, []);

  // Handle team member selection
  const handleTeamMemberSelect = useCallback(
    (memberId) => {
      setFormData((prevData) => {
        if (!prevData.moderatorTeamMembers.includes(memberId)) {
          return {
            ...prevData,
            moderatorTeamMembers: [...prevData.moderatorTeamMembers, memberId],
          };
        }
        return prevData;
      });
    },
    []
  );

  const handleTeamMemberRemove = (memberId) => {
    setFormData((prevData) => ({
      ...prevData,
      moderatorTeamMembers: prevData.moderatorTeamMembers.filter((id) => id !== memberId),
    }));
    setSelectedTeamMembers((prev) => prev.filter((member) => member._id !== memberId));
  };

  const handleTeamMemberSearch = useCallback((query) => {
    setTeamMemberSearch(query);
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
  const [createModeratorTeam] = useCreateModeratorTeamMutation();
  const [updateModeratorTeam] = useUpdateModeratorTeamMutation();
  const [deleteModeratorTeam] = useDeleteModeratorTeamMutation();

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
        const result = await updateModeratorTeam({
          id: editId,
          ...dataToSubmit,
        }).unwrap();

        if (result.status === true) {
          toast.success(result.message);
          handleCloseModal();
          if (userRole === "Monitor") {
            refetchMonitorTeams && refetchMonitorTeams();
          } else {
            refetchAllTeams && refetchAllTeams();
          }
        } else {
          toast.error(result.message || "Failed to update moderator team");
        }
      } else {
        const result = await createModeratorTeam(dataToSubmit).unwrap();

        if (result.status === true) {
          toast.success(result.message);
          handleCloseModal();
          if (userRole === "Monitor") {
            refetchMonitorTeams && refetchMonitorTeams();
          } else {
            refetchAllTeams && refetchAllTeams();
          }
        } else {
          toast.error(result.message || "Failed to create moderator team");
        }
      }
    } catch (error) {
      console.log("Update error:", error);
      if (showModal) {
        toast.error(error.data?.message || "An error occurred");
      }
    }
  };

  // Handle edit button click
  const handleEdit = (team) => {
    setFormData({
      districtName: team.districtName || "",
      upazilaName: team.upazilaName || "",
      moderatorName: team.moderatorName?._id || "",
      moderatorTeamName: team.moderatorTeamName || "",
      moderatorTeamMembers: Array.isArray(team.moderatorTeamMembers)
        ? team.moderatorTeamMembers.map((member) => member._id || member)
        : [],
    });
    setSelectedTeamMembers(
      team.moderatorTeamMembers?.map((member) => ({
        _id: member._id,
        name: member.name || "Unknown",
      })) || []
    );
    setDistrictName(team.districtName || "");
    setUpazilaName(team.upazilaName || "");
    setModeratorName(team.moderatorName?.name || "");
    setIsEditing(true);
    setEditId(team._id);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirmed = await deleteConfirm();
    if (!confirmed) return;

    try {
      const result = await deleteModeratorTeam(id).unwrap();
      if (result.status) {
        toast.success(result.message);
        refetchAllTeams && refetchAllTeams();
      } else {
        toast.error(result.message || "Failed to delete moderator team");
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
      moderatorName: "",
      moderatorTeamName: "",
      moderatorTeamMembers: [],
    });
    setSelectedTeamMembers([]);
    setDistrictName("");
    setUpazilaName("");
    setModeratorName("");
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
      moderatorName: "",
      moderatorTeamName: "",
      moderatorTeamMembers: [],
    });
    setSelectedTeamMembers([]);
    setDistrictName("");
    setUpazilaName("");
    setModeratorName("");
    setIsEditing(false);
    setEditId(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading moderator teams</div>;
  }

  return (
    <div className="container mx-auto mt-10 md:mt-0">
      {/* Moderator and Member View */}
      {(userRole === 'Moderator' || userRole === "Member") && (
        <div>
          <div>
            <h1 className="text-2xl font-bold text-center text-primary mb-6">
              {userRole === "Moderator" ? (
                <>
                  Moderator Team Of {upazilaName} Upazila/Thana
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You are moderating {moderatorTeamData?.data?.[0]?.moderatorTeamName}
                  </p>
                </>
              ) : (
                <>
                  Your Team: {teamData?.data?.[0]?.moderatorTeamName}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Moderated by {teamData?.data?.[0]?.moderatorName?.name}
                  </p>
                </>
              )}
            </h1>
          </div>
          <div className="flex justify-center">
            {userRole === "Moderator" ? (
              <ProfileCard
                id={moderatorData?._id}
                name={moderatorData?.name}
                phone={moderatorData?.phone}
                imageUrl={moderatorData?.profileImage}
                role={moderatorData?.role}
                isVerified={moderatorData?.isVerified}
                roleSuffix={moderatorData?.roleSuffix}
                bloodGroup={moderatorData?.bloodGroup}
                lastDonate={moderatorData?.lastDonate}
                nextDonationDate={moderatorData?.nextDonationDate}
              />
            ) : (
              <ProfileCard
                id={teamData?.data?.[0]?.moderatorName?._id}
                name={teamData?.data?.[0]?.moderatorName?.name}
                phone={teamData?.data?.[0]?.moderatorName?.phone}
                imageUrl={teamData?.data?.[0]?.moderatorName?.profileImage}
                role={teamData?.data?.[0]?.moderatorName?.role}
                isVerified={teamData?.data?.[0]?.moderatorName?.isVerified}
                roleSuffix={teamData?.data?.[0]?.moderatorName?.roleSuffix}
                bloodGroup={teamData?.data?.[0]?.moderatorName?.bloodGroup}
                lastDonate={teamData?.data?.[0]?.moderatorName?.lastDonate}
                nextDonationDate={teamData?.data?.[0]?.moderatorName?.nextDonationDate}
              />
            )}
          </div>
          {
            (userRole === "Moderator" ? teamMembers : teamData?.data?.[0]?.moderatorTeamMembers)?.length > 0 ? (
              <>
                <div className={`flex flex-col md:flex-row ${userRole === "Moderator" ? "justify-between" : "justify-center"} items-center`}>
                  <h1 className="text-2xl font-bold text-center text-primary my-6">
                    Team Members
                  </h1>
                  {userRole === "Moderator" && (
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="button"
                    >
                      Add Member
                    </button>
                  )}
                </div>

                <div
                  className={`grid gap-6 w-full mx-auto
                    ${
                      (userRole === "Moderator" ? teamMembers : teamData?.data?.[0]?.moderatorTeamMembers)?.length === 1
                        ? "grid-cols-1 max-w-md"
                        : (userRole === "Moderator" ? teamMembers : teamData?.data?.[0]?.moderatorTeamMembers)?.length === 2
                        ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    }`}
                >
                  {(userRole === "Moderator" ? teamMembers : teamData?.data?.[0]?.moderatorTeamMembers)?.map((member, index) => (
                    <div key={index} className="relative">
                      <ProfileCard
                        id={member?._id}
                        name={member?.name}
                        phone={member?.phone}
                        imageUrl={member?.profileImage}
                        role={member?.role}
                        isVerified={member?.isVerified}
                        roleSuffix={member?.roleSuffix}
                        bloodGroup={member?.bloodGroup}
                        lastDonate={member?.lastDonate}
                        nextDonationDate={member?.nextDonationDate}
                      />
                      {userRole === "Moderator" && (
                        <button
                          onClick={() => handleRemoveMember(member?._id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Stats Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-16">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-center">Team Name</h3>
                    <p className="text-2xl text-center">
                      {userRole === "Moderator" 
                        ? moderatorTeamData?.data?.[0]?.moderatorTeamName
                        : teamData?.data?.[0]?.moderatorTeamName}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-center">Total Members</h3>
                    <p className="text-2xl text-center">
                      {userRole === "Moderator"
                        ? teamMembers?.length
                        : teamData?.data?.[0]?.moderatorTeamMembers?.length}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-center text-primary my-6 mb-10">
                  No Team Members
                </h1>
                {userRole === "Moderator" && (
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="button"
                  >
                    Add Member
                  </button>
                )}
              </div>
            )
          }

          {/* Add Member Modal - Only for Moderator */}
          {userRole === "Moderator" && showAddMemberModal && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="bg-white p-8 rounded-lg w-full max-w-2xl mt-35 md:mt-0 border border-gray-300">
                <h2 className="text-2xl font-bold mb-4">Add New Member</h2>
                <form onSubmit={handleAddMember}>
                  <div className="mb-4">
                    <PersonSelector
                      onSelect={(value) => setSelectedMemberId(value)}
                      role="Member"
                      label="Select Member"
                      required={true}
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMemberModal(false);
                        setSelectedMemberId("");
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="button">
                      Add Member
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Monitor table */}
      {userRole === "Monitor" && (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-center md:text-start">Moderator Teams Management</h1>
            <button onClick={handleAddNew} className="button mt-2">
              Add New Moderator Team
            </button>
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
                      Moderator
                    </th>
                    <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Team Members
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(moderatorTeamsByMonitorUserId?.data || []).map((team) => (
                    <tr key={team._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {team.moderatorTeamName || "N/A"}
                              </div>
                              <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {team.moderatorName?.name || "Not provided"}
                              </div>
                              <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {team.moderatorName?.phone}
                              </div>
                      </td>
                      <td className="hidden text-center md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap">
                        {team.moderatorName?.name}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {team.moderatorName?.phone}
                        </div>
                      </td>
                      <td className="hidden text-center md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap">
                        {team.moderatorTeamMembers?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(team)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit className="inline" />
                        </button>
                        {/* No Delete button for Monitor */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Modal logic remains unchanged */}
          {showModal && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="bg-white p-8 rounded-lg w-full max-w-2xl mt-35 md:mt-0 border border-gray-300">
                <h2 className="text-2xl font-bold mb-4">
                  {isEditing ? "Edit Moderator Team" : "Add New Moderator Team"}
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
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={formData.moderatorTeamName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          moderatorTeamName: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter team name"
                    />
                  </div>

                  <div className="mb-4">
                    <PersonSelector
                      onSelect={handleModeratorChange}
                      initialValue={moderatorName}
                      role="Moderator"
                      label="Moderator"
                      required={true}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Team Members
                    </label>
                    <PersonSelector
                      onSelect={handleTeamMemberSelect}
                      role="Member"
                      label="Members"
                      required={false}
                      multiple={true}
                    />
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2">
                      Selected Team Members:
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTeamMembers.map((member) => (
                        <span
                          key={member._id}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          {member.name}
                          <button
                            type="button"
                            className="ml-1 text-red-500 hover:text-red-700"
                            onClick={() => handleTeamMemberRemove(member._id)}
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
            const canManage = ["Admin", "Head of IT & Media", "Upazila Coordinator", "Upazila Co-coordinator", "Monitor"].includes(userRole);

            return (
              <>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-center md:text-start">Moderator Teams Management</h1>
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
                      Add New Moderator Team
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
                            Moderator
                          </th>
                          <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Team Members
                          </th>
                          {canManage && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {moderatorTeams.map((team) => (
                          <tr key={team._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {team.moderatorTeamName || "N/A"}
                              </div>
                              <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {team.moderatorName?.name || "Not provided"}
                              </div>
                              <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {team.districtName}
                                <br />
                                {team.upazilaName}
                              </div>
                              <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {team.moderatorName?.phone}
                              </div>
                            </td>
                            <td className="hidden text-center md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap">
                              {team.moderatorName?.name}
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {team.moderatorName?.phone}
                              </div>
                            </td>
                            <td className="hidden text-center md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap">
                              {team.districtName}
                              <br />
                              {team.upazilaName}
                            </td>
                            <td className="hidden text-center md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap">
                              {team.moderatorTeamMembers?.length || 0}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-16">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-center">Total Teams</h3>
                    <p className="text-2xl text-center">{totalItems}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-center">Total Members</h3>
                    <p className="text-2xl text-center">{totalTeamMembers}</p>
                  </div>
                </div>

                {/* Modal */}
                {showModal && (
                  <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="bg-white p-8 rounded-lg w-full max-w-2xl mt-35 md:mt-0 border border-gray-300">
                      <h2 className="text-2xl font-bold mb-4">
                        {isEditing ? "Edit Moderator Team" : "Add New Moderator Team"}
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
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Team Name
                          </label>
                          <input
                            type="text"
                            value={formData.moderatorTeamName}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                moderatorTeamName: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter team name"
                          />
                        </div>

                        <div className="mb-4">
                          <PersonSelector
                            onSelect={handleModeratorChange}
                            initialValue={moderatorName}
                            role="Moderator"
                            label="Moderator"
                            required={true}
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Team Members
                          </label>
                          <PersonSelector
                            onSelect={handleTeamMemberSelect}
                            role="Member"
                            label="Members"
                            required={false}
                            multiple={true}
                          />
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2">
                            Selected Team Members:
                          </label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedTeamMembers.map((member) => (
                              <span
                                key={member._id}
                                className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1"
                              >
                                {member.name}
                                <button
                                  type="button"
                                  className="ml-1 text-red-500 hover:text-red-700"
                                  onClick={() => handleTeamMemberRemove(member._id)}
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

export default ModeratorTeamPage;
