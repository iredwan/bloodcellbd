'use client';

import React, { useState, useEffect } from 'react';
import { useGetAllAmbassadorsQuery, useCreateAmbassadorMutation, useUpdateAmbassadorMutation, useDeleteAmbassadorMutation } from '@/features/goodwillAmbassador/goodwillAmbassadorApiSlice';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaImage } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import deleteConfirm from '@/utils/deleteConfirm';
import CustomSelect from '@/components/CustomSelect';
import uploadFiles from '@/utils/fileUpload';

const AmbassadorsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAmbassador, setEditingAmbassador] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        designation: 'Goodwill Ambassador',
        position: '',
        organization: '',
        profileImage: '',
        active: true,
        socialMedia: {
            facebook: '',
            youtube: '',
            instagram: '',
            linkedin: '',
            tiktok: '',
            x: '',
            website: ''
        },
        achievements: [],
        order: 0
    });


    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    const profileImageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

    const { data: ambassadorsData, isLoading, error } = useGetAllAmbassadorsQuery(
        debouncedSearchTerm === '' 
            ? { page: currentPage + 1, limit: itemsPerPage }
            : { page: currentPage + 1, limit: itemsPerPage, search: debouncedSearchTerm }
    );

    // Reset to first page when search term or items per page changes
    useEffect(() => {
        // Only reset page when there's an actual search term
        if (debouncedSearchTerm?.trim()) {
            setCurrentPage(0);
        }
    }, [debouncedSearchTerm, itemsPerPage]);

    const [createAmbassador, { isLoading: isCreating }] = useCreateAmbassadorMutation();
    const [updateAmbassador, { isLoading: isUpdating }] = useUpdateAmbassadorMutation();
    const [deleteAmbassador] = useDeleteAmbassadorMutation();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const clearImage = () => {
        setSelectedImage(null);
        setPreviewImage('');
        setFormData(prev => ({ ...prev, profileImage: null }));
        if (errors?.profileImage) {
            setErrors(prev => ({ ...prev, profileImage: '' }));
        }
    };

    const handleDesignationChange = (value) => {
        setFormData(prev => ({ ...prev, designation: value }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
      
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({
            ...prev,
            profileImage: 'Please select a valid image file',
          }));
          return;
        }
      
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({
            ...prev,
            profileImage: 'Image size should be less than 5MB',
          }));
          return;
        }
      
        // Clear error if any
        if (errors?.profileImage) {
          setErrors(prev => ({ ...prev, profileImage: '' }));
        }
      
        // Preview image
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      
        // Save selected image file (actual file)
        setSelectedImage(file);
      
        // Optional: Set name in formData for showing only (not final upload)
        setFormData(prev => ({
          ...prev,
          profileImage: file.name,
        }));
      };
      

      const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // reset errors
      
        // Basic validation
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = 'Name is required';
      
        if (!editingAmbassador && !selectedImage) {
          newErrors.profileImage = 'Profile image is required for new ambassadors';
        }
      
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
      
        setIsUploading(true);
      
        try {
          let imageUrl = formData.profileImage;
      
          if (selectedImage) {
            const uploaded = await uploadFiles([selectedImage], {
              onError: (err) => {
                throw new Error(err);
              },
            });
      
            
            if (Array.isArray(uploaded) && uploaded[0]?.url) {
              imageUrl = uploaded[0].url.split('/').pop(); 
            } else if (typeof uploaded === 'string') {
              imageUrl = uploaded.split('/').pop();
            } else if (uploaded?.url) {
              imageUrl = uploaded.url.split('/').pop();
            }
          }
      
          const ambassadorData = {
            name: formData.name,
            designation: formData.designation,
            position: formData.position,
            organization: formData.organization,
            profileImage: imageUrl, // This will now be just the filename
            active: formData.active,
            socialMedia: formData.socialMedia,
            achievements: formData.achievements,
            order: formData.order,
          };
      
          let result;
      
          if (editingAmbassador) {
            result = await updateAmbassador({
              id: editingAmbassador._id,
              ambassadorData,
            }).unwrap();
          } else {
            result = await createAmbassador(ambassadorData).unwrap();
          }
      
          if (result?.status) {
            toast.success(`Ambassador ${editingAmbassador ? 'updated' : 'created'} successfully`);
            setIsModalOpen(false);
            setEditingAmbassador(null);
            resetForm();
          } else {
            toast.error(result?.message || 'Operation failed');
          }
        } catch (error) {
          console.error('Operation failed:', error);
          toast.error(error?.data?.message || 'Something went wrong');
        } finally {
          setIsUploading(false);
        }
      };
      

    const handleEdit = (ambassador) => {
        setEditingAmbassador(ambassador);
        setFormData({
            name: ambassador.name || '',
            designation: ambassador.designation || 'Goodwill Ambassador',
            position: ambassador.position || '',
            organization: ambassador.organization || '',
            profileImage: ambassador.profileImage || '',
            active: ambassador.active !== false,
            socialMedia: ambassador.socialMedia || {
                facebook: '',
                youtube: '',
                instagram: '',
                linkedin: '',
                tiktok: '',
                x: '',
                website: ''
            },
            achievements: ambassador.achievements || [],
            order: ambassador.order || 0
        });
        // Set preview image for existing ambassador
        setPreviewImage(ambassador.profileImage ? `${profileImageUrl}${ambassador.profileImage}` : '');
        setSelectedImage(null);
        setIsModalOpen(true);
    };

    // Function to get image preview source
    const getImagePreviewSrc = () => {
        if (previewImage) {
            return previewImage;
        }
        if (editingAmbassador && formData.profileImage) {
            return `${profileImageUrl}${formData.profileImage}`;
        }
        return '';
    };

    const handleDelete = async (id) => {
        const confirmed = await deleteConfirm({
            title: 'Delete Ambassador?',
            text: 'Are you sure you want to delete this ambassador? This action cannot be undone!',
            confirmButtonText: 'Yes, delete ambassador',
        });
        
        if (confirmed) {
            try {
                const result = await deleteAmbassador(id).unwrap();
                if (result.status) {
                    toast.success('Ambassador deleted successfully');
                } else {
                    toast.error(result.message || 'Failed to delete ambassador');
                }
            } catch (error) {
                console.error('Delete failed:', error);
                toast.error(error?.data?.message || 'Failed to delete ambassador');
            }
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            designation: 'Goodwill Ambassador',
            position: '',
            organization: '',
            profileImage: '',
            active: true,
            socialMedia: {
                facebook: '',
                youtube: '',
                instagram: '',
                linkedin: '',
                tiktok: '',
                x: '',
                website: ''
            },
            achievements: [],
            order: 0
        });
        setPreviewImage('');
        setSelectedImage(null);
    };

    // Add search handler with proper validation
    const handleSearch = (e) => {
        const value = e.target.value.trim();
        // Only update search if value has changed
        if (value !== searchTerm) {
            setSearchTerm(value);
        }
    };

    // Add achievement handler
    const handleAddAchievement = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newAchievement = e.target.value.trim();
            
            // Add the new achievement to the array
            setFormData(prev => ({
                ...prev,
                achievements: [...prev.achievements, newAchievement]
            }));

            // Clear the input
            e.target.value = '';
        }
    };

    // Remove achievement handler
    const handleRemoveAchievement = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            achievements: prev.achievements.filter((_, index) => index !== indexToRemove)
        }));
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8a0303]"></div>
        </div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">Error: {error.message}</div>;
    }

    return (
        <div className="mt-8 md:mt-0">
            <h1 className="text-2xl md:text-3xl text-center mb-4 font-bold text-primary">Goodwill Ambassadors</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-grow sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Search ambassadors..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-4 py-2.5 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button
                        onClick={() => {
                            setEditingAmbassador(null);
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="button flex items-center gap-2"
                        disabled={isCreating || isUpdating}
                    >
                        <FaPlus /> Add Ambassador
                    </button>
                </div>
            </div>

            <div className="w-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {ambassadorsData?.data?.ambassadors?.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-200 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Ambassador
                                        </th>
                                        <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Position
                                        </th>
                                        <th className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Organization
                                        </th>
                                        <th className="hidden lg:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {ambassadorsData.data.ambassadors.map((ambassador) => (
                                        <tr key={ambassador._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-3 sm:px-4 py-3 sm:py-4">
                                                <div className="flex items-center">
                                                    {ambassador.profileImage && (
                                                        <img
                                                            src={`${profileImageUrl}${ambassador.profileImage}`}
                                                            alt={ambassador.name}
                                                            className="h-10 w-10 rounded-full object-cover mr-3"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {ambassador.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {ambassador.designation}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {ambassador.position}
                                                </div>
                                            </td>
                                            <td className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {ambassador.organization}
                                                </div>
                                            </td>
                                            <td className="hidden lg:table-cell px-3 sm:px-4 py-3 sm:py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    ambassador.active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                    {ambassador.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(ambassador)}
                                                        className="text-green-500 hover:text-green-700 transition-colors p-2 sm:p-1"
                                                        title="Edit Ambassador"
                                                        disabled={isUpdating}
                                                    >
                                                        <FaEdit className="text-base sm:text-base" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(ambassador._id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors p-2 sm:p-1"
                                                        title="Delete Ambassador"
                                                    >
                                                        <FaTrash className="text-base sm:text-base" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                No ambassadors found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {ambassadorsData?.data?.pagination && ambassadorsData.data.pagination.totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        pageCount={ambassadorsData.data.pagination.totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto backdrop-blur-sm transition-opacity mt-16 md:mt-0">
                    <div className="flex min-h-screen items-center justify-center px-4 py-6">
                        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    disabled={isCreating || isUpdating || isUploading}
                                >
                                    <span className="sr-only">Close</span>
                                    <IoMdClose className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {editingAmbassador ? 'Edit Ambassador' : 'Add New Ambassador'}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Fill in the information below to {editingAmbassador ? 'update the' : 'create a new'} ambassador.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {/* Profile Image Upload */}
                                    <div className="group relative">
                                        <label className="mb-2 block text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Profile Photo
                                            {!editingAmbassador && <span className="text-xs text-gray-400 ml-1">(required)</span>}
                                        </label>
                                        
                                        <div className={`relative flex flex-col mx-auto items-center justify-center mt-6 overflow-hidden h-60 w-60 rounded-full bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-700 ${
                                            errors?.profileImage 
                                                ? 'border-2 border-red-400/50' 
                                                : 'border border-gray-200 dark:border-gray-600'
                                        }`}>
                                            {(getImagePreviewSrc()) ? (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                    <img
                                                        src={getImagePreviewSrc()}
                                                        alt="Profile preview"
                                                        className="h-60 w-60 rounded-full object-cover object-center shadow-inner"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={clearImage}
                                                        className="absolute bottom-6 left-1/2 -translate-x-1/2 transform rounded-full bg-red-500 px-4 py-1.5 text-xs font-medium text-white shadow-lg transition-all duration-300 hover:bg-red-600 md:opacity-0 md:group-hover:opacity-100"
                                                    >
                                                        Change Photo
                                                    </button>
                                                </>
                                            ) : (
                                                <label
                                                    htmlFor="profile-image"
                                                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-3"
                                                >
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-3">
                                                        <FaImage className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            <span className="text-primary underline-offset-2 hover:underline">
                                                                Click to upload <br/>
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <input
                                                        id="profile-image"
                                                        name="profileImage"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageSelect}
                                                        className="hidden"
                                                        required={!editingAmbassador && !formData.profileImage}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        {errors?.profileImage && (
                                            <p className="mt-2 text-center text-xs text-red-500">{errors.profileImage}</p>
                                        )}
                                    </div>

                                    {/* Name Field */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder='Enter Name'
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>

                                    {/* Designation Field */}
                                    <div>
                                        <CustomSelect
                                            label="Designation *"
                                            name="designation"
                                            options={['Goodwill Ambassador', 'Honorable Member', 'Lifetime Member']}
                                            selected={formData.designation}
                                            setSelected={handleDesignationChange}
                                            placeholder="Select designation..."
                                        />
                                    </div>
                                    {/* Organization Field */}
                                    <div>
                                        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Organization
                                        </label>
                                        <input
                                            type="text"
                                            id="organization"
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            placeholder="Enter organization"
                                        />
                                    </div>

                                    {/* Position Field */}
                                    <div>
                                        <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            id="position"
                                            name="position"
                                            value={formData.position}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            placeholder="Enter position"
                                        />
                                    </div>

                                    {/* Social Media Links */}
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300">Social Media Links</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Facebook
                                                </label>
                                                <input
                                                    type="url"
                                                    id="facebook"
                                                    name="socialMedia.facebook"
                                                    value={formData.socialMedia.facebook}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        socialMedia: {
                                                            ...prev.socialMedia,
                                                            facebook: e.target.value
                                                        }
                                                    }))}
                                                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    placeholder="Facebook profile URL"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    YouTube
                                                </label>
                                                <input
                                                    type="url"
                                                    id="youtube"
                                                    name="socialMedia.youtube"
                                                    value={formData.socialMedia.youtube}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        socialMedia: {
                                                            ...prev.socialMedia,
                                                            youtube: e.target.value
                                                        }
                                                    }))}
                                                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    placeholder="YouTube channel URL"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Instagram
                                                </label>
                                                <input
                                                    type="url"
                                                    id="instagram"
                                                    name="socialMedia.instagram"
                                                    value={formData.socialMedia.instagram}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        socialMedia: {
                                                            ...prev.socialMedia,
                                                            instagram: e.target.value
                                                        }
                                                    }))}
                                                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    placeholder="Instagram profile URL"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    LinkedIn
                                                </label>
                                                <input
                                                    type="url"
                                                    id="linkedin"
                                                    name="socialMedia.linkedin"
                                                    value={formData.socialMedia.linkedin}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        socialMedia: {
                                                            ...prev.socialMedia,
                                                            linkedin: e.target.value
                                                        }
                                                    }))}
                                                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    placeholder="LinkedIn profile URL"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    TikTok
                                                </label>
                                                <input
                                                    type="url"
                                                    id="tiktok"
                                                    name="socialMedia.tiktok"
                                                    value={formData.socialMedia.tiktok}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        socialMedia: {
                                                            ...prev.socialMedia,
                                                            tiktok: e.target.value
                                                        }
                                                    }))}
                                                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    placeholder="TikTok profile URL"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="x" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    X (Twitter)
                                                </label>
                                                <input
                                                    type="url"
                                                    id="x"
                                                    name="socialMedia.x"
                                                    value={formData.socialMedia.x}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        socialMedia: {
                                                            ...prev.socialMedia,
                                                            x: e.target.value
                                                        }
                                                    }))}
                                                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    placeholder="X (Twitter) profile URL"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Website
                                                </label>
                                                <input
                                                    type="url"
                                                    id="website"
                                                    name="socialMedia.website"
                                                    value={formData.socialMedia.website}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        socialMedia: {
                                                            ...prev.socialMedia,
                                                            website: e.target.value
                                                        }
                                                    }))}
                                                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    placeholder="Personal website URL"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Achievements */}
                                    <div>
                                        <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Achievements
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                id="achievements"
                                                placeholder="Add achievement and press Enter"
                                                onKeyDown={handleAddAchievement}
                                                className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        {formData.achievements?.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {formData.achievements.map((achievement, index) => (
                                                    <span
                                                        key={`${achievement}-${index}`}
                                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                                                    >
                                                        {achievement}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAchievement(index)}
                                                            className="hover:text-red-500 focus:outline-none"
                                                        >
                                                            <IoMdClose className="h-4 w-4" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Field */}
                                    <div>
                                        <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            id="order"
                                            name="order"
                                            value={formData.order}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 input-number-hide-spinner"
                                            placeholder="Enter display order number"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">Lower numbers will be displayed first</p>
                                    </div>

                                    {/* Active Status Field */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            name="active"
                                            checked={formData.active}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                                        />
                                        <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            Active
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                                        disabled={isCreating || isUpdating || isUploading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                                        disabled={isCreating || isUpdating || isUploading}
                                    >
                                        {(isCreating || isUpdating || isUploading) ? (
                                            <span className="inline-flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                {isUploading ? 'Uploading...' : (editingAmbassador ? 'Updating...' : 'Creating...')}
                                            </span>
                                        ) : (
                                            editingAmbassador ? 'Update Ambassador' : 'Create Ambassador'
                                        )}
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

export default AmbassadorsPage;
