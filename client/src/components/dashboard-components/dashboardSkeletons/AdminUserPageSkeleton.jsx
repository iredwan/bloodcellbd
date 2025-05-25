"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { FaUser, FaUserPlus, FaSearch } from 'react-icons/fa';

const AdminUserPageSkeleton = () => {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Main Content Area */}
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    <Skeleton className="h-4 w-12" />
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    <Skeleton className="h-4 w-12" />
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                        <div className="ml-3">
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2 sm:space-x-3">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-6 w-6 rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-3 sm:px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center">
              <Skeleton className="h-8 w-64" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPageSkeleton;