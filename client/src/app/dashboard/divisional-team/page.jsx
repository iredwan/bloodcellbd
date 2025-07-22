'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { 
  useGetAllDivisionalTeamsQuery, 
  useCreateDivisionalTeamMutation,
  useUpdateDivisionalTeamMutation,
  useDeleteDivisionalTeamMutation
} from '@/features/divisionalTeam/divisionalTeamApiSlice';
import DivisionSelector from '@/components/DivisionSelector';
import PersonSelector from '@/components/PersonSelector';
import Pagination from '@/components/Pagination';
import deleteConfirm from '@/utils/deleteConfirm';
import { useGetUserInfoQuery } from '@/features/userInfo/userInfoApiSlice';
import TeamSelector from '@/components/TeamSelector';
import { useGetAllDistrictTeamsQuery } from '@/features/districtTeam/districtTeamApiSlice';

const DivisionalTeamPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    divisionID: '',
    divisionalCoordinatorID: '',
    divisionalCoCoordinatorID: '',
    districtTeamID: [],
  });
  const [selectedDistrictTeams, setSelectedDistrictTeams] = useState([]);
  const [districtTeamSearch, setDistrictTeamSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [initialDivisionName, setInitialDivisionName] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coCoordinatorName, setCoCoordinatorName] = useState('');

  // Fetch divisional teams data
  const { 
    data: divisionalTeamsData, 
    isLoading, 
    isError, 
    refetch 
  } = useGetAllDivisionalTeamsQuery();

  // Fetch district teams for TeamSelector
  const { data: districtTeamsData, isLoading: isDistrictTeamsLoading, isError: isDistrictTeamsError, refetch: refetchDistrictTeams } = useGetAllDistrictTeamsQuery(
    districtTeamSearch.length >= 2 ? { districtName: districtTeamSearch } : {},
    { skip: districtTeamSearch.length < 2 }
  );
  const allDistrictTeams = districtTeamsData?.data?.districtTeams || [];
  const formattedDistrictTeams = allDistrictTeams.map(team => ({
    _id: team._id,
    name: team.name || team.districtName || 'Unknown',
  }));

  // Get user info for role-based permissions
  const { data: userInfoData } = useGetUserInfoQuery();
  const userRole = userInfoData?.user?.role || '';

  // Mutations
  const [createDivisionalTeam, { isLoading: isCreating }] = useCreateDivisionalTeamMutation();
  const [updateDivisionalTeam, { isLoading: isUpdating }] = useUpdateDivisionalTeamMutation();
  const [deleteDivisionalTeam, { isLoading: isDeleting }] = useDeleteDivisionalTeamMutation();

  // Extract divisional teams from response
  const divisionalTeams = divisionalTeamsData?.data?.divisionalTeams || [];
  
  // Calculate pagination
  const totalPages = Math.ceil(divisionalTeams.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = divisionalTeams.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle form input changes - use useCallback to prevent infinite loops
  const handleDivisionChange = useCallback((value) => {
    setFormData(prevData => ({
      ...prevData,
      divisionID: value
    }));
  }, []);

  const handleCoordinatorChange = useCallback((value) => {
    setFormData(prevData => ({
      ...prevData,
      divisionalCoordinatorID: value
    }));
  }, []);

  const handleCoCoordinatorChange = useCallback((value) => {
    setFormData(prevData => ({
      ...prevData,
      divisionalCoCoordinatorID: value
    }));
  }, []);

  // Add handler for TeamSelector multi-select
  const handleDistrictTeamSelect = useCallback((teamId) => {
    setFormData(prevData => {
      // Only add if not already present
      if (!prevData.districtTeamID.includes(teamId)) {
        return { ...prevData, districtTeamID: [...prevData.districtTeamID, teamId] };
      }
      return prevData;
    });
    // Add to selectedDistrictTeams for display
    const team = formattedDistrictTeams.find(t => t._id === teamId);
    if (team && !selectedDistrictTeams.some(t => t._id === teamId)) {
      setSelectedDistrictTeams(prev => [...prev, team]);
    }
  }, [formattedDistrictTeams, selectedDistrictTeams]);

  const handleDistrictTeamRemove = (teamId) => {
    setFormData(prevData => ({
      ...prevData,
      districtTeamID: prevData.districtTeamID.filter(id => id !== teamId)
    }));
    setSelectedDistrictTeams(prev => prev.filter(t => t._id !== teamId));
  };

  const handleDistrictTeamSearch = useCallback((query) => {
    setDistrictTeamSearch(query);
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
        
        const result = await updateDivisionalTeam({ 
          id: editId, 
          ...dataToSubmit 
        }).unwrap();
        
        if (result.status) {
          toast.success(`${result.message}`);
          setShowModal(false);
          refetch();
        } else {
          toast.error(result.message || 'Failed to update divisional team');
        }
      } else {
        const result = await createDivisionalTeam(formData).unwrap();
        
        if (result.status) {
          toast.success(`${result.message}`);
          setShowModal(false);
          refetch();
        } else {
          toast.error(result.message || 'Failed to create divisional team');
        }
      }
    } catch (error) {
      toast.error(error.data?.message || 'An error occurred');
    }
  };

  // Handle edit button click
  const handleEdit = (team) => {
    setFormData({
      divisionID: team.divisionID?._id || '',
      divisionalCoordinatorID: team.divisionalCoordinatorID?._id || '',
      divisionalCoCoordinatorID: team.divisionalCoCoordinatorID?._id || '',
      districtTeamID: Array.isArray(team.districtTeamID) ? team.districtTeamID.map(dt => dt._id || dt) : [],
    });
    setInitialDivisionName(team.divisionID?.name || '');
    setCoordinatorName(team.divisionalCoordinatorID?.name || '');
    setCoCoordinatorName(team.divisionalCoCoordinatorID?.name || '');
    setSelectedDistrictTeams(
      Array.isArray(team.districtTeamID)
        ? team.districtTeamID.map(dt => ({
            _id: dt._id || dt,
            name: dt.name || dt.districtName || 'Unknown',
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
      title: 'Delete Divisional Team?',
      text: 'Are you sure you want to delete this divisional team? This action cannot be undone!',
      confirmButtonText: 'Yes, delete team',
    });
    
    if (confirmed) {
      try {
        const result = await deleteDivisionalTeam(id).unwrap();
        
        if (result.status) {
          toast.success(`${result.message}`);
          refetch();
        } else {
          toast.error(result.message || 'Failed to delete divisional team');
        }
      } catch (error) {
        toast.error(error.data?.message || 'An error occurred');
      }
    }
  };

  // Reset form when modal is opened for creating new team
  const handleAddNew = () => {
    setFormData({
      divisionID: '',
      divisionalCoordinatorID: '',
      divisionalCoCoordinatorID: '',
      districtTeamID: [],
    });
    setInitialDivisionName('');
    setCoordinatorName('');
    setCoCoordinatorName('');
    setSelectedDistrictTeams([]);
    setIsEditing(false);
    setEditId(null);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Check if user has permission to manage teams
  const canManageTeams = ['Admin', 'Head of IT & Media'].includes(userRole);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-1/4 mb-4 rounded"></div>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 w-full rounded"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading divisional teams. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Divisional Teams</h1>
        {canManageTeams && (
          <button
            onClick={handleAddNew}
            className="button"
          >
            Add New Divisional Team
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
                  Division
                </th>
                <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Coordinator
                </th>
                <th className="hidden lg:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Co-Coordinator
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  District Teams
                </th>
                {canManageTeams && (
                  <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 sm:px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    No divisional teams found
                  </td>
                </tr>
              ) : (
                currentItems.map((team) => (
                  <tr 
                    key={team._id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {team.divisionID?.name || 'N/A'}
                      </div>
                      {/* Mobile-only content */}
                      <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Coordinator: {team.divisionalCoordinatorID?.name || 'Not assigned'}
                      </div>
                      <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Co-Coordinator: {team.divisionalCoCoordinatorID?.name || 'Not assigned'}
                      </div>
                      <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                        District Teams: {team.districtTeamID?.length || 0}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {team.divisionalCoordinatorID?.name || 'Not assigned'}
                      </div>
                      {team.divisionalCoordinatorID?.bloodGroup && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Blood Group: {team.divisionalCoordinatorID.bloodGroup}
                        </div>
                      )}
                      {team.divisionalCoordinatorID?.phone && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                        Phone: {team.divisionalCoordinatorID.phone}
                       </div>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-4 py-3 sm:py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {team.divisionalCoCoordinatorID?.name || 'Not assigned'}
                      </div>
                      {team.divisionalCoCoordinatorID?.bloodGroup && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Blood Group: {team.divisionalCoCoordinatorID.bloodGroup}
                        </div>
                      )}
                      {team.divisionalCoCoordinatorID?.phone && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Phone: {team.divisionalCoCoordinatorID.phone}
                        </div>
                      )}
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {team.districtTeamID?.length || 0} district teams
                      </div>
                    </td>
                    {canManageTeams && (
                      <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(team);
                            }}
                            className="text-green-500 hover:text-green-700 transition-colors p-2 sm:p-1"
                            title="Edit Team"
                          >
                            <FaEdit className="text-base" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(team._id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 sm:p-1"
                            title="Delete Team"
                            disabled={isDeleting}
                          >
                            <FaTrash className="text-base" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-3 sm:px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              pageCount={totalPages}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md m-4 border border-gray-300 mt-35 md:mt-0">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {isEditing ? 'Edit Divisional Team' : 'Add New Divisional Team'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <DivisionSelector
                  initialDivisionId={formData.divisionID}
                  initialDivisionName={initialDivisionName}
                  onDivisionChange={handleDivisionChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <PersonSelector
                  label="Divisional Coordinator"
                  onSelect={handleCoordinatorChange}
                  initialValue={coordinatorName}
                />
              </div>
              
              <div className="mb-4">
                <PersonSelector
                  label="Divisional Co-Coordinator"
                  onSelect={handleCoCoordinatorChange}
                  initialValue={coCoordinatorName}
                />
              </div>
              
              <div className="mb-4">
                <TeamSelector
                  teams={formattedDistrictTeams}
                  onSearch={handleDistrictTeamSearch}
                  onTeamSelect={handleDistrictTeamSelect}
                  label="Add District Team(s)"
                  placeholder="Search district team ..."
                  isLoading={isDistrictTeamsLoading}
                  isError={isDistrictTeamsError}
                  errorMessage={isDistrictTeamsError ? 'Error loading district teams' : ''}
                  onRetry={refetchDistrictTeams}
                />
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2">
                  District Teams in {initialDivisionName} Divisional Team:
                </label>
                {/* Show selected district teams as chips/tags */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedDistrictTeams.map(team => (
                    <span key={team._id} className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                      {team.name}
                      <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleDistrictTeamRemove(team._id)}>
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button"
                  disabled={isCreating || isUpdating}
                >
                  {isEditing ? (isUpdating ? 'Updating...' : 'Update') : (isCreating ? 'Creating...' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DivisionalTeamPage;
