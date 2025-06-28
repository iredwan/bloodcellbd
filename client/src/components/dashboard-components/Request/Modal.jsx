'use client';

import Image from 'next/image';
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, initialData, children }) => {
  if (!isOpen) return null;

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + initialData?.userId.profileImage;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto mt-17">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black opacity-50 transition-opacity z-10"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative z-20 bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-auto shadow-xl">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            </div>
            {title === "Edit Blood Request From" &&(
              <div className="flex flex-col justify-center items-center">
              <Image
                src={imageUrl}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full aspect-square object-cover object-center"
              />
              <div className="flex items-center justify-center">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                  {initialData.userId.name}
                  {initialData.userId.isVerified && (
                    <span className="text-primary ml-1 inline-block">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  )}
                </h3>
              </div>
              <p 
              onClick={() => {
                window.location.href = `tel:${initialData.userId.phone}`;
              }}
              className="text-sm py-2 text-gray-500 dark:text-gray-400 cursor-pointer">
                {initialData.userId.phone}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {initialData.contactRelation} of patient
              </p>
            </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
