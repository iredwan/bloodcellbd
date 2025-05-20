'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { useGetAllRequestsQuery } from '@/features/requests/requestApiSlice';
import { useGetAllUsersForAdminQuery } from '@/features/users/userApiSlice';
import { IoMdPerson, IoMdWater } from 'react-icons/io';
import { MdEventAvailable, MdBloodtype } from 'react-icons/md';
import { FaHospital } from 'react-icons/fa';
import { format, sub, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import CustomSelect from '@/components/CustomSelect';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TIME_FILTERS = [
  'Today',
  'Last 7 Days',
  'Last 30 Days',
  'Last 3 Months',
  'Last 6 Months',
  'Last Year',
  'All Time'
];

// Map display names to values
const TIME_FILTER_VALUES = {
  'Today': 'today',
  'Last 7 Days': 'week',
  'Last 30 Days': 'month',
  'Last 3 Months': 'quarter',
  'Last 6 Months': 'half',
  'Last Year': 'year',
  'All Time': 'all'
};

export default function AdminDashboard() {
  // Use string display value for the CustomSelect component
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('Today');
  // Get the actual filter value from the display name
  const timeFilter = TIME_FILTER_VALUES[selectedTimeFilter] || 'today';

  const { data: requestsData = {}, isLoading: requestsLoading } = useGetAllRequestsQuery();
  const { data: usersData = {}, isLoading: usersLoading } = useGetAllUsersForAdminQuery();

  // Extract actual data arrays from the nested structure returned by both APIs
  // Both APIs return { status, data: [...], message } or { status, data: { users, totalUsers }, message }
  const requests = useMemo(() => {
    if (requestsData && requestsData.data && Array.isArray(requestsData.data)) {
      return requestsData.data;
    }
    return [];
  }, [requestsData]);
  
  const users = useMemo(() => {
    if (usersData && usersData.data && Array.isArray(usersData.data.users)) {
      return usersData.data.users;
    }
    return [];
  }, [usersData]);

  // Log the data structures for debugging
  useEffect(() => {
    console.log('Admin users data structure:', usersData);
    console.log('Extracted users array:', users);
    console.log('Requests data structure:', requestsData);
    console.log('Extracted requests array:', requests);
  }, [usersData, users, requestsData, requests]);

  // Calculate date ranges based on selected filter
  const filterDate = useMemo(() => {
    const today = new Date();
    switch (timeFilter) {
      case 'today':
        // Set to the start of today
        today.setHours(0, 0, 0, 0);
        return today;
      case 'week':
        return sub(today, { days: 7 });
      case 'month':
        return sub(today, { days: 30 });
      case 'quarter':
        return sub(today, { months: 3 });
      case 'half':
        return sub(today, { months: 6 });
      case 'year':
        return sub(today, { years: 1 });
      case 'all':
      default:
        return new Date(0); // Beginning of time
    }
  }, [timeFilter]);

  // Safely parse ISO date with error handling
  const safeParseDate = (dateString) => {
    try {
      if (!dateString) return null;
      return parseISO(dateString);
    } catch (error) {
      console.error(`Error parsing date: ${dateString}`, error);
      return null;
    }
  };

  // Filter data based on selected time range with error handling
  const filteredRequests = useMemo(() => {
    if (!requests || !Array.isArray(requests) || requests.length === 0) return [];
    
    return requests.filter(request => {
      if (!request || !request.createdAt) return false;
      const requestDate = safeParseDate(request.createdAt);
      return requestDate && requestDate >= filterDate;
    });
  }, [requests, filterDate]);

  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users) || users.length === 0) return [];
    
    return users.filter(user => {
      if (!user || !user.createdAt) return false;
      const registrationDate = safeParseDate(user.createdAt);
      return registrationDate && registrationDate >= filterDate;
    });
  }, [users, filterDate]);

  // Request status distribution for pie chart
  const requestStatusDistribution = useMemo(() => {
    if (!filteredRequests || filteredRequests.length === 0) return [];
    
    // Count requests by status
    const pending = filteredRequests.filter(req => req.status === 'pending').length;
    const fulfilled = filteredRequests.filter(req => req.status === 'fulfilled').length;
    const cancelled = filteredRequests.filter(req => req.status === 'cancelled').length;
    
    return [
      { name: 'Pending', value: pending, fill: '#FFBB28' },
      { name: 'Fulfilled', value: fulfilled, fill: '#00C49F' },
      { name: 'Cancelled', value: cancelled, fill: '#FF8042' }
    ].filter(item => item.value > 0);
  }, [filteredRequests]);

  // Statistics calculations with better error handling
  const stats = useMemo(() => {
    // Default values when data is loading or has errors
    if (requestsLoading || usersLoading || !Array.isArray(users) || !Array.isArray(requests)) {
      return {
        totalUsers: 0,
        newUsers: 0,
        totalRequests: 0,
        fulfilledRequests: 0,
        pendingRequests: 0,
        cancelledRequests: 0,
        fulfillmentRate: 0,
        pendingUsers: 0,
        bannedUsers: 0,
        approvedUsers: 0,
        requestsToday: 0
      };
    }

    const newUsers = filteredUsers.length;
    // Use filteredRequests to respect the time filter
    const totalRequests = filteredRequests.length;
    const fulfilledRequests = filteredRequests.filter(req => req.status === 'fulfilled').length;
    const pendingRequests = filteredRequests.filter(req => req.status === 'pending').length;
    const cancelledRequests = filteredRequests.filter(req => req.status === 'cancelled').length;
    
    // Count today's requests
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestsToday = requests.filter(req => {
      if (!req || !req.createdAt) return false;
      const requestDate = safeParseDate(req.createdAt);
      return requestDate && requestDate >= today;
    }).length;
    
    // Use filteredUsers instead of users to respect the time filter
    const pendingUsers = filteredUsers.filter(user => !user.isApproved).length;
    const bannedUsers = filteredUsers.filter(user => user.isBanned).length;
    const approvedUsers = filteredUsers.filter(user => user.isApproved && !user.isBanned).length;

    return {
      totalUsers: users.length,
      newUsers,
      totalRequests,
      fulfilledRequests,
      pendingRequests,
      cancelledRequests,
      fulfillmentRate: totalRequests > 0 ? (fulfilledRequests / totalRequests * 100).toFixed(1) : 0,
      pendingUsers,
      bannedUsers,
      approvedUsers,
      requestsToday
    };
  }, [users, filteredUsers, requests, filteredRequests, requestsLoading, usersLoading]);

  // Data preparation for charts with error handling
  const bloodGroupDistribution = useMemo(() => {
    if (!users || !Array.isArray(users) || users.length === 0) return [];

    // Count occurrences of each blood group
    const bloodCounts = {};
    BLOOD_GROUPS.forEach(group => bloodCounts[group] = 0);
    
    users.forEach(user => {
      if (user && user.bloodGroup && BLOOD_GROUPS.includes(user.bloodGroup)) {
        bloodCounts[user.bloodGroup]++;
      }
    });

    // Create data for chart
    return BLOOD_GROUPS.map(group => ({
      name: group,
      value: bloodCounts[group]
    })).filter(item => item.value > 0); // Only include groups with values
  }, [users]);

  // Data for blood group requests
  const bloodGroupRequestsDistribution = useMemo(() => {
    if (!filteredRequests || filteredRequests.length === 0) return [];

    // Count occurrences of each blood group in requests
    const bloodCounts = {};
    BLOOD_GROUPS.forEach(group => bloodCounts[group] = 0);
    
    filteredRequests.forEach(request => {
      if (request && request.bloodGroup && BLOOD_GROUPS.includes(request.bloodGroup)) {
        bloodCounts[request.bloodGroup]++;
      }
    });

    // Create data for chart
    return BLOOD_GROUPS.map(group => ({
      name: group,
      value: bloodCounts[group]
    })).filter(item => item.value > 0); // Only include groups with values
  }, [filteredRequests]);

  // Update userStatusDistribution to use filteredUsers
  const userStatusDistribution = useMemo(() => {
    if (!filteredUsers || !Array.isArray(filteredUsers) || filteredUsers.length === 0) return [];
    
    // Count users by status
    const approved = filteredUsers.filter(user => user.isApproved && !user.isBanned).length;
    const pending = filteredUsers.filter(user => !user.isApproved).length;
    const banned = filteredUsers.filter(user => user.isBanned).length;
    
    return [
      { name: 'Approved', value: approved, fill: '#82ca9d' },
      { name: 'Pending', value: pending, fill: '#ffbb28' },
      { name: 'Banned', value: banned, fill: '#ff8042' }
    ].filter(item => item.value > 0);
  }, [filteredUsers]);

  const requestTrends = useMemo(() => {
    if (!filteredRequests || filteredRequests.length === 0) return [];

    // Group requests by month with error handling
    const groupedByMonth = {};
    
    filteredRequests.forEach(request => {
      if (!request || !request.createdAt) return;
      
      try {
        const date = safeParseDate(request.createdAt);
        if (!date) return;
        
        const month = format(date, 'MMM yyyy');
        if (!groupedByMonth[month]) {
          groupedByMonth[month] = { 
            created: 0, 
            fulfilled: 0, 
            pending: 0,
            cancelled: 0
          };
        }
        
        groupedByMonth[month].created += 1;
        
        if (request.status === 'fulfilled') {
          groupedByMonth[month].fulfilled += 1;
        } else if (request.status === 'pending') {
          groupedByMonth[month].pending += 1;
        } else if (request.status === 'cancelled') {
          groupedByMonth[month].cancelled += 1;
        }
      } catch (error) {
        console.error('Error processing request data:', error);
      }
    });

    // Convert to array format for chart
    return Object.entries(groupedByMonth)
      .map(([month, data]) => ({
        month,
        created: data.created,
        fulfilled: data.fulfilled,
        pending: data.pending,
        cancelled: data.cancelled
      }))
      .sort((a, b) => {
        // Ensure dates are sorted chronologically
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        if (aYear !== bYear) {
          return parseInt(aYear) - parseInt(bYear);
        }
        
        return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth);
      });
  }, [filteredRequests]);

  // Add new calculation for religion distribution
  const religionDistribution = useMemo(() => {
    if (!filteredUsers || !Array.isArray(filteredUsers) || filteredUsers.length === 0) return [];
    
    // Count occurrences of each religion
    const religionCounts = {};
    
    filteredUsers.forEach(user => {
      if (user && user.religion) {
        const religion = user.religion;
        religionCounts[religion] = (religionCounts[religion] || 0) + 1;
      } else {
        // Count users with no religion specified as "Not Specified"
        religionCounts["Not Specified"] = (religionCounts["Not Specified"] || 0) + 1;
      }
    });

    // Create data for chart - convert the counts object to an array of objects
    return Object.entries(religionCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by count descending
  }, [filteredUsers]);

  if (requestsLoading || usersLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if we have any data to display
  const hasRequestData = filteredRequests && filteredRequests.length > 0;
  const hasUserData = filteredUsers && filteredUsers.length > 0;
  const hasBloodGroupData = bloodGroupDistribution && bloodGroupDistribution.length > 0;

  if (!hasUserData && !hasRequestData) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Analytics Dashboard</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-red-500">No Data Available</h2>
          <div className="space-y-4">
            <p>No users or requests data could be retrieved. This might be due to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>API server is not running or unreachable</li>
              <li>You are not logged in or don't have proper permissions</li>
              <li>There is no data in the database yet</li>
            </ul>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <p className="font-mono text-sm mb-2">API Response Structure:</p>
              <p className="font-mono text-sm">Users data: {JSON.stringify(usersData).substring(0, 100)}...</p>
              <p className="font-mono text-sm">Requests data: {JSON.stringify(requestsData).substring(0, 100)}...</p>
            </div>
            <button 
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => {
                window.location.reload();
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex md:flex-row flex-col justify-between items-center">
        <h1 className="text-2xl text-center font-bold text-gray-800 dark:text-white">Admin Analytics Dashboard</h1>
        <div className="w-64 mt-4 md:mt-0">
          <CustomSelect
            options={TIME_FILTERS}
            selected={selectedTimeFilter}
            setSelected={setSelectedTimeFilter}
            label="Time Period"
            placeholder="Filter by time"
          />
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<IoMdPerson className="text-blue-500" />} 
        />
        <StatCard 
          title="New Users" 
          value={stats.newUsers} 
          subtitle={`Since ${format(filterDate, 'PP')}`}
          icon={<IoMdPerson className="text-green-500" />} 
        />
        <StatCard 
          title="Approved Users" 
          value={stats.approvedUsers} 
          icon={<IoMdPerson className="text-green-500" />} 
        />
        <StatCard 
          title="Pending Users" 
          value={stats.pendingUsers}
          icon={<IoMdPerson className="text-yellow-500" />} 
        />
      </div>

      {/* Request Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Requests" 
          value={stats.totalRequests} 
          icon={<IoMdWater className="text-blue-500" />} 
        />
        <StatCard 
          title="Pending Requests" 
          value={stats.pendingRequests}
          icon={<IoMdWater className="text-yellow-500" />} 
        />
        <StatCard 
          title="Fulfilled Requests" 
          value={stats.fulfilledRequests}
          icon={<IoMdWater className="text-green-500" />} 
        />
        <StatCard 
          title="Today's Requests" 
          value={stats.requestsToday}
          icon={<IoMdWater className="text-purple-500" />} 
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Blood Request Trends">
          {hasRequestData ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={requestTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="created" stroke="#8884d8" name="Created" />
                <Line type="monotone" dataKey="fulfilled" stroke="#82ca9d" name="Fulfilled" />
                <Line type="monotone" dataKey="pending" stroke="#FFBB28" name="Pending" />
                <Line type="monotone" dataKey="cancelled" stroke="#FF8042" name="Cancelled" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No request data available for the selected time period
            </div>
          )}
        </ChartCard>

        <ChartCard title="Request Status In Selected Time Period">
          {hasRequestData ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {requestStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No request data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Blood Groups of Users">
          {hasBloodGroupData ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bloodGroupDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {bloodGroupDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No blood group data available for users
            </div>
          )}
        </ChartCard>

        <ChartCard title="Requested Blood Groups In Selected Time Period">
          {hasRequestData ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bloodGroupRequestsDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {bloodGroupRequestsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No blood group data available for requests
            </div>
          )}
        </ChartCard>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="User Registration In Selected Time Period">
          {hasUserData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getUserRegistrationData(users, timeFilter, safeParseDate)}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No user registration data available for the selected time period
            </div>
          )}
        </ChartCard>

        <ChartCard title="User Status In Selected Time Period">
          {hasUserData ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {userStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No user status data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Add new Charts Row 4 for religion distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="User Religion In Selected Time Period">
          {filteredUsers && filteredUsers.length > 0 && religionDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={religionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {religionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No religion data available for the selected time period
            </div>
          )}
        </ChartCard>
        
        {/* Leave space for another chart in the future */}
        <div className="lg:block hidden">
          {/* This space is intentionally left empty for future expansion */}
        </div>
      </div>
    </div>
  );
}

