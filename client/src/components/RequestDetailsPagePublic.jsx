"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useGetRequestByIdQuery,
  useProcessRequestMutation,
} from "@/features/requests/requestApiSlice";
import {
  selectUserInfo,
  selectIsAuthenticated,
} from "@/features/userInfo/userInfoSlice";
import ProfileCard from "@/components/ProfileCard";
import ProfileCardSkeleton from "@/components/ui/Skeletons/ProfileCardSkeleton";
import { BiDonateBlood, BiShareAlt} from "react-icons/bi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaEdit, FaRegCopy } from "react-icons/fa";
import { useTopLoader } from "nextjs-toploader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";
import { QRCodeSVG } from 'qrcode.react';

function requestDetailsPagePublic(requestMongoDBId) {
  const id = requestMongoDBId.requestMongoDBId;
  const router = useRouter();
  const { start, done } = useTopLoader();
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  const [processRequest] = useProcessRequestMutation();

  const userInfo = useSelector(selectUserInfo);
  const eligible = userInfo?.eligible;
  const userRole = userInfo?.role;
  const userBloodGroup = userInfo?.bloodGroup;
  const processingRequest = userInfo?.processingRequest;
  const isAuthenticated = useSelector(selectIsAuthenticated);

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

  const divisionalCoordinators = [
    "Divisional Coordinator",
    "Divisional Co-coordinator",
  ];

  const admin = ["Head of IT & Media", "Head of Logistics", "Admin"];

  const isAllowed = allowedRoles.includes(userRole);
  const isUpazilaCoordinator = upazilaCoordinators.includes(userRole);
  const isDistrictCoordinator = districtCoordinators.includes(userRole);
  const isDivisionalCoordinator = divisionalCoordinators.includes(userRole);
  const isAdmin = admin.includes(userRole);

  const userRequest = requestPersonData?._id === userInfo?.id;

  //handleDonateClick
  const handleDonateClick = async () => {
    if (isAuthenticated) {
      try {
        const response = await processRequest(id).unwrap();

        if (response.status === true) {
          toast.success("Request processed successfully");
          start();
          router.push(`/dashboard/requests/details/${id}`);
        } else {
          toast.error(response.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error processing request:", error);
        toast.error("Failed to process the request");
      }
    } else {
      toast.error("Please login first");
      window.open(`/login`, "_blank");
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Format WhatsApp URL
  const getWhatsAppUrl = (phone) => {
    // Remove any non-digit characters from phone number
    const cleanPhone = phone?.replace(/\D/g, '');
    return cleanPhone ? `https://wa.me/${cleanPhone}` : null;
  };

  // QR Code Section Component
  const QRCodeSection = () => (
    <div className="bg-white hidden md:block dark:bg-gray-800 rounded-lg p-6 mt-8">
  <div className="flex justify-center items-center mb-4">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
      QR Codes
    </h3>
  </div>

  <div
    className={`${
      getWhatsAppUrl(requestData?.whatsappNumber)
        ? "grid grid-cols-1 md:grid-cols-2 gap-6"
        : "flex justify-center"
    }`}
  >
    {/* Phone QR Code */}
    <div className="flex flex-col items-center">
      <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        Phone Number
      </h4>
      <div className="bg-white p-4 rounded-lg">
        <QRCodeSVG
          value={`tel:${requestData?.contactNumber}`}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Scan to call
      </p>
    </div>

    {/* WhatsApp QR Code */}
    {getWhatsAppUrl(requestData?.whatsappNumber) && (
      <div className="flex flex-col items-center">
        <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          WhatsApp
        </h4>
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            value={getWhatsAppUrl(requestData?.whatsappNumber)}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Scan to message on WhatsApp
        </p>
      </div>
    )}
  </div>
</div>

  );

  return (
    <div className="container mx-auto my-8 px-3">
      {/* Request person details */}
      <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6">
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

      <div className="bg-white dark:bg-gray-800 rounded-xl py-6 px-2 md:px-6 mt-4">
        <div className="flex justify-center items-center">
          <h1 className="text-2xl font-bold text-primary">Request details</h1>
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
            <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
              {requestData?.status}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <>
          <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
            <Skeleton className="flex flex-col justify-center items-center mt-4 h-30 w-full"></Skeleton>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:justify-end items-center gap-3 justify-center">
            <Skeleton className="w-50 h-10"></Skeleton>
          </div>
        </>
      ) : (
        <>
          {isAuthenticated && requestData?.processingBy && (
            <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
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

          {isAuthenticated && requestData?.fulfilledBy && (
            <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Blood Donor Details
                </h2>
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

          {!isAuthenticated && (
            <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
              <div className="text-center">
                {requestData?.status === "processing" && (
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Thank you for your interest. This request is already being
                    processed.
                  </h2>
                )}
                {requestData?.status === "fulfilled" && (
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Thank you for your interest. This request is already
                    fulfilled.
                  </h2>
                )}
                {requestData?.status === "cancelled" && (
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Thank you for your interest. This request is already
                    cancelled.
                  </h2>
                )}
                {requestData?.status === "rejected" && (
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Thank you for your interest. This request is already
                    rejected.
                  </h2>
                )}
                {requestData?.status === "pending" && (
                  <>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Please login to donate blood.
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-100 mt-1">
                      Clicking the button below will take you to the login page.
                      Log in and reload this page.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {processingRequest === true &&
            requestData?.status !== "processing" &&
            requestData?.status !== "fulfilled" &&
            requestData?.status !== "cancelled" &&
            requestData?.status !== "rejected" &&
            !userRequest && (
              <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-4 text-center">
                    You are already processing a request.
                  </h2>
                </div>
              </div>
            )}

          {(requestData?.status === "cancelled" ||
            requestData?.status === "rejected") && (
            <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-4 text-center">
                  {requestData?.status === "cancelled"
                    ? "This Request is Cancelled"
                    : "This Request is Rejected"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                  Place contact us if it is a mistake
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row sm:justify-end items-center gap-3 justify-center">
            {!isAuthenticated && (
              <button
                onClick={() => window.open(`/login`, "_blank")}
                className="button w-50 sm:w-auto"
                title="If you want to donate blood, please click here."
              >
                <BiDonateBlood className="w-4 h-4" /> Donate Blood
              </button>
            )}

            {requestData?.status !== "processing" &&
              requestData?.status !== "fulfilled" &&
              requestData?.status !== "cancelled" &&
              requestData?.status !== "rejected" &&
              processingRequest === false &&
              eligible === true && userBloodGroup === requestData?.bloodGroup && (
                <button
                  onClick={handleDonateClick}
                  className="button w-50 sm:w-auto"
                  title="If you want to donate blood, please click here."
                >
                  <BiDonateBlood className="w-4 h-4" /> Donate Blood
                </button>
            )}

            {(isAllowed ||
              isUpazilaCoordinator ||
              isDistrictCoordinator ||
              isDivisionalCoordinator ||
              isAdmin ||
              userRequest) && (
              <button
                onClick={() => {
                  start();
                  router.push(`/dashboard/requests/details/${id}`);
                }}
                className="button w-50 sm:w-auto"
                title="If you want to edit the request, please click here."
              >
                <FaEdit className="w-4 h-4" /> Edit Request
              </button>
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
        </>
      )}

      {/* QR Codes Section - Always show at bottom */}
      {requestData?.contactNumber && (
      <QRCodeSection />
      )}

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

export default requestDetailsPagePublic;
