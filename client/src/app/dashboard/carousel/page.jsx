'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaLink } from 'react-icons/fa';
import { MdOutlineSwapVert } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { 
  useGetAllCarouselQuery, 
  useCreateCarouselMutation, 
  useUpdateCarouselMutation, 
  useDeleteCarouselMutation 
} from '@/features/carousel/carouselApiSlice';
import Pagination from '@/components/Pagination';
import ImageUpload from '@/components/ImageUpload';
import deleteConfirm from '@/utils/deleteConfirm';
import uploadFiles from '@/utils/fileUpload';

export default function CarouselManagementPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    linkUrl: '',
    isActive: true,
    order: 0
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl] = useState(process.env.NEXT_PUBLIC_IMAGE_URL || '');

  // RTK Query hooks
  const { data: carouselData, isLoading, refetch } = useGetAllCarouselQuery();
  const [createCarousel, { isLoading: isCreating }] = useCreateCarouselMutation();
  const [updateCarousel, { isLoading: isUpdating }] = useUpdateCarouselMutation();
  const [deleteCarousel, { isLoading: isDeleting }] = useDeleteCarouselMutation();

  // Process carousel data
  const carouselItems = carouselData?.data || [];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = carouselItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(carouselItems.length / itemsPerPage);

  // Handle image upload
  const handleFileChange = (file) => {
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedFile(file);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Open modal for creating new item
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      imageUrl: '',
      linkUrl: '',
      isActive: true,
      order: carouselItems.length > 0 ? Math.max(...carouselItems.map(item => item.order || 0)) + 1 : 0
    });
    setSelectedFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  // Open modal for editing existing item
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      imageUrl: item.imageUrl || '',
      linkUrl: item.linkUrl || '',
      isActive: item.isActive !== undefined ? item.isActive : true,
      order: item.order || 0
    });
    setImagePreview(item.imageUrl || '');
    setSelectedFile(null);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let imageUrl = formData.imageUrl;
      
      // If a new file was selected, upload it
      if (selectedFile) {
        try {
          const uploadResult = await uploadFiles([selectedFile], {
            maxFiles: 1,
            onError: (error) => {
              throw new Error(error);
            }
          });
          imageUrl = uploadResult[0].filename;
        } catch (error) {
          toast.error(`Failed to upload image: ${error.message || error}`);
          setIsUploading(false);
          return;
        }
      }
      
      const carouselData = {
        ...formData,
        imageUrl: imageUrl
      };
      
      if (editingItem) {
        // Update existing carousel item
        await updateCarousel({
          id: editingItem._id,
          carouselData
        }).unwrap();
        toast.success('Carousel item updated successfully');
      } else {
        // Create new carousel item
        await createCarousel(carouselData).unwrap();
        toast.success('Carousel item created successfully');
      }
      
      // Close modal and refresh data
      setShowModal(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save carousel item');
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirmed = await deleteConfirm({
      title: 'Delete Carousel Item',
      text: 'Are you sure you want to delete this carousel item? This action cannot be undone.',
      confirmButtonText: 'Yes, delete it',
    });
    
    if (confirmed) {
      try {
        await deleteCarousel(id).unwrap();
        toast.success('Carousel item deleted successfully');
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete carousel item');
        console.error('Error:', error);
      }
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Carousel Management</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          <FaPlus /> Add New
        </button>
      </div>

      {/* Carousel Items Table */}
      <div className="w-full overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Image
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Link
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Status
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Order
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    No carousel items found.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {/* First column: Image + mobile details */}
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-20 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={`${imageUrl}${item.imageUrl}`}
                            alt="Carousel image"
                            width={80}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {/* Mobile details */}
                        <div className="sm:hidden flex flex-col gap-1 text-xs">
                          <div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Link: </span>
                            {item.linkUrl ? (
                              <span className="text-blue-500 break-all">{item.linkUrl}</span>
                            ) : (
                              <span className="text-gray-400">No link</span>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Status: </span>
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              item.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Order: </span>
                            <span className="text-gray-500">{item.order}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Link column (hidden on mobile) */}
                    <td className="hidden sm:table-cell px-4 py-4 align-top">
                      {item.linkUrl ? (
                        <div className="flex items-center text-blue-500">
                          <FaLink className="mr-1" />
                          <span className="truncate max-w-[200px]">{item.linkUrl}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">No link</span>
                      )}
                    </td>
                    {/* Status column (hidden on <md) */}
                    <td className="hidden md:table-cell px-4 py-4 align-top">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          item.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {/* Order column (hidden on <md) */}
                    <td className="hidden md:table-cell px-4 py-4 align-top text-sm text-gray-500 dark:text-gray-400">
                      {item.order}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-4 align-top text-right text-md font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
            <Pagination
              pageCount={totalPages}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
              {editingItem ? 'Edit Carousel Item' : 'Add New Carousel Item'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className="mb-4">
                <ImageUpload
                  label="Carousel Image"
                  name="carouselImage"
                  onChange={handleFileChange}
                  defaultImage={editingItem ? `${imageUrl}${editingItem.imageUrl}` : null}
                  height={180}
                  rounded="lg"
                  required={!editingItem}
                />
              </div>
              
              {/* Link URL */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Link URL (Optional)
                </label>
                <input
                  type="url"
                  name="linkUrl"
                  value={formData.linkUrl}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>
              
              {/* Order */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white input-number-hide-spinner"
                  min="0"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Lower numbers will be displayed first
                </p>
              </div>
              
              {/* Active Status */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Active (visible on website)
                  </span>
                </label>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating || isUploading}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-70"
                >
                  {isCreating || isUpdating || isUploading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
