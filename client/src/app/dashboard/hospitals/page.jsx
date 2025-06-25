'use client';

import React, { useState, useEffect } from 'react';
import { useGetAllHospitalsQuery, useCreateHospitalMutation, useUpdateHospitalMutation, useDeleteHospitalMutation } from '@/features/hospital/hospitalApiSlice';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import deleteConfirm from '@/utils/deleteConfirm';
import LocationSelector from '@/components/LocationSelector';

const HospitalsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHospital, setEditingHospital] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        district: '',
        upazila: '',
        address: '',
        contact: '',
        email: '',
        website: '',
        beds: '',
        specialties: ''
    });

    const { data: hospitalsData, isLoading, error } = useGetAllHospitalsQuery({
        page: currentPage + 1,
        limit: itemsPerPage,
        search: debouncedSearchTerm
    });

    // Reset to first page when search term or items per page changes
    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearchTerm, itemsPerPage]);

    const [createHospital] = useCreateHospitalMutation();
    const [updateHospital] = useUpdateHospitalMutation();
    const [deleteHospital] = useDeleteHospitalMutation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLocationChange = (locationData) => {
        setFormData(prev => ({
            ...prev,
            district: locationData.districtName || '',
            upazila: locationData.upazilaName || ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingHospital) {
                await updateHospital({ id: editingHospital._id, ...formData }).unwrap();
                toast.success('Hospital updated successfully');
            } else {
                await createHospital(formData).unwrap();
                toast.success('Hospital added successfully');
            }
            setIsModalOpen(false);
            setEditingHospital(null);
            resetForm();
        } catch (error) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    const handleEdit = (hospital) => {
        setEditingHospital(hospital);
        setFormData({
            name: hospital.name || '',
            district: hospital.district || '',
            upazila: hospital.upazila || '',
            address: hospital.address || '',
            contact: hospital.contact || '',
            email: hospital.email || '',
            website: hospital.website || '',
            beds: hospital.beds || '',
            specialties: hospital.specialties || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const confirmed = await deleteConfirm({
            title: 'Delete Hospital?',
            text: 'Are you sure you want to delete this hospital? This action cannot be undone!',
            confirmButtonText: 'Yes, delete hospital',
        });
        
        if (confirmed) {
            try {
                await deleteHospital(id).unwrap();
                toast.success('Hospital deleted successfully');
            } catch (error) {
                toast.error(error?.data?.message || 'Failed to delete hospital');
            }
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            district: '',
            upazila: '',
            address: '',
            contact: '',
            email: '',
            website: '',
            beds: '',
            specialties: ''
        });
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">Error: {error.message}</div>;
    }

    return (
        <div className="p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl text-center mb-4 font-bold text-primary">Hospitals</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-grow sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Search hospitals..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 px-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button
                        onClick={() => {
                            setEditingHospital(null);
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="button"
                    >
                        <FaPlus /> Add Hospital
                    </button>
                </div>
            </div>

            {/* Hospitals Table */}
            <div className="w-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {hospitalsData?.data?.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-200 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Hospital Name
                                        </th>
                                        <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="hidden lg:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Beds
                                        </th>
                                        <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {hospitalsData.data.map((hospital) => (
                                        <tr key={hospital._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-3 sm:px-4 py-3 sm:py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {hospital.name}
                                                </div>
                                                <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {hospital.district}, {hospital.upazila}
                                                </div>
                                                <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {hospital.contact}
                                                </div>
                                                <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Beds: {hospital.beds}
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {hospital.district}, {hospital.upazila}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {hospital.address}
                                                </div>
                                            </td>
                                            <td className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {hospital.contact}
                                                </div>
                                                {hospital.email && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {hospital.email}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="hidden lg:table-cell px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                                                    {hospital.beds} beds
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(hospital)}
                                                        className="text-green-500 hover:text-green-700 transition-colors p-2 sm:p-1"
                                                        title="Edit Hospital"
                                                    >
                                                        <FaEdit className="text-base sm:text-base" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(hospital._id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors p-2 sm:p-1"
                                                        title="Delete Hospital"
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
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p className="text-xl mb-2">No hospitals found</p>
                                <p className="text-sm">
                                    {searchTerm ? 'Try different search terms' : 'Click the "Add Hospital" button to add a new hospital'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {hospitalsData?.pagination && hospitalsData.pagination.totalPages > 1 && (
                <Pagination
                    pageCount={hospitalsData.pagination.totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-10">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto my-6 mt-25 z-10">
                        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
                            <h2 className="text-xl font-semibold text-primary">
                                {editingHospital ? 'Edit Hospital' : 'Add New Hospital'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <IoMdClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Hospital Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>

                                {/* Location Selector */}
                                <div className="md:col-span-2">
                                    <LocationSelector
                                        initialDistrictName={formData.district}
                                        initialUpazilaName={formData.upazila}
                                        onLocationChange={handleLocationChange}
                                        required={true}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Contact
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleInputChange}
                                        pattern="^(?:\+88|88)?(01[3-9]\d{8})$"
                                        title="Please enter a valid Bangladeshi phone number (e.g. +8801712345678 or 01712345678)"
                                        placeholder="01712345678"
                                        className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                        title="Please enter a valid email address"
                                        placeholder="example@domain.com"
                                        className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

                                <div>
                                    <label htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Number of Beds
                                    </label>
                                    <input
                                        type="number"
                                        name="beds"
                                        value={formData.beds}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 input-number-hide-spinner"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Specialties
                                    </label>
                                    <input
                                        name="specialties"
                                        value={formData.specialties}
                                        onChange={handleInputChange}
                                        placeholder="Diagnostic center, clinic, etc."
                                        className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 button-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 button"
                                >
                                    {editingHospital ? 'Update Hospital' : 'Add Hospital'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalsPage;