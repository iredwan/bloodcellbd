'use client';

import { useState, useEffect } from 'react';
import { useGetAllAmbassadorsQuery } from '@/features/goodwillAmbassador/goodwillAmbassadorApiSlice';
import { FaSpinner, FaFacebook, FaYoutube, FaInstagram, FaLinkedin, FaTiktok, FaTwitter, FaGlobe } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import AmbassadorCardSkeleton from '@/components/ui/Skeletons/AmbassadorCardSkeleton';

const AmbassadorCard = ({ ambassador }) => {
    const { name, designation, profileImage, position, organization, socialMedia, achievements = [], _id } = ambassador;
    const profileImageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  
    const icons = {
      facebook: <FaFacebook className="w-5 h-5 text-[#1877F2]" />,
      youtube: <FaYoutube className="w-5 h-5 text-[#FF0000]" />,
      instagram: <FaInstagram className="w-5 h-5 text-[#E4405F]" />,
      linkedin: <FaLinkedin className="w-5 h-5 text-[#0A66C2]" />,
      tiktok: <FaTiktok className="w-5 h-5 text-black dark:text-white" />,
      x: <FaTwitter className="w-5 h-5 text-[#1DA1F2]" />,
      website: <FaGlobe className="w-5 h-5 text-green-600" />,
    };
  
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group text-center">
        {/* Profile Image Container */}
        <div className="relative w-full h-40 bg-primary flex justify-center items-end pb-4">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-40 h-40">
            <div className="relative w-full h-full rounded-full ring-4 ring-white dark:ring-gray-800 shadow-lg overflow-hidden">
              <Image
                src={`${profileImageUrl}${profileImage}`}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
  
        {/* Content Section */}
        <div className="pt-20 pb-6 px-6 space-y-4">
          <Link href={`/ambassador-members/details?id=${_id}`} className="block">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white pb-3">{name}</h3>
            <p className="text-primary font-medium pb-3">{designation}</p>
  
            {(position || organization) && (
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 pb-3">
                {position && <p>{position}</p>}
                {organization && <p>{organization}</p>}
              </div>
            )}
  
            {achievements.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Achievements</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {achievements.slice(0, 2).map((a, i) => (
                    <li key={i} className="truncate">{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </Link>
  
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {Object.entries(socialMedia || {}).map(([platform, url]) =>
              url ? (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-105 transition"
                  aria-label={`${platform} profile`}
                >
                  {icons[platform]}
                </a>
              ) : null
            )}
          </div>
        </div>
      </div>
    );
  };

export default function AmbassadorMembersPage() {
  const [selectedDesignation, setSelectedDesignation] = useState('Goodwill Ambassador');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search term to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query with pagination and designation parameters
  const {
    data: ambassadorsData,
    isLoading,
    error,
    isFetching,
    refetch
  } = useGetAllAmbassadorsQuery({
    page: currentPage,
    limit: 6,
    designation: selectedDesignation,
    search: debouncedSearch || undefined
  }, {
    // Skip query if search term is too short (less than 2 characters) to avoid unnecessary API calls
    skip: debouncedSearch.length === 1
  });

  // Extract data from the response
  const ambassadors = ambassadorsData?.data?.ambassadors || [];
  const pagination = ambassadorsData?.data?.pagination || {
    totalAmbassadors: 0,
    currentPage: 1,
    totalPages: 1,
    ambassadorsPerPage: 10
  };

  // Handle pagination from react-paginate
  const handlePageChange = (data) => {
    // react-paginate uses 0-based indexing, so add 1
    const newPage = data.selected + 1;
    setCurrentPage(newPage);
  };

  // Refetch when parameters change
  useEffect(() => {
    // Only refetch if we have a valid search term (empty or 2+ characters)
    if (debouncedSearch.length !== 1) {
      refetch();
    }
  }, [currentPage, selectedDesignation, debouncedSearch, refetch]);

  // Handler for search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Combined loading state
  const isPageLoading = isLoading || isFetching;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section remains the same */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Distinguished Members
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Meet our {selectedDesignation}s in blood donation advocacy
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-10">
          {['Goodwill Ambassador', 'Honorable Member', 'Lifetime Member'].map((designation) => (
            <button
              key={designation}
              onClick={() => {
                setSelectedDesignation(designation);
                setCurrentPage(1);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedDesignation === designation
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {designation}
            </button>
          ))}

          {/* Search with validation message */}
          <div className="relative ml-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {searchTerm.length === 1 && (
              <div className="absolute -bottom-6 left-0 text-xs text-amber-600 dark:text-amber-400">
                Please enter at least 2 characters
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isPageLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <AmbassadorCardSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">Failed to load ambassadors.</div>
        ) : searchTerm.length === 1 ? (
          <div className="text-center text-amber-600 dark:text-amber-400 py-12">
            Please enter at least 2 characters to search
          </div>
        ) : ambassadors.length > 0 ? (
          <>
            <div className="flex justify-center">
              <div className={`
                grid 
                ${ambassadors.length === 1 ? 'grid-cols-1 max-w-md' : ''}
                ${ambassadors.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl' : ''}
                ${ambassadors.length >= 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}
                gap-8 w-full
              `}>
                {ambassadors.map((ambassador) => (
                  <AmbassadorCard key={ambassador._id} ambassador={ambassador} />
                ))}
              </div>
            </div>

            {/* Pagination remains the same */}
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  pageCount={pagination.totalPages}
                  onPageChange={handlePageChange}
                  currentPage={currentPage - 1}
                />
                <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Showing page {pagination.currentPage} of {pagination.totalPages} • 
                  Total {selectedDesignation}s: {pagination.totalAmbassadors}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            {searchTerm ? `No ${selectedDesignation}s found for "${searchTerm}"` : `No ${selectedDesignation}s found`}
          </div>
        )}
      </div>
    </div>
  );
}
