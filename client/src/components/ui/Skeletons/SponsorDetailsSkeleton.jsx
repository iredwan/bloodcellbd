import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SponsorDetailsSkeleton() {
  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Cover Image Skeleton */}
        <Skeleton className="h-72 w-full rounded-xl shadow-xl mb-8" />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full md:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md text-center">
              {/* Logo Skeleton */}
              <Skeleton className="w-48 h-48 mx-auto rounded-full mb-6" />

              {/* Badge Skeleton */}
              <div className="flex justify-center items-center mb-4">
                <Skeleton className="w-10 h-10 rounded-full mr-2" />
                <Skeleton className="w-32 h-6" />
              </div>

              {/* Website Skeleton */}
              <Skeleton className="mx-auto mt-4 h-10 w-40 rounded-full" />
            </div>

            {/* Contact Person Card Skeleton */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <Skeleton className="h-6 w-32 mb-4 mx-auto" />
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md mb-8">
              <Skeleton className="h-8 w-2/3 mb-6" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-5/6 mb-2" />
              <Skeleton className="h-5 w-3/4" />
            </div>

            {/* Events Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
              <Skeleton className="h-6 w-1/2 mb-6" />
              {[1, 2].map(i => (
                <div key={i} className="flex gap-4 mb-4">
                  <Skeleton className="w-24 h-24 rounded-md flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button Skeleton */}
        <div className="mt-8 text-center">
          <Skeleton className="h-10 w-25 mx-auto rounded-md" />
        </div>
      </div>
    </div>
  );
}