import Link from "next/link";
import React from "react";
import { FaPhone } from "react-icons/fa";

const TeamCard = ({
  id,
  detailPageLink,
  imageUrl,
  name,
  isVerified,
  role,
  roleSuffix,
  bloodGroup,
  phone,
  teamName,
  subTeamNumber,
}) => {
  const CardContent = (
    <div className="relative max-w-2xl w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-[18px] shadow-md p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      {teamName && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full shadow text-white text-sm font-semibold">
          {teamName}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Image */}
        <div className="w-28 h-28 aspect-square rounded-full overflow-hidden border border-gray-400 dark:border-gray-600">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="text-center md:text-left space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white line-clamp-2">
            {id ? (
              <Link href={`/profile-detail?id=${id}`}>
                {name}
              </Link>
            ) : (
              name
            )}
            {isVerified && (
              <span className="text-primary ml-1 inline-block align-middle">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
            )}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{role + ' ' + roleSuffix}</p>
          <div className="flex justify-center md:justify-start items-center gap-2">
            <p className="text-white bg-primary rounded-full w-10 aspect-square flex items-center justify-center p-1">
              {bloodGroup}
            </p>
          </div>
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-300"
          >
            <FaPhone className="mr-2 text-primary" />
            <span>{phone}</span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        {subTeamNumber}
      </div>
    </div>
  );

  return (
    <>
      {detailPageLink ? (
        <Link href={detailPageLink}>{CardContent}</Link>
      ) : (
        CardContent
      )}
    </>
  );
};

export default TeamCard;
