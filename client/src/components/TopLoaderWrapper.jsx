'use client';

import NextTopLoader from 'nextjs-toploader';

export default function TopLoaderWrapper() {
  return <NextTopLoader
  color="#ffffff" // Customize the color
  initialPosition={0.08}
  crawlSpeed={200}
  height={3}
  showSpinner={true}
  zIndex={1600}
/>;
}