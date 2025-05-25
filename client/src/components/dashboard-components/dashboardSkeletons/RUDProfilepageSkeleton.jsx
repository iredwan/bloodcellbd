"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  FaUser,
  FaPhone,
  FaTint,
  FaShieldAlt,
  FaImage,
  FaUserFriends,
} from "react-icons/fa";

const RUDProfilePageSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-6">      {/* User Basic Info Card */}
      <div className="rounded-lg overflow-hidden">
        <div className="grid grid-col gap-6 justify-center p-4">
          <Skeleton className="h-40 w-40 rounded-full mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
      </div>      {/* Form Sections */}
      <div className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaUser className="text-primary" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaPhone className="text-primary" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <div className="col-span-2">
                <Skeleton className="h-5 w-full mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaTint className="text-primary" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Skeleton className="h-8 w-full mb-2" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Role & Access Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-primary" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaImage className="text-primary" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-5 w-32" />
                  <div className="relative">
                    <Skeleton className="h-60 w-full rounded-lg" />
                    <Skeleton className="absolute bottom-4 left-1/2 transform -translate-x-1/2 h-8 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reference Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center">
            <div className="flex items-center gap-2">
              <FaUserFriends className="text-primary" />
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                Reference Information
              </span>
            </div>
          </div>
          <div className="p-6">
            {/* Reference Card */}
            <div className="mb-8">
              <Skeleton className="h-6 w-40 mx-auto mb-4" />
              <div className="max-w-sm mx-auto bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Updated By Card */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <Skeleton className="h-6 w-32 mx-auto mb-4" />
              <div className="max-w-sm mx-auto bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <div className="mt-6 flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
};

export default RUDProfilePageSkeleton;