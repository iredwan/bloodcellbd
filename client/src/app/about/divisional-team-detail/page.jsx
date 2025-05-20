"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetDivisionalTeamByIdQuery } from "../../../features/divisionalTeam/divisionalTeamApiSlice";
import {
  FaUser,
  FaPhone,
  FaMapMarker,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";
import TeamCard from "@/components/TeamCard";
import ProfileCard from "@/components/ProfileCard";
import TeamCardSkeleton from "@/components/ui/Skeletons/TeamCardSkeleton";
import ProfileCardSkeleton from "@/components/ui/Skeletons/ProfileCardSkeleton";

const DivisionalTeamDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDivisionalTeamByIdQuery(id);

  //Get the divisional team data from the response
  const divisionalTeam = response?.data?.divisionalTeam;
  const totalUpazilaTeams = response?.data?.totalUpazilaTeams;

  // Filter district teams based on search term
  const filteredDistrictTeams =
    divisionalTeam?.districtTeamID.filter((district) =>
      district.districtId.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        {!isLoading && divisionalTeam && (
          <div className="text-center space-y-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
              {divisionalTeam.divisionID?.name} Divisional Team Structure
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              <span className="inline-flex items-center">
                <FaUsers className="mr-2 text-primary w-4 h-4" />
                {divisionalTeam.districtTeamID?.length} District Teams
              </span>
              <span className="inline-flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary w-4 h-4" />
                {totalUpazilaTeams} Upazila Units
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Leadership Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, idx) => (
              <ProfileCardSkeleton key={idx} />
            ))}
          </div>
        )}
        {isError && (
          <div className="text-center text-red-500 py-4">
            Error: {error?.message || "Failed to load team details"}
          </div>
        )}
        {divisionalTeam && (
          <div className="grid md:grid-cols-2 gap-5 border-b-2 border-gray-200 dark:border-gray-700 pb-8">
            <ProfileCard
              id={divisionalTeam.divisionalCoordinatorID?._id || "Not assigned"}
              imageUrl={
                divisionalTeam.divisionalCoordinatorID?.profileImage || ""
              }
              name={
                divisionalTeam.divisionalCoordinatorID?.name || "Not assigned"
              }
              isVerified={
                divisionalTeam.divisionalCoordinatorID?.isVerified || false
              }
              role={
                divisionalTeam.divisionalCoordinatorID?.role || "Not assigned"
              }
              roleSuffix={
                divisionalTeam.divisionalCoordinatorID?.roleSuffix ||
                ""
              }
              bloodGroup={
                divisionalTeam.divisionalCoordinatorID?.bloodGroup || "N/A"
              }
              phone={
                divisionalTeam.divisionalCoordinatorID?.phone || "Not assigned"
              }
            />

            <ProfileCard
              id={
                divisionalTeam.divisionalSubCoordinatorID._id || "Not assigned"
              }
              imageUrl={
                divisionalTeam.divisionalSubCoordinatorID.profileImage || ""
              }
              name={
                divisionalTeam.divisionalSubCoordinatorID.name || "Not assigned"
              }
              isVerified={
                divisionalTeam.divisionalSubCoordinatorID.isVerified || false
              }
              role={
                divisionalTeam.divisionalSubCoordinatorID.role || "Not assigned"
              }
              roleSuffix={
                divisionalTeam.divisionalSubCoordinatorID.roleSuffix ||
                ""
              }
              bloodGroup={
                divisionalTeam.divisionalSubCoordinatorID.bloodGroup || "N/A"
              }
              phone={divisionalTeam.divisionalSubCoordinatorID.phone}
            />
          </div>
        )}
      </section>

      {/* District Teams Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* District Teams Header */}

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

        {divisionalTeam && (
          <div className="py-10 rounded-lg bg-gray-100 dark:bg-gray-800 mb-10">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white tracking-tight ">
              District Teams of {divisionalTeam.divisionID?.name} Division
            </h1>

            {/* District Search Filter */}
            <div className="mt-3 max-w-md mx-auto">
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by district name"
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
              {searchTerm && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                  Showing {filteredDistrictTeams.length} of{" "}
                  {divisionalTeam.districtTeamID.length} districts
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
        ${filteredDistrictTeams.length === 1 ? "max-w-md" : ""}
        ${filteredDistrictTeams.length === 2 ? "max-w-3xl" : ""}
        gap-6 w-full
      `}
            >
              {Array.from({ length: filteredDistrictTeams.length || 3 }).map(
                (_, idx) => (
                  <TeamCardSkeleton key={idx} />
                )
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className={`
        grid 
        ${filteredDistrictTeams.length === 1 ? "grid-cols-1 max-w-md" : ""}
        ${
          filteredDistrictTeams.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
            : ""
        }
        ${
          filteredDistrictTeams.length >= 3
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : ""
        }
        gap-6 w-full
      `}
            >
              {filteredDistrictTeams.map((district) => (
                <div key={district._id} className="space-y-4">
                  <TeamCard
                    detailPageLink={`/about/district-team-detail?id=${district._id}`}
                    imageUrl={district.districtCoordinatorID.profileImage || ""}
                    name={district.districtCoordinatorID.name || "Not assigned"}
                    isVerified={
                      district.districtCoordinatorID.isVerified || false
                    }
                    role={district.districtCoordinatorID.role || "Not assigned"}
                    roleSuffix={
                      district.districtCoordinatorID.roleSuffix ||
                      ""
                    }
                    bloodGroup={
                      district.districtCoordinatorID.bloodGroup || "N/A"
                    }
                    phone={
                      district.districtCoordinatorID.phone || "Not assigned"
                    }
                    teamName={district.districtId.name}
                    subTeamNumber={`Manages ${district.upazilaTeamID.length} Upazilas Teams`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredDistrictTeams.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No districts found matching "{searchTerm}"
          </div>
        )}
      </section>

      {/* Statistics Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
  {isLoading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center animate-pulse transition-transform"
        >
          <div className="w-10 h-10 mb-3 rounded-full bg-gray-300 dark:bg-gray-600" />
          <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
      ))}
    </div>
  ) : (
    divisionalTeam && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBlock
          value={divisionalTeam.districtTeamID?.length || 0}
          label="Districts Teams"
          icon={<FaMapMarkerAlt className="w-6 h-6 text-primary" />}
        />
        <StatBlock
          value={totalUpazilaTeams || 0}
          label="Upazila Teams"
          icon={<FaUsers className="w-6 h-6 text-primary" />}
        />
        <StatBlock
          value={
            divisionalTeam?.updatedAt
              ? new Date(divisionalTeam.updatedAt).toLocaleDateString("en-BN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"
          }
          label="Last Updated"
          icon={<FaCalendarAlt className="w-6 h-6 text-primary" />}
        />
        <StatBlock
          value={
            divisionalTeam.divisionalCoordinatorID?.phone || "Not available"
          }
          label="Contact Number"
          icon={<FaPhone className="w-6 h-6 text-primary" />}
        />
      </div>
    )
  )}
</section>



    </div>
  );
};

const StatBlock = ({ value, label, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform hover:scale-105">
    <div className="mb-3">{icon}</div>
    <div className="text-xl font-bold mb-1">{value}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
  </div>
);

export default DivisionalTeamDetail;
