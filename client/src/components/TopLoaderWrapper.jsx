'use client';

import NextTopLoader, { useTopLoader } from 'nextjs-toploader';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function TopLoaderWrapper() {
  const pathname = usePathname();
  const { start, done } = useTopLoader();

  useEffect(() => {
    const timer = setTimeout(() => {
      done();
    }, 300); 

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handlePopState = () => {
      start(); 
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <NextTopLoader
      color="#ffffff"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      showSpinner={false}
      zIndex={1600}
    />
  );
}
