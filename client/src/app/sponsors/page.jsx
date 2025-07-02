'use client';

import { useState } from 'react';
import { useGetAllSponsorsQuery } from '@/features/sponsors/sponsorApiSlice';
import SponsorCard from '@/components/SponsorCard';
import Pagination from '@/components/Pagination';
import CustomSelect from '@/components/CustomSelect';
import SponsorCardSkeleton from '@/components/ui/Skeletons/SponsorCardSkeleton';
import { useDebounce } from '@/hooks/useDebounce';

const SPONSOR_TYPES = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Other'];

export default function SponsorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sponsorType, setSponsorType] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);


  // Only include non-empty parameters
  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    active: 'true',
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(sponsorType && { type: sponsorType.toLowerCase() }),
  };

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetAllSponsorsQuery(queryParams);

  // Extract data from the response according to GetAllSponsorsService structure
  const sponsors = response?.data?.sponsors || [];
  const totalPages = response?.data?.pagination?.totalPages || 1;
  const totalSponsors = response?.data?.pagination?.totalCount || 0;

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const handleTypeChange = (selectedType) => {
    setSponsorType(selectedType || '');
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">
          Our Sponsors
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 dark:bg-gray-900">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 focus:outline-1 px-4 py-2 rounded-md w-full md:w-1/2 dark:text-gray-300 dark:bg-gray-800"
          />
          
          <div className="max-w-40 w-full">
            <CustomSelect 
              options={['', ...SPONSOR_TYPES]} 
              selected={sponsorType} 
              setSelected={handleTypeChange} 
              label="Type" 
              placeholder="All Types"
            />
          </div>
        </div>

        {/* Sponsor List */}
        <div className="min-h-[200px]">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: itemsPerPage }).map((_, idx) => (
                <SponsorCardSkeleton key={idx} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center">
              <p className="text-red-500">{error?.data?.message || error?.error || 'Failed to load sponsors.'}</p>
              {process.env.NODE_ENV === 'development' && (
                <pre className="mt-2 text-sm text-gray-500">{JSON.stringify(error, null, 2)}</pre>
              )}
            </div>
          ) : !response?.status ? (
            <p className="text-gray-500 text-center">{response?.message || 'No sponsors found.'}</p>
          ) : (
            <div
              className={`
                grid gap-8 w-full
                ${sponsors.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : ''}
                ${sponsors.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' : ''}
                ${sponsors.length >= 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}
              `}
            >
              {sponsors.map((sponsor) => (
                <SponsorCard key={sponsor._id} sponsor={sponsor} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage - 1}
          />
        )}
      </div>
    </div>
  );
}
