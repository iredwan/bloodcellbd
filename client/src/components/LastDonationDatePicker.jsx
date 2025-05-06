'use client';

import { useState, useEffect } from 'react';
import CustomDatePicker from './DatePicker';
import { format, addDays, parse } from 'date-fns';

const LastDonationDatePicker = ({ 
  formData, 
  setFormData, 
  errors = {}, 
  maxDate = new Date(),
}) => {
  const [isFirstTimeDonor, setIsFirstTimeDonor] = useState(false);
  
  // Initialize from formData
  useEffect(() => {
    // Check if the user has indicated they're a first-time donor
    if (formData.isFirstTimeDonor) {
      setIsFirstTimeDonor(true);
    } else {
      setIsFirstTimeDonor(false);
    }
  }, [formData.isFirstTimeDonor]);
  
  // Calculate next donation date (120 days after last donation)
  useEffect(() => {
    // Only update if not a first-time donor and has a last donation date
    if (!isFirstTimeDonor && formData.lastDonate) {
      try {
        // Parse the date string to a Date object
        const lastDonateDate = parse(formData.lastDonate, 'dd/MM/yyyy', new Date());
        
        // Calculate next donation date (120 days after last donation)
        const nextDate = addDays(lastDonateDate, 120);
        const formattedNextDate = format(nextDate, 'dd/MM/yyyy');
        
        // Update form data with the new next donation date
        if (formData.nextDonationDate !== formattedNextDate) {
          setFormData(prev => ({
            ...prev,
            nextDonationDate: formattedNextDate
          }));
        }
      } catch (error) {
        console.error('Error calculating next donation date:', error);
      }
    }
  }, [formData.lastDonate, isFirstTimeDonor, setFormData, formData.nextDonationDate]);

  const handleFirstTimeDonorChange = (e) => {
    const isChecked = e.target.checked;
    setIsFirstTimeDonor(isChecked);
    
    // Update formData accordingly
    if (isChecked) {
      // Set first-time donor flag and clear last donation date
      // Set next donation date to today
      const today = format(new Date(), 'dd/MM/yyyy');
      setFormData(prev => ({
        ...prev,
        isFirstTimeDonor: true,
        lastDonate: '',
        nextDonationDate: today
      }));
    } else {
      // Remove first-time donor flag and let the useEffect handle next donation date calculation
      setFormData(prev => ({
        ...prev,
        isFirstTimeDonor: false,
        nextDonationDate: '' // Clear it and let the effect update it when lastDonate is set
      }));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <input
          id="isFirstTimeDonor"
          name="isFirstTimeDonor"
          type="checkbox"
          checked={isFirstTimeDonor}
          onChange={handleFirstTimeDonorChange}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
        />
        <label htmlFor="isFirstTimeDonor" className="ml-2 block text-sm text-neutral-700 dark:text-gray-300 cursor-pointer">
          I've never donated blood before
        </label>
      </div>
      
      {!isFirstTimeDonor && (
        <CustomDatePicker
          label="Last Donation Date"
          name="lastDonate"
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          maxDate={maxDate}
          placeholder="Select last donation date"
        />
      )}
      
      {formData.nextDonationDate && (
        <div className="mt-2 text-sm text-green-600 dark:text-green-400">
          <p>Next eligible donation date: {formData.nextDonationDate} and after</p>
        </div>
      )}
    </div>
  );
};

export default LastDonationDatePicker; 