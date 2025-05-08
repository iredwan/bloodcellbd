'use client';

import { useGetActiveCarouselQuery } from '@/features/carousel/carouselApiSlice';
import { useGetCompletedEventsQuery } from '@/features/events/eventApiSlice';
import { useWebsiteConfig } from '@/features/websiteConfig/configApiSlice';
import Carousel from '@/components/Carousel';
import EventCard from '@/components/EventCard';
import Link from 'next/link';
import BloodBenefits from '@/components/BloodBenefits';
import { GiDrop } from 'react-icons/gi';
import { FaHandHoldingWater, FaUsers } from 'react-icons/fa';
import { IoAlertCircle } from "react-icons/io5";
import { FaSpinner } from 'react-icons/fa';
// Temporary placeholder carousel items for testing if API doesn't return any items
const placeholderItems = [
  {
    _id: '1',
    imageUrl: 'https://via.placeholder.com/1200x500/FF5733/FFFFFF?text=Donate+Blood+Save+Lives',
    linkUrl: '/donate',
    title: 'Donate Blood, Save Lives',
    subtitle: 'Your donation can make a difference'
  },
  {
    _id: '2',
    imageUrl: 'https://via.placeholder.com/1200x500/33A8FF/FFFFFF?text=Find+Blood+Donors',
    linkUrl: '/find-donors',
    title: 'Need Blood?',
    subtitle: 'Find donors in your area quickly'
  },
  {
    _id: '3',
    imageUrl: 'https://via.placeholder.com/1200x500/33FF57/000000?text=Join+Our+Community',
    linkUrl: '/register',
    title: 'Join Our Community',
    subtitle: 'Become a blood donor today'
  }
];

const HomePage = () => {
  // Use RTK Query hook to fetch active carousel items
  const { 
    data: carouselData, 
    isLoading: carouselLoading, 
    isError: carouselError, 
    error: carouselErrorData 
  } = useGetActiveCarouselQuery();

    // Extract carousel items array safely and use placeholders if empty
    const carouselItems = (carouselData?.data && carouselData.data.length > 0) 
    ? carouselData.data 
    : placeholderItems;

  // Use the website config hook to access stats
  const { config, loading: configLoading } = useWebsiteConfig();

  // Fetch completed events
  const { 
    data: eventsData, 
    isLoading: eventsLoading, 
    error: eventsError 
  } = useGetCompletedEventsQuery();

  // Extract completed events and ensure proper serialization
  const completedEvents = eventsData?.data || [];
  const eventsErrorMessage = eventsData?.message || "There are no completed events at the moment";

  const columnCount =
  completedEvents.length === 1
    ? 'grid-cols-1'
    : completedEvents.length === 2
    ? 'md:grid-cols-2'
    : 'md:grid-cols-2 lg:grid-cols-3';


  return (
    <div className='min-h-[100vh] dark:bg-gray-900'>
      <div className="flex flex-col items-center">
      {/* Hero Carousel - Full width */}
      <div className="w-full mb-12">
        <div className="max-w-screen-xl mx-auto">
          <Carousel 
            items={carouselItems}
            isLoading={carouselLoading}
            error={carouselError ? carouselErrorData : null}
            autoplay={true}
            autoplaySpeed={5000}
          />
        </div>
      </div>

      {/* Blood Benefits Section */}
      <BloodBenefits />

      {/* Completed Events Section */}
      <div className="container bg-gray-50 dark:bg-gray-800 py-16 rounded-lg mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-3">
              Recent Events
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Check out our recent blood donation drives and their impact
            </p>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center items-center py-12 ">
              <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
          ) : eventsError ? (
            <div className="text-center py-12">
              <p className="text-red-500">{eventsErrorMessage}</p>
            </div>
          ) : completedEvents.length > 0 ? (
            <>
              <div className={`grid ${columnCount} gap-8 justify-center`}>
                {completedEvents.slice(0, 6).map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>

              {completedEvents.length > 6 && (
                <div className="text-center mt-8">
                  <Link 
                    href="/events" 
                    className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors duration-300"
                  >
                    View All Events
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {eventsErrorMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="container bg-gray-50 py-16 my-12 rounded-lg mx-3 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-3 text-primary">
            Our Impact
          </h2>
          <p className='text-center text-gray-600 dark:text-gray-300 mb-12'>
            We are proud to have helped save countless lives through our blood donation drives.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                value: configLoading ? '...' : config.stats.totalMembers,
                label: "Total Members",
                icon: <FaUsers className="w-8 h-8" />
              },
              {
                value: configLoading ? '...' : config.stats.totalEligibleMembers,
                label: "Available Donors",
                icon: <FaHandHoldingWater className="w-8 h-8" />
              },
              {
                value: configLoading ? '...' : config.stats.totalFulfilledRequests,
                label: "Lives Impacted", 
                icon: <GiDrop className="w-8 h-8" />
              },
              {
                value: configLoading ? '...' : config.stats.totalPendingRequests,
                label: "Current Needs",
                icon: <IoAlertCircle className="w-8 h-8" />
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl backdrop-blur-sm bg-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl border border-white/10 dark:bg-gray-800"
              >
                <div className={`${stat.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary`}>
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold mb-2 text-primary animate-pulse dark:text-white">
                  {stat.value}
                </div>
                <div className="font-semibold text-sm text-primary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomePage;