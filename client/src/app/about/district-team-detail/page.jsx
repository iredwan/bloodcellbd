"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetDistrictTeamByIdQuery } from "../../../features/districtTeam/districtTeamApiSlice";
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

const DistrictTeamDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDistrictTeamByIdQuery(id);

  // Get the district team data from the response
  const districtTeam = response?.data;

  // Filter upazila teams based on search term
  const filteredUpazilaTeams =
    districtTeam?.upazilaTeamID?.filter((upazila) =>
      upazila.upazilaName?.name
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
        {!isLoading && districtTeam && (
          <div className="text-center space-y-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
              {districtTeam.districtId?.name} District Team Structure
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              <span className="inline-flex items-center">
                <FaUsers className="mr-2 text-primary w-4 h-4" />
                {districtTeam.upazilaTeamID?.length || 0} Upazila Teams
              </span>
              <span className="inline-flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary w-4 h-4" />
                {districtTeam.districtId?.name} District
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
        {districtTeam && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 border-b-2 border-gray-200 dark:border-gray-700 pb-8">
            {/* District Coordinator */}
            <ProfileCard
              id={districtTeam.districtCoordinatorID?._id || "Not assigned"}
              imageUrl={districtTeam.districtCoordinatorID?.profileImage || ""}
              name={districtTeam.districtCoordinatorID?.name || "Not assigned"}
              isVerified={
                districtTeam.districtCoordinatorID?.isVerified || false
              }
              role="District Coordinator"
              roleSuffix={districtTeam.districtCoordinatorID?.roleSuffix || ""}
              bloodGroup={
                districtTeam.districtCoordinatorID?.bloodGroup || "N/A"
              }
              phone={
                districtTeam.districtCoordinatorID?.phone || "Not assigned"
              }
            />

            {/* District Sub Coordinator */}
            {districtTeam.districtSubCoordinatorID && (
              <ProfileCard
                id={
                  districtTeam.districtSubCoordinatorID?._id || "Not assigned"
                }
                imageUrl={
                  districtTeam.districtSubCoordinatorID?.profileImage || ""
                }
                name={
                  districtTeam.districtSubCoordinatorID?.name || "Not assigned"
                }
                isVerified={
                  districtTeam.districtSubCoordinatorID?.isVerified || false
                }
                role="District Sub Coordinator"
                roleSuffix={
                  districtTeam.districtSubCoordinatorID?.roleSuffix || ""
                }
                bloodGroup={
                  districtTeam.districtSubCoordinatorID?.bloodGroup || "N/A"
                }
                phone={
                  districtTeam.districtSubCoordinatorID?.phone || "Not assigned"
                }
              />
            )}

            {/* District IT Media Coordinator */}
            {districtTeam.districtITMediaCoordinatorID && (
              <ProfileCard
                id={
                  districtTeam.districtITMediaCoordinatorID?._id ||
                  "Not assigned"
                }
                imageUrl={
                  districtTeam.districtITMediaCoordinatorID?.profileImage || ""
                }
                name={
                  districtTeam.districtITMediaCoordinatorID?.name ||
                  "Not assigned"
                }
                isVerified={
                  districtTeam.districtITMediaCoordinatorID?.isVerified || false
                }
                role="District IT & Media Coordinator"
                roleSuffix={
                  districtTeam.districtITMediaCoordinatorID?.roleSuffix || ""
                }
                bloodGroup={
                  districtTeam.districtITMediaCoordinatorID?.bloodGroup || "N/A"
                }
                phone={
                  districtTeam.districtITMediaCoordinatorID?.phone ||
                  "Not assigned"
                }
              />
            )}

            {/* District Logistics Coordinator */}
            <div className="lg:col-start-2">
              {districtTeam.districtLogisticsCoordinatorID && (
                <ProfileCard
                  id={
                    districtTeam.districtLogisticsCoordinatorID?._id ||
                    "Not assigned"
                  }
                  imageUrl={
                    districtTeam.districtLogisticsCoordinatorID?.profileImage ||
                    ""
                  }
                  name={
                    districtTeam.districtLogisticsCoordinatorID?.name ||
                    "Not assigned"
                  }
                  isVerified={
                    districtTeam.districtLogisticsCoordinatorID?.isVerified ||
                    false
                  }
                  role="District Logistics Coordinator"
                  roleSuffix={
                    districtTeam.districtLogisticsCoordinatorID?.roleSuffix ||
                    ""
                  }
                  bloodGroup={
                    districtTeam.districtLogisticsCoordinatorID?.bloodGroup ||
                    "N/A"
                  }
                  phone={
                    districtTeam.districtLogisticsCoordinatorID?.phone ||
                    "Not assigned"
                  }
                />
              )}
            </div>
          </div>
        )}
      </section>

      {/* Upazila Teams Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Upazila Teams Header */}
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

        {districtTeam && (
          <div className="py-10 rounded-lg bg-gray-100 dark:bg-gray-800 mb-10">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white tracking-tight">
              Upazila/Thana Teams of {districtTeam.districtId?.name} District
            </h1>

            {/* Upazila Search Filter */}
            <div className="mt-3 max-w-md mx-auto">
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by upazila/thana name"
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
              {searchTerm && districtTeam.upazilaTeamID && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                  Showing {filteredUpazilaTeams.length} of{" "}
                  {districtTeam.upazilaTeamID.length} upazilas
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
                ${filteredUpazilaTeams?.length === 1 ? "max-w-md" : ""}
                ${filteredUpazilaTeams?.length === 2 ? "max-w-3xl" : ""}
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
                  filteredUpazilaTeams?.length === 1
                    ? "grid-cols-1 max-w-md"
                    : ""
                }
                ${
                  filteredUpazilaTeams?.length === 2
                    ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
                    : ""
                }
                ${
                  filteredUpazilaTeams?.length >= 3 ||
                  filteredUpazilaTeams?.length === 0
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : ""
                }
                gap-6 w-full
              `}
            >
              {filteredUpazilaTeams?.length > 0 ? (
                filteredUpazilaTeams.map((upazila) => (
                  <div key={upazila._id} className="space-y-4">
                    <TeamCard
                      detailPageLink={`/about/upazila-or-thana-team-detail?id=${upazila._id}`}
                      teamName={upazila.upazilaName?.name || "Unknown Upazila"}
                      name={upazila.upazilaCoordinator?.name || "Not assigned"}
                      role={
                        upazila.upazilaCoordinator?.role || ""
                      }
                      roleSuffix={
                        upazila.upazilaCoordinator?.roleSuffix || ""
                      }
                      bloodGroup={
                        upazila.upazilaCoordinator?.bloodGroup || "N/A"
                      }
                      phone={
                        upazila.upazilaCoordinator?.phone || "Not assigned"
                      }
                      imageUrl={upazila.upazilaCoordinator?.profileImage || ""}
                      subTeamNumber={
                        "Manages " +
                          upazila.monitorTeams?.length +
                          " Monitor Teams" || 0
                      }
                      isVerified={
                        upazila.upazilaCoordinator?.isVerified || false
                      }
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "No upazila teams match your search criteria."
                      : "No upazila teams have been added to this district yet."}
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
          districtTeam && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatBlock
                value={districtTeam.upazilaTeamID?.length || 0}
                label="Upazila Teams"
                icon={<FaUsers className="w-6 h-6 text-primary" />}
              />
              <StatBlock
                value={
                  districtTeam?.updatedAt
                    ? new Date(districtTeam.updatedAt).toLocaleDateString(
                        "en-BN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )
                    : "N/A"
                }
                label="Last Updated"
                icon={<FaCalendarAlt className="w-6 h-6 text-primary" />}
              />
              <StatBlock
                value={
                  districtTeam.districtCoordinatorID?.phone || "Not available"
                }
                label="Contact Number"
                icon={<FaPhone className="w-6 h-6 text-primary" />}
              />
              <StatBlock
                value={districtTeam.districtId?.name || "Unknown"}
                label="District"
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

export default DistrictTeamDetail;
