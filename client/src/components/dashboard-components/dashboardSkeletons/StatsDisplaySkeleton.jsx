"use client";

import React from 'react';

const StatsDisplaySkeleton = ({ type = 'summary' }) => {
  const getTitle = () => {
    const titles = {
      summary: 'Summary Statistics',
      gender: 'Gender Distribution',
      bloodGroup: 'Blood Group Distribution',
      religion: 'Religion Distribution',
      timeline: 'Activity Timeline',
      users: 'User Statistics'
    };
    return titles[type] || 'Statistics';
  };

  const chartTypes = [
    { id: 'bar', label: 'Bar' },
    { id: 'line', label: 'Line' },
    { id: 'area', label: 'Area' },
    ...(type !== 'timeline' ? [{ id: 'pie', label: 'Pie' }] : []),
  ];

  return (
    <>
    <div className="container mx-auto p-4 mt-6 md:mt-0">
      {/* Title Skeleton */}
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      
      {/* Filters Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Date Range Selector Skeleton */}
        <div className="lg:col-span-1">
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-10 w-full bg-gray-100 dark:bg-gray-600 rounded-md"></div>
        </div>
        
        {/* From Date Picker Skeleton */}
        <div>
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-10 w-full bg-gray-100 dark:bg-gray-600 rounded-md"></div>
        </div>
        
        {/* To Date Picker Skeleton */}
        <div>
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-10 w-full bg-gray-100 dark:bg-gray-600 rounded-md"></div>
        </div>
        
        {/* Location Selectors Skeleton - Conditionally rendered */}
            <div className="lg:col-span-1">
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-10 w-full bg-gray-100 dark:bg-gray-600 rounded-md"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-10 w-full bg-gray-100 dark:bg-gray-600 rounded-md"></div>
            </div>
      </div>
    </div>

    <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-pulse">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 pb-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {getTitle()}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-1"></p>
        </div>
        
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {chartTypes.map((chart) => (
            <div
              key={chart.id}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-600 h-8 w-12"
            ></div>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-[600px] md:h-[400px] p-6">
        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-2"></div>
            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
          </div>
        </div>
      </div>
      
      {/* Stats footer */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="text-center">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
            </div>
          ))}
        </div>

      {/* Users stats footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="text-center">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
            </div>
          ))}
        </div>
    </div>
    </>
  );
};

export default StatsDisplaySkeleton;