"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaSearch,
  FaTrash,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";
import {
  useGetAllReviewsQuery,
  useGetUserReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewStatusMutation,
  useCreateReviewMutation,
  useGetReviewsForPublicQuery,
} from "@/features/reviews/reviewApiSlice";
import Pagination from "@/components/Pagination";
import deleteConfirm from "@/utils/deleteConfirm";
import { useGetUserInfoQuery } from "@/features/userInfo/userInfoApiSlice";
import DistrictSelector from "@/components/DistrictSelector";
import CustomSelect from "@/components/CustomSelect";

const ReviewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [userReviewsPage, setUserReviewsPage] = useState(1);
  const [districtReviewsPage, setDistrictReviewsPage] = useState(1);
  const [publicReviewsSearch, setPublicReviewsSearch] = useState('');
  const debouncedPublicSearch = useDebounce(publicReviewsSearch, 500);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    review: "",
    status: "pending",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [districtNameSearch, setDistrictNameSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const statusOptions = ["", "pending", "approved", "rejected"];
  const statusDisplayOptions = [
    "All Status",
    "Pending",
    "Approved",
    "Rejected",
  ];
  const modalStatusOptions = ["pending", "approved", "rejected"];
  const modalStatusDisplayOptions = ["Pending", "Approved", "Rejected"];
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  // Convert status for display
  const getStatusDisplay = (status) => {
    const index = statusOptions.indexOf(status);
    return statusDisplayOptions[index];
  };

  // Convert modal status for display
  const getModalStatusDisplay = (status) => {
    const index = modalStatusOptions.indexOf(status);
    return modalStatusDisplayOptions[index];
  };

  // Handle status filter change
  const handleStatusFilterChange = (selectedStatus) => {
    const index = statusDisplayOptions.indexOf(selectedStatus);
    setStatusFilter(index !== -1 ? statusOptions[index] : "");
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Handle public reviews search
  const handlePublicReviewsSearch = (e) => {
    setPublicReviewsSearch(e.target.value);
    setDistrictReviewsPage(1); // Reset to first page on new search
  };

  // Handle modal status change
  const handleModalStatusChange = (selectedStatus) => {
    const index = modalStatusDisplayOptions.indexOf(selectedStatus);
    const newStatus = index !== -1 ? modalStatusOptions[index] : "pending";
    setFormData((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  // Get user info for role-based permissions
  const { data: userInfoData, isLoading: isUserInfoLoading } =
    useGetUserInfoQuery();
  const userRole = userInfoData?.user?.role || "";
  const userId = userInfoData?.user?._id || "";
  const userDistrict = userInfoData?.user?.district || "";
  const isAuthenticated = userInfoData ? true : false;

  // Get public reviews
  const {
    data: publicReviewsData,
    isLoading: isPublicReviewsLoading,
    isError: isPublicReviewsError
  } = useGetReviewsForPublicQuery({
    page: districtReviewsPage,
    limit: 10,
    search: debouncedPublicSearch
  });

  // Extract public reviews data
  const publicReviews = publicReviewsData?.data?.reviews || [];
  const publicTotalReviews = publicReviewsData?.data?.totalReviews || 0;
  const publicAverageRating = publicReviewsData?.data?.averageRating || 0;

  // Determine if user has admin privileges
  const hasAdminPrivileges = [
    "Admin",
    "Divisional Coordinator",
    "Divisional Co-coordinator",
    "District Coordinator",
    "District Co-coordinator",
    "District IT & Media Coordinator",
    "District Logistics Coordinator",
  ].includes(userRole);

  // Determine if user can see all reviews or only district-specific ones
  const canSeeAllReviews = [
    "Admin",
    "Head of Logistics",
    "Head of IT & Media",
    "Divisional Coordinator",
    "Divisional Co-coordinator",
  ].includes(userRole);

  // Query parameters for fetching reviews
  const queryParams = {
    limit: itemsPerPage,
    page: currentPage,
    ...(searchQuery && { search: searchQuery }),
    ...(statusFilter && { status: statusFilter }),
    ...(!canSeeAllReviews && userDistrict && { district: userDistrict }),
    ...(districtNameSearch && { district: districtNameSearch })
  };

  // Set districtReviewsPage to currentPage when userDistrict changes
  useEffect(() => {
    if (userDistrict) {
      setDistrictReviewsPage(currentPage);
    }
  }, [userDistrict, currentPage]);

  // Fetch reviews data - wait for user info to load first
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    isError,
    error,
    refetch: refetchAllReviews,
  } = useGetAllReviewsQuery(queryParams, {
    skip: isUserInfoLoading, // Skip this query until user info is loaded
  });

  // Query parameters for user's own reviews
  const userReviewsQueryParams = {
    limit: itemsPerPage,
    page: currentPage
  };

  // Query parameters for district reviews
  const districtReviewsQueryParams = {
    limit: itemsPerPage,
    page: currentPage,
    district: userDistrict
  };

  // Fetch user's own reviews
  const {
    data: userReviewsData,
    isLoading: isUserReviewsLoading,
    error: userReviewsError,
    refetch: refetchUserReviews
  } = useGetUserReviewsQuery(userReviewsQueryParams, { 
    skip: isUserInfoLoading 
  });

  // Calculate total pages for user reviews
  const userReviewsTotalPages = userReviewsData?.data?.totalReviews 
    ? Math.ceil(userReviewsData.data.totalReviews / itemsPerPage) 
    : 1;

  // Extract reviews from response with safer access
  const reviews = reviewsData?.data?.reviews || [];
  const totalReviews = reviewsData?.data?.totalReviews || 0;
  const approvedReviews = reviewsData?.data?.approvedReviews || 0;
  const pendingReviews = reviewsData?.data?.pendingReviews || 0;
  const rejectedReviews = reviewsData?.data?.rejectedReviews || 0;
  const averageRating = reviewsData?.data?.averageRating || 0;

  // Update total pages calculation based on API response
  useEffect(() => {
    if (reviewsData?.data) {
      const totalItems = reviewsData.data.totalReviews;
      const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
      setTotalPages(calculatedTotalPages || 1);
      setTotalItems(totalItems || 0);
    }
  }, [reviewsData, itemsPerPage]);

  // Log errors for debugging
  useEffect(() => {
    if (isError) {
      console.error("Review fetch error details:", {
        status: error?.status,
        data: error?.data,
        error: error,
      });
    }
    if (userReviewsError) {
      console.error("User reviews fetch error details:", {
        status: userReviewsError?.status,
        data: userReviewsError?.data,
        error: userReviewsError,
      });
    }
  }, [isError, error, userReviewsError]);

  // API mutations
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReviewStatus] = useUpdateReviewStatusMutation();
  const [createReview] = useCreateReviewMutation();

  // Handle district name search with pagination reset
  const handleDistrictNameSearch = useCallback((district) => {
    if (district) {
      setDistrictNameSearch(district.name || "");
    } else {
      setDistrictNameSearch("");
    }
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  // Handle search query with pagination reset
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle page change for pagination
  const handlePageChange = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleDistrictReviewsPageChange = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setDistrictReviewsPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if user can edit/delete a review
  const canModifyReview = (review) => {
    // Admin, divisional coordinator, divisional co-coordinator and district coordinator can modify any review
    if (
      [
        "Admin",
        "Divisional Coordinator",
        "Divisional Co-coordinator",
        "District Coordinator",
        "District Co-coordinator",
      ].includes(userRole)
    ) {
      return true;
    }

    // Users can modify their own reviews
    return review.user?._id === userId;
  };

  // Check if user has already submitted a review
  const hasUserSubmittedReview = userReviewsData?.data?.length > 0;

  // Handle add new review
  const handleAddNew = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasUserSubmittedReview) {
      toast.error("You can only submit one review.");
      return;
    }

    setFormData({
      rating: 0,
      review: "",
      status: "pending",
    });
    setIsEditing(false);
    setEditId(null);
    setShowModal(true);
  };

  // Handle edit button click
  const handleEdit = (review) => {
    setFormData({
      rating: review.rating || 0,
      review: review.review || "",
      status: review.status || "pending",
    });
    setIsEditing(true);
    setEditId(review._id);
    setShowModal(true);
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const result = await updateReviewStatus({
        id,
        statusData: { status: newStatus },
      }).unwrap();

      if (result.status === true) {
        toast.success(result.message || "Status updated successfully");
        refetchAllReviews();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.data?.message || "An error occurred");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirmed = await deleteConfirm();
    if (!confirmed) return;

    try {
      const result = await deleteReview(id).unwrap();
      if (result.status) {
        toast.success(result.message || "Review deleted successfully");
        refetchAllReviews();
        if (!hasAdminPrivileges) {
          refetchUserReviews();
        }
      } else {
        toast.error(result.message || "Failed to delete review");
      }
    } catch (error) {
      toast.error(error.data?.message || "An error occurred");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!formData.review.trim()) {
      toast.error("Please enter your review");
      return;
    }

    try {
      let result;

      if (isEditing) {
        result = await updateReview({
          id: editId,
          updateData: formData,
        }).unwrap();
      } else {
        // Create the review
        result = await createReview({
          rating: formData.rating,
          review: formData.review,
          status: formData.status || "pending",
        }).unwrap();
      }

      if (result && result.status === true) {
        toast.success(
          result.message ||
            `Review ${isEditing ? "updated" : "created"} successfully`
        );
        handleCloseModal();
        refetchAllReviews();
        if (!hasAdminPrivileges) {
          refetchUserReviews();
        }
      } else {
        toast.error(
          result?.message ||
            `Failed to ${isEditing ? "update" : "create"} review`
        );
      }
    } catch (error) {
      console.error("Review submission error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        error: error,
      });

      // Handle specific error cases
      if (error?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else if (error?.status === 403) {
        toast.error("You don't have permission to perform this action.");
      } else {
        toast.error(
          error?.data?.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } review. Please try again.`
        );
      }
    }
  };

  // Handle modal close
  const handleCloseModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowModal(false);
    setFormData({
      rating: 0,
      review: "",
      status: "pending",
    });
    setIsEditing(false);
    setEditId(null);
  };

  // Render star rating
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

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Handle row click to show details modal
  const handleRowClick = (review, e) => {
    // If there's no event object, return early
    if (!e) return;

    // Check if the click was on or inside a button
    const isButtonClick = e.target.closest('button') || 
                         e.target.tagName.toLowerCase() === 'button' ||
                         e.target.closest('.button') ||
                         e.target.parentElement.tagName.toLowerCase() === 'button';

    if (isButtonClick) {
      e.stopPropagation();
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
  if (isUserInfoLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  // Don't return early for review loading or errors, just handle them in the UI
  const isReviewsEmpty =
    !isReviewsLoading && (!reviews || reviews.length === 0);

  return (
    <div className="container mx-auto mt-10 md:mt-0">
      {/* Admin/Coordinator View */}
      {hasAdminPrivileges && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-center md:text-start">
              Reviews Management
            </h1>
            <div className="flex flex-col md:flex-row gap-4 items-center mt-4 md:mt-0">
              {canSeeAllReviews && (
                <div>
                  <DistrictSelector
                    onDistrictChange={handleDistrictNameSearch}
                    label="Filter by District"
                    required={false}
                  />
                </div>
              )}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2.5 pl-10 mt-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <FaSearch className="absolute left-3 top-6.5 text-gray-400" />
              </div>
              <div className="mb-3">
                <CustomSelect
                  options={statusDisplayOptions}
                  selected={getStatusDisplay(statusFilter)}
                  setSelected={handleStatusFilterChange}
                  label="Filter by Status"
                  placeholder="Select status..."
                />
              </div>
              {!hasUserSubmittedReview && (
                <button
                  onClick={handleAddNew}
                  className="button mt-2 md:mt-0"
                  type="button"
                >
                  Add New Review
                </button>
              )}
            </div>
          </div>

          {/* Reviews List */}
          {isReviewsLoading ? (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-gray-500">Loading reviews...</p>
            </div>
          ) : isReviewsEmpty ? (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">No reviews found.</p>
              <button onClick={handleAddNew} className="button" type="button">
                Create First Review
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="hidden md:table-cell px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Review
                      </th>
                      <th className="hidden md:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="hidden xl:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review) => (
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
                          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {renderStars(review.rating)}
                          </div>
                          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                review.status
                              )}`}
                            >
                              {review.status}
                            </span>
                          </div>
                        </td>
                        <td className="hidden xl:table-cell px-3 sm:px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {review.review}
                          </div>
                          <div className="md:hidden mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-center">
                          {renderStars(review.rating)}
                        </td>
                        <td className="hidden md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                review.status
                              )}`}
                            >
                              {review.status}
                            </span>
                          </div>
                          {hasAdminPrivileges && (
                            <div className="mt-2 flex justify-center gap-1">
                              <button
                                onClick={() =>
                                  handleStatusChange(review._id, "approved")
                                }
                                className={`text-xs px-2 py-1 rounded ${
                                  review.status === "approved"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"
                                }`}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(review._id, "rejected")
                                }
                                className={`text-xs px-2 py-1 rounded ${
                                  review.status === "rejected"
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
                                }`}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          {canModifyReview(review) && (
                            <>
                              <button
                                onClick={() => handleEdit(review)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                <FaEdit className="inline" />
                              </button>
                              <button
                                onClick={() => handleDelete(review._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash className="inline" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                pageCount={totalPages}
                onPageChange={handlePageChange}
                currentPage={currentPage - 1}
              />
            </div>
          )}

          {/* Stats Display */}
          {reviews && reviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 mt-16">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">
                  Total Reviews
                </h3>
                <p className="text-2xl text-center">{totalReviews}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">
                  Approved Reviews
                </h3>
                <p className="text-2xl text-center text-green-600">
                  {approvedReviews}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">
                  Pending Reviews
                </h3>
                <p className="text-2xl text-center text-yellow-600">
                  {pendingReviews}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">
                  Rejected Reviews
                </h3>
                <p className="text-2xl text-center text-red-600">
                  {rejectedReviews}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-center">
                  Average Rating
                </h3>
                <p className="text-2xl text-center">{averageRating}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Regular User View - Show their own reviews and district users reviews */}
      {!hasAdminPrivileges && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-center">Your Reviews</h1>
            {!hasUserSubmittedReview && (
              <button onClick={handleAddNew} className="button mt-4 md:mt-0">
                Add New Review
              </button>
            )}
          </div>

          {userReviewsData?.data && userReviewsData.data.length > 0 ? (
            <div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Review
                        </th>
                        <th className="hidden md:table-cell px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="hidden md:table-cell px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userReviewsData.data.map((review) => (
                        <tr
                          key={review._id}
                          onClick={(e) => handleRowClick(review, e)}
                          className="cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {review.review}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                            <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                review.status
                              )}`}
                            >
                              {review.status}
                            </span>
                          </div>
                          </td>
                          <td className="hidden md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap flex justify-center">
                            {renderStars(review.rating)}
                          </td>
                          <td className="hidden md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                review.status
                              )}`}
                            >
                              {review.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            {review.status !== 'approved' &&(
                              <button
                              onClick={() => handleEdit(review)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <FaEdit className="inline" />
                            </button>
                            )}
                            <button
                              onClick={() => handleDelete(review._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash className="inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : userReviewsError ? (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-red-500 mb-2">Error loading your reviews</p>
              <p className="text-gray-500 mb-4">Please try again later</p>
              <button onClick={handleAddNew} className="button">
                Create New Review
              </button>
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">
                You haven't submitted any reviews yet.
              </p>
              {!hasUserSubmittedReview && (
                <button onClick={handleAddNew} className="button">
                  Create Your First Review
                </button>
              )}
            </div>
          )}

          {/* Search box for public reviews */}

          <h1 className="text-2xl font-bold text-center m-4 mt-10">Other Reviews</h1>

          <div className="mb-4 flex justify-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={publicReviewsSearch}
                onChange={handlePublicReviewsSearch}
                className="w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          {/* public reviews table */}
          {isPublicReviewsLoading ? (
            <div className="mt-10">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : isPublicReviewsError ? (
            <div className="mt-10 text-center text-red-600">
              Error loading public reviews. Please try again later.
            </div>
          ) : publicReviews.length > 0 ? (
            <>
              <div className="bg-white rounded-lg shadow overflow-hidden mt-10">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profile
                        </th>
                        <th className="hidden md:table-cell px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Review
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {publicReviews.map((review) => (
                        <tr
                          key={review._id}
                          onClick={(e) => handleRowClick(review, e)}
                          className="cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
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
                          <td className="hidden md:table-cell px-3 sm:px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {review.review}
                            </div>
                          </td>
                          <td className="px-6 py-4 flex justify-center">
                            {renderStars(review.rating)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Pagination for public reviews */}
              <div className="mt-4">
                <Pagination
                  pageCount={Math.ceil(publicTotalReviews / 10)}
                  onPageChange={handleDistrictReviewsPageChange}
                  currentPage={districtReviewsPage - 1}
                />
              </div>
            </>
          ) : (
            <div className="text-center mt-10">
              <p className="text-gray-600 mb-4">No public reviews available yet.</p>
            </div>
          )}

          {publicReviews.length > 0 && (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-16">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-center">
                    Total Public Reviews
                  </h3>
                  <p className="text-2xl text-center">{publicTotalReviews}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-center">
                    Average Public Rating
                  </h3>
                  <div className="flex flex-col items-center">
                    <p className="text-2xl">{publicAverageRating.toFixed(1)}</p>
                    {renderStars(publicAverageRating)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10">
          <div
            className="absolute inset-0  backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          <div className="relative z-50 flex items-center justify-center min-h-screen p-4">
            <div
              className="bg-white p-8 rounded-lg w-full max-w-2xl border border-gray-300 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">
                {isEditing ? "Edit Review" : "Create New Review"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, rating: star })
                        }
                        className="focus:outline-none"
                      >
                        <FaStar
                          className={
                            star <= formData.rating
                              ? "text-yellow-500 text-2xl"
                              : "text-gray-300 text-2xl"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Review
                  </label>
                  <textarea
                    value={formData.review}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        review: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-32"
                    placeholder="Enter your review"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.review.length}/500 characters
                  </p>
                </div>

                {hasAdminPrivileges && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Status
                    </label>
                    <CustomSelect
                      options={modalStatusDisplayOptions}
                      selected={getModalStatusDisplay(formData.status)}
                      setSelected={handleModalStatusChange}
                      placeholder="Select status..."
                    />
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="button">
                    {isEditing ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Review Details Modal */}
      {showDetailsModal && selectedReview && (
        <div className="fixed inset-0 z-10">
          <div
            className="absolute inset-0  backdrop-blur-sm"
            onClick={handleCloseDetailsModal}
          ></div>
          <div className="relative z-50 flex items-center justify-center min-h-screen p-4">
            <div
              className="bg-white p-3 md:p-8 rounded-lg w-full max-w-2xl border border-gray-300 shadow-xl mt-25"
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
                  <div className="h-16 w-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center text-xl word-brack">
                    {selectedReview.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center justify-start">
                    <span className="flex items-center">
                      <Link
                        href={
                          isAuthenticated && userRole.toLowerCase() !== 'user'
                            ? `/dashboard/users/details?id=${selectedReview.user._id}`
                            : `/profile-detail?id=${selectedReview.user._id}`
                        }
                        className="hover:text-primary transition-colors line-clamp-2 md:line-clamp-none break-all"
                      >
                        {selectedReview.user?.name || "Unknown User"}
                      </Link>

                      {selectedReview.user?.isVerified && (
                        <span className="text-primary ml-1 inline-block">
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
                    </span>
                  </h3>
                  <p className="text-gray-600">
                    {selectedReview.user?.phone || "No phone"}
                  </p>
                  <p className="text-gray-600 line-clamp-2 md:line-clamp-none break-all">
                    {selectedReview.user?.email || "No email"}
                  </p>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-lg font-semibold">Rating:</span>
                  {renderStars(selectedReview.rating)}
                  <span className="text-lg">({selectedReview.rating}/5)</span>
                </div>
                <div className="mb-4">
                  <span className="text-lg font-semibold">Review:</span>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {selectedReview.review}
                  </p>
                </div>
                {hasAdminPrivileges && (
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                        selectedReview.status
                      )}`}
                    >
                      {selectedReview.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="border-t pt-4 mt-4 text-sm text-gray-500">
                <p>
                  Created:{" "}
                  {new Date(selectedReview.createdAt).toLocaleDateString(
                    "en-GB"
                  )}{" "}
                  {new Date(selectedReview.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {/* Action Buttons */}
              {canModifyReview(selectedReview) && (
                <div className="flex justify-center md:justify-end gap-4 mt-6 border-t pt-4">
                  <button
                    onClick={() => {
                      handleCloseDetailsModal();
                      setTimeout(() => handleEdit(selectedReview), 100);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => {
                      handleCloseDetailsModal();
                      handleDelete(selectedReview._id);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              )}

              {/* Status Change Buttons for Admin */}
              {hasAdminPrivileges && (
                <div className="flex justify-center gap-2 mt-6 border-t pt-4">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReview._id, "approved");
                      handleCloseDetailsModal();
                    }}
                    className={`text-sm px-4 py-2 rounded ${
                      selectedReview.status === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReview._id, "rejected");
                      handleCloseDetailsModal();
                    }}
                    className={`text-sm px-4 py-2 rounded ${
                      selectedReview.status === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
