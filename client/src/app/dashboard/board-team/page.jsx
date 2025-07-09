'use client';

import React, { useState, useEffect } from 'react';
import { 
    useGetAllBoardTeamMembersQuery, 
    useCreateBoardTeamMutation, 
    useUpdateBoardTeamMutation, 
    useDeleteBoardTeamMutation,
    useToggleBoardTeamActiveMutation,
    useToggleBoardTeamFeaturedMutation,
    useUpdateBoardTeamOrderMutation
} from '@/features/boardTeam/boardTeamApiSlice';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaStar, FaToggleOn, FaToggleOff, FaInstagram, FaLinkedin, FaWhatsapp, FaFacebook } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import deleteConfirm from '@/utils/deleteConfirm';
import Image from 'next/image';
import PersonSelector from '@/components/PersonSelector';
import CustomSelect from '@/components/CustomSelect';

const BoardTeamPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [formData, setFormData] = useState({
        userId: '',
        designation: '',
        bio: '',
        socialLinks: {
            facebook: '',
            whatsapp: '',
            linkedin: '',
            instagram: ''
        },
        active: true,
        featured: false,
        order: 0
    });

    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

    const { data: boardTeamData, isLoading, error, refetch } = useGetAllBoardTeamMembersQuery({
        page: currentPage + 1,
        limit: itemsPerPage,
        search: debouncedSearchTerm,
    });

    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearchTerm, itemsPerPage]);

    // Update formData when selectedUserId changes
    useEffect(() => {
        if (selectedUserId) {
            setFormData(prev => ({
                ...prev,
                userId: selectedUserId
            }));
        }
    }, [selectedUserId]);

    const [createBoardTeam] = useCreateBoardTeamMutation();
    const [updateBoardTeam] = useUpdateBoardTeamMutation();
    const [deleteBoardTeam] = useDeleteBoardTeamMutation();
    const [toggleBoardTeamActive] = useToggleBoardTeamActiveMutation();
    const [toggleBoardTeamFeatured] = useToggleBoardTeamFeaturedMutation();
    const [updateBoardTeamOrder] = useUpdateBoardTeamOrderMutation();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate that a user has been selected for new members
            if (!formData.userId && !editingMember) {
                toast.error('Please select a user');
                return;
            }

            if (editingMember) {
                // Create a clean copy of the data for update
                const updateData = {
                    designation: formData.designation,
                    bio: formData.bio,
                    socialLinks: formData.socialLinks,
                    active: formData.active,
                    featured: formData.featured,
                    order: formData.order,
                    userId: selectedUserId || editingMember.userId._id // Use selected or existing userId
                };
                
                console.log('Updating board team member with data:', updateData);
                
                await updateBoardTeam({ 
                    id: editingMember._id, 
                    boardTeamData: updateData 
                }).unwrap();
                toast.success('Board team member updated successfully');
            } else {
                // Make sure userId is set from selectedUserId
                const createData = {
                    ...formData,
                    userId: selectedUserId
                };
                
                console.log('Creating board team member with data:', createData);
                
                await createBoardTeam(createData).unwrap();
                toast.success('Board team member added successfully');
            }
            setIsModalOpen(false);
            setEditingMember(null);
            resetForm();
            refetch();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        // Set the userId for the PersonSelector
        setSelectedUserId(member.userId._id);
        setFormData({
            userId: member.userId._id, // Explicitly set the userId
            designation: member.designation || '',
            bio: member.bio || '',
            socialLinks: {
                facebook: member.socialLinks?.facebook || '',
                whatsapp: member.socialLinks?.whatsapp || '',
                linkedin: member.socialLinks?.linkedin || '',
                instagram: member.socialLinks?.instagram || ''
            },
            active: member.active ?? true,
            featured: member.featured ?? false,
            order: member.order || 0
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const confirmed = await deleteConfirm({
            title: 'Delete Board Team Member?',
            text: 'Are you sure you want to remove this person from the board team? This action cannot be undone!',
            confirmButtonText: 'Yes, delete member',
        });
        
        if (confirmed) {
            try {
                await deleteBoardTeam(id).unwrap();
                toast.success('Board team member removed successfully');
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || 'Failed to delete board team member');
            }
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            await toggleBoardTeamActive(id).unwrap();
            toast.success(`Member ${currentStatus ? 'deactivated' : 'activated'} successfully`);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update status');
        }
    };

    const handleToggleFeatured = async (id, currentStatus) => {
        try {
            await toggleBoardTeamFeatured(id).unwrap();
            toast.success(`Member ${currentStatus ? 'removed from' : 'added to'} featured list`);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update featured status');
        }
    };

    const handleUpdateOrder = async (id, newOrder) => {
        try {
            await updateBoardTeamOrder({ id, order: parseInt(newOrder) }).unwrap();
            toast.success('Display order updated successfully');
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update display order');
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const resetForm = () => {
        setFormData({
            userId: '',
            designation: '',
            bio: '',
            socialLinks: {
                facebook: '',
                whatsapp: '',
                linkedin: '',
                instagram: ''
            },
            active: true,
            featured: false,
            order: 0
        });
        setSelectedUserId('');
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
        <div className="p-2 md:p-6 mt-8 md:mt-0">
            <h1 className="text-2xl md:text-3xl text-center mb-4 font-bold text-primary">Board Team Management</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-grow sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2.5 px-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button
                        onClick={() => {
                            setEditingMember(null);
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="button"
                    >
                        <FaPlus /> Add Board Member
                    </button>
                </div>
            </div>

            {/* Board Team Members Table - Desktop */}
            <div className="overflow-x-auto">
                <table className="min-w-full hidden md:table divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Member</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Designation</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">Order</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">Status</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">Featured</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {boardTeamData?.data?.map((member) => (
                            <tr key={member._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 relative">
                                            <Image
                                                src={member.userId.profileImage ? `${imageUrl}${member.userId.profileImage}` : '/image/user-male.png'}
                                                alt={member.userId.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full object-cover aspect-square"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {member.userId.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {member.userId.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">{member.designation}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white text-center">{member.order}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => handleToggleActive(member._id, member.active)}
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            member.active
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                        }`}
                                    >
                                        {member.active ? <FaToggleOn className="mr-1" /> : <FaToggleOff className="mr-1" />}
                                        {member.active ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => handleToggleFeatured(member._id, member.featured)}
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            member.featured
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <FaStar className={`mr-1 ${member.featured ? 'text-yellow-500' : ''}`} />
                                        {member.featured ? 'Featured' : 'Not Featured'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-3"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member._id)}
                                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {boardTeamData?.data?.length === 0 && (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                    No board team members found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="md:hidden">
                    {boardTeamData?.data?.length > 0 ? (
                        boardTeamData.data.map((member) => (
                            <div key={member._id} className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
                                <div className="flex items-center mb-2">
                                    <Image
                                        src={member.userId.profileImage ? `${imageUrl}${member.userId.profileImage}` : '/image/user-male.png'}
                                        alt={member.userId.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover aspect-square mr-3"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{member.userId.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{member.userId.email}</div>
                                    </div>
                                </div>
                                <div className="mb-1 dark:text-white text-center"><span className="font-semibold">Designation: </span>{member.designation}</div>
                                <div className="mb-1 dark:text-white text-center"><span className="font-semibold">Order: </span>{member.order}</div>
                                <div className="mb-1 text-center"><span className="font-semibold dark:text-white">Status: </span>
                                    <span className={member.active ? 'text-green-600' : 'text-red-600'}>{member.active ? 'Active' : 'Inactive'}</span>
                                </div>
                                <div className="mb-1 text-center"><span className="font-semibold dark:text-white">Featured: </span>
                                    <span className={member.featured ? 'text-yellow-600' : 'text-gray-600'}>{member.featured ? 'Featured' : 'Not Featured'}</span>
                                </div>
                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="text-green-600 hover:text-green-900 dark:hover:text-green-400 p-2 rounded-full border border-green-200 dark:border-green-700"
                                        aria-label="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member._id)}
                                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-2 rounded-full border border-red-200 dark:border-red-700"
                                        aria-label="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">No board team members found</div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {boardTeamData?.data?.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        pageCount={Math.ceil(boardTeamData.data.length / itemsPerPage)}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-10 mt-22">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {editingMember ? 'Edit Board Team Member' : 'Add New Board Team Member'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingMember(null);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <IoMdClose size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <PersonSelector
                                        onSelect={setSelectedUserId}
                                        label="Name(NID or Birth Registration) *"
                                        initialValue={editingMember?.userId?.name}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Designation *
                                    </label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Bio *
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                {/* Social Links Section */}
                                <div className="border-t pt-4 mt-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Links</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Facebook
                                            </label>
                                            <input
                                                type="url"
                                                name="socialLinks.facebook"
                                                value={formData.socialLinks.facebook}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                WhatsApp
                                            </label>
                                            <input
                                                type="url"
                                                name="socialLinks.whatsapp"
                                                value={formData.socialLinks.whatsapp}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                LinkedIn
                                            </label>
                                            <input
                                                type="url"
                                                name="socialLinks.linkedin"
                                                value={formData.socialLinks.linkedin}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Instagram
                                            </label>
                                            <input
                                                type="url"
                                                name="socialLinks.instagram"
                                                value={formData.socialLinks.instagram}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 input-number-hide-spinner"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            name="active"
                                            checked={formData.active}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            Active
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            Featured
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setEditingMember(null);
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
                                        {editingMember ? <><FaEdit /> Update</> : <><FaPlus /> Create</>}
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

export default BoardTeamPage;