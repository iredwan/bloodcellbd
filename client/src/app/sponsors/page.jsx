'use client';

import { useState, useEffect } from 'react';
import { useGetAllSponsorsQuery } from '@/features/sponsors/sponsorApiSlice';
import SponsorCard from '@/components/SponsorCard';
import Pagination from '@/components/Pagination';
import CustomSelect from '@/components/CustomSelect';
import SponsorCardSkeleton from '@/components/ui/Skeletons/SponsorCardSkeleton';

const SPONSOR_TYPES = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Other'];

export default function SponsorsPage() {
  const [filter, setFilter] = useState({
    type: '',
    search: '',
    active: 'true',
    page: 1,
    limit: 6,
  });

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetAllSponsorsQuery();

  const filterSponsors = () => {
    if (!data || !data.sponsors) return [];
  
    let filtered = data.sponsors;
  
    if (filter.type) {
      filtered = filtered.filter(sponsor =>
        sponsor.sponsorType?.toLowerCase() === filter.type.toLowerCase()
      );
    }
  
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(sponsor =>
        sponsor.name.toLowerCase().includes(searchLower) ||
        (sponsor.description && sponsor.description.toLowerCase().includes(searchLower))
      );
    }
  
    // ✅ Avoid mutating original: make a copy before sorting
    const sortOrder = SPONSOR_TYPES.map(t => t.toLowerCase());
  
    return [...filtered].sort((a, b) => {
      const typeA = a.sponsorType?.toLowerCase() || 'other';
      const typeB = b.sponsorType?.toLowerCase() || 'other';
      return sortOrder.indexOf(typeA) - sortOrder.indexOf(typeB);
    });
  };
  


  const filteredSponsors = filterSponsors();
  
  const paginatedSponsors = filteredSponsors.slice(
    (filter.page - 1) * filter.limit, 
    filter.page * filter.limit
  );
  
  const totalPages = Math.ceil(filteredSponsors.length / filter.limit) || 1;

  const handlePageChange = ({ selected }) => {
    setFilter((prev) => ({ ...prev, page: selected + 1 }));
  };

  const handleTypeChange = (selectedType) => {
    setFilter({ ...filter, type: selectedType ? selectedType.toLowerCase() : '', page: 1 });
  };

  const handleSearchChange = (e) => {
    setFilter({ ...filter, search: e.target.value, page: 1 });
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
          value={filter.search}
          onChange={handleSearchChange}
          className="border border-gray-300 focus:outline-1 px-4 py-2 rounded-md w-full md:w-1/2 dark:text-gray-300 dark:bg-gray-800"
        />
        
        <div className="max-w-40 w-full">
          <CustomSelect 
            options={['', ...SPONSOR_TYPES]} 
            selected={filter.type ? filter.type.charAt(0).toUpperCase() + filter.type.slice(1) : ''} 
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
            {Array.from({ length: 6 }).map((_, idx) => (
              <SponsorCardSkeleton key={idx} />
            ))}
          </div>
        ) : isError ? (
            <p className="text-red-500 text-center">{error?.message || 'Failed to load sponsors.'}</p>
        ) : paginatedSponsors.length === 0 ? (
            <p className="text-gray-500 text-center">No sponsors found.</p>
        ) : (
            <div
            className={`
                grid gap-8 w-full
                ${paginatedSponsors.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : ''}
                ${paginatedSponsors.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' : ''}
                ${paginatedSponsors.length >= 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}
            `}
            >
            {paginatedSponsors.map((sponsor) => (
                <SponsorCard key={sponsor._id} sponsor={sponsor} />
            ))}
            </div>
        )}
        </div>


      {/* Pagination */}
      {filteredSponsors.length > 0 && (
        <Pagination
          pageCount={totalPages}
          onPageChange={handlePageChange}
          currentPage={filter.page - 1}
        />
      )}
    </div>
    </div>
  );
}
