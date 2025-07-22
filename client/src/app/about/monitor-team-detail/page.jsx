"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetMonitorTeamByIdQuery } from "../../../features/monitorTeam/monitorTeamApiSlice";
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

const MonitorTeamDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMonitorTeamByIdQuery(id);

  // Get the monitor team data from the response
  const monitorTeam = response?.data?.monitorTeam;
  const totalModeratorTeam = response?.data?.totalModeratorTeam || 0;
  const totalModerator = response?.data?.totalModerator || 0;
  const totalMembers = response?.data?.totalMembers || 0;

  // Filter moderator teams based on search term
  const filteredModeratorTeams =
    monitorTeam?.moderatorTeamID?.filter((moderator) =>
      moderator.moderatorTeamName
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
              <div className="inline-flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="w-28 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        )}
        {!isLoading && monitorTeam && (
          <div className="text-center space-y-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
              {monitorTeam.teamName} Structure
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              <span className="inline-flex items-center">
                <FaLayerGroup className="mr-2 text-primary w-4 h-4" />
                {monitorTeam.moderatorTeamID?.length || 0} Moderator Teams
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Leadership Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {isLoading && (
          <div className="flex justify-center items-center gap-5 border-b-2 border-gray-200 dark:border-gray-700 pb-8 max-w-2xl mx-auto">
            {Array.from({ length: 1 }).map((_, idx) => (
              <ProfileCardSkeleton key={idx} />
            ))}
          </div>
        )}
        {isError && (
          <div className="text-center text-red-500 py-4">
            Error: {error?.message || "Failed to load team details"}
          </div>
        )}
        {monitorTeam && (
          <div className="flex justify-center items-center gap-5 border-b-2 border-gray-200 dark:border-gray-700 pb-8">
            {/* Team Monitor */}
            <ProfileCard
              id={monitorTeam.teamMonitor?._id || "Not assigned"}
              imageUrl={monitorTeam.teamMonitor?.profileImage || ""}
              name={monitorTeam.teamMonitor?.name || "Not assigned"}
              isVerified={monitorTeam.teamMonitor?.isVerified || false}
              role={monitorTeam.teamMonitor?.role || "Not assigned"}
              roleSuffix={monitorTeam.teamMonitor?.roleSuffix || ""}
              bloodGroup={monitorTeam.teamMonitor?.bloodGroup || "N/A"}
              phone={monitorTeam.teamMonitor?.phone || "Not assigned"}
            />
          </div>
        )}
      </section>

      {/* Moderator Teams Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Moderator Teams Header */}
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

        {monitorTeam && (
          <div className="py-10 rounded-lg bg-gray-100 dark:bg-gray-800 mb-10">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white tracking-tight">
              Moderator Teams of {monitorTeam.teamName}
            </h1>

            {/* Moderator Teams Search Filter */}
            <div className="mt-3 max-w-md mx-auto">
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by moderator name"
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
              {searchTerm && monitorTeam.moderatorTeamID && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                  Showing {filteredModeratorTeams.length} of{" "}
                  {monitorTeam.moderatorTeamID.length} moderator teams
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
                ${filteredModeratorTeams?.length === 1 ? "max-w-md" : ""}
                ${filteredModeratorTeams?.length === 2 ? "max-w-3xl" : ""}
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
                  filteredModeratorTeams?.length === 1
                    ? "grid-cols-1 max-w-md"
                    : ""
                }
                ${
                  filteredModeratorTeams?.length === 2
                    ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
                    : ""
                }
                ${
                  filteredModeratorTeams?.length >= 3 ||
                  filteredModeratorTeams?.length === 0
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : ""
                }
                gap-6 w-full
              `}
            >
              {filteredModeratorTeams?.length > 0 ? (
                filteredModeratorTeams.map((moderator) => (
                  <div key={moderator._id} className="space-y-4">
                    <TeamCard
                      id={moderator.moderatorName?._id}
                      teamName="Moderator Team"
                      name={moderator.moderatorName?.name || "Not assigned"}
                      role={moderator.moderatorName?.role || "Not assigned"}
                      roleSuffix={moderator.moderatorName?.roleSuffix || ""}
                      bloodGroup={moderator.moderatorName?.bloodGroup || "N/A"}
                      phone={moderator.moderatorName?.phone || "Not assigned"}
                      imageUrl={moderator.moderatorName?.profileImage || ""}
                      subTeamNumber={
                        moderator.moderatorTeamMembers?.length
                          ? `${moderator.moderatorTeamMembers.length} Members`
                          : "No Members"
                      }
                      isVerified={moderator.moderatorName?.isVerified || false}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "No moderator teams match your search criteria."
                      : "No moderator teams have been added to this monitor team yet."}
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
          monitorTeam && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatBlock
                value={monitorTeam.moderatorTeamID?.length || 0}
                label="Moderator Teams"
                icon={<FaLayerGroup className="w-6 h-6 text-primary" />}
              />
              <StatBlock
                value={totalModerator || 0}
                label="Moderators"
                icon={<FaUsers className="w-6 h-6 text-primary" />}
              />
              <StatBlock
                value={monitorTeam.teamMonitor?.phone || "Not available"}
                label="Contact Number"
                icon={<FaPhone className="w-6 h-6 text-primary" />}
              />
              <StatBlock
                value={totalMembers || 0}
                label="Total Members"
                icon={<FaUsers className="w-6 h-6 text-primary" />}
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

export default MonitorTeamDetail;
