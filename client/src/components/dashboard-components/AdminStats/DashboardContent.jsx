 "use client";

import React, { useState, useEffect, useRef } from 'react';
import { useGetAllUsersForAdminQuery } from '@/features/users/userApiSlice';
import StatsDisplay from '@/components/dashboard-components/AdminStats/StatsDisplay';
import CustomDatePicker from '@/components/DatePicker';
import CustomSelect from '@/components/CustomSelect';
import LocationSelector from '@/components/LocationSelector';
import { format, parse, subDays, subMonths, startOfDay } from 'date-fns';
import { useGetUserInfoQuery } from '@/features/userInfo/userInfoApiSlice';
import StatsDisplaySkeleton from '@/components/dashboard-components/dashboardSkeletons/StatsDisplaySkeleton';

const DashboardContent = () => {
  const [formData, setFormData] = useState({
    fromDate: '01/01/2025',
    toDate: '',
  });
  const [groupBy, setGroupBy] = useState('none');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [selectedRange, setSelectedRange] = useState('custom');
  const isDateRangeSelected = useRef(false);

  const { data: userInfoData, isLoading: isLoadingUserInfo } =
    useGetUserInfoQuery();

  const userRole = userInfoData?.user.role || "";
  const userDistrict = userInfoData?.user.district || "";
  const userUpazila = userInfoData?.user.upazila || "";

  const allowedRoles = ["Technician", "Member", "Moderator", "Monitor"];

  const upazilaCoordinators = ["Upazila Coordinator", "Upazila Co-coordinator", "Upazila IT & Media Coordinator", "Upazila Logistics Coordinator"]

  const districtCoordinators = ["District Coordinator", "District Co-coordinator", "District IT & Media Coordinator", "District Logistics Coordinator"]


  const admin = ["Divisional Coordinator", "Divisional Co-coordinator, Head of IT & Media", "Head of Logistics", "Admin"];

  const isAllowed = allowedRoles.includes(userRole);
  const isUpazilaCoordinator = upazilaCoordinators.includes(userRole);
  const isDistrictCoordinator = districtCoordinators.includes(userRole);
  const isAdmin = admin.includes(userRole);


  const dateRangeOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'Last 3 Months', value: '3months' },
    { label: 'Last 6 Months', value: '6months' },
    { label: 'Last 1 Year', value: '1year' },
    { label: 'Custom Range', value: 'custom' },
  ];

  useEffect(() => {
    if (userInfoData) {
      if (isDistrictCoordinator) {
        setDistrict(userDistrict);
      } else if (isUpazilaCoordinator || isAllowed) {
        setDistrict(userDistrict);
        setUpazila(userUpazila);
      }
    }
  }, [userInfoData, isDistrictCoordinator, isUpazilaCoordinator, isAllowed, userDistrict, userUpazila]);

  const handleDateRangeChange = (range) => {
    setSelectedRange(range);
    isDateRangeSelected.current = true;
    const today = new Date();
    let fromDate;
    let newGroupBy;

    switch (range) {
      case 'today':
        fromDate = startOfDay(today);
        newGroupBy = 'day';
        break;
      case '7days':
        fromDate = subDays(today, 7);
        newGroupBy = 'day';
        break;
      case '30days':
        fromDate = subDays(today, 30);
        newGroupBy = 'day';
        break;
      case '3months':
        fromDate = subMonths(today, 3);
        newGroupBy = 'month';
        break;
      case '6months':
        fromDate = subMonths(today, 6);
        newGroupBy = 'month';
        break;
      case '1year':
        fromDate = subMonths(today, 12);
        newGroupBy = 'month';
        break;
      default:
        isDateRangeSelected.current = false;
        return;
    }

    setFormData({
      fromDate: format(fromDate, 'dd/MM/yyyy'),
      toDate: format(today, 'dd/MM/yyyy'),
    });
    setGroupBy(newGroupBy);
  };

  const handleLocationChange = (locationData) => {
    if (isAdmin) {
      setDistrict(locationData.districtName || '');
      setUpazila(locationData.upazilaName || '');
    } else if (isDistrictCoordinator) {
      setUpazila(locationData.upazilaName || '');
    }
  };

  const handleDateChange = (newFormData) => {
    if (!isDateRangeSelected.current) {
      setSelectedRange('custom');
    }
    isDateRangeSelected.current = false;
    setFormData(newFormData);
  };

  const queryParams = {
    fromDate: formData.fromDate ? format(parse(formData.fromDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd') : undefined,
    toDate: formData.toDate ? format(parse(formData.toDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd') : undefined,
    groupBy: groupBy || undefined,
    district: isAdmin ? district : userDistrict || undefined,
    upazila: (isAdmin || isDistrictCoordinator) ? upazila : userUpazila || undefined,
  };

  const { data: statsData, isLoading, error } = useGetAllUsersForAdminQuery(queryParams, {
    skip: !userInfoData || (!isAdmin && !isDistrictCoordinator && !isUpazilaCoordinator && !isAllowed)
  });
  
  if (isLoading) {
    return (
      <StatsDisplaySkeleton/>
    );
  }
  if (!userInfoData) {
    return (
      <StatsDisplaySkeleton/>
    );
  }

  if (!isAdmin && !isDistrictCoordinator && !isUpazilaCoordinator && !isAllowed) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">You do not have permission to access this dashboard</div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading dashboard data</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-6 md:mt-0">
      <h1 className="text-2xl font-bold mb-6 text-primary">Admin Dashboard</h1>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-1">
          <CustomSelect
            label="Date Range"
            options={dateRangeOptions.map(option => option.label)}
            selected={dateRangeOptions.find(option => option.value === selectedRange)?.label || 'Custom Range'}
            setSelected={(label) => {
              const option = dateRangeOptions.find(opt => opt.label === label);
              if (option) {
                handleDateRangeChange(option.value);
              }
            }}
            placeholder="Select date range"
          />
        </div>
        <div>
          <CustomDatePicker
            label="From Date"
            name="fromDate"
            formData={formData}
            setFormData={handleDateChange}
            maxDate={formData.toDate ? parse(formData.toDate, 'dd/MM/yyyy', new Date()) : new Date()}
            className="w-full"
          />
        </div>
        <div>
          <CustomDatePicker
            label="To Date"
            name="toDate"
            formData={formData}
            setFormData={handleDateChange}
            minDate={formData.fromDate ? parse(formData.fromDate, 'dd/MM/yyyy', new Date()) : null}
            maxDate={new Date()}
            className="w-full"
          />
        </div>
        {(isAdmin || isDistrictCoordinator) && (
          <div className="lg:col-span-2">
            <LocationSelector
              onLocationChange={handleLocationChange}
              defaultDistrict={userDistrict}
              defaultUpazila={userUpazila}
              disableDistrictChange={!isAdmin}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Stats */}
        <div className="col-span-1 lg:col-span-2">
          <StatsDisplay data={statsData?.data} type="summary" chartType="bar" />
        </div>

        {/* User Stats */}
        <div className="col-span-1 lg:col-span-2">
          <StatsDisplay data={statsData?.data} type="users" chartType="composed" />
        </div>

        {/* Blood Group Stats */}
        <div className="col-span-1 lg:col-span-2">
          <StatsDisplay data={statsData?.data} type="bloodGroup" chartType="pie" />
        </div>

        {/* Timeline Stats */}
        {groupBy !== 'none' && (
          <div className="col-span-1 lg:col-span-2">
            <StatsDisplay data={statsData?.data} type="timeline" chartType="line" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;