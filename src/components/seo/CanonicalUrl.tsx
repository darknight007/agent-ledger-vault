/**
 * CanonicalUrl Component
 * Injects canonical URL link into document head
 */

import { useEffect } from 'react';
import { validateCanonicalUrl } from '@/lib/seo/canonical-url';

interface CanonicalUrlProps {
  url: string;
}

export const CanonicalUrl: React.FC<CanonicalUrlProps> = ({ url }) => {
  useEffect(() => {
    // Validate canonical URL
    const validation = validateCanonicalUrl(url);
    if (!validation.isValid) {
      console.warn('Invalid canonical URL:', validation.errors);
      return;
    }

    // Create or update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.href = url;

    return () => {
      // Keep the link for persistence across route changes
    };
  }, [url]);

  // This component doesn't render anything visible
  return null;
};

export default CanonicalUrl;
