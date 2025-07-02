'use client';

import React, { useState, useEffect } from 'react';
import { useGetAllSponsorsQuery, useCreateSponsorMutation, useUpdateSponsorMutation, useDeleteSponsorMutation } from '@/features/sponsors/sponsorApiSlice';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import deleteConfirm from '@/utils/deleteConfirm';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';
import uploadFiles from '@/utils/fileUpload.js';
import CustomSelect from '@/components/CustomSelect';

const SponsorsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        sponsorType: 'Platinum',
        logo: '',
        coverImage: '',
        description: '',
        website: '',
        active: true,
        order: 0,
        contactPerson: {
            name: '',
            email: '',
            phone: '',
            designation: ''
        }
    });

    const imageUrl= process.env.NEXT_PUBLIC_IMAGE_URL;

    const { data: sponsorsData, isLoading, error, refetch } = useGetAllSponsorsQuery({
        page: currentPage + 1,
        limit: itemsPerPage,
        search: debouncedSearchTerm
    });

    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearchTerm, itemsPerPage]);

    const [createSponsor] = useCreateSponsorMutation();
    const [updateSponsor] = useUpdateSponsorMutation();
    const [deleteSponsor] = useDeleteSponsorMutation();

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

    const handleSponsorTypeChange = (value) => {
        setFormData(prev => ({
            ...prev,
            sponsorType: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let sponsorData = { 
                ...formData,
                sponsorType: formData.sponsorType
            };

            // Handle logo upload if new file is selected
            if (formData.logo instanceof File) {
                const logoUploadResult = await uploadFiles([formData.logo], {
                    maxFiles: 1,
                    onError: (error) => {
                        toast.error(`Failed to upload logo: ${error}`);
                        throw new Error(error);
                    }
                });
                sponsorData.logo = logoUploadResult[0].filename;
            }

            // Handle cover image upload if new file is selected
            if (formData.coverImage instanceof File) {
                const coverImageUploadResult = await uploadFiles([formData.coverImage], {
                    maxFiles: 1,
                    onError: (error) => {
                        toast.error(`Failed to upload cover image: ${error}`);
                        throw new Error(error);
                    }
                });
                sponsorData.coverImage = coverImageUploadResult[0].filename;
            }

            if (editingSponsor) {
                // If editing and no new image is selected, keep the existing image URLs
                if (!(formData.logo instanceof File)) {
                    sponsorData.logo = editingSponsor.logo;
                }
                if (!(formData.coverImage instanceof File)) {
                    sponsorData.coverImage = editingSponsor.coverImage;
                }
                
                await updateSponsor({ id: editingSponsor._id, ...sponsorData }).unwrap();
                toast.success('Sponsor updated successfully');
                refetch();
            } else {
                // For new sponsors, ensure both images are provided
                if (!sponsorData.logo || !sponsorData.coverImage) {
                    toast.error('Both logo and cover image are required');
                    return;
                }
                await createSponsor(sponsorData).unwrap();
                toast.success('Sponsor added successfully');
                refetch();
            }
            setIsModalOpen(false);
            setEditingSponsor(null);
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    const handleEdit = (sponsor) => {
        setEditingSponsor(sponsor);
        setFormData({
            name: sponsor.name || '',
            sponsorType: sponsor.sponsorType ? sponsor.sponsorType.charAt(0).toUpperCase() + sponsor.sponsorType.slice(1) : 'Other',
            logo: sponsor.logo || '',
            coverImage: sponsor.coverImage || '',
            description: sponsor.description || '',
            website: sponsor.website || '',
            active: sponsor.active ?? true,
            order: sponsor.order || 0,
            contactPerson: {
                name: sponsor.contactPerson?.name || '',
                email: sponsor.contactPerson?.email || '',
                phone: sponsor.contactPerson?.phone || '',
                designation: sponsor.contactPerson?.designation || ''
            }
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const confirmed = await deleteConfirm({
            title: 'Delete Sponsor?',
            text: 'Are you sure you want to delete this sponsor? This action cannot be undone!',
            confirmButtonText: 'Yes, delete sponsor',
        });
        
        if (confirmed) {
            try {
                await deleteSponsor(id).unwrap();
                toast.success('Sponsor deleted successfully');
            } catch (error) {
                toast.error(error?.data?.message || 'Failed to delete sponsor');
            }
            refetch();
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            sponsorType: 'Other',
            logo: '',
            coverImage: '',
            description: '',
            website: '',
            active: true,
            order: 0,
            contactPerson: {
                name: '',
                email: '',
                phone: '',
                designation: ''
            }
        });
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
        <div className="p-2 md:p-6">
            <h1 className="text-2xl md:text-3xl text-center mb-4 font-bold text-primary">Sponsors</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-grow sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Search sponsors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 px-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button
                        onClick={() => {
                            setEditingSponsor(null);
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="button"
                    >
                        <FaPlus /> Add Sponsor
                    </button>
                </div>
            </div>

            {/* Sponsors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsorsData?.data?.sponsors?.map((sponsor) => (
                    <div key={sponsor._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 hover:scale-105">
                        <div className="relative h-40">
                            <Image
                                src={`${imageUrl}${sponsor.coverImage}`}
                                alt={sponsor.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(sponsor)}
                                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                                    title="Edit Sponsor"
                                >
                                    <FaEdit className="text-green-600" />
                                </button>
                                <button
                                    onClick={() => handleDelete(sponsor._id)}
                                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                                    title="Delete Sponsor"
                                >
                                    <FaTrash className="text-red-600" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="relative w-12 h-12">
                                    <Image
                                        src={`${imageUrl}${sponsor.logo}`}
                                        alt={`${sponsor.name} logo`}
                                        fill
                                        className="object-cover rounded-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{sponsor.name}</h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{sponsor.sponsorType}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{sponsor.description}</p>
                            {sponsor.website && (
                                <a
                                    href={sponsor.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:text-primary-dark mt-2 inline-block"
                                >
                                    Visit Website
                                </a>
                            )}
                            <div className="mt-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    sponsor.active
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                }`}>
                                    {sponsor.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {sponsorsData?.data?.totalSponsors > itemsPerPage && (
                <div className="mt-6">
                    <Pagination
                        pageCount={Math.ceil(sponsorsData.data.totalSponsors / itemsPerPage)}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-10">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto mt-43 md:mt-18">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingSponsor(null);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <IoMdClose size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                                <div>
                                    <CustomSelect
                                        label="Sponsor Type *"
                                        name="sponsorType"
                                        options={['Platinum', 'Gold', 'Silver', 'Bronze', 'Other']}
                                        selected={formData.sponsorType}
                                        setSelected={handleSponsorTypeChange}
                                        placeholder="Select sponsor type..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ImageUpload
                                        label="Logo *"
                                        name="logo"
                                        defaultImage={editingSponsor ? `${imageUrl}${editingSponsor.logo}` : null}
                                        onChange={(file) => handleFileChange('logo', file)}
                                        required={!editingSponsor}
                                        height={160}
                                        width={160}
                                        rounded="full"
                                    />
                                    <ImageUpload
                                        label="Cover Image *"
                                        name="coverImage"
                                        defaultImage={editingSponsor ? `${imageUrl}${editingSponsor.coverImage}` : null}
                                        onChange={(file) => handleFileChange('coverImage', file)}
                                        required={!editingSponsor}
                                        height={160}
                                        rounded="lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Order
                                        </label>
                                        <input
                                            type="number"
                                            name="order"
                                            value={formData.order}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 input-number-hide-spinner"
                                        />
                                    </div>
                                </div>

                                {/* Contact Person Section */}
                                <div className="border-t pt-4 mt-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Person</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                name="contactPerson.name"
                                                value={formData.contactPerson.name}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    contactPerson: {
                                                        ...prev.contactPerson,
                                                        name: e.target.value
                                                    }
                                                }))}
                                                className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="contactPerson.email"
                                                value={formData.contactPerson.email}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    contactPerson: {
                                                        ...prev.contactPerson,
                                                        email: e.target.value
                                                    }
                                                }))}
                                                className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="contactPerson.phone"
                                                value={formData.contactPerson.phone}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    contactPerson: {
                                                        ...prev.contactPerson,
                                                        phone: e.target.value
                                                    }
                                                }))}
                                                className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Designation
                                            </label>
                                            <input
                                                type="text"
                                                name="contactPerson.designation"
                                                value={formData.contactPerson.designation}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    contactPerson: {
                                                        ...prev.contactPerson,
                                                        designation: e.target.value
                                                    }
                                                }))}
                                                className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                        Active
                                    </label>
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setEditingSponsor(null);
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
                                        {editingSponsor ? <><FaEdit /> Update</> : <><FaPlus /> Create</>}
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

export default SponsorsPage;

