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

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  if (!day || !month || !year) return dateString;
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
  });
};

// Format time for display in 12-hour format
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // Check if the time is already in 24-hour format (HH:MM)
  const timeParts = timeString.split(':');
  if (timeParts.length !== 2) return timeString;
  
  let hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1].padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert '0' to '12'
  
  return `${hours}:${minutes} ${ampm}`;
};
  
  
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  return (
    <div 
      className="bg-white max-w-100 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl + safeEvent.eventCard}
          fill
          alt={safeEvent.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            safeEvent.status === 'Upcoming' ? 'bg-amber-400 text-black' :
            safeEvent.status === 'Ongoing' ? 'bg-blue-500 text-white' :
            safeEvent.status === 'Completed' ? 'bg-green-500 text-white' :
            'bg-red-500 text-white'
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
        <span className="font-medium">{formatDate(safeEvent.date)}</span>
      </div>
      <div className="flex justify-center items-center text-gray-600 dark:text-gray-300">
        <FaClock className="mr-2 text-primary" />
        <span className="font-medium">Start at {formatTime(safeEvent.time) || 'Time TBA'}</span>
      </div>
    </div>
  </div>

  {/* Location */}
  <div className="flex justify-center items-center text-gray-600 dark:text-gray-300 pt-2">
    <FaMapMarkerAlt className="mr-2 text-primary" />
    <span className="line-clamp-1 break-words font-medium">
      {safeEvent.upazila && safeEvent.district
        ? `${safeEvent.upazila}, ${safeEvent.district}`
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
        <Link href={`/sponsors/details?id=${safeEvent.organizer._id}`}  className="min-w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-500 shadow-md">
          <Image
            src={imageUrl + safeEvent.organizer.logo}
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