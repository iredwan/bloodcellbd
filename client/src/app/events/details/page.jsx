'use client';

import { useSearchParams } from 'next/navigation';
import { useGetEventByIdQuery } from '@/features/events/eventApiSlice';
import { FaSpinner, FaMapMarkerAlt, FaGlobe, FaGem, 
  FaCrown, 
  FaCoins, 
  FaMedal, 
  FaQuestionCircle,
  FaInfoCircle,
  FaUser,
  FaEnvelope,
  FaPhone } from 'react-icons/fa';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';

export default function EventDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { data: eventData, isLoading, isError } = useGetEventByIdQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (isError || !eventData?.data) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Failed to load event details</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const event = eventData.data;
  const organizer = event.organizer;

  // Date formatting with Bengali locale
  const eventDate = format(new Date(event.date), 'dd MMMM yyyy');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Event Card */}
      <div className="shadow-md">
        <Image 
        src={event.eventCard}
        alt="Event Card" 
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover w-full h-full rounded-lg" />
      </div>

        {/* Event Header */}
        <div className="text-center my-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {event.title}
          </h1>
          <div className="flex justify-center items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="bg-green-200 text-green-600 px-2 py-1 rounded-md">{event.status}</span>
            <span className='border-b-2 border-gray-300'>{eventDate}</span>
            <span className='border-b-2 border-gray-300'>{event.time}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Event Details</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Location Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Location</h2>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaMapMarkerAlt className="mr-2 text-primary" />
                  <span>
                    {event.upazila?.name}, {event.district?.name}
                  </span>
                </div>
                {event.googleMapLink && (
                  <a
                    href={event.googleMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <FaGlobe className="mr-2" />
                    View on Google Maps
                  </a>
                )}
              </div>
            </div>

            {/* Event Images */}
            {event.image?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-4 dark:text-white">Event Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.image.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Link href={img} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={img}
                          alt={`Event image ${index + 1}`}
                          fill
                          className="object-cover w-full h-full"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Organizer Section */}
          {organizer && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-fit">
            <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white text-center">Sponsor By</h2>
            
            <div className="space-y-6">
              {/* Logo & Contact Info */}
              <div className="flex flex-col items-center space-y-6">
                {/* Centered Logo */}
                <div className="relative w-40 h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
                  {organizer.logo && (
                    <Image
                      src={organizer.logo}
                      alt={organizer.name}
                      fill
                      className="object-cover w-full h-full bg-white dark:bg-gray-100 p-2"
                    />
                  )}
                </div>
          
          
                {/* Sponsor Type Badge */}
                {organizer.sponsorType && (
                  <div className={`p-3 rounded-full shadow-md ${
                    organizer.sponsorType === 'platinum' ? 'bg-purple-500 dark:bg-purple-600' :
                    organizer.sponsorType === 'gold' ? 'bg-yellow-500 dark:bg-yellow-600' :
                    organizer.sponsorType === 'silver' ? 'bg-gray-400 dark:bg-gray-500' :
                    organizer.sponsorType === 'bronze' ? 'bg-orange-700 dark:bg-orange-800' : 
                    'bg-gray-600 dark:bg-gray-700'
                  }`}>
                    {organizer.sponsorType === 'platinum' ? <FaGem className="text-white text-xl" /> :
                    organizer.sponsorType === 'gold' ? <FaCrown className="text-white text-xl" /> :
                    organizer.sponsorType === 'silver' ? <FaCoins className="text-white text-xl" /> :
                    organizer.sponsorType === 'bronze' ? <FaMedal className="text-white text-xl" /> :
                    <FaQuestionCircle className="text-white text-xl" />}
                  </div>
                )}
              </div>
          
              {/* Organizer Details */}
              <div className="space-y-4 text-center flex flex-col">
                <Link href={`/sponsors/details?id=${organizer._id}`} className="text-xl font-semibold dark:text-white cursor-pointer line-clamp-1">{organizer.name}</Link>
                
                {organizer.website && (
                  <a
                    href={organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-primary hover:underline dark:text-primary-400"
                  >
                    <FaGlobe className="mr-2" />
                    Visit Website
                  </a>
                )}
          
                {organizer.description && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {organizer.description}
                  </p>
                )}
              </div>

              {/* Contact Person Details */}
              {organizer.contactPerson && (
                  <div className="text-center space-y-2">
                    <h4 className="text-lg font-semibold dark:text-gray-200">Contact Person</h4>
                    <div className="space-y-1 text-gray-600 dark:text-gray-400">
                      {organizer.contactPerson.name && (
                        <p className="flex items-center justify-center">
                          <FaUser className="mr-2" />
                          {organizer.contactPerson.name}
                        </p>
                      )}
                      {organizer.contactPerson.designation && (
                        <p className="flex items-center justify-center text-sm line-clamp-1">
                          {organizer.contactPerson.designation}
                        </p>
                      )}
                      {organizer.contactPerson.email && (
                        <a 
                          href={`mailto:${organizer.contactPerson.email}`}
                          className="flex items-center justify-center word-break"
                        >
                          <FaEnvelope className="mr-2" />
                          {organizer.contactPerson.email}
                        </a>
                      )}
                      {organizer.contactPerson.phone && (
                        <a
                          href={`tel:${organizer.contactPerson.phone}`}
                          className="flex items-center justify-center hover:text-primary dark:hover:text-primary-300 transition-colors"
                        >
                          <FaPhone className="mr-2" />
                          {organizer.contactPerson.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}
            </div>
            </div>
            {/* Cover Image */}
            {organizer.coverImage && (
                  <div className="relative h-full w-full rounded-lg overflow-hidden">
                    <Image
                      src={organizer.coverImage}
                      alt={`${organizer.name} cover`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}