'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGenerateOTPMutation, useVerifyOTPMutation } from '@/features/auth/otpApiSlice';
import { useRegisterUserMutation } from '@/features/users/userApiSlice';
import { toast } from 'react-toastify';
import uploadFile from '@/utils/fileUpload';
import Toast from '@/utils/toast';
import { deleteCookie, setCookie } from 'cookies-next';
import { FaCheckCircle, FaEnvelope,  FaFileImage,  FaPhone, FaUserCircle } from 'react-icons/fa';
import { BiSolidDonateBlood } from "react-icons/bi";
import CustomDatePicker from '@/components/DatePicker';
import LastDonationDatePicker from '@/components/LastDonationDatePicker';
import { 
  getPhoneError, 
  getEmailError, 
  getIDError
} from '@/utils/validations';
import LocationSelector from '@/components/LocationSelector';
import { FiFile, FiImage, FiUpload, FiFileText, FiInfo } from 'react-icons/fi';

// Form steps
const STEPS = {
  EMAIL_VERIFICATION: 0,
  OTP_VERIFICATION: 1,
  PERSONAL_INFO: 2,
  CONTACT_INFO: 3,
  DONATION_INFO: 4,
  DOCUMENT_UPLOAD: 5,
  FINAL_REVIEW: 6
};

