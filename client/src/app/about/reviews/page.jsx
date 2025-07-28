"use client";

import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useGetReviewsForPublicQuery } from "@/features/reviews/reviewApiSlice";
import Pagination from "@/components/Pagination";

const ReviewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch reviews data
  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
  } = useGetReviewsForPublicQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
  });

  // Extract reviews and stats from response
  const reviews = reviewsData?.data?.reviews || [];
  const totalReviews = reviewsData?.data?.totalReviews || 0;
  const averageRating = reviewsData?.data?.averageRating || 0;

  // Update total pages when data changes
  useEffect(() => {
    if (reviewsData?.data) {
      const totalPages = Math.ceil(reviewsData.data.totalReviews / itemsPerPage);
      setTotalPages(totalPages || 1);
    }
  }, [reviewsData, itemsPerPage]);

  // Handle page change
  const handlePageChange = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /// Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1 text-yellow-400">
        {Array.from({ length: 5 }, (_, i) => {
          const index = i + 1;
  
          if (index <= Math.floor(rating)) {
            return <FaStar key={index} className="w-5 h-5 sm:w-6 sm:h-6" />;
          } else if (
            index === Math.ceil(rating) &&
            rating % 1 >= 0.1 
          ) {
            return <FaStarHalfAlt key={index} className="w-5 h-5 sm:w-6 sm:h-6" />;
          } else {
            return (
              <FaRegStar
                key={index}
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300"
              />
            );
          }
        })}
      </div>
    );
  };

  // Handle row click to show details modal
  const handleRowClick = (review, e) => {
    if (e && (e.target.closest('button') || e.target.tagName.toLowerCase() === 'button')) {
      return;
    }
    setSelectedReview(review);
    setShowDetailsModal(true);
  };

  // Handle close details modal
  const handleCloseDetailsModal = () => {
    setSelectedReview(null);
    setShowDetailsModal(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          Error: {error?.data?.message || "Failed to load reviews"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Stats */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-6">What Our Users Say</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Reviews</h3>
            <p className="text-3xl font-bold text-primary mt-2">{totalReviews}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Average Rating</h3>
            <div className="flex flex-col items-center mt-2">
              <p className="text-3xl font-bold text-primary">{averageRating.toFixed(1)}</p>
              {renderStars(averageRating)}
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr
                    key={review._id}
                    onClick={(e) => handleRowClick(review, e)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {review.user?.profileImage ? (
                          <img
                            src={`${imageUrl}${review.user.profileImage}`}
                            alt={review.user?.name}
                            className="h-10 w-10 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                            {review.user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {review.user?.name || "Unknown User"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {review.user?.phone || "No phone"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xl truncate">
                        {review.review}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    {debouncedSearchTerm
                      ? "No reviews found matching your search criteria"
                      : "No reviews available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            pageCount={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage - 1}
          />
        </div>
      )}

      {/* Review Details Modal */}
      {showDetailsModal && selectedReview && (
        <div className="fixed inset-0 z-10">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            onClick={handleCloseDetailsModal}
          ></div>
          <div className="relative z-50 flex items-center justify-center min-h-screen p-4">
            <div
              className="bg-white p-6 rounded-lg w-full max-w-2xl border border-gray-300 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Review Details</h2>
                <button
                  onClick={handleCloseDetailsModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center mb-6">
                {selectedReview.user?.profileImage ? (
                  <img
                    src={`${imageUrl}${selectedReview.user.profileImage}`}
                    alt={selectedReview.user?.name}
                    className="h-16 w-16 rounded-full mr-4 object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center text-xl">
                    {selectedReview.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Link
                      href={`/profile-detail?id=${selectedReview.user._id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {selectedReview.user?.name || "Unknown User"}
                    </Link>
                    {selectedReview.user?.isVerified && (
                      <span className="text-primary ml-1">
                        <svg
                          className="h-5 w-5"
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
                  <p className="text-gray-600">{selectedReview.user?.phone || "No phone"}</p>
                  <p className="text-gray-600">{selectedReview.user?.email || "No email"}</p>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-lg font-semibold">Rating:</span>
                  {renderStars(selectedReview.rating)}
                  <span className="text-lg">({selectedReview.rating}/5)</span>
                </div>
                <div>
                  <span className="text-lg font-semibold">Review:</span>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {selectedReview.review}
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t pt-4 text-sm text-gray-500">
                <p>
                  Posted on:{" "}
                  {new Date(selectedReview.createdAt).toLocaleDateString("en-GB")}{" "}
                  {new Date(selectedReview.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
