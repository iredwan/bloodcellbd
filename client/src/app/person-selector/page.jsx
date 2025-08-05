'use client';

import TeamSelector from '@/components/TeamSelector';
import { useState, useCallback } from 'react';
import { useGetAllDistrictTeamsQuery } from '@/features/districtTeam/districtTeamApiSlice';

const PersonSelectorPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  
  // Fetch district team data with search query parameter
  const { 
    data: districtTeamData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetAllDistrictTeamsQuery({
    districtName: searchQuery,
  }, {
    skip: searchQuery.length < 2
  });
  
  // Extract team members from the API response
  const teamMembers = districtTeamData?.data?.districtTeams || [];
  
  // Format team data for display
  const formattedTeams = teamMembers.map(team => ({
    _id: team._id,
    name: team.name || team.districtName || 'Unknown',
    role: team.role || '',
    bloodGroup: team.bloodGroup || '',
  }));
  
  // Handle search input change from TeamSelector
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);
  
  // Handle team selection from TeamSelector
  const handleTeamSelect = useCallback((teamId) => {
    setSelectedTeamId(teamId);
    
    // Find the selected team member from the API response
    const selectedTeam = teamMembers.find(member => member._id === teamId);
    if (selectedTeam) {
      setSelectedTeamMember(selectedTeam);
      console.log('Selected team ID:', teamId);
    }
  }, [teamMembers]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">District Team Member Selector</h1>
      
      <div className="max-w-md">
        <TeamSelector
          teams={formattedTeams}
          onSearch={handleSearch}
          onTeamSelect={handleTeamSelect}
          label="Select District Team Member"
          placeholder="Search for a team member..."
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.data?.message || 'Error loading team data'}
          onRetry={refetch}
        />
      </div>
      
      {selectedTeamMember && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Selected Team Member Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Name:</p>
              <p className="font-medium">{selectedTeamMember.name || selectedTeamMember.districtName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Role:</p>
              <p className="font-medium">{selectedTeamMember.role || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Blood Group:</p>
              <p className="font-medium">{selectedTeamMember.bloodGroup || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">ID:</p>
              <p className="font-medium">{selectedTeamMember._id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonSelectorPage; 