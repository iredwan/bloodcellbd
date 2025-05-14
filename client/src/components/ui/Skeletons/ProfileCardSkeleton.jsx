import React from "react";

const ProfileCardSkeleton = () => {
  return (
    <div className="relative w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-[18px] shadow-md p-6 animate-pulse">
      {/* Content */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Image */}
        <div className="w-28 h-28 rounded-full bg-gray-300 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 shrink-0" />

        {/* Info */}
        <div className="text-center md:text-left space-y-3 w-full">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mx-auto md:mx-0"></div>

          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto md:mx-0"></div>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32" />
          </div>

          <div className="flex justify-center md:justify-start items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>

          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40 mx-auto md:mx-0" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto md:mx-0" />
        </div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;
