'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function EventDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back button */}
        <Skeleton className="w-24 h-10 rounded-md" />

        {/* Event Image Banner */}
        <div className="w-full h-64 rounded-lg overflow-hidden">
          <Skeleton className="w-full h-full object-cover" />
        </div>

        {/* Title & Meta */}
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-[60%] mx-auto" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column (Event details, location, images) */}
          <div className="md:col-span-2 space-y-6">
            {/* Event Description */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[85%]" />
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>

            {/* Event Images */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-4">
              <Skeleton className="h-6 w-36" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sponsor info) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-fit">
            <div className="p-6 space-y-6">
              <Skeleton className="h-6 w-32 mx-auto" />

              <div className="flex flex-col items-center space-y-6">
                {/* Logo */}
                <div className="w-40 h-40 rounded-full overflow-hidden">
                  <Skeleton className="w-full h-full rounded-full" />
                </div>
                {/* Sponsor badge */}
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>

              {/* Sponsor name and website */}
              <div className="space-y-2 text-center">
                <Skeleton className="h-5 w-40 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-4 w-[70%] mx-auto" />
              </div>

              {/* Contact Person */}
              <div className="text-center space-y-2">
                <Skeleton className="h-5 w-32 mx-auto" />
                <Skeleton className="h-4 w-36 mx-auto" />
                <Skeleton className="h-4 w-28 mx-auto" />
                <Skeleton className="h-4 w-40 mx-auto" />
                <Skeleton className="h-4 w-28 mx-auto" />
              </div>
            </div>

            {/* Cover Image */}
            <div className="h-40 w-full">
              <Skeleton className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
