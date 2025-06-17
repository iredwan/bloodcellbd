"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useGetRequestByIdQuery,
} from "@/features/requests/requestApiSlice";
import { useGetUserInfoQuery } from "@/features/userInfo/userInfoApiSlice";
import ProfileCard from "@/components/ProfileCard";
import ProfileCardSkeleton from "@/components/ui/Skeletons/ProfileCardSkeleton";
import { IoRefreshCircle } from "react-icons/io5";
import { BiDonateBlood } from 'react-icons/bi';

function requestDetailsPage(requestMongoDBId) {
  const id = requestMongoDBId.requestMongoDBId;
  

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


  // const {
  //   data: userInfoData,
  //   isLoading: isLoadingUserInfo,
  //   isError: isErrorUserInfo,
  //   error: errorUserInfo,
  // } = useGetUserInfoQuery();

  // const userRole = userInfoData?.user.role || "";
  // const eligible = userInfoData?.user.eligible;
  // const processingRequest = userInfoData?.user.processingRequest || false;
  // const userId = userInfoData?.user.id || "";
  // const isUserRequest = userId === requestPersonData?._id;


 
  return (
    <div className="container mx-auto my-8">
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
            <div
              className="flex justify-center items-center"
            >
              <h1 className="text-2xl font-bold text-primary">
                Request details
              </h1>
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
                <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                  {requestData?.contactNumber}
                </p>
              </div>

              <div className="form-group">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Number
                </label>
                <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                  {requestData?.contactNumber}
                </p>
              </div>

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
       <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
              <div className="animate-pulse">
                <p className="text-2xl text-center mb-1 bg-gray-300 px-24 py-6 rounded-lg">
                </p>
                <p className="text-center mb-4 bg-gray-300 px-28 py-3 rounded-lg">
                  </p>
              </div>
              <div className="flex flex-col justify-center items-center mt-4 w-full">{ProfileCardSkeleton()}</div>
            </div>
      ) : (
        <>
          {requestData?.processingBy && (
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

          {requestData?.fulfilledBy && (
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
        </>
      )}

      {(requestData?.status === "cancelled" ||
        requestData?.status === "rejected") && (
        <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-xl py-6 px-3 md:px-6 mt-4">
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
      <button
        className="button w-50 sm:w-auto"
        title="If you want to donate blood, please click here."
      >
        <BiDonateBlood className="w-6 h-6" /> Donate Blood
      </button>
</div>



    </div>
  );
}

export default requestDetailsPage;
