'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetSponsorByIdQuery } from '@/features/sponsors/sponsorApiSlice';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaGlobe, 
  FaEnvelope, 
  FaPhone, 
  FaUser, 
  FaGem, 
  FaCrown, 
  FaCoins, 
  FaMedal, 
  FaQuestionCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowLeft
} from 'react-icons/fa';
import SponsorDetailsSkeleton from '@/components/ui/Skeletons/SponsorDetailsSkeleton';
export default function SponsorDetailsPage() {
  const searchParams = useSearchParams();
  const sponsorId = searchParams.get('id');
  const [sponsor, setSponsor] = useState(null);

  const {
    data: sponsorData,
    isLoading,
    isError,
    error
  } = useGetSponsorByIdQuery(sponsorId, {
    skip: !sponsorId
  });

  useEffect(() => {
    if (sponsorData) {
      setSponsor(sponsorData);
    }
  }, [sponsorData]);

  const getBadgeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'platinum':
        return <FaGem className="text-white text-xl" />;
      case 'gold':
        return <FaCrown className="text-white text-xl" />;
      case 'silver':
        return <FaCoins className="text-white text-xl" />;
      case 'bronze':
        return <FaMedal className="text-white text-xl" />;
      default:
        return <FaQuestionCircle className="text-white text-xl" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'platinum':
        return 'bg-purple-500 dark:bg-purple-600';
      case 'gold':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'silver':
        return 'bg-gray-400 dark:bg-gray-500';
      case 'bronze':
        return 'bg-orange-700 dark:bg-orange-800';
      default:
        return 'bg-gray-600 dark:bg-gray-700';
    }
  };

  if (isLoading) {
    return (
      <SponsorDetailsSkeleton />
    );
  }

  if (isError) {
    return (
      <div className="dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="bg-red-100 dark:bg-red-900 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-4">Error Loading Sponsor</h2>
            <p className="text-red-600 dark:text-red-400">{error?.message || 'Could not load sponsor details. Please try again later.'}</p>
            <Link href="/sponsors" className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
              Back to Sponsors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Sponsor Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The sponsor you're looking for doesn't exist or was removed.</p>
          <Link href="/sponsors" className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
            Back to Sponsors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Cover Image */}
        {sponsor.coverImage && (
          <div className="relative h-72 w-full rounded-xl overflow-hidden shadow-xl mb-8">
            <Image
              src={sponsor.coverImage}
              alt={`${sponsor.name} cover`}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Logo, Type, Website */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md text-center">
              {/* Logo */}
              {sponsor.logo && (
                <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-white dark:border-gray-700 shadow-lg overflow-hidden mb-6">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-cover bg-white dark:bg-gray-100 p-2"
                  />
                </div>
              )}

              {/* Sponsor Type Badge */}
              {sponsor.sponsorType && (
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full shadow-md ${getBadgeColor(sponsor.sponsorType)}`}>
                    {getBadgeIcon(sponsor.sponsorType)}
                  </div>
                  <span className="ml-2 font-semibold text-lg dark:text-white self-center">
                    {sponsor.sponsorType} Sponsor
                  </span>
                </div>
              )}

              {/* Website */}
              {sponsor.website && (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center px-6 py-3 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                >
                  <FaGlobe className="mr-2" />
                  Visit Website
                </a>
              )}
            </div>

            {/* Contact Person Card */}
            {sponsor.contactPerson && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-center dark:text-white">Contact Person</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  {sponsor.contactPerson.name && (
                    <div className="flex items-center">
                      <FaUser className="text-primary mr-3" />
                      <div>
                        <p className="font-medium">{sponsor.contactPerson.name}</p>
                        {sponsor.contactPerson.designation && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{sponsor.contactPerson.designation}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {sponsor.contactPerson.email && (
                    <a 
                      href={`mailto:${sponsor.contactPerson.email}`} 
                      className="flex items-center hover:text-primary dark:hover:text-primary-400 transition-colors"
                    >
                      <FaEnvelope className="mr-3 text-primary" />
                      <span className="break-all">{sponsor.contactPerson.email}</span>
                    </a>
                  )}

                  {sponsor.contactPerson.phone && (
                    <a 
                      href={`tel:${sponsor.contactPerson.phone}`} 
                      className="flex items-center hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      <FaPhone className="mr-3 text-primary" />
                      <span>{sponsor.contactPerson.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Name, Description, Events */}
          <div className="w-full md:w-2/3">
            {/* Name and Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md mb-8">
              <h1 className="text-3xl font-bold mb-6 dark:text-white">{sponsor.name}</h1>
              
              {sponsor.description ? (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{sponsor.description}</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No description provided</p>
              )}
            </div>

            {/* Sponsored Events */}
            {sponsor.events && sponsor.events.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
                <h2 className="text-2xl font-semibold mb-6 dark:text-white">Sponsored Events</h2>
                <div className="grid grid-cols-1 gap-6">
                  {sponsor.events.map(event => (
                    <div key={event._id} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Link href={`/events/details?id=${event._id}`} className="group">
                        <div className="flex">
                          {event.posterImage && (
                            <div className="w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0 mr-4">
                              <Image
                                src={event.posterImage}
                                alt={event.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-medium group-hover:text-primary dark:text-white transition-colors">{event.title}</h3>
                            
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              {event.date && (
                                <div className="flex items-center">
                                  <FaCalendarAlt className="mr-2 text-primary" />
                                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric'
                                  })}</span>
                                </div>
                              )}
                              
                              {event.location && (
                                <div className="flex items-center">
                                  <FaMapMarkerAlt className="mr-2 text-primary" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to sponsors button */}
        <div className="mt-8 text-center">
          <Link 
            href="/sponsors" 
            className="inline-flex items-center button"
          >
            <FaArrowLeft /> Back
          </Link>
        </div>
      </div>
    </div>
  );
}
