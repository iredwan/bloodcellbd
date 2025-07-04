import { useEffect } from 'react';

const FaviconSetter = ({ faviconUrl }) => {
  useEffect(() => {
    if (!faviconUrl) return;

    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = faviconUrl;
    document.head.appendChild(link);
  }, [faviconUrl]);

  return null;
};

export default FaviconSetter;
