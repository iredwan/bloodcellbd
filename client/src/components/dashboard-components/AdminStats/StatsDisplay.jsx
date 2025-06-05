"use client";

import React, { useState, useEffect} from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

const StatsDisplay = ({ data, type = 'summary', initialChartType = 'bar' }) => {
  const [activeChart, setActiveChart] = useState(initialChartType);
  
  if (!data) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="text-center p-6">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
          <h3 className="text-gray-500 font-medium">No data available</h3>
          <p className="text-gray-400 text-sm mt-1">Select a different time range or filters</p>
        </div>
      </div>
    );
  }

 const chartTypes = [
    // Always show these chart types
    { id: 'bar', label: 'Bar' },
    { id: 'line', label: 'Line' },
    { id: 'area', label: 'Area' },
    
    // Exclude pie chart for 'timeline'
    ...(type !== 'timeline' ? [{ id: 'pie', label: 'Pie' }] : []),
];

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

  const renderNoData = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
      <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <h3 className="font-medium mb-1">No chart data available</h3>
      <p className="text-sm">Try selecting different filters or time range</p>
    </div>
  );

  const renderSummaryChart = () => {
    const summaryData = [
      { name: 'Total Requests', value: data.summary.totalRequests },
      { name: 'Fulfilled', value: data.summary.fulfilledRequests },
      { name: 'Pending', value: data.summary.pendingRequests },
      { name: 'Processing', value: data.summary.processingRequests },
      { name: 'Cancelled', value: data.summary.cancelledRequests },
    ];

    if (activeChart === 'pie') {
      return (
        <PieChart>
          <Pie
            data={summaryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            stroke="none"
          >
            {summaryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px' }}
          />
        </PieChart>
      );
    }

    if (activeChart === 'line') {
      return (
        <LineChart data={summaryData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px' }}
          />
          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      );
    }

    if (activeChart === 'area') {
      return (
        <AreaChart data={summaryData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px' }}
          />
          <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
        </AreaChart>
      );
    }

    return (
      <BarChart
        data={summaryData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barSize={32}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {summaryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    );
  };


  const renderBloodGroupChart = () => {
    if (!data.bloodGroupStats || data.bloodGroupStats.length === 0) {
      return renderNoData();
    }

    if (activeChart === 'pie') {
      return (
        <PieChart>
          <Pie
            data={data.bloodGroupStats}
            dataKey="count"
            nameKey="bloodGroup"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            label={({ bloodGroup, percent }) => `${bloodGroup}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            stroke="none"
          >
            {data.bloodGroupStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px' }}
          />
        </PieChart>
      );
    }

    if (activeChart === 'line') {
      return (
        <LineChart data={data.bloodGroupStats}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis dataKey="bloodGroup" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px' }}
          />
          <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      );
    }

    if (activeChart === 'area') {
      return (
        <AreaChart data={data.bloodGroupStats}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis dataKey="bloodGroup" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px' }}
          />
          <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
        </AreaChart>
      );
    }

    return (
      <BarChart
        data={data.bloodGroupStats}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barSize={32}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis dataKey="bloodGroup" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.bloodGroupStats.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    );
  };


  const renderTimelineChart = () => {
    if (!data.timelineStats || data.timelineStats.length === 0) {
      return renderNoData();
    }

    if (activeChart === 'line') {
      return (
        <LineChart data={data.timelineStats}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tickMargin={10}
          />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px' }}
          />
          <Line 
            type="monotone" 
            dataKey="newUsers" 
            stroke="#3B82F6" 
            name="New Users" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="totalRequests" 
            stroke="#10B981" 
            name="Total Requests" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="fulfilledRequests" 
            stroke="#F59E0B" 
            name="Fulfilled Requests" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      );
    }

    if (activeChart === 'area') {
      return (
        <AreaChart data={data.timelineStats}>
          <defs>
            <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorTotalRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorFulfilled" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tickMargin={10}
          />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px' }}
          />
          <Area 
            type="monotone" 
            dataKey="newUsers" 
            stroke="#3B82F6" 
            fillOpacity={1} 
            fill="url(#colorNewUsers)" 
            name="New Users"
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="totalRequests" 
            stroke="#10B981" 
            fillOpacity={1} 
            fill="url(#colorTotalRequests)" 
            name="Total Requests"
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="fulfilledRequests" 
            stroke="#F59E0B" 
            fillOpacity={1} 
            fill="url(#colorFulfilled)" 
            name="Fulfilled Requests"
            strokeWidth={2}
          />
        </AreaChart>
      );
    }

    // Default to bar chart for timeline if not line/area
    const timelineBarData = data.timelineStats.map(entry => ({
      date: entry.date,
      'New Users': entry.newUsers,
      'Total Requests': entry.totalRequests,
      'Fulfilled': entry.fulfilledRequests,
    }));

    return (
      <BarChart
        data={timelineBarData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ paddingTop: '16px' }}
        />
        <Bar dataKey="New Users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Total Requests" fill="#10B981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Fulfilled" fill="#F59E0B" radius={[4, 4, 0, 0]} />
      </BarChart>
    );
  };

  const renderUsersChart = () => {
    if (!data.summary || !data.genderStats || !data.religionStats) {
      return renderNoData();
    }

    const genderData = [
      { name: 'Male', value: data.genderStats.male },
      { name: 'Female', value: data.genderStats.female },
      { name: 'Others', value: data.genderStats.others },
    ];

    const religionData = Object.entries(data.religionStats).map(([name, value]) => ({
      name,
      value,
    }));

    if (activeChart === 'pie') {
      return (
        <div className="flex justify-center w-full mb-8">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 px-4">
            <div className="w-full h-[240px] mb-4">
              <h4 className="text-center text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Gender Distribution</h4>
              <div className="h-[200px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      stroke="none"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-full h-[240px] mb-4">
              <h4 className="text-center text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Religion Distribution</h4>
              <div className="h-[200px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={religionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      stroke="none"
                    >
                      {religionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index + 3]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const barData = [
      { name: 'Total Users', value: data.summary.totalUsers, color: '#3B82F6' },
      ...genderData.map((item, index) => ({ ...item, color: COLORS[index + 1] })),
      ...religionData.map((item, index) => ({ ...item, color: COLORS[index + 4] }))
    ];

    if (activeChart === 'line') {
      return (
        <LineChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px' }}
          />
          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      );
    }

    if (activeChart === 'area') {
      return (
        <AreaChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px' }}
          />
          <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
        </AreaChart>
      );
    }

    return (
      <BarChart
        data={barData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barSize={32}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ paddingTop: '16px' }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {barData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'summary': return renderSummaryChart();
      case 'bloodGroup': return renderBloodGroupChart();
      case 'timeline': return renderTimelineChart();
      case 'users': return renderUsersChart();
      default: return null;
    }
  };

  const hasChartData = () => {
    switch (type) {
      case 'summary': return !!data.summary;
      case 'gender': return !!data.genderStats;
      case 'bloodGroup': return !!data.bloodGroupStats && data.bloodGroupStats.length > 0;
      case 'religion': return !!data.religionStats && Object.keys(data.religionStats).length > 0;
      case 'timeline': return !!data.timelineStats && data.timelineStats.length > 0;
      case 'users': return !!data.summary && !!data.genderStats && !!data.religionStats;
      default: return false;
    }
  };

  const [lastUpdateTime] = useState(new Date()); // Set once on mount
  const [now, setNow] = useState(new Date()); // Changes every X seconds

  // Update "now" every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000); // 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const getLastUpdateTime = (pastTime) => {
    const diffMins = Math.floor((now - pastTime) / 60000);
    if (diffMins < 1) return "Just now";
    return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
  {/* Header */}
  <div className="flex flex-wrap items-center justify-between gap-4 p-6 pb-0">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {getTitle()}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Last updated: {getLastUpdateTime(lastUpdateTime)}
      </p>
    </div>
    
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
      {chartTypes.map((chart) => (
        <button
          key={chart.id}
          onClick={() => setActiveChart(chart.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeChart === chart.id 
              ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
          }`}
        >
          {chart.label}
        </button>
      ))}
    </div>
  </div>

  {/* Chart container */}
  <div className="w-full h-[600px] md:h-[400px] p-6">
    {hasChartData() ? (
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    ) : renderNoData()}
  </div>
  
  {/* Stats footer */}
  {type === 'summary' && data.summary && (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      {Object.entries(data.summary)
        .filter(([key]) => key !== 'totalUsers')
        .map(([key, value], index) => (
          <div key={key} className="text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {value}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
              {key.replace(/([A-Z])/g, ' $1').replace(/\b\w/g, l => l.toUpperCase()).trim()}
            </p>
          </div>
        ))}
    </div>
  )}

{/* users stats footer */}
{type === 'users' && data.summary && data.genderStats && data.religionStats && (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        {/* Total Users */}
        <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {data.summary.totalUsers}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                Total Users
            </p>
        </div>

        {/* Gender Stats */}
        <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {data.genderStats.male}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                Male Users
            </p>
        </div>

        <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {data.genderStats.female}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                Female Users
            </p>
        </div>

        <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {data.genderStats.others}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                Other Gender
            </p>
        </div>

        {/* Religion Stats */}
        <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {data.religionStats.Islam || 0}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                Islam
            </p>
        </div>

        <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {data.religionStats.Hinduism || 0}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                Hinduism
            </p>
        </div>

        <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {data.religionStats.Christianity || 0}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                Christianity
            </p>
        </div>

        <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {data.religionStats.Others || 0}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                Other Religion
            </p>
        </div>
    </div>
)}
</div>
  );
};

export default StatsDisplay;