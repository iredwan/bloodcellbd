'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CustomSelect from '@/components/CustomSelect';
import HospitalSearch from '@/components/HospitalSearch';
import { validateContactNumber, validateWhatsAppNumber } from '@/utils/validations';
import CustomDatePicker from '@/components/DatePicker';

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
    hospitalId: '',
    upazila: '',
    district: '',
    contactNumber: '',
    whatsappNumber: '',
    contactRelation: '',
    description: '',
    date: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    contactNumber: '',
    whatsappNumber: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        bloodGroup: initialData.bloodGroup || '',
        bloodUnit: initialData.bloodUnit || 1,
        hospitalName: initialData.hospitalName || '',
        hospitalId: initialData.hospitalId || '',
        upazila: initialData.upazila || '',
        district: initialData.district || '',
        contactNumber: initialData.contactNumber || '',
        whatsappNumber: initialData.whatsappNumber || '',
        contactRelation: initialData.contactRelation || '',
        description: initialData.description || '',
        date: initialData.date || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors when user types
    if (name === 'contactNumber' || name === 'whatsappNumber') {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleHospitalSelect = (hospitalData) => {
    setFormData(prev => ({
      ...prev,
      hospitalName: hospitalData.name,
      hospitalId: hospitalData.id,
      district: hospitalData.district,
      upazila: hospitalData.upazila
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone numbers
    const contactNumberError = validateContactNumber(formData.contactNumber);
    const whatsappNumberError = validateWhatsAppNumber(formData.whatsappNumber);

    const newValidationErrors = {
      contactNumber: contactNumberError,
      whatsappNumber: whatsappNumberError
    };

    setValidationErrors(newValidationErrors);

    // If there are validation errors, prevent submission
    if (contactNumberError || whatsappNumberError) {
      return;
    }

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
          <label
          htmlFor="bloodUnit"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Blood Units
          </label>
          <input
            type="number"
            name="bloodUnit"
            id="bloodUnit"
            value={formData.bloodUnit}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <CustomDatePicker
                    label="Blood Need Date"
                    name="date"
                    formData={formData}
                    setFormData={setFormData}
                    showMonthDropdown={true}
                    required={true}
                    maxDate={new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)}
                    minDate={new Date()}
                  />

        <div>
          <HospitalSearch
            onHospitalSelect={handleHospitalSelect}
            initialHospital={initialData ? {
              name: initialData.hospitalName,
              district: initialData.district,
              upazila: initialData.upazila,
              id: initialData.hospitalId
            } : null}
          />
        </div>

        <div>
          <label 
          htmlFor="contactNumber"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNumber"
            id="contactNumber"
            placeholder="Contact Number (e.g., 01712345678)"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2.5 pr-10 border ${
              validationErrors.contactNumber ? 'border-red-500' : 'border-neutral-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          />
          {validationErrors.contactNumber && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.contactNumber}</p>
          )}
        </div>

        <div>
          <label 
          htmlFor="whatsappNumber"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            WhatsApp Number (Optional)
          </label>
          <input
            type="tel"
            name="whatsappNumber"
            id="whatsappNumber"
            placeholder="WhatsApp Number (e.g., 01712345678)"
            value={formData.whatsappNumber}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 pr-10 border ${
              validationErrors.whatsappNumber ? 'border-red-500' : 'border-neutral-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          />
          {validationErrors.whatsappNumber && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.whatsappNumber}</p>
          )}
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
              "Himself",
              "Mother",
              "Mother-in-law",
              "Nephew",
              "Niece",
              "Others",
              "Sister",
              "Sister-in-law",
              "Son",
              "Son-in-law",
              "Uncle",
              "Volunteer"
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
          <label 
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
          className="button"
        >
          {initialData ? 'Update Request' : 'Create Request'}
        </button>
      </div>
    </form>
  );
};

export default RequestForm;
