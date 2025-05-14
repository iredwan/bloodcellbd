'use client';

import { Skeleton } from "@/components/ui/skeleton";

const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      {/* Image Skeleton */}
      <div className="relative h-48 overflow-hidden">
        <Skeleton className="w-full h-full object-cover" />
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-[80%]" />
        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />

        {/* Event Details Box */}
        <div className="bg-gray-100 p-4 rounded-lg dark:bg-gray-700 space-y-4">
          {/* Date & Time */}
          <div className="space-y-2 border-b-2 border-gray-500 dark:border-gray-400 pb-3">
            <Skeleton className="h-4 w-[60%] mx-auto" />
            <Skeleton className="h-4 w-[50%] mx-auto" />
          </div>

          {/* Location */}
          <Skeleton className="h-4 w-[70%] mx-auto" />

          {/* Organizer */}
          <div className="pt-3 border-t-2 border-gray-500 dark:border-gray-400 space-y-3">
            <Skeleton className="h-4 w-[30%] mx-auto" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-[100px] h-[100px] rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
};

export default EventCardSkeleton;
