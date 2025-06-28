'use client';
import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import ReqFulfilledCertificate from '@/components/dashboard-components/Request/ReqFulfilledCertificate';

const ParentComponent = () => {
  const certificateRef = useRef(null);

  const handleDownload = async () => {
    const images = certificateRef.current.querySelectorAll("img");
    const loadPromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    try {
      await Promise.all(loadPromises);
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        skipFonts: true,
      });
      download(dataUrl, `certificate.png`);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      {/* Hidden Certificate Component */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <ReqFulfilledCertificate
          ref={certificateRef}
          name="Ifrahim M. Raduan"
          bloodGroup="AB+"
          profileImage={null}
          donationDate="25/06/2025"
          nextDonationDate="23/10/2025"
          policeStation="Mirpur"
          district="Dhaka"
          requestId="BC-009123"
        />
      </div>

      {/* Visible Button Only */}
      <button
        onClick={handleDownload}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Download Certificate
      </button>
    </div>
  );
};

export default ParentComponent;
