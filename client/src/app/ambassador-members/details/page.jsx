'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetAmbassadorByIdQuery } from '@/features/goodwillAmbassador/goodwillAmbassadorApiSlice';
import { FaSpinner, FaFacebook, FaYoutube, FaInstagram, FaLinkedin, FaTiktok, FaTwitter, FaGlobe, FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { FaArrowLeft } from 'react-icons/fa';
import AmbassadorDetailsSkeleton from '@/components/ui/Skeletons/AmbassadorDetailsSkeleton';

const AmbassadorDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { data, isLoading, error } = useGetAmbassadorByIdQuery(id);
  const profileImageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  if (isLoading) {
    return (
      <AmbassadorDetailsSkeleton />
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-8 inline-block">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Error loading details</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Failed to load ambassador information</p>
          <Link 
            href="/ambassador-members" 
            className="mt-6 inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ← Back to Members
          </Link>
        </div>
      </div>
    );
  }

  const ambassador = data?.data;

  if (!ambassador) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 inline-block">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Ambassador not found</h2>
          <Link 
            href="/ambassador-members" 
            className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Members
          </Link>
        </div>
      </div>
    );
  }

  const socialIcons = {
    facebook: { icon: FaFacebook, color: 'text-[#1877F2]' },
    youtube: { icon: FaYoutube, color: 'text-[#FF0000]' },
    instagram: { icon: FaInstagram, color: 'text-[#E4405F]' },
    linkedin: { icon: FaLinkedin, color: 'text-[#0A66C2]' },
    tiktok: { icon: FaTiktok, color: 'text-black dark:text-white' },
    x: { icon: FaTwitter, color: 'text-black dark:text-white' },
    website: { icon: FaGlobe, color: 'text-green-600' },
  };

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
            <div className="relative w-60 h-60 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              <Image
                src={`${profileImageUrl}${ambassador.profileImage}`}
                alt={ambassador.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 256px"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {ambassador.name}
              </h1>
              <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mb-4">
                {ambassador.designation}
              </span>

              <div className="space-y-2">
                {ambassador.position && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Position:</span> {ambassador.position}
                  </p>
                )}
                {ambassador.organization && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Organization:</span> {ambassador.organization}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Social Media */}
          {Object.entries(ambassador.socialMedia).some(([_, value]) => value) && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(ambassador.socialMedia).map(([platform, url]) => {
                  if (!url) return null;
                  const { icon: Icon, color } = socialIcons[platform];
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${color}`}
                      aria-label={`${platform} profile`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Achievements */}
          {ambassador.achievements?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Achievements</h3>
              <ul className="space-y-3">
                {ambassador.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 mt-2.5 mr-3 bg-primary rounded-full"></span>
                    <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Events */}
          {ambassador.events?.length > 0 && (
              <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <FaCalendarAlt className="text-primary" />
                <span>Participated Events</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ambassador.events.map((event) => (
                <Link href={`/events/details?id=${ambassador.events[0]._id}`} >
                    <div 
                    key={event._id} 
                    className="bg-gray-50 dark:bg-gray-700/30 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all"
                  >
                    {event.image && (
                      <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{event.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center text-sm text-primary">
                      <FaCalendarAlt className="mr-2 flex-shrink-0" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                    </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AmbassadorDetails;