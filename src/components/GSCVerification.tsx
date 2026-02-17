/**
 * GSCVerification Component
 * Injects Google Search Console verification meta tag
 */

import { useEffect } from 'react';
import { getGSCVerificationMetaTag } from '@/lib/seo/google-search-console';

interface GSCVerificationProps {
  verificationCode?: string;
}

/**
 * GSCVerification component that injects GSC verification meta tag
 * Should be placed in the document head
 */
export function GSCVerification({ verificationCode }: GSCVerificationProps) {
  useEffect(() => {
    const code = verificationCode || import.meta.env.VITE_GSC_VERIFICATION_CODE;

    if (!code) {
      console.warn('GSC verification code not configured');
      return;
    }

    try {
      const metaTag = getGSCVerificationMetaTag(code);

      // Check if meta tag already exists
      const existingTag = document.querySelector(
        `meta[name="${metaTag.name}"]`
      );
      if (existingTag) {
        return;
      }

      // Create and append meta tag
      const meta = document.createElement('meta');
      meta.name = metaTag.name;
      meta.content = metaTag.content;
      document.head.appendChild(meta);
    } catch (error) {
      console.error('Failed to add GSC verification meta tag:', error);
    }
  }, [verificationCode]);

  return null;
}
