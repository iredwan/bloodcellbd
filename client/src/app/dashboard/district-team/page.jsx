'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { 
  useGetAllDistrictTeamsQuery, 
  useCreateDistrictTeamMutation,
  useUpdateDistrictTeamMutation,
  useDeleteDistrictTeamMutation,
  useGetDistrictTeamByCoordinatorIdQuery
} from '@/features/districtTeam/districtTeamApiSlice';
import DistrictSelector from '@/components/DistrictSelector';
import PersonSelector from '@/components/PersonSelector';
import Pagination from '@/components/Pagination';
import deleteConfirm from '@/utils/deleteConfirm';
import { useGetUserInfoQuery } from '@/features/userInfo/userInfoApiSlice';
import TeamSelector from '@/components/TeamSelector';
import { useGetAllUpazilaTeamsQuery } from '@/features/upazilaTeam/upazilaTeamApiSlice';
import ProfileCard from '@/components/ProfileCard'

const DistrictTeamPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    districtId: '',
    districtCoordinatorID: '',
    districtCodinatorID: '',
    districtITMediaCoordinatorID: '',
    districtLogisticsCoordinatorID: '',
    upazilaTeamID: [],
  });
  const [selectedUpazilaTeams, setSelectedUpazilaTeams] = useState([]);
  const [upazilaTeamSearch, setUpazilaTeamSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [initialDistrictId, setInitialDistrictId] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coCoordinatorName, setCoCoordinatorName] = useState('');
  const [itMediaCoordinatorName, setITMediaCoordinatorName] = useState('');
  const [logisticsCoordinatorName, setLogisticsCoordinatorName] = useState('');
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const [districtNameSearch, setDistrictNameSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch district teams data with pagination parameters
  const { 
    data: districtTeamsData, 
    isLoading, 
    isError, 
    refetch 
  } = useGetAllDistrictTeamsQuery({
    districtName: districtNameSearch.length >= 2 ? districtNameSearch : undefined,
    page: currentPage,
    limit: itemsPerPage
  });

  // Get user info for role-based permissions
  const { data: userInfoData } = useGetUserInfoQuery();
  const userRole = userInfoData?.user?.role || '';

  const {
    data: districtCoordinatorsData,
    isLoading: isDistrictLoading,
    isError: isDistrictError,
    error: districtError
  } = useGetDistrictTeamByCoordinatorIdQuery(undefined, {
    skip: userRole !== "District Coordinator" && userRole !== "District Co-coordinator"
  });

    const districtCoordinatorsDataArray = districtCoordinatorsData?.data[0]
    const districtName = districtCoordinatorsDataArray?.districtName
    const districtCoordinatorData = districtCoordinatorsDataArray?.districtCoordinatorID
    const districtCoCoordinatorData = districtCoordinatorsDataArray?.districtCoCoordinatorID
    const districtITMediaCoordinatorData = districtCoordinatorsDataArray?.districtITMediaCoordinatorID
    const districtLogisticsCoordinatorData = districtCoordinatorsDataArray?.districtLogisticsCoordinatorID

  

  // Mutations
  const [createDistrictTeam, { isLoading: isCreating }] = useCreateDistrictTeamMutation();
  const [updateDistrictTeam, { isLoading: isUpdating }] = useUpdateDistrictTeamMutation();
  const [deleteDistrictTeam, { isLoading: isDeleting }] = useDeleteDistrictTeamMutation();

  // Extract district teams from response
  const districtTeams = districtTeamsData?.data?.districtTeams || [];
  
  // Update total pages and items from API response
  useEffect(() => {
    if (districtTeamsData?.data?.pagination) {
      setTotalPages(districtTeamsData.data.pagination.totalPages);
      setTotalItems(districtTeamsData.data.pagination.totalItems);
    }
  }, [districtTeamsData]);
  
  // Handle page change
  const handlePageChange = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setDistrictNameSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Fetch azila teams for TeamSelector
  const { data: upazilaTeamsData, isLoading: isUpazilaTeamsLoading, isError: isUpazilaTeamsError, refetch: refetchUpazilaTeams } = useGetAllUpazilaTeamsQuery(
    upazilaTeamSearch.length >= 2 ? { districtName:formData.districtName, upazilaName: upazilaTeamSearch } : {},
    { skip: upazilaTeamSearch.length < 2 }
  );
  const allUpazilaTeams = upazilaTeamsData?.data?.upazilaTeams || [];
  const formattedUpazilaTeams = allUpazilaTeams.map(team => ({
    _id: team._id,
    name: team.name || team.upazilaName || 'Unknown',
  }));

  // Handle form input changes
  const handleDistrictChange = useCallback((district) => {
    setFormData(prevData => ({
      ...prevData,
      districtId: district || ''
    }));
  }, []);

  const handleCoordinatorChange = useCallback((value) => {
    setFormData(prevData => ({
      ...prevData,
      districtCoordinatorID: value
    }));
  }, []);

  const handleCoCoordinatorChange = useCallback((value) => {
    setFormData(prevData => ({
      ...prevData,
      districtCoCoordinatorID: value
    }));
  }, []);

  const handleITMediaCoordinatorChange = useCallback((value) => {
    setFormData(prevData => ({
      ...prevData,
      districtITMediaCoordinatorID: value
    }));
  }, []);

  const handleLogisticsCoordinatorChange = useCallback((value) => {
    setFormData(prevData => ({
      ...prevData,
      districtLogisticsCoordinatorID: value
    }));
  }, []);

  // Add handler for TeamSelector multi-select
  const handleUpazilaTeamSelect = useCallback((teamId) => {
    setFormData(prevData => {
      // Only add if not already present
      if (!prevData.upazilaTeamID.includes(teamId)) {
        return { ...prevData, upazilaTeamID: [...prevData.upazilaTeamID, teamId] };
      }
      return prevData;
    });
    // Add to selectedUpazilaTeams for display
    const team = formattedUpazilaTeams.find(t => t._id === teamId);
    if (team && !selectedUpazilaTeams.some(t => t._id === teamId)) {
      setSelectedUpazilaTeams(prev => [...prev, team]);
    }
  }, [formattedUpazilaTeams, selectedUpazilaTeams]);

  const handleUpazilaTeamRemove = (teamId) => {
    setFormData(prevData => ({
      ...prevData,
      upazilaTeamID: prevData.upazilaTeamID.filter(id => id !== teamId)
    }));
    setSelectedUpazilaTeams(prev => prev.filter(t => t._id !== teamId));
  };

  const handleUpazilaTeamSearch = useCallback((query) => {
    setUpazilaTeamSearch(query);
  }, []);

  // Prepare data for API submission - filter out empty fields to prevent nullifying existing values
  const prepareDataForSubmission = (data) => {
    const submissionData = { ...data };
    
    // Only include fields that have values
    Object.keys(submissionData).forEach(key => {
      if (!submissionData[key]) {
        delete submissionData[key];
      }
    });
    
    return submissionData;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Only send fields that have values to prevent nullifying existing data
        const dataToSubmit = prepareDataForSubmission(formData);
        
        const result = await updateDistrictTeam({ 
          id: editId, 
          ...dataToSubmit 
        }).unwrap();
        
        if (result.status) {
          toast.success(`${result.message}`);
          setShowModal(false);
          refetch();
        } else {
          toast.error(result.message || 'Failed to update district team');
        }
      } else {
        const result = await createDistrictTeam(formData).unwrap();
        
        if (result.status) {
          toast.success(`${result.message}`);
          setShowModal(false);
          refetch();
        } else {
          toast.error(result.message || 'Failed to create district team');
        }
      }
    } catch (error) {
      toast.error(error.data?.message || 'An error occurred');
    }
  };
  
  // Handle edit button click
  const handleEdit = (team) => {
    setFormData({
      districtName: team.districtName || '',
      districtCoordinatorID: team.districtCoordinatorID?._id || '',
      districtCoCoordinatorID: team.districtCoCoordinatorID?._id || '',
      districtITMediaCoordinatorID: team.districtITMediaCoordinatorID?._id || '',
      districtLogisticsCoordinatorID: team.districtLogisticsCoordinatorID?._id || '',
      upazilaTeamID: Array.isArray(team.upazilaTeamID) ? team.upazilaTeamID.map(ut => ut._id || ut) : [],
    });
    setInitialDistrictId(team.districtName || '');
    setCoordinatorName(team.districtCoordinatorID?.name || '');
    setCoCoordinatorName(team.districtCoCoordinatorID?.name || '');
    setITMediaCoordinatorName(team.districtITMediaCoordinatorID?.name || '');
    setLogisticsCoordinatorName(team.districtLogisticsCoordinatorID?.name || '');
    setSelectedUpazilaTeams(
      Array.isArray(team.upazilaTeamID)
        ? team.upazilaTeamID.map(ut => ({
            _id: ut._id || ut,
            name: ut.name || ut.upazilaName || 'Unknown',
          }))
        : []
    );
    setIsEditing(true);
    setEditId(team._id);
    setShowModal(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    const confirmed = await deleteConfirm({
      title: 'Delete District Team?',
      text: 'Are you sure you want to delete this district team? This action cannot be undone!',
      confirmButtonText: 'Yes, delete team',
    });
    
    if (confirmed) {
      try {
        const result = await deleteDistrictTeam(id).unwrap();
        
        if (result.status) {
          toast.success(`${result.message}`);
          refetch();
        } else {
          toast.error(result.message || 'Failed to delete district team');
        }
      } catch (error) {
        toast.error(error.data?.message || 'An error occurred');
      }
    }
  };

  // Reset form when modal is opened for creating new team
  const handleAddNew = () => {
    setFormData({
      districtName: '',
      districtCoordinatorID: '',
      districtCoCoordinatorID: '',
      districtITMediaCoordinatorID: '',
      districtLogisticsCoordinatorID: '',
      upazilaTeamID: [],
    });
    setInitialDistrictId('');
    setCoordinatorName('');
    setCoCoordinatorName('');
    setITMediaCoordinatorName('');
    setLogisticsCoordinatorName('');
    setSelectedUpazilaTeams([]);
    setIsEditing(false);
    setEditId(null);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Check if user has permission to manage teams
  const canManageTeams = ['Admin', 'Head of IT & Media', 'Divisional Coordinator', 'Divisional Co-Coordinator'].includes(userRole);
  const districtCoordinator = ['District Coordinator', 'District Co-Coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator'].includes(userRole);


  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading district teams. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4">
      {canManageTeams &&( 
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
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">District Teams</h1>
        <div className="relative flex flex-col">
            <label className="mb-1 text-sm font-medium text-center md:text-left text-gray-700 dark:text-gray-300">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search with district name"
                value={districtNameSearch}
                onChange={handleSearchChange}
                className="w-full px-4 py-2.5 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <FaSearch className="absolute left-3 top-4 text-gray-400" />                                                     
            </div>
            <p className="text-sm text-center md:text-left text-gray-500 dark:text-gray-400 pt-2">
              Total Results: {totalItems}
            </p>
          </div>
        {canManageTeams && (
          <button
            onClick={handleAddNew}
            className="button"
          >
            Add New District Team
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
                  District
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
                  Upazila Teams
                </th>
                {canManageTeams && (
                  <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {districtTeams.length > 0 ? (
                districtTeams.map((team) => (
                  <tr key={team._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 sm:px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {team.districtName || 'N/A'}
                      </div>
                      <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Coordinator: {team.districtCoordinatorID?.name || 'Not provided'}
                      </div>
                      <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Phone: {team.districtCoordinatorID?.phone || 'Not provided'}
                      </div>
                      <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Police Station Team: {team.upazilaTeamID?.length || 0}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {team.districtCoordinatorID?.name || 'Not assigned'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Phone: {team.districtCoordinatorID?.phone || 'Not provided'}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {team.districtCoCoordinatorID?.name || 'Not assigned'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Phone: {team.districtCoCoordinatorID?.phone || 'Not provided'}
                      </div>
                    </td>
                    <td className="hidden xl:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {team.districtITMediaCoordinatorID?.name || 'Not assigned'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Phone: {team.districtITMediaCoordinatorID?.phone || 'Not provided'}
                      </div>
                    </td>
                    <td className="hidden xl:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {team.districtLogisticsCoordinatorID?.name || 'Not assigned'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Phone: {team.districtLogisticsCoordinatorID?.phone || 'Not provided'}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {team.upazilaTeamID?.length || 0}
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
                  <td colSpan={canManageTeams ? 7 : 6} className="px-3 sm:px-4 py-4 text-center text-gray-500 dark:text-gray-300">
                    No district teams found
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
                {isEditing ? 'Edit District Team' : 'Add New District Team'}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                {/* District Selector */}
                <div className="mb-4">
                  <DistrictSelector
                    onDistrictChange={handleDistrictChange}
                    initialDistrict={initialDistrictId}
                    label="Select District"
                    required={true}
                  />
                </div>

                {/* District Coordinator */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    District Coordinator <span className="text-red-500">*</span>
                  </label>
                  <PersonSelector 
                    onSelect={handleCoordinatorChange}
                    initialValue={coordinatorName}
                    required={true}
                  />
                </div>

                {/* District Co-Coordinator */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    District Co-Coordinator
                  </label>
                  <PersonSelector 
                    onSelect={handleCoCoordinatorChange}
                    initialValue={coCoordinatorName}
                  />
                </div>

                {/* District IT & Media Coordinator */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    District IT & Media Coordinator
                  </label>
                  <PersonSelector 
                    onSelect={handleITMediaCoordinatorChange}
                    initialValue={itMediaCoordinatorName}
                  />
                </div>

                {/* District Logistics Coordinator */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    District Logistics Coordinator
                  </label>
                  <PersonSelector 
                    onSelect={handleLogisticsCoordinatorChange}
                    initialValue={logisticsCoordinatorName}
                  />
                </div>

                {/* Upazila Teams */}
                <div className="mb-4">
                  <TeamSelector
                    teams={formattedUpazilaTeams}
                    onSearch={handleUpazilaTeamSearch}
                    onTeamSelect={handleUpazilaTeamSelect}
                    label="Add Upazila Team(s)"
                    placeholder="Search upazila team ..."
                    isLoading={isUpazilaTeamsLoading}
                    isError={isUpazilaTeamsError}
                    errorMessage={isUpazilaTeamsError ? 'Error loading upazila teams' : ''}
                    onRetry={refetchUpazilaTeams}
                  />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2">
                    Upazila Teams in {initialDistrictId} District Team:
                  </label>
                  {/* Show selected upazila teams as chips/tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUpazilaTeams.map(team => (
                      <span key={team._id} className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                        {team.name}
                        <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleUpazilaTeamRemove(team._id)}>
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
                  {isCreating || isUpdating ? 'Saving...' : isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </>
      )}

      {districtCoordinator && (
        <div className='mx-auto'>
          {isDistrictLoading ? (
            <div className="flex justify-center">Loading...</div>
          ) : (
            <div>

            {/* District Name */}
            <div>
              <h1 className='text-2xl font-bold text-center text-primary mb-6'>Coordinatos Of {districtName} District</h1>
            </div>

            {/* District coordinator */}
            {districtCoordinatorsDataArray && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 border-b-2 border-gray-200 dark:border-gray-700 pb-8">
            {/* District Coordinator */}
            <ProfileCard
              id={districtCoordinatorData?._id || "Not assigned"}
              imageUrl={districtCoordinatorData?.profileImage || ""}
              name={districtCoordinatorData?.name || "Not assigned"}
              isVerified={
                districtCoordinatorData?.isVerified || false
              }
              role="District Coordinator"
              roleSuffix={districtCoordinatorData?.roleSuffix || ""}
              bloodGroup={
                districtCoordinatorData?.bloodGroup || "N/A"
              }
              phone={
                districtCoordinatorData?.phone || "Not assigned"
              }
            />

            {/* District Co-Coordinator */}
            {districtCoCoordinatorData && (
              <ProfileCard
                id={
                  districtCoCoordinatorData?._id || "Not assigned"
                }
                imageUrl={
                  districtCoCoordinatorData?.profileImage || ""
                }
                name={
                  districtCoCoordinatorData?.name || "Not assigned"
                }
                isVerified={
                  districtCoCoordinatorData?.isVerified || false
                }
                role="District Co-Coordinator"
                roleSuffix={
                  districtCoCoordinatorData?.roleSuffix || ""
                }
                bloodGroup={
                  districtCoCoordinatorData?.bloodGroup || "N/A"
                }
                phone={
                  districtCoCoordinatorData?.phone || "Not assigned"
                }
              />
            )}

            {/* District IT Media Coordinator */}
            {districtITMediaCoordinatorData && (
              <ProfileCard
                id={
                  districtITMediaCoordinatorData?._id ||
                  "Not assigned"
                }
                imageUrl={
                  districtITMediaCoordinatorData?.profileImage || ""
                }
                name={
                  districtITMediaCoordinatorData?.name ||
                  "Not assigned"
                }
                isVerified={
                  districtITMediaCoordinatorData?.isVerified || false
                }
                role="District IT & Media Coordinator"
                roleSuffix={
                  districtITMediaCoordinatorData?.roleSuffix || ""
                }
                bloodGroup={
                  districtITMediaCoordinatorData?.bloodGroup || "N/A"
                }
                phone={
                  districtITMediaCoordinatorData?.phone ||
                  "Not assigned"
                }
              />
            )}

            {/* District Logistics Coordinator */}
            <div className="lg:col-start-2">
              {districtLogisticsCoordinatorData && (
                <ProfileCard
                  id={
                    districtLogisticsCoordinatorData?._id ||
                    "Not assigned"
                  }
                  imageUrl={
                    districtLogisticsCoordinatorData?.profileImage ||
                    ""
                  }
                  name={
                    districtLogisticsCoordinatorData?.name ||
                    "Not assigned"
                  }
                  isVerified={
                    districtLogisticsCoordinatorData?.isVerified ||
                    false
                  }
                  role="District Logistics Coordinator"
                  roleSuffix={
                    districtLogisticsCoordinatorData?.roleSuffix ||
                    ""
                  }
                  bloodGroup={
                    districtLogisticsCoordinatorData?.bloodGroup ||
                    "N/A"
                  }
                  phone={
                    districtLogisticsCoordinatorData?.phone ||
                    "Not assigned"
                  }
                />
              )}
            </div>
          </div>
        )}

        <div className="mt-5 bg-primary p-4 w-full">
          <h1 className='text-white text-2xl font-bold text-center'>{districtCoordinatorsDataArray.upazilaTeamID.length} Upazila Team In {districtName} District</h1>
          <div className='flex justify-center my-4'>
          <button 
          onClick={() => router.push(`/dashboard/upazila-team`)}
          className='text-white border-2 border-white rounded-full py-2 px-3 hover:bg-white hover:text-red-800 cursor-pointer'>
            <FaEdit className='w-4 h-4 inline-block mr-2'/>
            Edit Upazila Team</button>
          </div>
        </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DistrictTeamPage;
