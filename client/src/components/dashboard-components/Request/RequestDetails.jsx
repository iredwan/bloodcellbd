"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  useGetRequestByIdQuery,
  useRemoveProcessingByMutation,
  useCancelRequestMutation,
  useRejectRequestMutation,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
  useResetRequestMutation,
  useSetVolunteerNameMutation,
  useRemoveVolunteerNameMutation,
  useFulfillRequestMutation,
  useProcessRequestMutation,
} from "@/features/requests/requestApiSlice";
import {
  useGetUsersByUpazilaQuery,
  useGetUsersByDistrictQuery,
} from "@/features/users/userApiSlice";
import { useGetUserInfoQuery } from "@/features/userInfo/userInfoApiSlice";
import ProfileCard from "@/components/ProfileCard";
import ProfileCardSkeleton from "@/components/ui/Skeletons/ProfileCardSkeleton";
import {
  FaEdit,
  FaTimes,
  FaCheck,
  FaBan,
  FaHandsHelping,
  FaTrash,
  FaInfoCircle,
  FaCheckDouble,
  FaDownload,
  FaRegCopy,
} from "react-icons/fa";
import CustomSelect from "@/components/CustomSelect";
import HospitalSearch from "@/components/HospitalSearch";
import PersonSelector from "@/components/PersonSelector";
import deleteConfirm from "@/utils/deleteConfirm";
import { IoRefreshCircle } from "react-icons/io5";
import {
  validateContactNumber,
  validateWhatsAppNumber,
} from "@/utils/validations";
import Link from "next/link";
import { IoIosArrowDropright, IoIosArrowDropdownCircle } from "react-icons/io";
import { BiShareAlt, BiSolidDonateBlood } from "react-icons/bi";
import { toPng } from "html-to-image";
import download from "downloadjs";
import ReqFulfilledCertificate from "@/components/dashboard-components/Request/ReqFulfilledCertificate";

import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";

