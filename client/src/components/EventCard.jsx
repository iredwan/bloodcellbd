'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Ensure event data is properly serialized
  const safeEvent = {
    _id: event?._id || '',
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    time: event?.time || '',
    status: event?.status || 'upcoming',
    eventCard: event?.eventCard || '',
    image: Array.isArray(event?.image) ? event.image : [],
    upazila: event?.upazila || { name: '' },
    district: event?.district || { name: '' },
    organizer: event?.organizer || { name: '' }
  };

  // Format the date
  const formattedDate = safeEvent.date ? format(new Date(safeEvent.date), 'MMMM dd, yyyy') : 'Date TBA';
  
  // Get the event card image or fallback to first image from image array or default
  const imageUrl = safeEvent.eventCard || 
    (safeEvent.image && safeEvent.image.length > 0 ? safeEvent.image[0] : '') ||
    'https://placehold.co/600x400/8a0303/FFFFFF?text=Event';

  return (
    <div 
      className="bg-white max-w-100 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={safeEvent.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            safeEvent.status === 'upcoming' ? 'bg-yellow-500 text-white' :
            safeEvent.status === 'ongoing' ? 'bg-blue-500 text-white' :
            safeEvent.status === 'completed' ? 'bg-green-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {safeEvent.status?.charAt(0).toUpperCase() + safeEvent.status?.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
          {safeEvent.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {safeEvent.description}
        </p>

        {/* Event Details */}
        <div className='bg-gray-100 p-4 rounded-lg dark:bg-gray-700 space-y-3'>
  {/* Date & Time */}
  <div className="flex justify-center items-center">
    <div className='border-b-2 border-gray-500 dark:border-gray-400 pb-3 px-6 w-full text-center'>
      <div className="flex justify-center items-center text-gray-600 dark:text-gray-300 mb-2">
        <FaCalendarAlt className="mr-2 text-primary" />
        <span className="font-medium">{formattedDate}</span>
      </div>
      <div className="flex justify-center items-center text-gray-600 dark:text-gray-300">
        <FaClock className="mr-2 text-primary" />
        <span className="font-medium">{safeEvent.time || 'Time TBA'}</span>
      </div>
    </div>
  </div>

  {/* Location */}
  <div className="flex justify-center items-center text-gray-600 dark:text-gray-300 pt-2">
    <FaMapMarkerAlt className="mr-2 text-primary" />
    <span className="line-clamp-1 break-words font-medium">
      {safeEvent.upazila?.name && safeEvent.district?.name 
        ? `${safeEvent.upazila.name}, ${safeEvent.district.name}`
        : 'Location TBA'}
    </span>
  </div>

  {/* Organizer Details */}
{safeEvent.organizer && (
  <div className="">
        {safeEvent.organizer.name && (
            <p className='text-center font-semibold py-2 text-primary pt-3 border-t-2 border-gray-500 dark:border-gray-400'>Sponsor By</p>
        )}
    <div className="flex items-center gap-6">
      {/* Organizer Logo */}
      {safeEvent.organizer.logo && (
        <Link href={`/sponsors/${safeEvent.organizer._id}`} className="min-w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-500 shadow-md">
          <Image
            src={safeEvent.organizer.logo}
            alt={safeEvent.organizer.name}
            width={100}
            height={100}
            className="object-cover w-full h-full"
          />
        </Link>
      )}

      {/* Organizer Info */}
      <div className="flex flex-col justify-center">
        {/* Name */}
        <Link 
          href={`/sponsors/details?id=${safeEvent.organizer._id}`}
          className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-primary transition-colors line-clamp-1"
        >
          {safeEvent.organizer.name}
        </Link>

        {/* Website Link */}
        {safeEvent.organizer.website && (
          <a
            href={safeEvent.organizer.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1  text-gray-600 dark:text-gray-300 hover:underline flex items-center text-sm"
          >
            <FaGlobe className="mr-2 text-primary text-lg" />
            Visit Website
          </a>
        )}
      </div>
    </div>
  </div>
)}

</div>

        {/* Action Button */}
        <Link 
          href={`/events/details?id=${safeEvent._id}`}
          className="block w-full mt-4 text-center bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard; 