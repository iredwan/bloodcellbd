"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  useGetUserByIdQuery,
  useUpdateUserProfileWithRefMutation,
  useDeleteUserMutation,
} from "@/features/users/userApiSlice";
import CustomDatePicker from "@/components/DatePicker";
import LocationSelector from "@/components/LocationSelector";
import CustomSelect from "@/components/CustomSelect";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaTint,
  FaShieldAlt,
  FaImage,
  FaUserFriends,
  FaEdit,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { BiSave, BiTrash } from "react-icons/bi";
import uploadFile from "@/utils/fileUpload";
import LastDonationDatePicker from "@/components/LastDonationDatePicker";
import { useGetUserInfoQuery } from "@/features/userInfo/userInfoApiSlice";
import { FiUpload } from "react-icons/fi";
import ProfileCard from "@/components/ProfileCard";
import deleteConfirm from "@/utils/deleteConfirm";
import RUDProfilePageSkeleton from "@/components/dashboard-components/dashboardSkeletons/RUDProfilepageSkeleton";


const Page = () => {
  // 1. All hooks at the top
  const router = useRouter();
  
  // State hooks
  const [errors, setErrors] = useState({});
  const [isPersonalInformationEditMode, setPersonalInformationEditMode] = useState(false);
  const [isContactInformationEditMode, setContactInformationEditMode] = useState(false);
  const [isDonationInformationEditMode, setDonationInformationEditMode] = useState(false);
  const [isRoleAndAccessControlEditMode, setRoleAndAccessControlEditMode] = useState(false);
  const [isProfileMediaEditMode, setProfileMediaEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState("personalInformation");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedUpazilaId, setSelectedUpazilaId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    identificationType: "NID",
    identificationNumber: "",
    gender: "",
    religion: "",
    occupation: "",
    fatherName: "",
    fatherPhoneNumber: "",
    motherName: "",
    motherPhoneNumber: "",
    smoking: false,
    email: "",
    phone: "",
    alternatePhone: "",
    whatsappNumber: "",
    district: "",
    upazila: "",
    bloodGroup: "",
    lastDonate: "",
    nextDonationDate: "",
    role: "",
    roleSuffix: "",
    isApproved: false,
    isBanned: false,
    isVerified: false,
    profileImage: null,
    nidOrBirthRegistrationImage: null,
    reference: "",
    updatedBy: "",
  });

  // Refs
  const locationChangeInProgress = useRef(false);

  // Query hooks
  const { data: userInfoData, isLoading: isLoadingUserInfo } = useGetUserInfoQuery();
  const userId = userInfoData?.user?.id;
  const editorRole = userInfoData?.user?.role;
  
  const { 
    data: userData, 
    isLoading: isLoadingUser,
    refetch 
  } = useGetUserByIdQuery(userId, {
    skip: !userId
  });

  // Mutation hooks
  const [updateUserProfileWithRef, { isLoading: isUpdating }] = useUpdateUserProfileWithRefMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Effects
  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setFormData({
        name: user.name || "",
        dob: user.dob || "",
        identificationType: user.identificationType || "NID",
        identificationNumber: user.identificationNumber || "",
        gender: user.gender || "",
        religion: user.religion || "",
        occupation: user.occupation || "",
        fatherName: user.fatherName || "",
        fatherPhoneNumber: user.fatherPhoneNumber || "",
        motherName: user.motherName || "",
        motherPhoneNumber: user.motherPhoneNumber || "",
        smoking: user.smoking || false,
        email: user.email || "",
        phone: user.phone || "",
        alternatePhone: user.alternatePhone || "",
        whatsappNumber: user.whatsappNumber || "",
        district: user.district || "",
        upazila: user.upazila || "",
        bloodGroup: user.bloodGroup || "",
        lastDonate: user.lastDonate || "",
        nextDonationDate: user.nextDonationDate || "",
        role: user.role || "",
        roleSuffix: user.roleSuffix || "",
        isApproved: user.isApproved || false,
        isBanned: user.isBanned || false,
        isVerified: user.isVerified || false,
        profileImage: user.profileImage || null,
        nidOrBirthRegistrationImage: user.nidOrBirthRegistrationImage || null,
      });
    }
  }, [userData]);

  // Loading state
  if (isLoadingUserInfo || isLoadingUser) {
    return <RUDProfilePageSkeleton />;
  }

  // Constants
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const displayUserData = userData?.data || {};
  const reference = userData?.data?.reference;
  const updateBy = userData?.data?.updatedBy;

  // Rest of your component code...

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  // Handle location selection
  const handleLocationChange = (locationData) => {
    // Skip if an update is already in progress to prevent circular updates
    if (locationChangeInProgress.current) return;
    
    // Set flag to indicate update in progress
    locationChangeInProgress.current = true;
    
    // Update district and upazila IDs only if they've changed
    if (selectedDistrictId !== locationData.districtId) {
      setSelectedDistrictId(locationData.districtId);
    }

    if (selectedUpazilaId !== locationData.upazilaId) {
      setSelectedUpazilaId(locationData.upazilaId);
    }

    // Update form data with location names
    setFormData((prev) => ({
      ...prev,
      district: locationData.districtName || prev.district,
      upazila: locationData.upazilaName || prev.upazila,
    }));
    
    // Reset the flag after a short delay to allow state updates to complete
    setTimeout(() => {
      locationChangeInProgress.current = false;
    }, 0);
  };

  // Handle form submission for updates
  const handleUpdate = async (e) => {
    if (e) e.preventDefault();

    // Reset all edit modes
    setPersonalInformationEditMode(false);
    setContactInformationEditMode(false);
    setDonationInformationEditMode(false);
    setRoleAndAccessControlEditMode(false);
    setProfileMediaEditMode(false);

    try {
      // Handle profile image upload if it's a new file
      let profileImageData = null;
      if (formData.profileImage instanceof File) {
        profileImageData = await uploadFile([formData.profileImage], {
          maxFiles: 1,
          onError: (error) => {
            toast.error(`Failed to upload profile image: ${error}`);
            throw new Error(error);
          }
        });
      }

      // Handle NID/Birth Registration image upload if it's a new file
      let nidImageData = null;
      if (formData.nidOrBirthRegistrationImage instanceof File) {
        nidImageData = await uploadFile([formData.nidOrBirthRegistrationImage], {
          maxFiles: 1,
          onError: (error) => {
            toast.error(`Failed to upload ID document: ${error}`);
            throw new Error(error);
          }
        });
      }

      const updatedData = {
        ...formData,
        profileImage: profileImageData?.[0]?.filename || formData.profileImage,
        nidOrBirthRegistrationImage: nidImageData?.[0]?.filename || formData.nidOrBirthRegistrationImage
      };

      const response = await updateUserProfileWithRef({
        id: userId,
        userData: updatedData,
      }).unwrap();

      if (response.status) {
        toast.success(response.message || "Profile updated successfully");
        // Refetch user data after successful update
        await refetch();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error details:", error);
      toast.error(error?.data?.message || "Error updating profile");
    }
  };

  // Handle Cancel edit mode
  const handleCancelEdit = () => {
    // Reset all edit modes
    setPersonalInformationEditMode(false);
    setContactInformationEditMode(false);
    setDonationInformationEditMode(false);
    setRoleAndAccessControlEditMode(false);
    setProfileMediaEditMode(false);

    // Reset form data to original user data
    if (userData?.data) {
      setFormData({
        // Personal Information
        name: userData.data.name || "",
        dob: userData.data.dob || "",
        identificationType: userData.data.identificationType || "NID",
        identificationNumber: userData.data.identificationNumber || "",
        gender: userData.data.gender || "",
        religion: userData.data.religion || "",
        occupation: userData.data.occupation || "",
        fatherName: userData.data.fatherName || "",
        fatherPhoneNumber: userData.data.fatherPhoneNumber || "",
        motherName: userData.data.motherName || "",
        motherPhoneNumber: userData.data.motherPhoneNumber || "",
        smoking: userData.data.smoking || false,

        // Contact Information
        email: userData.data.email || "",
        phone: userData.data.phone || "",
        alternatePhone: userData.data.alternatePhone || "",
        whatsappNumber: userData.data.whatsappNumber || "",
        district: userData.data.district || "",
        upazila: userData.data.upazila || "",

        // Donation Information
        bloodGroup: userData.data.bloodGroup || "",
        lastDonate: userData.data.lastDonate || "",
        nextDonationDate: userData.data.nextDonationDate || "",

        // Role and Access
        role: userData.data.role || "",
        roleSuffix: userData.data.roleSuffix || "",
        isApproved: userData.data.isApproved || false,
        isBanned: userData.data.isBanned || false,
        isVerified: userData.data.isVerified || false,

        // Media
        profileImage: userData.data.profileImage || null,
        nidOrBirthRegistrationImage:
          userData.data.nidOrBirthRegistrationImage || null,

        // Reference
        reference:
          typeof userData.data.reference === "object"
            ? userData.data.reference._id
            : userData.data.reference || "",
        updatedBy:
          typeof userData.data.updatedBy === "object"
            ? userData.data.updatedBy._id
            : userData.data.updatedBy || "",
      });
    }
  };

  // Handle user deletion
  const handleDelete = async () => {
    const isConfirmed = await deleteConfirm({
      title: "Are you sure?",
      text: `Are you sure you want to delete ${userData?.data?.name}? This action cannot be undone.`,
      confirmButtonText: "Yes, delete!"
    });
    
    if (isConfirmed) {
      try {
        const response = await deleteUser(userId).unwrap();
        if (response.status) {
          toast.success(response.message || "User deleted successfully");
          router.push(`/dashboard/${roleApi}/users`);
        } else {
          toast.error(response.message || "Failed to delete user");
        }
      } catch (error) {
        toast.error(error?.data?.message || "Error deleting user");
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <div className="container mx-auto">
      <div className="rounded-lg overflow-hidden">
        {/*Profile and Name Card*/}
        <div className="grid grid-col gap-6 justify-center p-4">
          <img
            src={imageUrl + userData?.data.profileImage}
            alt="Profile preview"
            className="h-40 w-40 rounded-full aspect-square object-cover object-center shadow-inner"
          />
          <div className="flex items-center justify-center">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                  {userData?.data.name}
                  {userData?.data.isVerified && (
                    <span className="text-primary ml-1 inline-block">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  )}
                </h3>
              </div>
        </div>
        {/* Form sections */}
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            

            {/* Personal Information Section with edit mode button */}
           <div className='bg-white dark:bg-gray-800 rounded-lg'>
           {isPersonalInformationEditMode ? (
              <div className="">
                <div className="flex justify-between p-5 rounded-t-lg bg-gray-200 dark:bg-gray-700">
                <h1 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                   <FaUser className="mr-3 text-primary"/> Personal Information
                  </h1>
                  <div className="grid gap-2 md:grid-cols-2">
                  <button
                    onClick={handleUpdate}
                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors flex items-center disabled:opacity-70"
                  >
                    <FaCheck className="mr-1" />
                    Save
                  </button>

                  <button
                    onClick={handleCancelEdit}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors flex items-center"
                  >
                    <FaTimes className="mr-1" />
                    Cancel
                  </button>
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 shadow-lg bg-white dark:bg-gray-800 rounded-b-lg">
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <CustomDatePicker
                    label="Date of Birth"
                    name="dob"
                    formData={formData}
                    setFormData={setFormData}
                  />

                  <div className="form-group">
                    <CustomSelect
                      options={["NID", "Birth Certificate"]}
                      selected={formData.identificationType}
                      setSelected={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          identificationType: value,
                        }))
                      }
                      label="Identification Type"
                      placeholder="Select Identification Type"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formData.identificationType === "NID" ? "NID Number" : "Birth Certificate Number"}
                    </label>
                    <input
                      type="text"
                      name="identificationNumber"
                      value={formData.identificationNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="form-group">
                    <CustomSelect
                      options={["Male", "Female", "Other"]}
                      selected={formData.gender}
                      setSelected={(value) =>
                        setFormData((prev) => ({ ...prev, gender: value }))
                      }
                      label="Gender"
                      placeholder="Select Gender"
                    />
                  </div>

                  <div className="form-group">
                    <CustomSelect
                      options={[
                        "Islam",
                        "Hinduism",
                        "Christianity",
                        "Buddhism",
                        "Jainism",
                        "Other",
                      ]}
                      selected={formData.religion}
                      setSelected={(value) =>
                        setFormData((prev) => ({ ...prev, religion: value }))
                      }
                      label="Religion"
                      placeholder="Select Religion"
                    />
                  </div>

                  <div className="form-group">
                    <CustomSelect
                      options={[
                        "Accountant",
                        "Adviser",
                        "Architect",
                        "Artist",
                        "Autonomous",
                        "Bachelor",
                        "Banker",
                        "Barber",
                        "Barrister At Law",
                        "Blacksmith",
                        "Boatman",
                        "Business",
                        "Chartered Secretary",
                        "Chief Adviser",
                        "Chief Justice",
                        "Cleaner",
                        "Contractor",
                        "Cook",
                        "Dependent On Diplomat",
                        "Doctor",
                        "Driver",
                        "Engineer",
                        "Farmer",
                        "Fisherman",
                        "Government Service",
                        "Guard",
                        "House Wife",
                        "Student",
                        "Journalist",
                        "Judge",
                        "Justice",
                        "Labor",
                        "Lawyer",
                        "Mechanic",
                        "Medical Technologist",
                        "Tailor",
                        "Teacher",
                        "Member Of Parliament",
                        "Merchant Marine Officer",
                        "Minister",
                        "Movie Director",
                        "Nurse",
                        "Others",
                        "Painter",
                        "Pharmacist",
                        "Pilot",
                        "Politician",
                        "Porter",
                        "Potter",
                        "President",
                        "Prime Minister",
                        "Private Service",
                        "Project Employee",
                        "Unemployed",
                        "Washerman",
                      ]}
                      selected={formData.occupation}
                      setSelected={(value) =>
                        setFormData((prev) => ({ ...prev, occupation: value }))
                      }
                      label="Occupation"
                      placeholder="Select Occupation"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Father's Phone
                    </label>
                    <input
                      type="tel"
                      name="fatherPhoneNumber"
                      value={formData.fatherPhoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mother's Phone
                    </label>
                    <input
                      type="tel"
                      name="motherPhoneNumber"
                      value={formData.motherPhoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="form-group">
                    <CustomSelect
                      options={["Yes", "No"]}
                      selected={formData.smoking ? "Yes" : "No"}
                      setSelected={(value) => {
                        const event = {
                          target: {
                            name: "smoking",
                            value: value === "Yes",
                          },
                        };
                        handleChange(event);
                      }}
                      label="Smoking"
                      placeholder="Select smoking status"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="">
                <div className="flex justify-between p-5 rounded-t-lg bg-gray-200 dark:bg-gray-700">
                  <h1 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                   <FaUser className="mr-3 text-primary"/> Personal Information
                  </h1>
                  <button
                    onClick={() => setPersonalInformationEditMode(true)}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 shadow-lg bg-white dark:bg-gray-800 rounded-b-lg">
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.name}
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date of Birth
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.dob}
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Identification Type
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.identificationType}
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                     {displayUserData.identificationType === "NID" ? "NID Number" : "Birth Certificate Number"}
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.identificationNumber}
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Gender
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.gender}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Religion
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.religion}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Occupation
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.occupation}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Father's Name
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.fatherName}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Father's Phone
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.fatherPhoneNumber}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mother's Name
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.motherName}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mother's Phone
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.motherPhoneNumber}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Smoking
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.smoking ? "Yes" : "No"}
                    </p>
                  </div>

                </div>
              </div>
            )}
           </div> 

            {/* Contact Information Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg mt-6">
            {isContactInformationEditMode ? (
              <div className="">
                <div className="flex justify-between p-5 rounded-t-lg bg-gray-200 dark:bg-gray-700">
                <h1 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                   <FaPhone className="mr-3 text-primary"/> Contact Information
                  </h1>
                  <div className="grid gap-2 md:grid-cols-2">
                    <button
                      onClick={handleUpdate}
                      className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors flex items-center disabled:opacity-70"
                    >
                      <FaCheck className="mr-1" />
                      Save
                    </button>

                    <button
                      onClick={handleCancelEdit}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors flex items-center"
                    >
                      <FaTimes className="mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 shadow-lg bg-white dark:bg-gray-800 rounded-b-lg">
                  <div className="form-group w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="form-group w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="form-group w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Alternate Phone
                    </label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="form-group w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex justify-center">
                      <LocationSelector
                        onLocationChange={handleLocationChange}
                        initialDistrictId={selectedDistrictId}
                        initialUpazilaId={selectedUpazilaId}
                        initialDistrictName={displayUserData.district}
                        initialUpazilaName={displayUserData.upazila}
                      />
                    </div>
                  </div>
                </div>
             </div>
            ):(
              <div>
                <div className="flex justify-between p-5 rounded-t-lg bg-gray-200 dark:bg-gray-700">
                  <h1 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                   <FaPhone className="mr-3 text-primary"/> Contact Information
                  </h1>
                  <button
                    onClick={() => setContactInformationEditMode(true)}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 shadow-lg bg-white dark:bg-gray-800 rounded-b-lg">

                <div className="form-group">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg  dark:bg-gray-700 dark:text-white bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.phone}
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alternate Phone
                    </label>
                    <p className={`w-full px-4 ${displayUserData.alternatePhone? 'py-2.5': 'py-5.5'} rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white`}>
                      {displayUserData.alternatePhone}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    WhatsApp Number
                    </label>
                    <p className={`w-full px-4 ${displayUserData.whatsappNumber? 'py-2.5': 'py-5.5'} rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white`}>
                      {displayUserData.whatsappNumber}
                    </p>
                  </div>

                <div className="form-group">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    District
                  </label>
                  <input
                    name="district"
                    value={displayUserData.district}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg  dark:bg-gray-700 dark:text-white bg-gray-100"
                  />
                </div>

                <div className="form-group">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upazila/Thana
                  </label>
                  <input
                    type="text"
                    name="upazila"
                    value={displayUserData.upazila}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg  dark:bg-gray-700 dark:text-white bg-gray-100"
                  />
                </div>
              </div>
              </div>
            )}
            </div>

            {/* Donation Information Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg mt-6">
            {isDonationInformationEditMode ? (
              <div>
                <div className="flex justify-between p-5 rounded-t-lg bg-gray-200 dark:bg-gray-700">
                <h1 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                   <FaTint className="mr-3 text-primary"/> Donation Information
                  </h1>
                  <div className="grid gap-2 md:grid-cols-2">
                    <button
                      onClick={handleUpdate}
                      className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors flex items-center disabled:opacity-70"
                    >
                      <FaCheck className="mr-1" />
                      Save
                    </button>

                    <button
                      onClick={handleCancelEdit}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors flex items-center"
                    >
                      <FaTimes className="mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
                <div>
                <div className="grid gap-6 p-5 shadow-lg bg-white dark:bg-gray-800 rounded-b-lg">
                <div className="form-group">
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

                <LastDonationDatePicker
                  formData={formData}
                  setFormData={setFormData}
                  maxDate={new Date()}
                />

                <CustomDatePicker
                  label="Next Donation Date"
                  name="nextDonationDate"
                  formData={formData}
                  setFormData={setFormData}
                  minDate={new Date()}
                />
              </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between p-5 rounded-t-lg bg-gray-200 dark:bg-gray-700">
                  <h1 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                   <FaTint className="mr-3 text-primary"/> Donation Information
                  </h1>
                  <button
                    onClick={() => setDonationInformationEditMode(true)}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                </div>
                <div>
                <div className="grid gap-6 p-5 shadow-lg bg-white dark:bg-gray-800 rounded-b-lg">

                <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Blood Group
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.bloodGroup}
                    </p>
                  </div>
                  
                <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Donation Date
                    </label>
                    <p className={`w-full px-4 ${displayUserData.lastDonate? 'py-2.5': 'py-5.5'} rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white`}>
                      {displayUserData.lastDonate}
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Next Donation Date
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.nextDonationDate}
                    </p>
                  </div>
                  
              </div>
                </div>
              </div>
            )}
            </div>

            {/* Role and Access Control Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg mt-6">
                <div className="flex justify-between p-5 rounded-t-lg bg-gray-200 dark:bg-gray-700">
                  <h1 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                   <FaShieldAlt className="mr-3 text-primary"/> Role & Access Control
                  </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 shadow-lg bg-white dark:bg-gray-800 rounded-b-lg">
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.role}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role Suffix
                    </label>
                    <p className={`w-full px-4 ${displayUserData.roleSuffix ? 'py-2.5' : 'py-5.5'} rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white`}>
                      {displayUserData.roleSuffix}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Approved
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.isApproved ? "Yes" : "No"}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Verified
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.isVerified ? "Yes" : "No"}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Banned
                    </label>
                    <p className="w-full px-4 py-2.5 rounded-lg transition-all bg-gray-100 dark:bg-gray-700 dark:text-white">
                      {displayUserData.isBanned ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

            {/* Media Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg mt-6">
            {isProfileMediaEditMode ? (
              <div>
                <div className="flex justify-between p-5 rounded-t-lg bg-gray-200 dark:bg-gray-700">
                <h1 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                   <FaImage className="mr-3 text-primary"/> Media
                  </h1>
                  <div className="grid gap-2 md:grid-cols-2">
                    <button
                      onClick={handleUpdate}
                      className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors flex items-center disabled:opacity-70"
                    >
                      <FaCheck className="mr-1" />
                      Save
                    </button>

                    <button
                      onClick={handleCancelEdit}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors flex items-center"
                    >
                      <FaTimes className="mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-5 shadow-lg bg-white dark:bg-gray-800 rounded-b-lg">
                  {/* Profile Picture - Circular Modern */}
                  <div className="group relative">
                    <label className="mb-2 block text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Profile Photo
                    </label>

                    <div
                      className={`relative flex flex-col mx-auto items-center justify-center mt-6 overflow-hidden h-60 w-60 rounded-full bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-400 ${
                        errors.profileImage
                          ? "border-2 border-red-400/50"
                          : "border border-neutral-200 dark:border-neutral-700"
                      }`}
                    >
                      {formData.profileImage ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          {formData.profileImage && (
                            <img
                              src={
                                formData.profileImage instanceof File
                                  ? URL.createObjectURL(formData.profileImage)
                                  : imageUrl + formData.profileImage
                              }
                              alt="Profile preview"
                              className="h-60 w-60 rounded-full object-cover object-center shadow-inner"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, profileImage: null })
                            }
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
                                Click to upload <br />
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
                      <p className="mt-2 text-xs text-red-500">
                        {errors.profileImage}
                      </p>
                    )}
                  </div>

                  {/* Document Upload - Rectangular Modern */}
                  <div className="group relative">
                    <label className="mb-2 block text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {formData.identificationType === "NID"
                        ? "National ID"
                        : "Birth Certificate"}
                    </label>

                    <div
                      className={`relative flex h-60 w-full flex-col items-center justify-center mt-6 overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-400 ${
                        errors.nidOrBirthRegistrationImage
                          ? "border-2 border-red-400/50"
                          : "border border-neutral-200 dark:border-neutral-700"
                      }`}
                    >
                      {formData.nidOrBirthRegistrationImage ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <div className="relative h-full w-full">
                            {formData.nidOrBirthRegistrationImage && (
                              <img
                                src={
                                  formData.nidOrBirthRegistrationImage instanceof File
                                    ? URL.createObjectURL(
                                        formData.nidOrBirthRegistrationImage
                                      )
                                    : imageUrl +
                                      formData.nidOrBirthRegistrationImage
                                }
                                alt="NID or Birth Registration preview"
                                className="h-full w-full rounded-3xl object-cover object-center shadow-inner"
                              />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-100 md:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={(href) =>
                                  window.open(
                                    imageUrl +
                                      formData.nidOrBirthRegistrationImage,
                                    "_blank"
                                  )
                                }
                                className="rounded-full bg-purple-500 px-4 py-1.5 text-xs font-medium text-white shadow-lg hover:bg-purple-600"
                              >
                                View Document
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
                            <FiUpload className="h-6 w-6 text-primary" />
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
                      <p className="mt-2 text-xs text-red-500">
                        {errors.nidOrBirthRegistrationImage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between p-5 rounded-t-lg bg-gray-200 dark:bg-gray-700">
                  <h1 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                   <FaImage className="mr-3 text-primary"/> Media
                  </h1>
                  <button
                    onClick={() => setProfileMediaEditMode(true)}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-5 shadow-lg bg-white dark:bg-gray-800 rounded-b-lg">
                  {/* Profile Image Display */}
                  <div className="flex flex-col items-center">
                    <label className="mb-2 block text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Profile Photo
                    </label>
                    <div className="h-60 w-60 rounded-full overflow-hidden mt-2">
                      <img
                        src={imageUrl + displayUserData.profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>

                  {/* ID Document Display */}
                  <div className="flex flex-col items-center">
                    <label className="mb-2 block text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {displayUserData.identificationType === "NID"
                        ? "National ID"
                        : "Birth Certificate"}
                    </label>
                    <div className="h-60 w-full rounded-3xl overflow-hidden mt-2 relative">
                      {displayUserData.nidOrBirthRegistrationImage ? (
                        <>
                          <img
                            src={imageUrl + displayUserData.nidOrBirthRegistrationImage}
                            alt="ID Document"
                            className="h-full w-full object-cover object-center"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <button
                              type="button"
                              onClick={() => window.open(imageUrl + displayUserData.nidOrBirthRegistrationImage, "_blank")}
                              className="rounded-full bg-purple-500 px-4 py-1.5 text-xs font-medium text-white shadow-lg hover:bg-purple-600"
                            >
                              View Document
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                          <p className="text-gray-500 dark:text-gray-400">No document uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
            

            {(editorRole === "Admin" || editorRole === "District Coordinator") && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                >
                  <BiTrash className="mr-2" /> Delete User
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
