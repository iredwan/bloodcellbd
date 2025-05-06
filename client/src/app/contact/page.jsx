'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWebsiteConfig } from '@/features/wesiteConfig/configApiSlice';
import { useGetUsersByDistrictQuery } from '@/features/users/userApiSlice';
import { useDistricts } from '@/features/districts/districtApiSlice';
import { IoMdArrowDropdown } from "react-icons/io";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaSearch, FaSpinner, FaUser,} from 'react-icons/fa';
import { getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import Toast from '@/utils/toast';

export default function ContactPage() {
  const { config, loading } = useWebsiteConfig();
  const { contactInfo } = config;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // District coordinator search state
  const [searchInput, setSearchInput] = useState('');
  const [districtCoordinators, setDistrictCoordinators] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Get districts from Redux
  const { districts, loading: loadingDistricts } = useDistricts();
  
  // Filter districts based on search input with debounce
  const [debouncedSearchInput, setDebouncedSearchInput] = useState('');
  
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 300); // 300ms delay
    
    return () => {
      clearTimeout(timerId);
    };
  }, [searchInput]);
  
  // RTK Query hook for fetching users by district
  const {
    data: districtUsersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch
  } = useGetUsersByDistrictQuery(selectedDistrict, {
    skip: !selectedDistrict || !getCookie('token'), // Skip the query if no district is selected or no token
  });
  
  // Process district users data safely
  const districtUsers = useMemo(() => {
    // Extract users array from the response
    const users = districtUsersData?.data || districtUsersData || [];
    return Array.isArray(users) ? users : [];
  }, [districtUsersData]);
  
  // Filter districts based on search input with debounce
  const filteredDistricts = useMemo(() => {
    if (!Array.isArray(districts)) {
      console.warn('Districts is not an array:', districts);
      return [];
    }
    
    return districts
      .filter(district => {
        // Handle both string districts and object districts
        if (typeof district === 'string') {
          return district.toLowerCase().includes(debouncedSearchInput.toLowerCase());
        } else if (district && typeof district === 'object') {
          // Check if district has name property
          const districtName = district.name || '';
          return districtName.toLowerCase().includes(debouncedSearchInput.toLowerCase());
        }
        return false;
      })
      .slice(0, 10); // Limit to 10 suggestions
  }, [districts, debouncedSearchInput]);
  
  // Filter district coordinators when district users data is available
  useEffect(() => {
    if (districtUsers.length > 0) {
      const coordinators = districtUsers.filter(
        user => user.role === 'District Coordinator' || user.role === 'District Sub-Coordinator'
      );
      setDistrictCoordinators(coordinators);
    } else if (districtUsersData && !isLoadingUsers) {
      // Clear coordinators if we got data but no users match
      setDistrictCoordinators([]);
    }
  }, [districtUsers, districtUsersData, isLoadingUsers]);

  const handleSelectDistrict = (district) => {
     // Check if user is authenticated
     const token = getCookie('token');
     if (!token) {
       toast.error('Please log in to search for district coordinators.');
       return;
     }
     
    // Handle both string and object district formats
    const districtValue = typeof district === 'string' ? district : district.name;
    setSelectedDistrict(districtValue);
    setSearchInput(districtValue);
    setShowSuggestions(false);
  };

  const handleDistrictSearch = (e) => {
    e.preventDefault();
    if (selectedDistrict) {
      // Trigger the query if a district is selected
      refetch();
    }
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow time for click to register
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Here you would typically send the form data to your API
      // For now we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='dark:bg-gray-900 dark:text-white'>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">Contact Us</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Have questions or need assistance? We're here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* District Coordinator Search Section */}
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-primary">Find Your District Coordinator</h2>
          
          <form onSubmit={handleDistrictSearch} className="mb-6">
            <div className='flex flex-col'>
            <div className="relative">
              <div className="flex flex-col">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for your district"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10 dark:bg-gray-700 dark:text-white"
                    value={searchInput}
                    onChange={(e) => {
                      const searchValue = e.target.value;
                      setSearchInput(searchValue);
                    }}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <IoMdArrowDropdown className='h-5 w-5' />
                  </div>
                </div>
                {showSuggestions && (
                  <div className="bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto dark:bg-gray-700 dark:text-white">
                    {filteredDistricts.length > 0 ? (
                      filteredDistricts.map((district, index) => (
                        <div 
                          key={typeof district === 'string' ? district : district._id || index} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:text-white dark:hover:bg-gray-600"
                          onClick={() => handleSelectDistrict(district)}
                        >
                          {typeof district === 'string' ? district : district.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No districts found.
                      </div>
                    )}
                  </div>
                )}
                </div>
                
                {selectedDistrict && selectedDistrict !== searchInput && (
                  <div className="text-sm text-primary mt-1 dark:text-white">
                    Selected district: <span className="font-medium">{selectedDistrict}</span>
                  </div>
                )}
              </div>
            </div>
          </form>
          
          {usersError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 dark:bg-gray-700 dark:text-white">
              Failed to load coordinators. Please try again.
            </div>
          )}
          
          {selectedDistrict && districtCoordinators.length === 0 && !isLoadingUsers && (
            <div className="text-center py-4 text-gray-600 dark:text-white">
              No coordinators found for {selectedDistrict}. Please try another district or contact our main phone number.
            </div>
          )}
          
          {isLoadingUsers && (
            <div className="flex justify-center py-8">
              <FaSpinner className="text-primary text-2xl animate-spin" />
            </div>
          )}
          
          {districtCoordinators.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white  ">Coordinators in {selectedDistrict}</h3>
              
              {districtCoordinators
                .sort((a, b) => {
                  // Sort by role: Coordinator first, then Sub-coordinator
                  if (a.role === "District Coordinator" && b.role !== "District Coordinator") return -1;
                  if (a.role !== "District Coordinator" && b.role === "District Coordinator") return 1;
                  if (a.role === "Sub-coordinator" && b.role !== "Sub-coordinator") return -1;
                  if (a.role !== "Sub-coordinator" && b.role === "Sub-coordinator") return 1;
                  return 0;
                })
                .map((coordinator) => (
                <div key={coordinator._id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 dark:border-gray-600 dark:bg-gray-800">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center dark:bg-gray-700">
                    {coordinator.profileImage ? (
                      <img 
                        src={coordinator.profileImage} 
                        alt={coordinator.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-gray-400 text-3xl dark:text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-medium text-primary">{coordinator.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-white">{coordinator.role}</p>
                    
                    <div className="mt-2 space-y-1">
                      {coordinator.phone && (
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <FaPhone className="text-xs text-primary" />
                          <a 
                            href={`tel:${coordinator.phone}`}
                            className="text-sm text-gray-600 hover:text-primary dark:text-gray-400"
                          >
                            {coordinator.phone}
                          </a>
                        </div>
                      )}
                      
                      {coordinator.email && (
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <FaEnvelope className="text-xs text-primary" />
                          <a 
                            href={`mailto:${coordinator.email}`}
                            className="text-sm text-gray-600 hover:text-primary dark:text-gray-400"
                          >
                            {coordinator.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-700 dark:text-white">
          <h2 className="text-xl font-semibold mb-6 text-primary">Send a Message</h2>
          
          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              Your message has been sent successfully. We'll get back to you soon!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {submitError}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full button py-3 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
 
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2 dark:bg-gray-700 dark:text-white">
          <h2 className="text-xl font-semibold mb-6 text-primary">Contact Information</h2>
          
          {loading ? (
            <p>Loading contact information...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                  <FaEnvelope className="text-primary dark:text-white" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href={`mailto:${contactInfo.email}`} className="text-gray-600 hover:text-primary dark:text-gray-400">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                  <FaPhone className="text-primary dark:text-white" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <a href={`tel:${contactInfo.phone}`} className="text-gray-600 hover:text-primary dark:text-gray-400">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                  <FaMapMarkerAlt className="text-primary dark:text-white" />
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600 dark:text-gray-400">{contactInfo.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast container for notifications */}
      <Toast />
    </div>
    </div>
  );
} 