/**
 * MetaTags Component
 * Injects meta tags into document head for SEO optimization
 */

import { useEffect } from 'react';
import { MetaTagProps } from '@/lib/seo/types';
import { sanitizeMetaTag } from '@/lib/seo/meta-tags';

export const MetaTags: React.FC<MetaTagProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterSite,
  twitterCreator,
}) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = sanitizeMetaTag(title);
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      let element = document.querySelector(
        isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      ) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }

      element.content = sanitizeMetaTag(content);
    };

    // Update standard meta tags
    if (description) {
      updateMetaTag('description', description);
    }

    if (keywords && keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }

    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    }

    // Update Open Graph tags
    if (ogTitle) {
      updateMetaTag('og:title', ogTitle, true);
    }

    if (ogDescription) {
      updateMetaTag('og:description', ogDescription, true);
    }

    if (ogImage) {
      updateMetaTag('og:image', ogImage, true);
    }

    if (ogType) {
      updateMetaTag('og:type', ogType, true);
    }

    // Update Twitter Card tags
    if (twitterCard) {
      updateMetaTag('twitter:card', twitterCard);
    }

    if (twitterTitle) {
      updateMetaTag('twitter:title', twitterTitle);
    }

    if (twitterDescription) {
      updateMetaTag('twitter:description', twitterDescription);
    }

    if (twitterImage) {
      updateMetaTag('twitter:image', twitterImage);
    }

    if (twitterSite) {
      updateMetaTag('twitter:site', twitterSite);
    }

    if (twitterCreator) {
      updateMetaTag('twitter:creator', twitterCreator);
    }

    // Cleanup function (optional - only if needed)
    return () => {
      // Meta tags persist across route changes, which is desired behavior
    };
  }, [
    title,
    description,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterSite,
    twitterCreator,
  ]);

  // This component doesn't render anything visible
  return null;
};

export default MetaTags;