// Helper function to get user registration data by time period
function getUserRegistrationData(users, timeFilter, safeParseDate) {
  if (!users || !Array.isArray(users) || users.length === 0) return [];

  const today = new Date();
  const filterDate = (() => {
    switch (timeFilter) {
      case 'week': return sub(today, { days: 7 });
      case 'month': return sub(today, { days: 30 });
      case 'quarter': return sub(today, { months: 3 });
      case 'half': return sub(today, { months: 6 });
      case 'year': return sub(today, { years: 1 });
      default: return new Date(0);
    }
  })();

  // Format based on timeframe
  const formatString = timeFilter === 'week' ? 'EEE' 
    : timeFilter === 'month' || timeFilter === 'quarter' ? 'dd MMM' 
    : 'MMM yyyy';

  // Group users by date with error handling
  const groupedData = {};
  
  users.forEach(user => {
    if (!user || !user.createdAt) return;
    
    try {
      const createdDate = safeParseDate(user.createdAt);
      if (!createdDate || createdDate < filterDate) return;
      
      const date = format(createdDate, formatString);
      groupedData[date] = (groupedData[date] || 0) + 1;
    } catch (error) {
      console.error('Error processing user data:', error);
    }
  });

  // Convert to array format for the chart
  let result = Object.entries(groupedData)
    .map(([date, count]) => ({ date, count }));
    
  // Sort based on timeframe
  if (timeFilter === 'week') {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    result.sort((a, b) => daysOfWeek.indexOf(a.date) - daysOfWeek.indexOf(b.date));
  } else if (timeFilter === 'month' || timeFilter === 'quarter') {
    result.sort((a, b) => {
      const dayA = parseInt(a.date.split(' ')[0]);
      const dayB = parseInt(b.date.split(' ')[0]);
      return dayA - dayB;
    });
  } else {
    // For longer periods, sort by date
    result.sort((a, b) => {
      const [aMonth, aYear] = a.date.split(' ');
      const [bMonth, bYear] = b.date.split(' ');
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      if (aYear !== bYear) {
        return parseInt(aYear) - parseInt(bYear);
      }
      
      return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth);
    });
  }
  
  return result;
}

// Component for individual statistic cards
function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}

// Component for chart containers
function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}