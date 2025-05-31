'use client';

import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CustomSelect from '@/components/CustomSelect';
import LocationSelector from '@/components/LocationSelector';

const RequestForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    bloodUnit: 1,
    hospitalName: '',
    upazila: '',
    district: '',
    contactNumber: '',
    contactRelation: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        bloodGroup: initialData.bloodGroup || '',
        bloodUnit: initialData.bloodUnit || 1,
        hospitalName: initialData.hospitalName || '',
        upazila: initialData.upazila || '',
        district: initialData.district || '',
        contactNumber: initialData.contactNumber || '',
        contactRelation: initialData.contactRelation || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
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
      await onSubmit(formData);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="grid gap-6">
        <div>
          <CustomSelect
            options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
            selected={formData.bloodGroup}
            setSelected={(value) =>
              setFormData((prev) => ({ ...prev, bloodGroup: value }))
            }
            label="Blood Group"
            placeholder="Select Blood Group"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Blood Units
          </label>
          <input
            type="number"
            name="bloodUnit"
            value={formData.bloodUnit}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hospital Name
          </label>
          <input
            type="text"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <LocationSelector
            initialDistrictName={formData.district}
            initialUpazilaName={formData.upazila}
            onLocationChange={handleLocationChange}
            required={true}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
        <CustomSelect
            options={[
              "Aunt",
              "Brother",
              "Brother-in-law",
              "Business Partner",
              "Colleague",
              "Cousin",
              "Daughter",
              "Daughter-in-law",
              "Employer",
              "Father",
              "Father-in-law",
              "Friend",
              "Grandfather",
              "Grandmother",
              "Grandson",
              "Mother",
              "Mother-in-law",
              "Nephew",
              "Niece",
              "Others",
              "Sister",
              "Sister-in-law",
              "Son",
              "Son-in-law",
              "Uncle"
            ]
            }
            selected={formData.contactRelation}
            setSelected={(value) =>
              setFormData((prev) => ({ ...prev, contactRelation: value }))
            }
            label="Contact Person Relation"
            placeholder="Select Contact Person Relation"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-70"
        >
          {initialData ? 'Update Request' : 'Create Request'}
        </button>
      </div>
    </form>
  );
};

export default RequestForm;
