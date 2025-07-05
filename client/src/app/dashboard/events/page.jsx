'use client';

import React, { useState, useEffect } from 'react';
import { useGetAllEventsQuery, useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } from '@/features/events/eventApiSlice';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaImage, FaTimes, FaStar } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import deleteConfirm from '@/utils/deleteConfirm';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';
import uploadFiles from '@/utils/fileUpload.js';
import CustomSelect from '@/components/CustomSelect';
import DatePicker from '@/components/DatePicker';
import LocationSelector from '@/components/LocationSelector';
import SponsorSearch from '@/components/SponsorSearch';
import { format, parse } from 'date-fns';

const EventsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        eventID: '',
        title: '',
        eventCard: '',
        description: '',
        date: '',
        time: '',
        district: '',
        upazila: '',
        googleMapLink: '',
        image: ['', '', '', '', ''], // Initialize with 5 empty strings
        status: 'Upcoming',
        organizer: null,
        organizerName: '' // Add organizerName for display purposes
    });

    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

    const { data: eventsData, isLoading, error, refetch } = useGetAllEventsQuery({
        page: currentPage + 1,
        limit: itemsPerPage,
        search: debouncedSearchTerm
    });

    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearchTerm, itemsPerPage]);

    const [createEvent] = useCreateEventMutation();
    const [updateEvent] = useUpdateEventMutation();
    const [deleteEvent] = useDeleteEventMutation();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (name, file) => {
        setFormData(prev => ({
            ...prev,
            [name]: file
        }));
    };

    const handleImageChange = (index, file) => {
        const newImages = [...formData.image];
        newImages[index] = file;
        setFormData(prev => ({
            ...prev,
            image: newImages
        }));
    };

    const handleRemoveImage = (index) => {
        const newImages = [...formData.image];
        newImages[index] = '';
        setFormData(prev => ({
            ...prev,
            image: newImages
        }));
    };

    const handleLocationChange = (location) => {
        setFormData(prev => ({
            ...prev,
            district: location.districtName || location.district,
            upazila: location.upazilaName || location.upazila
        }));
    };

    const handleStatusChange = (status) => {
        setFormData(prev => ({
            ...prev,
            status
        }));
    };

    const handleSponsorSelect = (sponsor) => {
        setFormData(prev => ({
            ...prev,
            organizer: sponsor.id, // Use the sponsor ID as the organizer reference
            organizerName: sponsor.name // Store the name for display
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let eventData = { ...formData };
            
            // Validate time format
            if (!eventData.time) {
                toast.error('Event time is required');
                return;
            }
            
            // Check if time is in the correct format (HH:MM)
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(eventData.time)) {
                toast.error('Time must be in 24-hour format (HH:MM)');
                return;
            }

            // Handle event card image upload if new file is selected
            if (formData.eventCard instanceof File) {
                const cardUploadResult = await uploadFiles([formData.eventCard], {
                    maxFiles: 1,
                    onError: (error) => {
                        toast.error(`Failed to upload event card: ${error}`);
                        throw new Error(error);
                    }
                });
                eventData.eventCard = cardUploadResult[0].filename;
            }

            // Handle multiple images upload if new files are selected
            const filesToUpload = formData.image.filter(img => img instanceof File);
            if (filesToUpload.length > 0) {
                const imagesUploadResult = await uploadFiles(filesToUpload, {
                    maxFiles: 5,
                    onError: (error) => {
                        toast.error(`Failed to upload images: ${error}`);
                        throw new Error(error);
                    }
                });
                
                // Create a new array with the uploaded filenames
                const newImages = [...formData.image];
                let uploadIndex = 0;
                
                for (let i = 0; i < newImages.length; i++) {
                    if (newImages[i] instanceof File) {
                        newImages[i] = imagesUploadResult[uploadIndex].filename;
                        uploadIndex++;
                    }
                }
                
                // Filter out empty strings
                eventData.image = newImages.filter(img => img !== '');
            } else {
                // Filter out empty strings from existing images
                eventData.image = formData.image.filter(img => img !== '');
            }

            if (editingEvent) {
                // If editing and no new image is selected, keep the existing image URLs
                if (!(formData.eventCard instanceof File)) {
                    eventData.eventCard = editingEvent.eventCard;
                }
                
                await updateEvent({ 
                    id: editingEvent._id, 
                    eventData
                }).unwrap();
                toast.success('Event updated successfully');
                refetch();
            } else {
                // For new events, ensure event card is provided
                if (!eventData.eventCard) {
                    toast.error('Event card image is required');
                    return;
                }
                
                // Generate a random eventID if not provided
                if (!eventData.eventID) {
                    eventData.eventID = `EVT-${Math.floor(100000 + Math.random() * 900000)}`;
                }
                
                await createEvent(eventData).unwrap();
                toast.success('Event added successfully');
                refetch();
            }
            setIsModalOpen(false);
            setEditingEvent(null);
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    const handleEdit = (event) => {
        // Prepare the image array with 5 slots
        const imageArray = Array(5).fill('');
        if (event.image && Array.isArray(event.image)) {
            event.image.forEach((img, index) => {
                if (index < 5) imageArray[index] = img;
            });
        }

        // Ensure time is in the correct format for the input field (HH:MM)
        let timeValue = event.time || '';
        
        // If time is already in the correct format, use it directly
        // The input type="time" expects the format HH:MM in 24-hour time

        // Get organizer information
        let organizerName = '';
        if (event.organizer) {
            if (typeof event.organizer === 'object') {
                organizerName = event.organizer.name || '';
            }
        }

        setEditingEvent(event);
        setFormData({
            eventID: event.eventID || '',
            title: event.title || '',
            eventCard: event.eventCard || '',
            description: event.description || '',
            date: event.date || '',
            time: timeValue,
            district: event.district || '',
            upazila: event.upazila || '',
            googleMapLink: event.googleMapLink || '',
            image: imageArray,
            status: event.status || 'Upcoming',
            organizer: event.organizer?._id || event.organizer || null,
            organizerName: organizerName
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const confirmed = await deleteConfirm({
            title: 'Delete Event?',
            text: 'Are you sure you want to delete this event? This action cannot be undone!',
            confirmButtonText: 'Yes, delete event',
        });
        
        if (confirmed) {
            try {
                await deleteEvent(id).unwrap();
                toast.success('Event deleted successfully');
            } catch (error) {
                toast.error(error?.data?.message || 'Failed to delete event');
            }
            refetch();
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const resetForm = () => {
        setFormData({
            eventID: '',
            title: '',
            eventCard: '',
            description: '',
            date: '',
            time: '',
            district: '',
            upazila: '',
            googleMapLink: '',
            image: ['', '', '', '', ''], // Reset with 5 empty strings
            status: 'Upcoming',
            organizer: null,
            organizerName: ''
        });
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

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-[#8a0303]"></div>
        </div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">Error: {error.message}</div>;
    }

    return (
        <div className="p-2 md:p-6">
            <h1 className="text-2xl md:text-3xl text-center mb-4 font-bold text-primary">Events</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-grow sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button
                        onClick={() => {
                            setEditingEvent(null);
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="button"
                    >
                        <FaPlus /> Add Event
                    </button>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventsData?.data?.map((event) => (
                    <div key={event._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="relative h-48">
                            <Image
                                src={`${imageUrl}${event.eventCard}`}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors cursor-pointer"
                                    title="Edit Event"
                                >
                                    <FaEdit className="text-green-600" />
                                </button>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors cursor-pointer"
                                    title="Delete Event"
                                >
                                    <FaTrash className="text-red-600" />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/25 to-transparent p-3">
                                <h3 className="font-semibold text-primary text-lg">{event.title}</h3>
                                <p className="text-secondary text-xs">{event.eventID}</p>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-primary" />
                                    <span className="dark:text-gray-300">{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaClock className="text-primary" />
                                    <span className="dark:text-gray-300">{formatTime(event.time)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    <span className="dark:text-gray-300">{event.upazila}, {event.district}</span>
                                </div>
                                {event.organizer && (
                                    <div className="flex items-center gap-2">
                                        <FaStar className="text-primary" />
                                        <span className='dark:text-gray-300'>{typeof event.organizer === 'object' ? event.organizer.name : 'Sponsor'}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-2">{event.description}</p>
                            
                            {/* Image thumbnails */}
                            {event.image && event.image.length > 0 && (
                                <div className="mt-3 flex gap-1 overflow-x-auto pb-2">
                                    {event.image.map((img, index) => (
                                        <div key={index} className="relative w-12 h-12 flex-shrink-0">
                                            <Image 
                                                src={`${imageUrl}${img}`}
                                                alt={`Event image ${index + 1}`}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="mt-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    event.status === 'Upcoming'
                                        ? 'bg-amber-400 text-black '
                                        : event.status === 'Ongoing'
                                        ? 'bg-blue-500 text-white'
                                        : event.status === 'Completed'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                }`}>
                                    {event.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No events message */}
            {eventsData?.data?.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No events found. Create a new event to get started.</p>
                </div>
            )}

            {/* Pagination */}
            {eventsData?.pagination?.totalPages > 1 && (
                <div className="mt-6">
                    <Pagination
                        pageCount={eventsData.pagination.totalPages}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-10 mt-30 md:mt-10">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingEvent(null);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <IoMdClose size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Event ID - Read Only */}
                                {editingEvent && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Event ID
                                        </label>
                                        <input
                                            type="text"
                                            name="eventID"
                                            value={formData.eventID}
                                            readOnly
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                )}
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                                
                                <div>
                                    <ImageUpload
                                        label="Event Card Image *"
                                        name="eventCard"
                                        defaultImage={editingEvent ? `${imageUrl}${editingEvent.eventCard}` : null}
                                        onChange={(file) => handleFileChange('eventCard', file)}
                                        required={!editingEvent}
                                        height={300}
                                        rounded="lg"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <DatePicker
                                            label="Date *"
                                            name="date"
                                            formData={formData}
                                            setFormData={setFormData}
                                            maxDate={null}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Start Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Location *
                                    </label>
                                    <LocationSelector
                                        initialDistrictName={formData.district}
                                        initialUpazilaName={formData.upazila}
                                        onLocationChange={(location) => {
                                            handleLocationChange(location);
                                        }}
                                        required={true}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Google Map Link
                                    </label>
                                    <input
                                        type="url"
                                        name="googleMapLink"
                                        value={formData.googleMapLink}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                {/* Image Uploads - 5 slots */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Event Images (Max 5)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                        {formData.image.map((img, index) => (
                                            <div key={index} className="relative">
                                                {img ? (
                                                    <div className="relative h-40 w-full rounded-lg overflow-hidden">
                                                        <Image 
                                                            src={typeof img === 'string' && !img.startsWith('blob:') ? `${imageUrl}${img}` : URL.createObjectURL(img)}
                                                            alt={`Event image ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                        >
                                                            <FaTimes size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="h-40 w-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-2 hover:border-primary transition-colors cursor-pointer">
                                                        <input
                                                            type="file"
                                                            id={`image-${index}`}
                                                            accept="image/*"
                                                            onChange={(e) => handleImageChange(index, e.target.files[0])}
                                                            className="hidden"
                                                        />
                                                        <label htmlFor={`image-${index}`} className="cursor-pointer flex flex-col items-center">
                                                            <FaImage className="text-gray-400 mb-1" size={20} />
                                                            <span className="text-xs text-gray-500 text-center">Upload Image {index + 1}</span>
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <CustomSelect
                                        label="Status *"
                                        name="status"
                                        options={['Upcoming', 'Ongoing', 'Completed', 'Cancelled']}
                                        selected={formData.status}
                                        setSelected={handleStatusChange}
                                        placeholder="Select event status..."
                                    />
                                </div>

                                <div>
                                    <SponsorSearch
                                        label="Event Organizer"
                                        placeholder="Search for a sponsor..."
                                        onSponsorSelect={handleSponsorSelect}
                                        initialSponsor={editingEvent?.organizer ? {
                                            id: editingEvent.organizer._id || editingEvent.organizer,
                                            name: formData.organizerName
                                        } : null}
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setEditingEvent(null);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="button"
                                    >
                                        {editingEvent ? <><FaEdit /> Update</> : <><FaPlus /> Create</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