const initialFormData = {
  // Personal Information
  name: '',
  dob: '',
  gender: '',
  religion: '',
  occupation: '',
  identificationNumber: '',
  identificationType: 'NID',
  fatherName: '',
  fatherPhoneNumber: '',
  motherName: '',
  motherPhoneNumber: '',
  smoking: false,
  
  // Contact Information
  email: '',
  phone: '',
  alternatePhone: '',
  whatsappNumber: '',
  password: '',
  confirmPassword: '',
  district: '',
  upazila: '',
  
  // Donation Information
  bloodGroup: '',
  lastDonate: '',
  nextDonationDate: '',
  isFirstTimeDonor: false,
  
  // Document Information
  profileImage: null,
  nidOrBirthRegistrationImage: null,
  
  // OTP Information
  otp: '',
  token: ''
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [step, setStep] = useState(STEPS.EMAIL_VERIFICATION);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // Add state for district/upazila IDs
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedUpazilaId, setSelectedUpazilaId] = useState('');
  
  // Redux hooks
  const [generateOTP, { isLoading: isGeneratingOTP }] = useGenerateOTPMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();

  // Handle step navigation
  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);
  
  // Generic form input handler
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
  
  // Send OTP for email verification
  const handleSendOTP = async () => {
    const emailError = getEmailError(formData.email);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      return;
    }
    
    try {
      const response = await generateOTP(formData.email).unwrap();
      if (response.status === true) {
        toast.success(`${response.message}`);
        nextStep();
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to send OTP');
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    try {
      const response = await generateOTP(formData.email).unwrap();
      if (response.status === true) {
        toast.success(`OTP Resent to ${formData.email}`);
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to send OTP');
    }
    
  };
  
  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setErrors(prev => ({ ...prev, otp: 'OTP is required' }));
      return;
    }
    
    try {
      const response = await verifyOTP({
        email: formData.email,
        otp: formData.otp
      }).unwrap();
      
      if (response.status === true) {
        toast.success(`${response.message}`);
        
        // Store token in state
        setFormData(prev => ({ 
          ...prev, 
          token: response.token 
        }));
        
        nextStep();
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to verify OTP');
    }
  };
  
  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  // Handle location change from LocationSelector component
  const handleLocationChange = (locationData) => {
    // Only update state if the values are actually different
    // This prevents infinite update loops
    if (selectedDistrictId !== locationData.districtId) {
      setSelectedDistrictId(locationData.districtId);
    }
    
    if (selectedUpazilaId !== locationData.upazilaId) {
      setSelectedUpazilaId(locationData.upazilaId);
    }
    
    // Check if form data values have changed before updating
    const districtChanged = formData.district !== locationData.districtName;
    const upazilaChanged = formData.upazila !== locationData.upazilaName;
    
    if (districtChanged || upazilaChanged) {
      setFormData(prev => ({
        ...prev,
        district: locationData.districtName || prev.district,
        upazila: locationData.upazilaName || prev.upazila
      }));
      
      // Clear errors if they exist
      if (errors.district || errors.upazila) {
        setErrors(prev => ({ 
          ...prev, 
          district: '',
          upazila: ''
        }));
      }
    }
  };
  
  // Validate current step
  const validateStep = () => {
    const newErrors = {};
    
    switch (step) {
      case STEPS.EMAIL_VERIFICATION:
        const emailError = getEmailError(formData.email);
        if (emailError) newErrors.email = emailError;
        break;
        
      case STEPS.OTP_VERIFICATION:
        if (!formData.otp) newErrors.otp = 'OTP is required';
        break;
        
      case STEPS.PERSONAL_INFO:
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.religion) newErrors.religion = 'Religion is required';
        if (!formData.occupation) newErrors.occupation = 'Occupation is required';
        const idError = getIDError(formData.identificationNumber);
        if (idError) newErrors.identificationNumber = idError;
        if (!formData.fatherName) newErrors.fatherName = 'Father\'s name is required';
        if (!formData.motherName) newErrors.motherName = 'Mother\'s name is required';
        break;
        
      case STEPS.CONTACT_INFO:
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        } else {
          const phoneError = getPhoneError(formData.phone);
          if (phoneError) newErrors.phone = phoneError;
        }
        
        // Only validate alternate phone if it's provided
        if (formData.alternatePhone) {
          const alternatePhoneError = getPhoneError(formData.alternatePhone);
          if (alternatePhoneError) newErrors.alternatePhone = alternatePhoneError;
        }
        
        if (!formData.district) newErrors.district = 'District is required';
        if (!formData.upazila) newErrors.upazila = 'Upazila is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
        
      case STEPS.DONATION_INFO:
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
        if (!formData.isFirstTimeDonor && !formData.lastDonate) newErrors.lastDonate = 'Last donation date is required';
        if (!formData.nextDonationDate) newErrors.nextDonationDate = 'Next donation date is required';
        break;
        
      case STEPS.DOCUMENT_UPLOAD:
        if (!formData.profileImage) newErrors.profileImage = 'Profile image is required';
        if (!formData.nidOrBirthRegistrationImage) {
          newErrors.nidOrBirthRegistrationImage = 'ID document image is required';
        }
        break;
        
      case STEPS.FINAL_REVIEW:
        // Additional validation for final review step
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.religion) newErrors.religion = 'Religion is required';
        if (!formData.occupation) newErrors.occupation = 'Occupation is required';
        const finalIdError = getIDError(formData.identificationNumber);
        if (finalIdError) newErrors.identificationNumber = finalIdError;
        
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        } else {
          const finalPhoneError = getPhoneError(formData.phone);
          if (finalPhoneError) newErrors.phone = finalPhoneError;
        }
        
        if (formData.alternatePhone) {
          const finalAlternatePhoneError = getPhoneError(formData.alternatePhone);
          if (finalAlternatePhoneError) newErrors.alternatePhone = finalAlternatePhoneError;
        }
        
        if (!formData.district) newErrors.district = 'District is required';
        if (!formData.upazila) newErrors.upazila = 'Upazila is required';
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
        if (!formData.isFirstTimeDonor && !formData.lastDonate) newErrors.lastDonate = 'Last donation date is required';
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission for registration
  const handleRegister = async () => {
    setIsLoading(true);

    //Set Cookie
    setCookie('token', formData.token);
    
    try {
      // Upload profile image
      let profileImageData = null;
      if (formData.profileImage) {
        profileImageData = await uploadFile([formData.profileImage], {
          maxFiles: 1,
          onError: (error) => {
            toast.error(`Failed to upload profile image: ${error}`);
            throw new Error(error);
          }
        });
      }
      
      // Upload ID document image
      let idImageData = null;
      if (formData.nidOrBirthRegistrationImage) {
        idImageData = await uploadFile([formData.nidOrBirthRegistrationImage], {
          maxFiles: 1,
          onError: (error) => {
            toast.error(`Failed to upload ID document: ${error}`);
            throw new Error(error);
          }
        });
      }
      
      // Prepare registration data
      const registrationData = {
        ...formData,
        profileImage: profileImageData?.[0]?.filename || '',
        nidOrBirthRegistrationImage: idImageData?.[0]?.filename || '',
      };
      
      // Remove confirmPassword and otp as they're not needed for API
      delete registrationData.confirmPassword;
      delete registrationData.otp;
      
      // Token is now sent via headers from the cookie
      // We don't need to include it in the request body
      delete registrationData.token;
      
      // Register user
      const response = await registerUser(registrationData).unwrap();
      
      if (response.status === true) {
        toast.success(`${response.message}`);

        // Remove token from cookie
        deleteCookie('token');
        //set timeout to redirect to login page
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  //Navigate To Step
  const navigateToStep = (step) => {
    setStep(step);
  };
  
  // Handle next button click
  const handleNext = () => {
    if (validateStep()) {
      if (step === STEPS.EMAIL_VERIFICATION) {
        handleSendOTP();
      } else if (step === STEPS.OTP_VERIFICATION) {
        handleVerifyOTP();
      } else if (step === STEPS.FINAL_REVIEW) {
        handleRegister();
      } else {
        nextStep();
      }
    }
  };
  
  // Render different steps
  const renderStep = () => {
    switch (step) {
      case STEPS.EMAIL_VERIFICATION:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <FaEnvelope className="text-primary text-5xl" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-gray-200">Email Verification</h2>
              <p className="text-neutral-600 mt-2 dark:text-gray-400">
                Enter your email to receive a verification code.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="form-control">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>}
              </div>
            </div>
          </div>
        );
      
      case STEPS.OTP_VERIFICATION:
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center items-center">
              <FaCheckCircle className="text-primary text-5xl" />
            </div>
            <h2 className="text-2xl font-bold">Verify OTP</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the 6-digit code sent to {formData.email}
            </p>
            
            <div className="form-control">
              <label htmlFor="otp" className="label">
                <span className="label-text">OTP Code</span>
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                className={`w-full px-4 py-3 border ${errors.otp ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                maxLength={6}
              />
              {errors.otp && <span className="text-error text-sm">{errors.otp}</span>}
            </div>
            
            <button 
              type="button" 
              onClick={handleResendOTP} 
              className="button"
              disabled={isGeneratingOTP}
            >
              {isGeneratingOTP ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        );
      
      case STEPS.PERSONAL_INFO:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <FaUserCircle className="text-primary text-5xl" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Personal Information</h2>
              <p className="text-neutral-600 mt-1 max-w-md mx-auto dark:text-gray-400">
                Tell us about yourself so we can better serve your donations and requests
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="form-group">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`w-full px-4 py-2.5 border ${errors.name ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="text-red-500 text-sm mt-1 block">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                  <CustomDatePicker
                    label="Date of Birth"
                    name="dob"
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 50))}
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 16))}
                    required={false}
                    placeholder="DD/MM/YYYY"
                    className="mb-2 w-full"
                  />
                  {formData.dob && new Date().getFullYear() - new Date(formData.dob).getFullYear() < 16 && (
                    <span className="text-red-500 text-sm mt-1 block">
                      You are not eligible to donate blood at {new Date().getFullYear()}
                    </span>
                  )}
                </div>
              
              
              <div className="form-group">
                <label htmlFor="gender" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className={`w-full px-4 py-2.5 border ${errors.gender ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700`}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="text-red-500 text-sm mt-1 block">{errors.gender}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="religion" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Religion
                </label>
                <select
                  id="religion"
                  name="religion"
                  className={`w-full px-4 py-2.5 border ${errors.religion ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700`}
                  value={formData.religion}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select religion</option>
                  <option value="Islam">Islam</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Christianity">Christianity</option>
                  <option value="Buddhism">Buddhism</option>
                  <option value="Other">Other</option>
                </select>
                {errors.religion && <span className="text-red-500 text-sm mt-1 block">{errors.religion}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="occupation" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Occupation
                </label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  className={`w-full px-4 py-2.5 border ${errors.occupation ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Enter your occupation"
                />
                {errors.occupation && <span className="text-red-500 text-sm mt-1 block">{errors.occupation}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="identificationType" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  ID Type
                </label>
                <select
                  id="identificationType"
                  name="identificationType"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700"
                  value={formData.identificationType}
                  onChange={handleChange}
                >
                  <option value="NID">NID</option>
                  <option value="Birth Registration">Birth Registration</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="identificationNumber" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                {formData.identificationType === 'NID' ? 'National ID Number' : 'Birth Certificate Number'}
                </label>
                <input
                  type="text"
                  id="identificationNumber"
                  name="identificationNumber"
                  className={`w-full px-4 py-2.5 border ${errors.identificationNumber ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  value={formData.identificationNumber}
                  onChange={handleChange}
                  placeholder="Enter your ID number"
                />
                {errors.identificationNumber && <span className="text-red-500 text-sm mt-1 block">{errors.identificationNumber}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="fatherName" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Father's Name
                </label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  className={`w-full px-4 py-2.5 border ${errors.fatherName ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Enter your father's name"
                />
                {errors.fatherName && <span className="text-red-500 text-sm mt-1 block">{errors.fatherName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="fatherPhoneNumber" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Father's Phone Number (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-600 pointer-events-none dark:text-white">
                    +880
                  </span>
                  <input
                    type="text"
                    id="fatherPhoneNumber"
                    name="fatherPhoneNumber"
                    className="w-full px-4 py-2.5 pl-16 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={formData.fatherPhoneNumber}
                    onChange={(e) => {
                      // Only allow numeric input
                      const value = e.target.value.replace(/\D/g, '');
                      // Update form with cleaned value
                      const event = {
                        target: {
                          name: 'fatherPhoneNumber',
                          value: value
                        }
                      };
                      handleChange(event);
                    }}
                    placeholder="Enter phone number"
                    pattern="[0-9]{11}"
                    minLength={11}
                    maxLength={11}
                    title="Please enter a valid 11-digit phone number"
                  />
                </div>
                  {formData.fatherPhoneNumber && formData.fatherPhoneNumber.length > 0 && 
                   formData.fatherPhoneNumber.length !== 11 && (
                    <span className="text-red-500 text-sm mt-1 block">
                      Phone number must be 11 digits
                    </span>
                  )}
              </div>
              
              <div className="form-group">
                <label htmlFor="motherName" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Mother's Name
                </label>
                <input
                  type="text"
                  id="motherName"
                  name="motherName"
                  className={`w-full px-4 py-2.5 border ${errors.motherName ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  value={formData.motherName}
                  onChange={handleChange}
                  placeholder="Enter your mother's name"
                />
                {errors.motherName && <span className="text-red-500 text-sm mt-1 block">{errors.motherName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="motherPhoneNumber" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Mother's Phone Number (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-600 pointer-events-none dark:text-white">
                    +880
                  </span>
                  <input
                    type="text"
                    id="motherPhoneNumber"
                    name="motherPhoneNumber"
                    className="w-full px-4 py-2.5 pl-16 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={formData.motherPhoneNumber}
                    onChange={(e) => {
                      // Only allow numeric input
                      const value = e.target.value.replace(/\D/g, '');
                      // Update form with cleaned value
                      const event = {
                        target: {
                          name: 'motherPhoneNumber',
                          value: value
                        }
                      };
                      handleChange(event);
                    }}
                    placeholder="Enter phone number"
                    pattern="[0-9]{11}"
                    minLength={11}
                    maxLength={11}
                    title="Please enter a valid 11-digit phone number"
                  />
                </div>
                  {formData.motherPhoneNumber && formData.motherPhoneNumber.length > 0 && 
                   formData.motherPhoneNumber.length !== 11 && (
                    <span className="text-red-500 text-sm mt-1 block">
                      Phone number must be 11 digits
                    </span>
                  )}
              </div>
              
              <div className="form-group md:col-span-2 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer dark:text-white">
                  <input 
                    type="checkbox" 
                    id="smoking"
                    name="smoking"
                    checked={formData.smoking}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary rounded focus:ring-primary border-neutral-300" 
                  />
                  <span className="text-neutral-700 dark:text-white">Do you smoke?</span>
                </label>
              </div>
            </div>
          </div>
        );
      
      case STEPS.CONTACT_INFO:
        return (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <FaPhone className="text-primary text-5xl" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Contact Information</h2>
              <p className="text-neutral-600 mt-1 max-w-md mx-auto dark:text-gray-400">
                Add your contact details so donors and recipients can reach you
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-600 pointer-events-none dark:text-white">
                    +880
                  </span>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className={`w-full pl-16 pr-4 py-2.5 border ${
                      errors.phone ? 'border-red-500' : 'border-neutral-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 dark:text-white`}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="alternatePhone" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Alternate Phone Number (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-600 pointer-events-none dark:text-white">
                    +880
                  </span>
                  <input
                    type="text"
                    id="alternatePhone"
                    name="alternatePhone"
                    className={`w-full pl-16 pr-4 py-2.5 border ${
                      errors.alternatePhone ? 'border-red-500' : 'border-neutral-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 dark:text-white`}
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    placeholder="Enter alternate phone number"
                  />
                </div>
                {errors.alternatePhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.alternatePhone}</p>
                )}
              </div>
              
              <div className="form-group my-9">
                <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white border-t-2 py-3 border-gray-200">
                  Location Information
                </label>
                <LocationSelector
                  onLocationChange={handleLocationChange}
                  initialDistrictId={selectedDistrictId}
                  initialUpazilaId={selectedUpazilaId}
                  required={true}
                  className="w-full"
                />
                {errors.upazila && (
                  <p className="text-red-500 text-xs mt-1">{errors.upazila}</p>
                )}
              </div>
              
              <div className="form-group mb-4">
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  WhatsApp Number (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-600 pointer-events-none dark:text-white">
                    +880
                  </span>
                  <input
                    type="text"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    className="w-full px-4 py-2.5 pl-16 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={formData.whatsappNumber}
                    onChange={(e) => {
                      // Only allow numeric input
                      const value = e.target.value.replace(/\D/g, '');
                      // Update form with cleaned value
                      const event = {
                        target: {
                          name: 'whatsappNumber',
                          value: value
                        }
                      };
                      handleChange(event);
                    }}
                    placeholder="Enter phone number"
                    pattern="[0-9]{11}"
                    minLength={11}
                    maxLength={11}
                    title="Please enter a valid 11-digit phone number"
                  />
                </div>
                  {formData.whatsappNumber && formData.whatsappNumber.length > 0 && 
                   formData.whatsappNumber.length !== 11 && (
                    <span className="text-red-500 text-sm mt-1 block">
                      Phone number must be 11 digits
                    </span>
                  )}
              </div>
              
              {/* Password fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-8 pt-6 border-t-2 border-gray-200">
                <div className="form-group">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`w-full px-4 py-2.5 border ${
                      errors.password ? 'border-red-500' : 'border-neutral-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 dark:text-white`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`w-full px-4 py-2.5 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-neutral-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 dark:text-white`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              
            </div>
          </div>
        );
        
      case STEPS.DONATION_INFO:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <BiSolidDonateBlood className="text-primary text-5xl" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Blood Donation Information</h2>
              <p className="text-neutral-600 mt-1 max-w-md mx-auto dark:text-gray-400">
                Tell us about your blood type and donation history
              </p>
            </div>
            
            <div className="max-w-sm mx-auto flex flex-col justify-between">
              <div className="form-group">
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-white">
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  className={`w-full mb-6 px-4 py-2.5 border ${errors.bloodGroup ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700`}
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="" disabled className="dark:text-gray-300">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodGroup && <span className="text-red-500 text-sm mt-1 block">{errors.bloodGroup}</span>}
              </div>
              
              <LastDonationDatePicker
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                maxDate={new Date()}
                required={true}
              />
            </div>
              
              <div className="max-w-lg mx-auto mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-neutral-600">
                    By providing accurate information about your last donation, you help ensure safe donation intervals and allow us to notify you when you're eligible to donate again.
                  </p>
                </div>
              </div>
            </div>
        );
        
      case STEPS.DOCUMENT_UPLOAD:
        return (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 mb-4">
                <FaFileImage className="text-5xl text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white sm:text-3xl">
                Identity Verification
              </h2>
              <p className="mx-auto mt-2 max-w-md text-neutral-500 dark:text-neutral-400">
                Upload your profile photo and government-issued ID for verification
              </p>
            </div>
        
            {/* Upload Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Profile Picture - Circular Modern */}
              <div className="group relative">
                <label className="mb-2 block text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Profile Photo
                  <span className="text-xs text-neutral-400 ml-1">(required)</span>
                </label>
                
                <div className={`relative flex flex-col mx-auto items-center justify-center mt-6 overflow-hidden h-60 w-60 rounded-full bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-400 ${
                  errors.profileImage 
                    ? 'border-2 border-red-400/50' 
                    : 'border border-neutral-200 dark:border-neutral-700'
                }`}>
                  {formData.profileImage ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <img
                        src={URL.createObjectURL(formData.profileImage)}
                        alt="Profile preview"
                        className="h-60 w-60 rounded-full object-cover object-center shadow-inner "
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, profileImage: null})}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 transform rounded-full bg-red-500 px-4 py-1.5 text-xs font-medium text-white opacity-100 md:opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:bg-red-600"
                      >
                        Change Photo
                      </button>
                    </>
                  ) : (
                    <label
                      htmlFor="profileImage"
                      className="flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-3"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-3">
                        <FiUpload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          <span className="text-primary underline-offset-2 hover:underline">
                            Click to upload <br/>
                          </span>
                        </p>
                      </div>
                      <input
                        id="profileImage"
                        name="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {errors.profileImage && (
                  <p className="mt-2 text-xs text-red-500">{errors.profileImage}</p>
                )}
              </div>
        
              {/* Document Upload - Rectangular Modern */}
              <div className="group relative">
                <label className="mb-2 block text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {formData.identificationType === 'NID' ? 'National ID' : 'Birth Certificate'}
                  <span className="text-xs text-neutral-400 ml-1">(required)</span>
                </label>
                
                <div className={`relative flex h-60 w-full flex-col items-center justify-center overflow-hidden mt-6 rounded-3xl bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-400 ${
                  errors.nidOrBirthRegistrationImage 
                    ? 'border-2 border-red-400/50' 
                    : 'border border-neutral-200 dark:border-neutral-700'
                }`}>
                  {formData.nidOrBirthRegistrationImage ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative h-full w-full">
                        <img
                          src={URL.createObjectURL(formData.nidOrBirthRegistrationImage)}
                          alt="Document preview"
                          className="h-full w-full rounded-xl object-contain object-center shadow-inner"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-100 md:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, nidOrBirthRegistrationImage: null})}
                            className="rounded-full bg-red-500 px-4 py-1.5 text-xs font-medium text-white shadow-lg hover:bg-red-600"
                          >
                            Change Document
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <label
                      htmlFor="nidOrBirthRegistrationImage"
                      className="flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-3"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-3">
                        <FiFileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          <span className="text-primary underline-offset-2 hover:underline">
                            Click to upload
                          </span>
                        </p>
                      </div>
                      <input
                        id="nidOrBirthRegistrationImage"
                        name="nidOrBirthRegistrationImage"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {errors.nidOrBirthRegistrationImage && (
                  <p className="mt-2 text-xs text-red-500">{errors.nidOrBirthRegistrationImage}</p>
                )}
              </div>
            </div>
        
            {/* Info Card - Modern */}
            <div className="mt-6 overflow-hidden rounded-2xl bg-gray-50 p-5">
              <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm text-neutral-600">
                    Secure Document Handling
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    All documents are encrypted and stored securely. We only use these for verification
                    purposes to maintain trust in our blood donation community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case STEPS.FINAL_REVIEW:
        return (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center  mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 text-primary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Review Your Details
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-lg text-gray-500 dark:text-gray-400">
                Please verify all information before completing your registration
              </p>
            </div>
            
            {/* Information Grid */}
            <div className="grid gap-6">
              {/* Personal Information Card */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 dark:from-green-900/20 dark:to-green-900/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300">
                        <FaUserCircle className="text-green-600 text-2xl" />
                      </div>
                      <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Personal Information
                      </h3>
                    </div>
                    <button 
                      onClick={() => navigateToStep(STEPS.PERSONAL_INFO)} // Replace with your step navigation function
                      className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                        />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
                <div className="px-3 py-4">
                  <div className="space-y-4">
                    {[
                      { label: "Full Name", value: formData.name },
                      { label: "Date of Birth", value: formData.dob },
                      { label: "Gender", value: formData.gender },
                      { label: "Religion", value: formData.religion },
                      { label: "Occupation", value: formData.occupation },
                      { label: "ID Type", value: formData.identificationType },
                      { label: "ID Number", value: formData.identificationNumber },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white text-right max-w-[60%]">
                          {item.value || <span className="text-gray-400">Not provided</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Contact Information Card */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 dark:from-blue-900/20 dark:to-blue-900/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                      <FaPhone className="text-blue-600" />
                      </div>
                      <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Contact Information
                      </h3>
                    </div>
                    <button 
                      onClick={() => navigateToStep(STEPS.CONTACT_INFO)} // Replace with your step navigation function
                      className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                        />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
                <div className="px-3 py-4">
                  <div className="space-y-4">
                    {[
                      { label: "Email", value: formData.email },
                      { label: "Phone", value: formData.phone },
                      { label: "District", value: formData.district },
                      { label: "Upazila", value: formData.upazila },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white text-right max-w-[75%] break-words">
                          {item.value || <span className="text-gray-400">Not provided</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Donation Information Card */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 dark:from-red-900/20 dark:to-red-900/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300">
                      <BiSolidDonateBlood className="text-red-600 text-2xl" />
                      </div>
                      <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Donation Information
                      </h3>
                    </div>
                    <button 
                      onClick={() => navigateToStep(STEPS.DONATION_INFO)} // Replace with your step navigation function
                      className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                        />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
                <div className="px-3 py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Group</span>
                      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-200">
                        {formData.bloodGroup}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Donation</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formData.isFirstTimeDonor ? (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                            First-time donor
                          </span>
                        ) : (
                          formData.lastDonate
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Available</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formData.nextDonationDate || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Documents Card */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 dark:from-purple-900/20 dark:to-purple-900/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                      <FaFileImage className="text-2xl text-purple-600" />
                      </div>
                      <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Uploaded Documents
                      </h3>
                    </div>
                    <button 
                      onClick={() => navigateToStep(STEPS.DOCUMENT_UPLOAD)} // Replace with your step navigation function
                      className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 cursor-pointer"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                        />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
                <div className="px-3 py-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {formData.profileImage && (
                      <div className="group relative">
                        <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={URL.createObjectURL(formData.profileImage)}
                            alt="Profile"
                            className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
                          />
                        </div>
                        <p className="mt-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                          Profile Photo
                        </p>
                      </div>
                    )}
                    
                    {formData.nidOrBirthRegistrationImage && (
                      <div className="group relative">
                        <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={URL.createObjectURL(formData.nidOrBirthRegistrationImage)}
                            alt="ID Document"
                            className="h-full w-full object-contain transition-opacity group-hover:opacity-75"
                          />
                        </div>
                        <p className="mt-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                          {formData.identificationType} Document
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Confirmation Banner */}
            <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 dark:border-yellow-800/50 dark:from-yellow-900/20 dark:to-yellow-900/10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-yellow-500 dark:text-yellow-300" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Important Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>
                      By completing registration, you confirm that all provided information is accurate. 
                      You agree to our <a href="#" className="font-medium underline hover:text-yellow-600 dark:hover:text-yellow-200">Terms & Conditions</a> and <a href="#" className="font-medium underline hover:text-yellow-600 dark:hover:text-yellow-200">Privacy Policy</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Step content not defined</div>;
    }
  };
  
  return (
    <div className="min-h-screen py-12 px-4 bg-neutral-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Create an Account</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">Join our community and be ready to donate blood and save lives</p>
          
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-3xl px-4">
              <ul className="steps steps-horizontal w-full">
                {Object.values(STEPS).map((stepValue) => (
                  <li 
                    key={stepValue}
                    className={`step ${
                      step >= stepValue 
                        ? 'step-primary before:!bg-primary after:!bg-primary text-primary' 
                        : 'before:!bg-neutral-300 after:!bg-neutral-300 text-neutral-400'
                    }`}
                    data-content={stepValue + 1}
                  ></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      
        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 dark:bg-gray-700 dark:text-white">
          <form>
            {renderStep()}
          
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className={`px-4 py-2 rounded-lg border border-neutral-300 font-medium text-neutral-700 hover:bg-neutral-50 transition-all dark:text-white dark:hover:bg-neutral-600 cursor-pointer ${
                  step === STEPS.EMAIL_VERIFICATION ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={step === STEPS.EMAIL_VERIFICATION}
              >
                Back
              </button>
            
              <button
                type="button"
                onClick={handleNext}
                className="button"
                disabled={
                  isLoading || 
                  isGeneratingOTP || 
                  isVerifyingOTP || 
                  isRegistering
                }
              >
                {isLoading || isGeneratingOTP || isVerifyingOTP || isRegistering
                  ? 'Processing...'
                  : step === STEPS.FINAL_REVIEW
                    ? 'Complete Registration'
                    : step === STEPS.EMAIL_VERIFICATION
                      ? 'Send OTP'
                      : step === STEPS.OTP_VERIFICATION
                        ? 'Verify OTP'
                        : 'Next'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toast />
    </div>
  );
}