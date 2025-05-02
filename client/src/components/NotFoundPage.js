'use client';

import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-center sm:min-h-[calc(100vh-64px)] min-h-[calc(100vh-128px)] px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2 text-dark dark:text-gray-200">Page Not Found</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link href="/" className="button">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default NotFoundPage;