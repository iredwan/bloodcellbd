"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";

export default function AmbassadorDetailsSkeleton() {
  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link
          href="/ambassador-members"
          className="inline-flex items-center button mb-3"
        >
          <FaArrowLeft className="text-md" />
          Back
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Profile Header */}
          <div className="bg-primary-light p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <Skeleton className="w-60 h-60 rounded-full" />

              <div className="flex-1 text-center md:text-left">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-6 w-32 mb-4 rounded-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Social Media */}
            <div className="mb-8">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-10 h-10 rounded-full" />
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-8">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full max-w-xl" />
                ))}
              </div>
            </div>

            {/* Events */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FaCalendarAlt className="text-primary" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 dark:bg-gray-700/30 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                  >
                    <Skeleton className="w-full aspect-video mb-4 rounded-lg" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
