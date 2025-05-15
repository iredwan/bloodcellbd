'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCalendarAlt, FaMapMarkerAlt, FaTint, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import CustomSelect from '@/components/CustomSelect';
import CustomDatePicker from '@/components/DatePicker';
import { useUpdateUserProfileMutation, useDeleteUserMutation } from '@/features/users/userApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { format, isValid, parse } from 'date-fns';

const Profile = ({ user, onDelete }) => {
  const router = useRouter();
  const [sectionEditMode, setSectionEditMode] = useState({
    personal: false,
    contact: false,
    donation: false
  });

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize formData with user data, ensuring dates are properly formatted
  useEffect(() => {
    if (user) {
      const initialData = { ...user };
      setFormData(initialData);
    }
  }, [user]);

  // Redux mutations
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Toggle edit mode for an entire section
  const toggleSectionEditMode = (section) => {
    setSectionEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle select change (for dropdown fields)
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Save all changes in a section
  const saveSectionChanges = async (section) => {
    // Collect all fields in this section
    let sectionFields = [];
    let updateData = {};
    
    if (section === 'personal') {
      sectionFields = ['name', 'dob', 'gender', 'religion', 'occupation', 'identificationType', 
                      'identificationNumber', 'fatherName', 'fatherPhoneNumber', 'motherName', 'motherPhoneNumber'];
    } else if (section === 'contact') {
      sectionFields = ['email', 'phone', 'alternatePhone', 'whatsappNumber', 'district', 'upazila'];
    } else if (section === 'donation') {
      sectionFields = ['bloodGroup', 'lastDonate', 'nextDonationDate'];
    }
    
    // Validate all fields in the section
    let isValid = true;
    const newErrors = { ...errors };
    
    sectionFields.forEach(field => {
      // Email validation
      if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Invalid email format';
          isValid = false;
        }
      }
      
      // Phone validation
      if (field === 'phone' || field === 'alternatePhone' || field === 'whatsappNumber' || field === 'fatherPhoneNumber' || field === 'motherPhoneNumber') {
        if (formData[field] && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData[field])) {
          newErrors[field] = 'Invalid phone format';
          isValid = false;
        }
      }
      
      // Add the field to our update data
      updateData[field] = formData[field];
    });
    
    setErrors(newErrors);
    if (!isValid) return;
    
    try {
      // Call the update API with all the section fields
      const result = await updateUserProfile({ 
        id: user._id, 
        userData: updateData 
      }).unwrap();
      
      if (result.status) {
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} information updated successfully`);
        toggleSectionEditMode(section);
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update profile');
      console.error('Update error:', error);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      try {
        const result = await deleteUser(user._id).unwrap();
        if (result.status) {
          toast.success('User deleted successfully');
          router.push('/dashboard'); // Redirect to dashboard after deletion
        } else {
          toast.error(result.message || 'Failed to delete user');
        }
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete user');
        console.error('Delete error:', error);
      }
    }
  };

  // Cancel editing a section
  const cancelSectionEditing = (section) => {
    // Reset all fields in the section to their original values
    let sectionFields = [];
    
    if (section === 'personal') {
      sectionFields = ['name', 'dob', 'gender', 'religion', 'occupation', 'identificationType', 
                       'identificationNumber', 'fatherName', 'fatherPhoneNumber', 'motherName', 'motherPhoneNumber'];
    } else if (section === 'contact') {
      sectionFields = ['email', 'phone', 'alternatePhone', 'whatsappNumber', 'district', 'upazila'];
    } else if (section === 'donation') {
      sectionFields = ['bloodGroup', 'lastDonate', 'nextDonationDate'];
    }
    
    const resetData = {};
    sectionFields.forEach(field => {
      resetData[field] = user[field];
    });
    
    setFormData(prev => ({
      ...prev,
      ...resetData
    }));
    
    toggleSectionEditMode(section);
  };

  // Helper function to check if a string is in a valid date format
  const isValidDateFormat = (dateString) => {
    if (!dateString) return false;
    
    // Try different date formats
    const formats = ['dd/MM/yyyy', 'yyyy-MM-dd', 'MM/dd/yyyy'];
    
    for (const format of formats) {
      const parsedDate = parse(dateString, format, new Date());
      if (isValid(parsedDate)) {
        return true;
      }
    }
    
    return false;
  };

  // Display field based on section edit mode
  const DisplayField = ({ label, field, value, type = 'text', options = [] }) => {
    const isEditing = sectionEditMode[field.includes('dob') || field.includes('donate') || field.includes('Date') ? 
      (field.includes('donate') || field.includes('Date') ? 'donation' : 'personal') : 
      (field.includes('email') || field.includes('phone') || field.includes('district') || field.includes('upazila') ? 'contact' : 'personal')];

    if (isEditing) {
      if (type === 'select') {
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
            <CustomSelect
              options={options}
              selected={formData[field] || ''}
              setSelected={(val) => handleSelectChange(field, val)}
              className="w-full"
            />
            {errors[field] && <span className="text-red-500 text-xs mt-1 block">{errors[field]}</span>}
          </div>
        );
      } else if (type === 'date') {
        // Instead of using the CustomDatePicker for editing dates, use a simple input field for now
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
            <input
              type="date"
              name={field}
              value={formData[field] ? formatDateForInput(formData[field]) : ''}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border ${errors[field] ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white`}
            />
            {errors[field] && <span className="text-red-500 text-xs mt-1 block">{errors[field]}</span>}
          </div>
        );
      } else {
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
            <input
              type={type}
              name={field}
              value={formData[field] || ''}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border ${errors[field] ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white`}
            />
            {errors[field] && <span className="text-red-500 text-xs mt-1 block">{errors[field]}</span>}
          </div>
        );
      }
    } else {
      return (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</h3>
          <p className="text-gray-800 dark:text-white font-semibold">
            {value || <span className="text-gray-400 italic">Not provided</span>}
          </p>
        </div>
      );
    }
  };

  // Format date from various formats to YYYY-MM-DD for date input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    try {
      // First try to parse as dd/MM/yyyy
      let parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      
      // If that fails, try yyyy-MM-dd
      if (!isValid(parsedDate)) {
        parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
      }
      
      // If that fails too, try MM/dd/yyyy
      if (!isValid(parsedDate)) {
        parsedDate = parse(dateString, 'MM/dd/yyyy', new Date());
      }
      
      // If we have a valid date, format it as YYYY-MM-DD for the input
      if (isValid(parsedDate)) {
        return format(parsedDate, 'yyyy-MM-dd');
      }
      
      // If all parsing attempts failed, return the original string
      return dateString;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Section component for grouping related fields
  const Section = ({ title, icon, children, section }) => {
    const isEditing = sectionEditMode[section] || false;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
          <div className="flex items-center">
            {icon}
            <h3 className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">
              {title}
            </h3>
          </div>
          
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => saveSectionChanges(section)}
                className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors flex items-center"
                disabled={isUpdating}
              >
                <FaCheck className="mr-1" />
                Save
              </button>
              
              <button 
                onClick={() => cancelSectionEditing(section)}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors flex items-center"
              >
                <FaTimes className="mr-1" />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => toggleSectionEditMode(section)}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors flex items-center"
            >
              <FaEdit className="mr-1" />
              Edit
            </button>
          )}
        </div>
        <div className="p-4">{children}</div>
      </div>
    );
  };

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="relative w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaUser className="text-5xl text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="text-center md:text-left space-y-2 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {user.name}
                {user.isVerified === true && (
                  <span className="text-primary ml-2 inline-block align-middle">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                )}
              </h1>
              
              <button 
                onClick={handleDeleteUser}
                className="mt-2 md:mt-0 inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                disabled={isDeleting}
              >
                <FaTrash className="mr-2" />
                Delete Account
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300">{user.role} {user.roleSuffix}</p>
            
            <div className="flex justify-center md:justify-start items-center gap-2">
              <span className="text-white bg-primary rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                {user.bloodGroup}
              </span>
              <span className="text-gray-600 dark:text-gray-300">{user.bloodGroup} Blood Group</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <Section 
        title="Personal Information" 
        icon={<FaUser className="text-primary" />}
        section="personal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <DisplayField label="Full Name" field="name" value={formData.name} />
          <DisplayField label="Date of Birth" field="dob" value={formData.dob} type="date" />
          <DisplayField 
            label="Gender" 
            field="gender" 
            value={formData.gender} 
            type="select" 
            options={['Male', 'Female', 'Other']} 
          />
          <DisplayField 
            label="Religion" 
            field="religion" 
            value={formData.religion} 
            type="select" 
            options={['Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other']} 
          />
          <DisplayField label="Occupation" field="occupation" value={formData.occupation} />
          <DisplayField 
            label="ID Type" 
            field="identificationType" 
            value={formData.identificationType} 
            type="select" 
            options={['NID', 'Birth Certificate']} 
          />
          <DisplayField label="ID Number" field="identificationNumber" value={formData.identificationNumber} />
          <DisplayField label="Father's Name" field="fatherName" value={formData.fatherName} />
          <DisplayField label="Father's Phone" field="fatherPhoneNumber" value={formData.fatherPhoneNumber} />
          <DisplayField label="Mother's Name" field="motherName" value={formData.motherName} />
          <DisplayField label="Mother's Phone" field="motherPhoneNumber" value={formData.motherPhoneNumber} />
        </div>
      </Section>

      {/* Contact Information Section */}
      <Section 
        title="Contact Information" 
        icon={<FaEnvelope className="text-primary" />}
        section="contact"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <DisplayField label="Email" field="email" value={formData.email} type="email" />
          <DisplayField label="Phone" field="phone" value={formData.phone} />
          <DisplayField label="Alternate Phone" field="alternatePhone" value={formData.alternatePhone} />
          <DisplayField label="WhatsApp Number" field="whatsappNumber" value={formData.whatsappNumber} />
          <DisplayField label="District" field="district" value={formData.district} />
          <DisplayField label="Upazila" field="upazila" value={formData.upazila} />
        </div>
      </Section>

      {/* Donation Information Section */}
      <Section 
        title="Donation Information" 
        icon={<FaTint className="text-primary" />}
        section="donation"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <DisplayField 
            label="Blood Group" 
            field="bloodGroup" 
            value={formData.bloodGroup} 
            type="select" 
            options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} 
          />
          <DisplayField label="Last Donation" field="lastDonate" value={formData.lastDonate} type="date" />
          <DisplayField label="Next Eligible Date" field="nextDonationDate" value={formData.nextDonationDate} type="date" />
        </div>
      </Section>
    </div>
  );
};

export default Profile;
