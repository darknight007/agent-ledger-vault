/**
 * GA4Provider Component
 * Initializes Google Analytics 4 and tracks page views
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/seo/google-analytics';

interface GA4ProviderProps {
  children: React.ReactNode;
  measurementId?: string;
}

/**
 * GA4Provider component that wraps the application
 * Automatically tracks page views on route changes
 */
export function GA4Provider({ children, measurementId }: GA4ProviderProps) {
  const location = useLocation();

  // Initialize GA4 script on mount
  useEffect(() => {
    const id = measurementId || import.meta.env.VITE_GA4_MEASUREMENT_ID;

    if (!id) {
      console.warn('GA4 measurement ID not configured');
      return;
    }

    // Check if GA4 script is already loaded
    if (window.gtag) {
      return;
    }

    // Create and append GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', id);
  }, [measurementId]);

  // Track page view on route change
  useEffect(() => {
    const pageTitle = document.title || 'Page';
    trackPageView(location.pathname, pageTitle);
  }, [location]);

  return <>{children}</>;
}
