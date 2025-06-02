'use client';

import React from 'react';
import { FiMenu, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const SidebarSkeleton = ({ isMobile = false }) => {
  // Simulate 3 sections with 3-4 items each
  const skeletonSections = [
    { section: 'Core', items: 4 },
    { section: 'Teams', items: 3 },
    { section: 'Other', items: 2 }
  ];

  return (
    <>
      {/* Sidebar Skeleton */}
      <div
        className={`
          fixed top-16 left-0 z-[58] h-[calc(100vh-4rem)]
          bg-white dark:bg-gray-800 shadow-lg
          transition-all duration-300 ease-in-out
          overflow-hidden
          w-64
          ${isMobile ? 'translate-x-0' : 'translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col overflow-y-auto px-1">
          {/* Navigation Skeleton */}
          <nav className="space-y-6 flex-1 overflow-y-auto">
            {skeletonSections.map((section, idx) => (
              <div className='border-b border-gray-200 dark:border-gray-700 pb-2' key={idx}>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 px-3 animate-pulse"></div>
                <ul className="space-y-1">
                  {[...Array(section.items)].map((_, i) => (
                    <li key={i}>
                      <div className="flex items-center gap-4 px-3 py-2 rounded-lg animate-pulse">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Spacer div skeleton */}
      <div className="shrink-0 w-64"></div>
    </>
  );
};

export default SidebarSkeleton;