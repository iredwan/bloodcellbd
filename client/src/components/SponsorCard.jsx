import Image from 'next/image';
import Link from 'next/link';
import {
  FaCrown,
  FaCoins,
  FaEnvelope,
  FaGem,
  FaGlobe,
  FaMedal,
  FaPhone,
  FaQuestionCircle,
  FaUser,
} from 'react-icons/fa';

export default function SponsorCard({ sponsor }) {
  const getBadgeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'platinum':
        return <FaGem className="text-white text-xl" />;
      case 'gold':
        return <FaCrown className="text-white text-xl" />;
      case 'silver':
        return <FaCoins className="text-white text-xl" />;
      case 'bronze':
        return <FaMedal className="text-white text-xl" />;
      default:
        return <FaQuestionCircle className="text-white text-xl" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'platinum':
        return 'bg-purple-500 dark:bg-purple-600';
      case 'gold':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'silver':
        return 'bg-gray-400 dark:bg-gray-500';
      case 'bronze':
        return 'bg-orange-700 dark:bg-orange-800';
      default:
        return 'bg-gray-600 dark:bg-gray-700';
    }
  };

  return (
    <div className="bbg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group text-center">
      <div className="p-6 space-y-6">
        {/* Logo and Badge */}
        <div className="flex flex-col items-center space-y-4">
          {sponsor.logo && (
            <div className="relative w-40 h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                fill
                className="object-cover bg-white dark:bg-gray-100 p-2"
              />
            </div>
          )}

          {sponsor.sponsorType && (
            <div className={`p-3 rounded-full shadow-md ${getBadgeColor(sponsor.sponsorType)}`}>
              {getBadgeIcon(sponsor.sponsorType)}
            </div>
          )}
        </div>

        {/* Sponsor Info */}
        <div className="space-y-3 text-center">
          <Link href={`/sponsors/details?id=${sponsor._id}`} className="text-xl font-semibold dark:text-white line-clamp-1">
            {sponsor.name}
          </Link>

          {sponsor.website && (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-primary hover:underline dark:text-primary-400"
            >
              <FaGlobe className="mr-2" />
              Visit Website
            </a>
          )}

          {sponsor.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {sponsor.description.slice(0, 100)}...
            </p>
          )}
        </div>

        {/* Contact Person */}
        {sponsor.contactPerson && (
          <div className="text-center space-y-2">
            <h4 className="text-lg font-semibold dark:text-gray-200">Contact Person</h4>
            <div className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
              {sponsor.contactPerson.name && (
                <p className="flex items-center justify-center">
                  <FaUser className="mr-2" />
                  {sponsor.contactPerson.name}
                </p>
              )}
              {sponsor.contactPerson.designation && (
                <p className="flex items-center justify-center text-sm line-clamp-1">
                  {sponsor.contactPerson.designation}
                </p>
              )}
              {sponsor.contactPerson.email && (
                <a href={`mailto:${sponsor.contactPerson.email}`} className="flex items-center justify-center break-words">
                  <FaEnvelope className="mr-2" />
                  {sponsor.contactPerson.email}
                </a>
              )}
              {sponsor.contactPerson.phone && (
                <a href={`tel:${sponsor.contactPerson.phone}`} className="flex items-center justify-center hover:text-primary dark:hover:text-primary-300 transition-colors">
                  <FaPhone className="mr-2" />
                  {sponsor.contactPerson.phone}
                </a>
              )}
            </div>
          </div>
        )}
        {/* Cover Image */}
        {sponsor.coverImage && (
            <div className="relative h-48 w-full mt-4">
            <Image
                src={sponsor.coverImage}
                alt={`${sponsor.name} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
            </div>
        )}
        </div>
      </div>

  );
}