function requestDetailsPage(requestParamsId) {
  const id = requestParamsId.requestParamsId;
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const [isUpdateMode, setIsUpdateMode] = React.useState(false);
  const [processingBy, setProcessingBy] = useState(null);
  const [volunteerName, addVolunteerName] = useState(null);
  const [fulfilledBy, setFulfilledBy] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    contactNumber: "",
    whatsappNumber: "",
  });
  const [isFulfilledButtonVisible, setIsFulfilledButtonVisible] =
    useState(false);
  const [isPossibleDonorModalOpen, setIsPossibleDonorModalOpen] =
    useState(true);

  // RTK Query
  const {
    data: request,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetRequestByIdQuery(id);

  const requestPersonData = request?.data?.userId;
  const requestData = request?.data;
  const processingByData = request?.data?.processingBy;
  const fulfilledByData = request?.data?.fulfilledBy;
  const updatedByData = request?.data?.updatedBy;
  const volunteerNameData = request?.data?.volunteerName;
  const requestUpazila = request?.data?.upazila;
  const requestDistrict = request?.data?.district;

  const {
    data: upazilaDonorsData,
    isLoading: isLoadingUpazilaDonors,
    refetch: refetchUpazilaDonors,
  } = useGetUsersByUpazilaQuery({
    upazila: requestUpazila,
    bloodGroup: requestData?.bloodGroup,
  });

  const {
    data: districtDonorsData,
    isLoading: isLoadingDistrictDonors,
    refetch: refetchDistrictDonors,
  } = useGetUsersByDistrictQuery(
    {
      district: requestDistrict,
      bloodGroup: requestData?.bloodGroup,
    },
    {
      skip:
        isLoadingUpazilaDonors ||
        (upazilaDonorsData && upazilaDonorsData?.data?.length >= 10),
    }
  );

  const [removeProcessingBy, { isLoading: isRemovingProcessingBy }] =
    useRemoveProcessingByMutation();
  const [cancelRequest, { isLoading: isCancellingRequest }] =
    useCancelRequestMutation();
  const [rejectRequest, { isLoading: isRejectingRequest }] =
    useRejectRequestMutation();
  const [updateRequest, { isLoading: isUpdatingRequest }] =
    useUpdateRequestMutation();
  const [deleteRequest, { isLoading: isDeletingRequest }] =
    useDeleteRequestMutation();
  const [resetRequest, { isLoading: isResettingRequest }] =
    useResetRequestMutation();
  const [removeVolunteerName, { isLoading: isRemovingVolunteerName }] =
    useRemoveVolunteerNameMutation();
  const [setVolunteerName, { isLoading: isSettingVolunteerName }] =
    useSetVolunteerNameMutation();
  const [fulfillRequest, { isLoading: isFulfillingRequest }] =
    useFulfillRequestMutation();
  const [processRequest, { isLoading: isProcessingRequest }] =
    useProcessRequestMutation();

  const {
    data: userInfoData,
    isLoading: isLoadingUserInfo,
    isError: isErrorUserInfo,
    error: errorUserInfo,
  } = useGetUserInfoQuery();

  const userRole = userInfoData?.user.role || "";
  const userBloodGroup = userInfoData?.user.bloodGroup || "";
  const eligible = userInfoData?.user.eligible;
  const processingRequest = userInfoData?.user.processingRequest || false;
  const userId = userInfoData?.user.id || "";
  const isUserRequest = userId === requestPersonData?._id;
  const isBloodGroupMatch = userBloodGroup === requestData?.bloodGroup;
  const isUserFulfilled = userId === fulfilledByData?._id;

  const allowedRoles = ["Technician", "Member", "Moderator", "Monitor"];

  const upazilaCoordinators = [
    "Upazila Coordinator",
    "Upazila Co-coordinator",
    "Upazila IT & Media Coordinator",
    "Upazila Logistics Coordinator",
  ];

  const districtCoordinators = [
    "District Coordinator",
    "District Co-coordinator",
    "District IT & Media Coordinator",
    "District Logistics Coordinator",
  ];

  const admin = [
    "Divisional Coordinator",
    "Divisional Co-coordinator, Head of IT & Media",
    "Head of Logistics",
    "Admin",
  ];

  const isAllowed = allowedRoles.includes(userRole);
  const isUpazilaCoordinator = upazilaCoordinators.includes(userRole);
  const isDistrictCoordinator = districtCoordinators.includes(userRole);
  const isAdmin = admin.includes(userRole);

  const [formData, setFormData] = useState({
    bloodGroup: "",
    bloodUnit: 1,
    hospitalName: "",
    hospitalId: "",
    upazila: "",
    district: "",
    contactNumber: "",
    whatsappNumber: "",
    contactRelation: "",
    description: "",
    processingBy: "",
    status: "",
  });

  useEffect(() => {
    if (requestData) {
      setFormData({
        bloodGroup: requestData.bloodGroup || "",
        bloodUnit: requestData.bloodUnit || 1,
        hospitalName: requestData.hospitalName || "",
        hospitalId: requestData.hospitalId || "",
        upazila: requestData.upazila || "",
        district: requestData.district || "",
        contactNumber: requestData.contactNumber || "",
        whatsappNumber: requestData.whatsappNumber || "",
        contactRelation: requestData.contactRelation || "",
        description: requestData.description || "",
        processingBy: requestData.processingBy || "",
        status: requestData.status || "",
      });
    }
  }, [requestData]);

  useEffect(() => {
    if (processingBy) {
      setFormData((prev) => ({
        ...prev,
        processingBy: processingBy,
      }));
    }

    if (fulfilledBy) {
      setFormData((prev) => ({
        ...prev,
        fulfilledBy: fulfilledBy,
      }));
    }

    if (volunteerName) {
      setFormData((prev) => ({
        ...prev,
        volunteerName: volunteerName,
      }));
    }
  }, [processingBy, fulfilledBy, volunteerName]);

  // Cancel edit mode
  const handleCancelEdit = () => {
    setFormData({
      bloodGroup: requestData.bloodGroup || "",
      bloodUnit: requestData.bloodUnit || 1,
      hospitalName: requestData.hospitalName || "",
      hospitalId: requestData.hospitalId || "",
      upazila: requestData.upazila || "",
      district: requestData.district || "",
      contactNumber: requestData.contactNumber || "",
      whatsappNumber: requestData.whatsappNumber || "",
      contactRelation: requestData.contactRelation || "",
      description: requestData.description || "",
      processingBy: requestData.processingBy || "",
      status: requestData.status || "",
    });
    setIsUpdateMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (name === "contactNumber" || name === "whatsappNumber") {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleHospitalSelect = (hospitalData) => {
    setFormData((prev) => ({
      ...prev,
      hospitalName: hospitalData.name,
      hospitalId: hospitalData.id,
      district: hospitalData.district,
      upazila: hospitalData.upazila,
    }));
  };

  // Handle save update
  const handleSaveUpdate = async () => {
    // Validate phone numbers
    const contactNumberError = validateContactNumber(formData.contactNumber);
    const whatsappNumberError = validateWhatsAppNumber(formData.whatsappNumber);

    const newValidationErrors = {
      contactNumber: contactNumberError,
      whatsappNumber: whatsappNumberError,
    };

    setValidationErrors(newValidationErrors);

    // If there are validation errors, return
    if (contactNumberError || whatsappNumberError) {
      return;
    }

    try {
      const result = await updateRequest({
        id,
        requestData: formData,
      }).unwrap();

      // Check if result exists and has a status property
      if (result?.status === true) {
        toast.success(result.message);
      } else {
        toast.error(result?.message);
      }
      setIsUpdateMode(false);
      refetch();
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error(
        error.data?.message ||
          error.message ||
          "An unexpected error occurred while updating"
      );
    }
  };

  // Handle cancel request
  const handleCancelRequest = async () => {
    try {
      const result = await cancelRequest(id).unwrap();
      if (result.status === true) {
        toast.success(`${result.message}`);
        refetch();
      } else {
        toast.error(`${result?.message}`);
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
    }
  };

  // Handle reject request
  const handleRejectRequest = async () => {
    try {
      const result = await rejectRequest(id).unwrap();
      if (result.status === true) {
        toast.success(`${result.message}`);
        refetch();
      } else {
        toast.error(`${result?.message}`);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // Handle remove processingBy
  const handleRemoveProcessingBy = async () => {
    try {
      const result = await removeProcessingBy(processingByData?._id).unwrap();
      if (result.status === true) {
        toast.success(`${result.message}`);
        refetch();
      } else {
        toast.error(`${result?.message}`);
      }
    } catch (error) {
      console.error("Error removing processingBy:", error);
    }
  };

  // Handle remove volunteerName
  const handleRemoveVolunteerName = async () => {
    try {
      const result = await removeVolunteerName(volunteerNameData?._id).unwrap();
      if (result.status === true) {
        toast.success(`${result.message}`);
        refetch();
      } else {
        toast.error(`${result?.message}`);
      }
    } catch (error) {
      console.error("Error removing volunteerName:", error);
    }
  };

  // Handle delete request
  const onDelete = async (id) => {
    try {
      const result = await deleteRequest(id).unwrap();
      if (result.status === true) {
        toast.success(`${result.message}`);
        refetch();
        window.location.href = "/dashboard/requests";
      } else {
        toast.error(`${result?.message}`);
      }
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmed = await deleteConfirm({
      title: "Delete Request?",
      text: "Are you sure you want to delete this blood request? This action cannot be undone!",
      confirmButtonText: "Yes, delete request",
    });

    if (confirmed) {
      onDelete(id);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsFulfilledButtonVisible(false);
  };

  // Handle Reset Request
  const handleResetRequest = async () => {
    try {
      const result = await resetRequest(id).unwrap();
      if (result.status === true) {
        toast.success(`${result.message}`);
        refetch();
      } else {
        toast.error(`${result?.message}`);
      }
    } catch (error) {
      console.error("Error resetting request:", error);
    }
  };

  // Handle set volunteer name
  const handleSetVolunteerName = async () => {
    try {
      const result = await setVolunteerName(id).unwrap();
      if (result.status === true) {
        toast.success(`${result.message}`);
        refetch();
      } else {
        toast.error(`${result?.message}`);
      }
    } catch (error) {
      console.error("Error setting volunteer name:", error);
    }
  };

  const handlePossibleDonorModalOpen = () => {
    setIsPossibleDonorModalOpen(!isPossibleDonorModalOpen);
  };

  const handleFulfillRequest = async () => {
    const confirmed = await deleteConfirm({
      title: "Fulfill Request?",
      text: `Has this request been "fulfilled" by "${processingByData?.name}"? This action cannot be undone!`,
      confirmButtonText: "Yes, fulfill request",
      cancelButtonText: "No",
    });

    if (!confirmed) return;

    try {
      const result = await fulfillRequest(id).unwrap();
      if (result.status === true) {
        toast.success(`${result.message}`);
        refetch();
      } else {
        toast.error(`${result?.message}`);
      }
    } catch (error) {
      console.error("Error fulfilling request:", error);
    }
  };

  const handleProcess = async () => {
    try {
      const response = await processRequest(id).unwrap();
      if (response.status) {
        toast.success("Request in processed successfully");
        refetch();
      }
      if (response.status === false) {
        toast.error(`${response?.message}`);
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const certificateRef = useRef(null);

  const handleDownload = async () => {
    const images = certificateRef.current.querySelectorAll("img");
    const loadPromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    try {
      await Promise.all(loadPromises);
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        skipFonts: true,
      });
      download(
        dataUrl,
        `${fulfilledByData?.name}-blood-donation-certificate-by-BLOODCELLBD.png`
      );
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareUrl = process.env.NEXT_PUBLIC_REQUEST_URL + id;

  return (
    <div className="container mx-auto mt-10 md:mt-0">
      {/* Request person details */}
      <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">
            Request Person Details
          </h2>
          <p className="text-center mb-4 text-sm font-semibold text-gray-400">
            Create Time:{" "}
            {requestData?.createdAt
              ? new Intl.DateTimeFormat("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }).format(new Date(requestData.createdAt))
              : "N/A"}
          </p>
        </div>
        {isLoading ? (
          ProfileCardSkeleton()
        ) : (
          <ProfileCard
            id={requestPersonData?._id}
            name={requestPersonData?.name}
            phone={requestPersonData?.phone}
            imageUrl={requestPersonData?.profileImage}
            isVerified={requestPersonData?.isVerified}
            role={requestPersonData?.role}
            roleSuffix={requestPersonData?.roleSuffix}
            bloodGroup={requestPersonData?.bloodGroup}
            lastDonate={requestPersonData?.lastDonate}
            nextDonationDate={requestPersonData?.nextDonationDate}
          />
        )}
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Request details */}
        {isUpdateMode ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl py-6 px-2 md:px-6 mt-4">
            <div className="flex justify-between ">
              <h1 className="text-2xl font-bold text-primary">
                Request details
              </h1>
              <div className="grid gap-2 md:grid-cols-2">
                <button
                  onClick={handleSaveUpdate}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors flex items-center disabled:opacity-70"
                >
                  <FaCheck className="mr-1" />
                  Save
                </button>

                <button
                  onClick={handleCancelEdit}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors flex items-center"
                >
                  <FaTimes className="mr-1" />
                  Cancel
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-3xl mx-auto">
              <div className="form-group md:col-span-2">
                <label className="block mb-1 text-md text-center font-medium text-gray-700 dark:text-gray-300">
                  Request ID
                </label>
                <p className="w-full px-4 py-2.5 text-center rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                  {requestData?.requestId}
                </p>
              </div>

              <div>
                <CustomSelect
                  options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                  selected={formData.bloodGroup}
                  setSelected={(value) =>
                    setFormData((prev) => ({ ...prev, bloodGroup: value }))
                  }
                  label="Blood Group"
                  placeholder="Select Blood Group"
                />
              </div>

              <div>
                <label
                  htmlFor="bloodUnit"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Blood Units
                </label>
                <input
                  type="number"
                  name="bloodUnit"
                  id="bloodUnit"
                  value={formData.bloodUnit}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 input-number-hide-spinner"
                />
              </div>

              <div>
                <HospitalSearch
                  onHospitalSelect={handleHospitalSelect}
                  initialHospital={
                    requestData
                      ? {
                          name: requestData.hospitalName,
                          district: requestData.district,
                          upazila: requestData.upazila,
                          id: requestData.hospitalId,
                        }
                      : null
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  id="contactNumber"
                  placeholder="Contact Number (e.g., 01712345678)"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 pr-10 border ${
                    validationErrors.contactNumber
                      ? "border-red-500"
                      : "border-neutral-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                />
                {validationErrors.contactNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors.contactNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="whatsappNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Whatsapp Number
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  id="whatsappNumber"
                  placeholder="Whatsapp Number (e.g., 01712345678)"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 pr-10 border ${
                    validationErrors.whatsappNumber
                      ? "border-red-500"
                      : "border-neutral-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                />
                {validationErrors.whatsappNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors.whatsappNumber}
                  </p>
                )}
              </div>

              <div>
                <CustomSelect
                  options={[
                    "Aunt",
                    "Brother",
                    "Brother-in-law",
                    "Business Partner",
                    "Colleague",
                    "Cousin",
                    "Daughter",
                    "Daughter-in-law",
                    "Employer",
                    "Father",
                    "Father-in-law",
                    "Friend",
                    "Grandfather",
                    "Grandmother",
                    "Grandson",
                    "Himself",
                    "Mother",
                    "Mother-in-law",
                    "Nephew",
                    "Niece",
                    "Others",
                    "Sister",
                    "Sister-in-law",
                    "Son",
                    "Son-in-law",
                    "Uncle",
                  ]}
                  selected={formData.contactRelation}
                  setSelected={(value) =>
                    setFormData((prev) => ({ ...prev, contactRelation: value }))
                  }
                  label="Contact Person Relation"
                  placeholder="Select Contact Person Relation"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                ></textarea>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed">
                  {formData?.status}
                </p>
              </div>

              {userRole !== "user" && (
                <div>
                  <PersonSelector
                    onSelect={setProcessingBy}
                    label={"Processing By"}
                    initialValue={processingByData?.name}
                  />
                  {requestData.processingBy && (
                    <button
                      onClick={handleRemoveProcessingBy}
                      className="button mt-2"
                    >
                      Remove Processing By
                    </button>
                  )}
                </div>
              )}

              {userRole !== "user" && (
                <div>
                  <PersonSelector
                    onSelect={addVolunteerName}
                    label={"Volunteer Name"}
                    initialValue={volunteerNameData?.name}
                  />
                  {requestData.volunteerName && (
                    <button
                      onClick={handleRemoveVolunteerName}
                      className="button mt-2"
                    >
                      Remove Volunteer Name
                    </button>
                  )}
                </div>
              )}

              {isFulfilledButtonVisible ? (
                <div className="form-group md:col-span-2 flex justify-center">
                  <div className="max-w-md">
                    <PersonSelector
                      onSelect={setFulfilledBy}
                      label={"Fulfilled By"}
                      initialValue={fulfilledByData?.name}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <FaInfoCircle className="mr-1 inline-block" />
                      Please select the person who fulfilled the request. Don't
                      mark fulfilled if{" "}
                      <span className="font-semibold text-md">
                        blood donation is not completed
                      </span>
                      .
                    </p>
                    <button
                      onClick={handleCancel}
                      className="button mt-4 text-center"
                    >
                      <FaTimes className="inline-block mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                userRole !== "user" && (
                  <div className="form-group md:col-span-2 flex justify-center">
                    <button
                      onClick={() => setIsFulfilledButtonVisible(true)}
                      className="button mt-4 text-center"
                    >
                      <FaCheck className="inline-block mr-2" />
                      Make Request Fulfilled
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl py-6 px-2 md:px-6 mt-4">
            <div
              className={`flex ${
                (isUserRequest || userRole !== "user") &&
                requestData?.status !== "fulfilled" &&
                requestData?.status !== "cancelled" &&
                requestData?.status !== "rejected"
                  ? "justify-between"
                  : "justify-center"
              } items-center`}
            >
              <h1 className="text-2xl font-bold text-primary">
                Request details
              </h1>

              {(isUserRequest || userRole !== "user") &&
                requestData?.status !== "fulfilled" &&
                requestData?.status !== "cancelled" &&
                requestData?.status !== "rejected" && (
                  <button
                    onClick={() => setIsUpdateMode(true)}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-3xl mx-auto">
              <div className="form-group md:col-span-2">
                <label className="block mb-1 text-md text-center font-medium text-gray-700 dark:text-gray-300">
                  Request ID
                </label>
                <p className="w-full px-4 py-2.5 text-center rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                  {requestData?.requestId}
                </p>
              </div>

              <div className="form-group">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Blood Group
                </label>
                <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                  {requestData?.bloodGroup}
                </p>
              </div>

              <div className="form-group">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Blood Units
                </label>
                <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                  {requestData?.bloodUnit}
                </p>
              </div>

              <div className="form-group">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hospital Name
                </label>
                <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                  {requestData?.hospitalName}
                </p>
              </div>

              <div className="form-group">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  District
                </label>
                <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                  {requestData?.district}
                </p>
              </div>

              <div className="form-group">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upazila
                </label>
                <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                  {requestData?.upazila}
                </p>
              </div>

              <div className="form-group">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Number
                </label>
                <a
                  href={`tel:${requestData?.contactNumber}`}
                  className="block w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {requestData?.contactNumber}
                </a>
              </div>

              {requestData?.whatsappNumber && (
                <div className="form-group">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Whatsapp Number
                  </label>
                  <a
                    href={`https://wa.me/${requestData?.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {requestData?.whatsappNumber}
                  </a>
                </div>
              )}

              <div className="form-group">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Person Relation with Patient
                </label>
                <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                  {requestData?.contactRelation}
                </p>
              </div>

              <div className="form-group md:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <p
                  className={`w-full px-4 ${
                    requestData?.description ? "py-2.5" : "py-20"
                  } rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white`}
                >
                  {requestData?.description}
                </p>
              </div>

              <div className="form-group">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <p className={`w-full px-4 py-2.5 rounded-lg transition-all ${
                  requestData?.status === "pending"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    : requestData?.status === "fulfilled"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : requestData?.status === "processing"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : "bg-primary text-white"
                }`}>
                  {requestData?.status}
                </p>
              </div>

              {requestData?.fulfilledBy && (
                <div className="form-group">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fulfilled By
                  </label>
                  <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                    {requestData?.fulfilledBy.name}
                  </p>
                </div>
              )}

              {requestData?.processingBy && (
                <div className="form-group">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Processing By
                  </label>
                  <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                    {requestData?.processingBy.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </form>

      {/* Potential Donors Table */}
      {requestData?.status === "pending" &&
        (userRole !== "user" || isUserRequest === true) && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl py-6 px-2 md:px-6 mt-4">
            {!isPossibleDonorModalOpen ? (
              <h2
                onClick={handlePossibleDonorModalOpen}
                className="text-md md:text-2xl flex items-center justify-center text-center font-bold text-primary mb-4 cursor-pointer"
              >
                {" "}
                Click to Show Potential Donors
                <IoIosArrowDropright className="ml-2" />
              </h2>
            ) : (
              <h2
                onClick={handlePossibleDonorModalOpen}
                className="text-md md:text-2xl flex items-center justify-center text-center font-bold text-primary mb-4 cursor-pointer"
              >
                {" "}
                Click to Hide Potential Donors
                <IoIosArrowDropdownCircle className="ml-2" />
              </h2>
            )}
            {isPossibleDonorModalOpen && (
              <div className="w-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-300 dark:border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-200 dark:bg-gray-600">
                        <tr>
                          <th className="px-3 sm:px-4 py-3 text-center md:text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Profile
                          </th>
                          <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-3 sm:px-4 py-3 text-center md:text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Blood Group
                          </th>
                          <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Last Donate
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {[
                          ...Array.from(
                            new Map([
                              ...(upazilaDonorsData?.data?.map((donor) => [
                                donor._id,
                                { ...donor, source: "upazila" },
                              ]) || []),
                              ...(districtDonorsData?.data?.map((donor) => [
                                donor._id,
                                { ...donor, source: "district" },
                              ]) || []),
                            ]).values()
                          ),
                        ].map((donor) => {
                          const profileSrc = donor.profileImage
                            ? `${imageUrl}/${donor.profileImage}`
                            : donor.gender === "Male"
                            ? "/image/user-male.png"
                            : "/image/user-female.png";

                          return (
                            <tr
                              key={`${donor.source}-${donor._id}`}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              {/* Profile (desktop: only image) */}
                              <td className="px-3 py-3 align-top text-center sm:text-left">
                                <div className="flex justify-center sm:justify-start">
                                  <img
                                    src={profileSrc}
                                    alt="user"
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                </div>

                                {/* Mobile view full profile block */}
                                <div className="text-center md:hidden mt-2">
                                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    <Link
                                      href={
                                        isAdmin ||
                                        isDistrictCoordinator ||
                                        isUpazilaCoordinator ||
                                        isAllowed
                                          ? `/dashboard/users/details?id=${donor._id}`
                                          : `/profile-detail?id=${donor._id}`
                                      }
                                    >
                                      {donor.name}
                                    </Link>
                                  </div>
                                  <div className="text-xs mt-1">
                                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary font-semibold rounded-full">
                                      {donor.bloodGroup}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Gender: {donor.gender || "Not specified"}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Last Donate:{" "}
                                    {donor.lastDonate
                                      ? donor.lastDonate
                                      : "Never"}
                                  </div>
                                </div>
                              </td>

                              {/* Name (only desktop) */}
                              <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4 align-top">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  <Link
                                    href={
                                      isAdmin ||
                                      isDistrictCoordinator ||
                                      isUpazilaCoordinator ||
                                      isAllowed
                                        ? `/dashboard/users/details?id=${donor._id}`
                                        : `/profile-detail?id=${donor._id}`
                                    }
                                  >
                                    {donor.name}
                                  </Link>
                                </div>
                              </td>

                              {/* Contact (both views) */}
                              <td className="px-3 sm:px-4 py-3 sm:py-4 text-center sm:text-left align-middle">
                                <div className="h-full flex flex-col justify-center items-center sm:items-start text-sm text-gray-700 dark:text-gray-300">
                                  <a
                                    href={`tel:${donor.phone}`}
                                    className="block hover:text-primary"
                                  >
                                    {donor.phone}
                                  </a>
                                  {donor.whatsappNumber && (
                                    <a
                                      href={`https://wa.me/${donor.whatsappNumber}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block mt-2 hover:text-green-500 text-sm"
                                    >
                                      WhatsApp: {donor.whatsappNumber}
                                    </a>
                                  )}
                                </div>
                              </td>

                              {/* Blood Group (only desktop) */}
                              <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4 align-top">
                                <span className="px-2 py-1 text-xs bg-primary/10 text-primary font-semibold rounded-full">
                                  {donor.bloodGroup}
                                </span>
                              </td>

                              {/* Last Donate (only desktop) */}
                              <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4 align-top">
                                <div className="text-sm text-gray-500 dark:text-gray-300">
                                  {donor.lastDonate
                                    ? donor.lastDonate
                                    : "Never"}
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                        {/* No Donor Fallback */}
                        {!upazilaDonorsData?.data?.length &&
                          !districtDonorsData?.data?.length && (
                            <tr>
                              <td
                                colSpan="5"
                                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                              >
                                No potential donors found in your area
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      {isLoading ? (
        <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
          <div className="animate-pulse">
            <p className="text-2xl text-center mb-1 bg-gray-300 px-24 py-6 rounded-lg"></p>
            <p className="text-center mb-4 bg-gray-300 px-28 py-3 rounded-lg"></p>
          </div>
          <div className="flex flex-col justify-center items-center mt-4 w-full">
            {ProfileCardSkeleton()}
          </div>
        </div>
      ) : (
        <>
          {requestData?.processingBy && (
            <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
              <div>
                <h2 className="text-xl md:text-2xl text-center font-bold text-primary mb-4 px-2">
                  Interested in donating, blood donor details
                </h2>
              </div>
              <ProfileCard
                id={processingByData?._id}
                name={processingByData?.name}
                phone={processingByData?.phone}
                imageUrl={processingByData?.profileImage}
                isVerified={processingByData?.isVerified}
                role={processingByData?.role}
                roleSuffix={processingByData?.roleSuffix}
                bloodGroup={processingByData?.bloodGroup}
                lastDonate={processingByData?.lastDonate}
                nextDonationDate={processingByData?.nextDonationDate}
              />
            </div>
          )}

          {requestData?.fulfilledBy && (
            <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {isUserFulfilled
                    ? "Congratulations! You save a life."
                    : "Blood Donor Details"}
                </h2>

                {isUserFulfilled && (
                  <>
                    {/* Hidden Certificate Component */}
                    <div
                      style={{ position: "absolute", left: "-9999px", top: 0 }}
                    >
                      <ReqFulfilledCertificate
                        ref={certificateRef}
                        name={fulfilledByData?.name}
                        bloodGroup={fulfilledByData?.bloodGroup}
                        profileImage={fulfilledByData?.profileImage}
                        donationDate={fulfilledByData?.lastDonate}
                        nextDonationDate={fulfilledByData?.nextDonationDate}
                        policeStation={fulfilledByData?.upazila}
                        district={fulfilledByData?.district}
                        requestId={requestData?.requestId}
                      />
                    </div>
                    {/* Visible Button Only */}
                    <div className="flex justify-center items-center mb-4">
                      <button
                        onClick={handleDownload}
                        className="button w-50 sm:w-auto"
                      >
                        <FaDownload /> Download Card
                      </button>
                    </div>
                  </>
                )}
              </div>

              <ProfileCard
                id={fulfilledByData?._id}
                name={fulfilledByData?.name}
                phone={fulfilledByData?.phone}
                imageUrl={fulfilledByData?.profileImage}
                isVerified={fulfilledByData?.isVerified}
                role={fulfilledByData?.role}
                roleSuffix={fulfilledByData?.roleSuffix}
                bloodGroup={fulfilledByData?.bloodGroup}
                lastDonate={fulfilledByData?.lastDonate}
                nextDonationDate={fulfilledByData?.nextDonationDate}
              />
            </div>
          )}

          {requestData?.volunteerName && (
            <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Dedicated Volunteer Details
                </h2>
                <p className="text-center mb-4 text-sm font-semibold text-gray-400">
                  For any information, please call without hesitation.
                </p>
              </div>
              <ProfileCard
                id={volunteerNameData?._id}
                name={volunteerNameData?.name}
                phone={volunteerNameData?.phone}
                imageUrl={volunteerNameData?.profileImage}
                isVerified={volunteerNameData?.isVerified}
                role={volunteerNameData?.role}
                roleSuffix={volunteerNameData?.roleSuffix}
                bloodGroup={volunteerNameData?.bloodGroup}
                lastDonate={volunteerNameData?.lastDonate}
                nextDonationDate={volunteerNameData?.nextDonationDate}
              />
            </div>
          )}

          {requestData?.updatedBy &&
            (isAdmin ||
              isDistrictCoordinator ||
              isUpazilaCoordinator ||
              isAllowed) && (
              <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
                <div>
                  <h2 className="text-2xl text-center font-bold text-primary mb-1">
                    Last Editor Details
                  </h2>
                  <p className="text-center mb-4 text-sm font-semibold text-gray-400">
                    Last Update:{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }).format(new Date(requestData?.updatedAt))}
                  </p>
                </div>
                <ProfileCard
                  id={updatedByData?._id}
                  name={updatedByData?.name}
                  phone={updatedByData?.phone}
                  imageUrl={updatedByData?.profileImage}
                  isVerified={updatedByData?.isVerified}
                  role={updatedByData?.role}
                  roleSuffix={updatedByData?.roleSuffix}
                  bloodGroup={updatedByData?.bloodGroup}
                  lastDonate={updatedByData?.lastDonate}
                  nextDonationDate={updatedByData?.nextDonationDate}
                />
              </div>
            )}
        </>
      )}

      {(requestData?.status === "cancelled" ||
        requestData?.status === "rejected") && (
        <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4 text-center">
              {requestData?.status === "cancelled"
                ? "Your Request Cancelled"
                : "Your Request Rejected"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
              Place contact us if it is a mistake
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row sm:justify-end items-center gap-3 justify-center">
        {(isUpazilaCoordinator || isDistrictCoordinator || isAdmin) && (
          <div>
            {(requestData?.status === "pending" ||
              requestData?.status === "processing") && (
              <button
                onClick={handleRejectRequest}
                className="button w-50 sm:w-auto"
              >
                <FaBan />
                Reject request
              </button>
            )}
          </div>
        )}

        {(isUpazilaCoordinator ||
          isDistrictCoordinator ||
          isAdmin ||
          isUserRequest) && (
          <div>
            {(requestData?.status === "pending" ||
              requestData?.status === "processing") && (
              <button
                onClick={handleCancelRequest}
                className="button w-50 sm:w-auto"
              >
                <FaTimes /> Cancel request
              </button>
            )}
          </div>
        )}

        {userRole !== "user" &&
          !requestData?.volunteerName &&
          !isUserRequest && (
            <div>
              {(requestData?.status === "pending" ||
                requestData?.status === "processing") && (
                <button
                  onClick={handleSetVolunteerName}
                  className="button w-50 sm:w-auto"
                >
                  <FaHandsHelping /> Help to find donor
                </button>
              )}
            </div>
          )}

        {eligible !== false &&
          processingRequest === false &&
          !isUserRequest &&
          isBloodGroupMatch && (
            <div>
              {requestData?.status === "pending" && (
                <button
                  onClick={handleProcess}
                  className="button w-50 sm:w-auto"
                >
                  <BiSolidDonateBlood /> Donate Blood
                </button>
              )}
            </div>
          )}

        {isUserRequest && (
          <div>
            {requestData?.status === "processing" && (
              <button
                onClick={handleFulfillRequest}
                className="button w-50 sm:w-auto"
              >
                <FaCheckDouble /> Fulfill request
              </button>
            )}
          </div>
        )}

        {(userRole === "District Coordinator" || userRole === "Admin") && (
          <div>
            <button onClick={handleDelete} className="button w-50 sm:w-auto">
              <FaTrash /> Delete request
            </button>
          </div>
        )}

        {(isUpazilaCoordinator ||
          isDistrictCoordinator ||
          userRole === "Admin") &&
          (requestData?.status === "cancelled" ||
            requestData?.status === "rejected" ||
            requestData?.status === "fulfilled") && (
            <div>
              <button
                onClick={handleResetRequest}
                className="button w-50 sm:w-auto"
              >
                <IoRefreshCircle className="w-6 h-6" /> Reset request
              </button>
            </div>
          )}

        {/* ✅ Share Button */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="button w-50 sm:w-auto"
            title="Share this blood request"
          >
            <BiShareAlt className="w-4 h-4" /> Share
          </button>

          {showShareMenu && (
            <div className="absolute right-0 mt-2 p-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl z-20 flex justify-center items-center gap-2">
              <FacebookShareButton
                url={shareUrl}
                className="flex items-center justify-center"
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>

              <WhatsappShareButton
                url={shareUrl}
                className="flex items-center justify-center"
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>

              <TwitterShareButton
                url={shareUrl}
                className="flex items-center justify-center"
              >
                <XIcon size={32} round />
              </TwitterShareButton>

              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied to clipboard!");
                  setShowShareMenu(false);
                }}
                className="p-2 bg-primary hover:bg-primary/90 text-white flex items-center justify-center rounded-full transition duration-150 mr-1 cursor-pointer"
                title="Copy link to clipboard"
              >
                <FaRegCopy className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Add click outside handler to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowShareMenu(false)}
        ></div>
      )}
    </div>
  );
}

export default requestDetailsPage;
