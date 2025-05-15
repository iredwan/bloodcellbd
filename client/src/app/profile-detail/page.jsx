'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { useGetUserByIdQuery } from '@/features/users/userApiSlice';
import NotFound from '@/app/not-found';
import { FaShareAlt, FaWhatsapp, FaFacebook, FaTwitter, FaLink, FaPhone, FaTint, FaUser, FaVenusMars, FaChurch, FaSmoking, FaCalendar, FaMosque, FaSmokingBan } from 'react-icons/fa';
import { FiCopy } from 'react-icons/fi';
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";

const ProfileDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [profileLink, setProfileLink] = useState('');

  useEffect(() => {
    if (!id) {
      router.push('/');
    } else {
      setProfileLink(`${window.location.origin}/profile-detail?id=${id}`);
    }
  }, [id, router]);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetUserByIdQuery(id, {
    skip: !id,
  });

  const user = response?.data;

  if (isLoading) return <div className="min-h-screen dark:bg-gray-900">
  <div className="container mx-auto flex flex-col items-center justify-center">
    <div className="relative max-w-2xl w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-lg p-8 my-12">
      
      {/* Skeleton Share Button */}
      <div className="absolute bottom-3 right-3">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>

      {/* Skeleton Content */}
      <div className="flex flex-col md:flex-row items-center gap-6 animate-pulse">
        
        {/* Skeleton Image */}
        <div className="w-40 h-40 rounded-full bg-gray-300 dark:bg-gray-700" />

        {/* Skeleton Text and Badges */}
        <div className="flex-1 space-y-4 w-full">
          
          {/* Name and District */}
          <div className="space-y-2 text-center md:text-left">
            <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mx-auto md:mx-0" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded mx-auto md:mx-0" />
          </div>

          {/* Blood Group & Availability */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="h-8 w-28 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="space-y-1 flex-1">
                  <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
                  <div className="h-4 w-2/3 bg-gray-400 dark:bg-gray-500 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Contact Links */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
;
  if (isError) return <div className="text-red-500 p-10">Error loading profile</div>;
  if (!user) return <NotFound />;

  const handleShare = (platform) => {
    const shareText = `Check out ${user.name}'s blood donor profile: ${profileLink}`;
    switch (platform) {
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileLink)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(profileLink);
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* ✅ Static Meta Tags */}
      <Head>
        <title>{user.name} - Blood Donor Profile</title>
        <meta name="description" content={`Blood donor profile of ${user.name}, Blood Group: ${user.bloodGroup}`} />
        <meta property="og:title" content={`${user.name} - Blood Donor`} />
        <meta property="og:description" content={`Donor from ${user.district}, ${user.upazila}. Blood Group: ${user.bloodGroup}`} />
        <meta property="og:image" content="https://ik.imagekit.io/jpmhhdczn/og-default.jpg" />
        <meta property="og:url" content={profileLink} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${user.name} - Blood Donor`} />
        <meta name="twitter:description" content={`Donor from ${user.district}, ${user.upazila}. Blood Group: ${user.bloodGroup}`} />
        <meta name="twitter:image" content="https://ik.imagekit.io/jpmhhdczn/og-default.jpg" />
      </Head>

      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="relative max-w-2xl w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-lg p-8 my-12">
          {/* Share Button */}
          <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2">
            {showShareMenu && (
              <div className="flex gap-3 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg">
                <button onClick={() => handleShare('whatsapp')} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 rounded-full"><FaWhatsapp className="text-xl" /></button>
                <button onClick={() => handleShare('facebook')} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full"><FaFacebook className="text-xl" /></button>
                <button onClick={() => handleShare('twitter')} className="p-2 text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full"><FaTwitter className="text-xl" /></button>
                <button onClick={() => handleShare('copy')} className="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-full"><FiCopy className="text-xl" /></button>
              </div>
            )}
            <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-3 bg-white dark:bg-gray-700 shadow-lg rounded-full text-primary hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
              <FaShareAlt className="text-2xl" />
            </button>
          </div>

          {/* Profile Content */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-40 h-40 aspect-square rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                  <FaUser className="text-3xl text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              {/* Name & Verification */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 flex items-center justify-center md:justify-start gap-2">
              {user.name}
              {user.isVerified && (
                <span className="text-primary ml-1 inline-block">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.district}, {user.upazila}
            </p>
          </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="bg-gray-300 text-primary dark:bg-gray-300 px-4 py-1 rounded-full flex items-center gap-1">
                  <span className="font-bold">{user.bloodGroup}</span>
                  <FaTint className="text-lg" />
                </div>
                <div className={`px-4 py-1 rounded-full ${user.nextDonationDate ? 'bg-gray-300 text-primary' : 'bg-primary-light text-primary'}`}>
                  {user.nextDonationDate ? 'Available from: ' + user.nextDonationDate : 'Ready to donate'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <DetailItem icon={user.gender === 'Male' ? <BsGenderMale /> : <BsGenderFemale />} label="Gender" value={user.gender} />
                <DetailItem icon={user.religion?.toLowerCase() === 'islam' ? <FaMosque /> : <FaChurch />} label="Religion" value={user.religion} />
                <DetailItem icon={user.smoking ? <FaSmoking /> : <FaSmokingBan />} label="Smoker" value={user.smoking ? 'Yes' : 'No'} />
                <DetailItem icon={<FaCalendar />} label="Last Donation" value={user.lastDonate || 'Never'} />
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <ContactLink type="tel" value={user.phone} />
                {user.alternatePhone && <ContactLink type="tel" value={user.alternatePhone} />}
                {user.whatsappNumber && <ContactLink type="whatsapp" value={user.whatsappNumber} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
    <span className="text-lg text-primary bg-gray-300 p-2 rounded-full">{icon}</span>
    <div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="font-medium text-gray-700 dark:text-gray-300">{value}</div>
    </div>
  </div>
);

const ContactLink = ({ type, value }) => (
  <a
    href={`${type === 'whatsapp' ? 'https://wa.me/' : 'tel:'}${value}`}
    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-shadow"
    target="_blank"
    rel="noopener noreferrer"
  >
    {type === 'whatsapp' ? (
      <FaWhatsapp className="text-green-500 text-xl" />
    ) : (
      <FaPhone className="text-blue-500 text-xl" />
    )}
    <span className="text-gray-700 dark:text-gray-300">{value}</span>
  </a>
);

export default ProfileDetail;
