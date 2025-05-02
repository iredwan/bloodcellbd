'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample events data
  const sampleEvents = [
    {
      id: 1,
      title: 'World Blood Donor Day',
      date: '2023-06-14',
      location: 'Dhaka Medical College Hospital',
      description: 'Join us in celebrating World Blood Donor Day. Donate blood and save lives.',
      image: 'https://placehold.co/600x400/8a0303/FFFFFF?text=Blood+Donor+Day',
    },
    {
      id: 2,
      title: 'Emergency Blood Drive',
      date: '2023-07-10',
      location: 'Bangabandhu Sheikh Mujib Medical University',
      description: 'Emergency blood drive to address critical shortages of blood supplies.',
      image: 'https://placehold.co/600x400/8a0303/FFFFFF?text=Blood+Drive',
    },
    {
      id: 3,
      title: 'Blood Donation Camp',
      date: '2023-08-05',
      location: 'North South University',
      description: 'Blood donation camp organized in collaboration with local universities.',
      image: 'https://placehold.co/600x400/8a0303/FFFFFF?text=Donation+Camp',
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`);
        // const data = await response.json();
        
        // Using sample data for now
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setEvents(sampleEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Blood Donation Events</h1>
        <p className="mt-4 text-lg text-gray-600">
          Join our upcoming blood donation drives and events
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="mr-2"></div>
          <span>Loading events...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4 bg-red-100 rounded-md">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2">{event.title}</h3>
                <div className="mb-4 text-gray-600">
                  <p className="mb-1"><strong>Date:</strong> {formatDate(event.date)}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                  <Link 
                    href={`/events/${event.id}`}
                    className="text-secondary hover:text-secondary-dark font-medium"
                  >
                    View Details
                  </Link>
                  <button className="button">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 