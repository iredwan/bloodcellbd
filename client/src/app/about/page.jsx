"use client";
import { useState } from "react";
import { FaUsers, FaHandHoldingWater, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useWebsiteConfig } from "@/features/websiteConfig/configApiSlice";
import { useGetAllBoardTeamMembersQuery } from "@/features/boardTeam/boardTeamApiSlice";
import { useGetReviewsForPublicQuery } from "@/features/reviews/reviewApiSlice";
import Link from "next/link";
import Image from "next/image";
import { useDivisionalTeams } from "@/features/divisionalTeam/divisionalTeamApiSlice";
import TeamCard from "@/components/TeamCard";
import TeamCardSkeleton from "@/components/ui/Skeletons/TeamCardSkeleton";
import { GiDrop } from "react-icons/gi";
import { IoAlertCircle } from "react-icons/io5";
import BoardTeamCard from "@/components/BoardTeamCard";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const { config, loading: configLoading } = useWebsiteConfig();

  const { divisionalTeams, loading, error, refreshDivisionalTeams } =
    useDivisionalTeams();

  const { data: boardTeamMembers, isLoading } = useGetAllBoardTeamMembersQuery({
    featured: true,
  });

  const { data: reviewsData, isLoading: reviewsLoading } =
    useGetReviewsForPublicQuery({
      page: 1,
      limit: 4,
    });
  const reviews = reviewsData?.data.reviews || [];

    // Render star rating
    const renderStars = (rating) => {
      return (
        <div className="flex items-center gap-1 text-yellow-400">
          {Array.from({ length: 5 }, (_, i) => {
            const index = i + 1;
  
            if (index <= Math.floor(rating)) {
              return <FaStar key={index} className="w-4 h-4" />;
            } else if (index - rating <= 0.5) {
              return (
                <FaStarHalfAlt key={index} className="w-4 h-4" />
              );
            } else {
              return (
                <FaRegStar
                  key={index}
                  className="w-4 h-4 text-gray-300"
                />
              );
            }
          })}
        </div>
      );
    };

  if (!divisionalTeams.length === 0) {
    return <div className="text-center py-4">No divisional teams found.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section with mission */}
      <section className="container mx-auto py-12 bg-primary text-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-3 text-center">
          <h1 className="text-4xl font-bold mb-6">Our Mission</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We aim to create a life-saving platform that connects voluntary
            blood donors with those in urgent need. Our mission is to ensure
            that no life is lost due to the unavailability of blood.
          </p>
        </div>
      </section>

      {/* Why We Exist section */}
      <section className="container mx-auto rounded-b-lg py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary dark:text-red-400 mb-4">
              Why We Exist
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              In emergency situations, finding the right blood donor quickly is
              often difficult. Our platform solves this problem by providing a
              trusted, fast, and organized way to connect blood seekers with
              willing donors.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer section */}
      <section className="container mx-auto py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary dark:text-white text-center mb-12">
            What We Offer
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Verified Database
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A trusted database of voluntary blood donors ready to help in
                emergencies.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Easy Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find donors quickly by blood group and location when time is
                critical.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Direct Communication
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect directly with donors via phone or message without
                intermediaries.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Awareness & Education
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Resources to understand blood donation importance, process, and
                eligibility.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Donor Verification
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Verification process for donors to build additional trust with
                recipients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works section */}
      <section className="container mx-auto py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary dark:text-red-400 text-center mb-12">
            How It Works
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-200 dark:bg-red-900"></div>

            <div className="relative z-10">
              <div className="md:flex md:items-center mb-12">
                <div className="md:w-1/2 md:pr-10 md:text-right">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md md:ml-auto md:mr-0 max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Step 1: Registration
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Register and create a profile with their blood type,
                      location, and contact information.
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center mt-4 md:mt-0">
                  <div className="w-10 h-10 rounded-full bg-primary dark:bg-red-500 flex items-center justify-center text-white">
                    1
                  </div>
                </div>
              </div>

              <div className="md:flex md:items-center mb-12">
                <div className="md:w-1/2 md:pl-10 hidden md:block"></div>
                <div className="md:w-1/2 flex justify-center mt-4 md:mt-0">
                  <div className="w-10 h-10 rounded-full bg-primary dark:bg-red-500 flex items-center justify-center text-white">
                    2
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-10 md:text-left mt-4 md:mt-0">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Step 2: Automatically Search
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      The recipient will create a blood request, then the system
                      will automatically find blood donor according to the
                      recipient's needs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:flex md:items-center mb-12">
                <div className="md:w-1/2 md:pr-10 md:text-right">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md md:ml-auto md:mr-0 max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Step 3: Contact
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Direct communication between the donor and recipient via
                      phone or message.
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center mt-4 md:mt-0">
                  <div className="w-10 h-10 rounded-full bg-primary dark:bg-red-500 flex items-center justify-center text-white">
                    3
                  </div>
                </div>
              </div>

              <div className="md:flex md:items-center">
                <div className="md:w-1/2 md:pl-10 hidden md:block"></div>
                <div className="md:w-1/2 flex justify-center mt-4 md:mt-0">
                  <div className="w-10 h-10 rounded-full bg-primary dark:bg-red-500 flex items-center justify-center text-white">
                    4
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-10 md:text-left mt-4 md:mt-0">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Step 4: Donation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      The donation takes place, and the status is updated in the
                      system for tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Board members section */}
      <section className="container mx-auto py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary dark:text-red-400 text-center mb-12">
            Board Members
          </h2>
        </div>
        <div className="flex justify-center items-center">
          <div
            className={`
                  grid 
                  ${
                    boardTeamMembers?.data?.length === 1
                      ? "grid-cols-1 max-w-md"
                      : ""
                  }
                  ${
                    boardTeamMembers?.data?.length === 2
                      ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
                      : ""
                  }
                  ${
                    boardTeamMembers?.data?.length >= 3
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : ""
                  }
                  gap-6 w-full
                `}
          >
            {boardTeamMembers?.data?.map((member) => (
              <BoardTeamCard key={member._id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="container mx-auto py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6">
          <h2 className="text-3xl font-bold text-primary dark:text-red-400 text-center mb-12">
            Meet Our Divisional Teams
          </h2>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <TeamCardSkeleton key={index} />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-4">
              Error loading divisional teams.
            </div>
          )}

          <div className="flex justify-center">
            <div
              className={`
                  grid 
                  ${divisionalTeams.length === 1 ? "grid-cols-1 max-w-md" : ""}
                  ${
                    divisionalTeams.length === 2
                      ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
                      : ""
                  }
                  ${
                    divisionalTeams.length >= 3
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : ""
                  }
                  gap-8 md:gap-x-3 w-full
                `}
            >
              {divisionalTeams.map((team) => (
                <TeamCard
                  key={team._id}
                  team={team}
                  detailPageLink={`/about/divisional-team-detail?id=${team._id}`}
                  teamName={team.divisionID?.name}
                  name={team.divisionalCoordinatorID?.name || "Not assigned"}
                  isVerified={team.divisionalCoordinatorID?.isVerified}
                  role={team.divisionalCoordinatorID?.role || "Not assigned"}
                  roleSuffix={team.divisionalCoordinatorID?.roleSuffix}
                  bloodGroup={team.divisionalCoordinatorID?.bloodGroup || "N/A"}
                  phone={team.divisionalCoordinatorID?.phone || "Not added"}
                  imageUrl={
                    team.divisionalCoordinatorID?.profileImage ||
                    "No profile image found"
                  }
                  subTeamNumber={
                    `Manages ${team.districtTeamID?.length} District Team` ||
                    0 + " District Team"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Review section */}
      <section className="container mx-auto py-6 bg-gray-50 dark:bg-gray-900 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary dark:text-red-400 text-center">
            Reviews
          </h2>
          <p className="text-sm text-center text-gray-600 dark:text-gray-300 ">
          Total: {reviewsData?.data.totalReviews}
           </p>
          <p className="text-sm text-center text-gray-600 dark:text-gray-300 ">
          Average Rating: {reviewsData?.data.averageRating}
           </p>
           <div className="flex justify-center items-center gap-4 py-1 mb-8">
             {renderStars(reviewsData?.data.averageRating)}
             </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-4 gap-4">
            {reviewsLoading ? (
              <div className="col-span-full text-center text-gray-600 dark:text-gray-300">
                Loading reviews...
              </div>
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md"
                >
                  {/* user info */}
                  <div className="flex items-start gap-4">
                    {/* Profile Image */}
                    <div className="relative h-15 w-15 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={`${imageUrl}/${review.user.profileImage}`}
                        alt={review.user.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-1">
                        <span className="line-clamp-2 md:line-clamp-none break-all">
                          {review.user?.name || "Unknown User"}
                        </span>

                        {review.user?.isVerified && (
                          <span className="text-primary inline-block">
                            <svg
                              className="h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {review.user.role}, {review.user.roleSuffix}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Blood Group: {review.user.bloodGroup}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Last Donate: {review.user.lastDonate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 py-1">
                    {renderStars(review.rating)}
                  </div>
                  <p className="pb-3">{review.review}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 dark:text-gray-300">
                No reviews found.
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              router.push("/about/reviews");
            }}
            className="button"
          >
            See all
          </button>
        </div>
      </section>

      {/* Impact section */}
      <section className="container mx-auto py-16 my-12 rounded-lg dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-3 text-primary">
            Our Impact
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
            We are proud to have helped save countless lives through our blood
            donation drives.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                value: configLoading ? "..." : config.stats.totalMembers,
                label: "Total Members",
                icon: <FaUsers className="w-8 h-8" />,
              },
              {
                value: configLoading
                  ? "..."
                  : config.stats.totalEligibleMembers,
                label: "Available Donors",
                icon: <FaHandHoldingWater className="w-8 h-8" />,
              },
              {
                value: configLoading
                  ? "..."
                  : config.stats.totalFulfilledRequests,
                label: "Lives Impacted",
                icon: <GiDrop className="w-8 h-8" />,
              },
              {
                value: configLoading
                  ? "..."
                  : config.stats.totalPendingRequests,
                label: "Current Needs",
                icon: <IoAlertCircle className="w-8 h-8" />,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl backdrop-blur-sm bg-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl border border-white/10 dark:bg-gray-800"
              >
                <div
                  className={`${stat.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary`}
                >
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold mb-2 text-primary animate-pulse dark:text-white">
                  {stat.value}
                </div>
                <div className="font-semibold text-sm text-primary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Join Us section */}
      <section className="py-16 bg-gradient-to-r from-primary to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Join Our Mission</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Every drop of blood has the potential to save a life. Join us in our
            mission to create a responsive and reliable blood donation network.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/register"
              className="bg-white text-primary font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Register as a Donor
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
