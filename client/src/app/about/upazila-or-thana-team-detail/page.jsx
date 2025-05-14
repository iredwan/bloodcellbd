"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetUpazilaTeamByIdQuery } from "../../../features/upazilaTeam/upazilaTeamApiSlice";
import {
  FaUser,
  FaPhone,
  FaMapMarker,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaLayerGroup,
} from "react-icons/fa";
import TeamCard from "@/components/TeamCard";
import ProfileCard from "@/components/ProfileCard";
import TeamCardSkeleton from "@/components/ui/Skeletons/TeamCardSkeleton";
import ProfileCardSkeleton from "@/components/ui/Skeletons/ProfileCardSkeleton";

const UpazilaOrThanaTeamDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUpazilaTeamByIdQuery(id);

  // Get the upazila team data from the response
  const upazilaTeam = response?.data?.upazilaTeam;
  const totalModeratorTeams = response?.data?.totalModeratorTeams || 0;

  // Filter monitor teams based on search term
  const filteredMonitorTeams =
    upazilaTeam?.monitorTeams?.filter((monitor) =>
      monitor.teamMonitor?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="dark:bg-gray-900 dark:text-white min-h-screen">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {isLoading && (
          <div className="text-center space-y-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mx-auto" />

            <div className="flex flex-wrap justify-center items-center gap-x-7 gap-y-2 text-sm sm:text-base">
              <div className="inline-flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
              <div className="inline-flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="w-28 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        )}
        {!isLoading && upazilaTeam && (
          <div className="text-center space-y-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
              {upazilaTeam.upazilaName?.name} Upazila/Thana Team Structure
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              <span className="inline-flex items-center">
                <FaUsers className="mr-2 text-primary w-4 h-4" />
                {upazilaTeam.monitorTeams?.length || 0} Monitor Teams
              </span>
              <span className="inline-flex items-center">
                <FaLayerGroup className="mr-2 text-primary w-4 h-4" />
                {totalModeratorTeams || 0} Moderator Teams
              </span>
              <span className="inline-flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary w-4 h-4" />
                {upazilaTeam.upazilaName?.name} Upazila/Thana
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Leadership Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <ProfileCardSkeleton key={idx} />
            ))}
          </div>
        )}
        {isError && (
          <div className="text-center text-red-500 py-4">
            Error: {error?.message || "Failed to load team details"}
          </div>
        )}
        {upazilaTeam && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 border-b-2 border-gray-200 dark:border-gray-700 pb-8">
            {/* Upazila Coordinator */}
            <ProfileCard
              id={upazilaTeam.upazilaCoordinator?._id || "Not assigned"}
              imageUrl={upazilaTeam.upazilaCoordinator?.profileImage || ""}
              name={upazilaTeam.upazilaCoordinator?.name || "Not assigned"}
              isVerified={upazilaTeam.upazilaCoordinator?.isVerified || false}
              role="Upazila Coordinator"
              roleSuffix={upazilaTeam.upazilaCoordinator?.roleSuffix || ""}
              bloodGroup={upazilaTeam.upazilaCoordinator?.bloodGroup || "N/A"}
              phone={upazilaTeam.upazilaCoordinator?.phone || "Not assigned"}
            />

            {/* Upazila Sub Coordinator */}
            {upazilaTeam.upazilaSubCoordinator && (
              <ProfileCard
                id={upazilaTeam.upazilaSubCoordinator?._id || "Not assigned"}
                imageUrl={upazilaTeam.upazilaSubCoordinator?.profileImage || ""}
                name={upazilaTeam.upazilaSubCoordinator?.name || "Not assigned"}
                isVerified={
                  upazilaTeam.upazilaSubCoordinator?.isVerified || false
                }
                role="Upazila Sub Coordinator"
                roleSuffix={upazilaTeam.upazilaSubCoordinator?.roleSuffix || ""}
                bloodGroup={
                  upazilaTeam.upazilaSubCoordinator?.bloodGroup || "N/A"
                }
                phone={
                  upazilaTeam.upazilaSubCoordinator?.phone || "Not assigned"
                }
              />
            )}

            {/* Upazila IT Media Coordinator */}
            {upazilaTeam.upazilaITMediaCoordinator && (
              <ProfileCard
                id={
                  upazilaTeam.upazilaITMediaCoordinator?._id || "Not assigned"
                }
                imageUrl={
                  upazilaTeam.upazilaITMediaCoordinator?.profileImage || ""
                }
                name={
                  upazilaTeam.upazilaITMediaCoordinator?.name || "Not assigned"
                }
                isVerified={
                  upazilaTeam.upazilaITMediaCoordinator?.isVerified || false
                }
                role="Upazila IT & Media Coordinator"
                roleSuffix={
                  upazilaTeam.upazilaITMediaCoordinator?.roleSuffix || ""
                }
                bloodGroup={
                  upazilaTeam.upazilaITMediaCoordinator?.bloodGroup || "N/A"
                }
                phone={
                  upazilaTeam.upazilaITMediaCoordinator?.phone || "Not assigned"
                }
              />
            )}

            {/* Upazila Logistics Coordinator */}
            <div className="lg:col-start-2">
              {upazilaTeam.upazilaLogisticsCoordinator && (
                <ProfileCard
                  id={
                    upazilaTeam.upazilaLogisticsCoordinator?._id ||
                    "Not assigned"
                  }
                  imageUrl={
                    upazilaTeam.upazilaLogisticsCoordinator?.profileImage || ""
                  }
                  name={
                    upazilaTeam.upazilaLogisticsCoordinator?.name ||
                    "Not assigned"
                  }
                  isVerified={
                    upazilaTeam.upazilaLogisticsCoordinator?.isVerified || false
                  }
                  role="Upazila Logistics Coordinator"
                  roleSuffix={
                    upazilaTeam.upazilaLogisticsCoordinator?.roleSuffix || ""
                  }
                  bloodGroup={
                    upazilaTeam.upazilaLogisticsCoordinator?.bloodGroup || "N/A"
                  }
                  phone={
                    upazilaTeam.upazilaLogisticsCoordinator?.phone ||
                    "Not assigned"
                  }
                />
              )}
            </div>
          </div>
        )}
      </section>

      {/* Monitor Teams Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Monitor Teams Header */}
        {isLoading && (
          <div className="py-10 rounded-lg bg-gray-100 dark:bg-gray-800 mb-10 animate-pulse space-y-6">
            {/* Heading */}
            <div className="h-8 w-3/5 mx-auto bg-gray-300 dark:bg-gray-700 rounded"></div>

            {/* Search Input Skeleton */}
            <div className="mt-3 max-w-md mx-auto">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-full pl-10" />
              </div>
            </div>
          </div>
        )}

        {upazilaTeam && (
          <div className="py-10 rounded-lg bg-gray-100 dark:bg-gray-800 mb-10">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white tracking-tight">
              Monitor Teams of {upazilaTeam.upazilaName?.name} Upazila/Thana
            </h1>

            {/* Monitor Teams Search Filter */}
            <div className="mt-3 max-w-md mx-auto">
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by monitor name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                )}
              </div>
              {searchTerm && upazilaTeam.monitorTeams && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                  Showing {filteredMonitorTeams.length} of{" "}
                  {upazilaTeam.monitorTeams.length} monitor teams
                </p>
              )}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <div
              className={`
                grid 
                grid-cols-1 
                md:grid-cols-2 
                lg:grid-cols-3
                ${filteredMonitorTeams?.length === 1 ? "max-w-md" : ""}
                ${filteredMonitorTeams?.length === 2 ? "max-w-3xl" : ""}
                gap-6 w-full
              `}
            >
              {Array.from({ length: 3 }).map((_, idx) => (
                <TeamCardSkeleton key={idx} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className={`
                grid 
                ${
                  filteredMonitorTeams?.length === 1
                    ? "grid-cols-1 max-w-md"
                    : ""
                }
                ${
                  filteredMonitorTeams?.length === 2
                    ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
                    : ""
                }
                ${
                  filteredMonitorTeams?.length >= 3 ||
                  filteredMonitorTeams?.length === 0
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : ""
                }
                gap-6 w-full
              `}
            >
              {filteredMonitorTeams?.length > 0 ? (
                filteredMonitorTeams.map((monitor) => (
                  <div key={monitor._id} className="space-y-4">
                    <TeamCard
                      detailPageLink={`/about/monitor-team-detail?id=${monitor._id}`}
                      teamName={monitor.teamName || "Monitor Team"}
                      name={monitor.teamMonitor?.name || "Not assigned"}
                      role={monitor.teamMonitor?.role || "Not assigned"}
                      roleSuffix={monitor.teamMonitor?.roleSuffix || ""}
                      bloodGroup={monitor.teamMonitor?.bloodGroup || "N/A"}
                      phone={monitor.teamMonitor?.phone || "Not assigned"}
                      imageUrl={monitor.teamMonitor?.profileImage || ""}
                      subTeamNumber={
                        monitor.moderatorTeamID
                          ? "Has Moderator Team"
                          : "No Moderator Team"
                      }
                      isVerified={monitor.teamMonitor?.isVerified || false}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "No monitor teams match your search criteria."
                      : "No monitor teams have been added to this upazila yet."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center animate-pulse"
              >
                <div className="mb-3 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          upazilaTeam && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatBlock
                value={upazilaTeam.monitorTeams?.length || 0}
                label="Monitor Teams"
                icon={<FaUsers className="w-6 h-6 text-primary" />}
              />
              <StatBlock
                value={totalModeratorTeams || 0}
                label="Moderator Teams"
                icon={<FaLayerGroup className="w-6 h-6 text-primary" />}
              />
              <StatBlock
                value={
                  upazilaTeam.upazilaCoordinator?.phone || "Not available"
                }
                label="Contact Number"
                icon={<FaPhone className="w-6 h-6 text-primary" />}
              />
              <StatBlock
                value={upazilaTeam.upazilaName?.name || "Unknown"}
                label="Upazila/Thana"
                icon={<FaMapMarkerAlt className="w-6 h-6 text-primary" />}
              />
            </div>
          )
        )}
      </section>
    </div>
  );
};

// Statistic Block Component
const StatBlock = ({ value, label, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform hover:scale-105">
    <div className="mb-3">{icon}</div>
    <div className="text-xl font-bold mb-1">{value}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
  </div>
);

export default UpazilaOrThanaTeamDetail;
