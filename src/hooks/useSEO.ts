/**
 * useSEO Hook
 * Provides easy access to SEO utilities and page metadata
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadPageConfig, configToMetadata } from '@/lib/seo/config-loader';
import { PageMetadata } from '@/lib/seo/types';

/**
 * Hook to manage SEO metadata for current page
 */
export function useSEO(): PageMetadata | null {
  const location = useLocation();

  useEffect(() => {
    const config = loadPageConfig(location.pathname);
    if (config) {
      const metadata = configToMetadata(config);
      // Log for debugging
      console.debug('SEO metadata loaded for:', location.pathname, metadata);
    }
  }, [location.pathname]);

  const config = loadPageConfig(location.pathname);
  return config ? configToMetadata(config) : null;
}

/**
 * Hook to get SEO metadata for a specific path
 */
export function useSEOForPath(path: string): PageMetadata | null {
  const config = loadPageConfig(path);
  return config ? configToMetadata(config) : null;
}

export default useSEO;
