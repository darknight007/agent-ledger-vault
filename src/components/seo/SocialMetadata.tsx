/**
 * SocialMetadata Component
 * Injects Open Graph and Twitter Card metadata into document head
 */

import { useEffect } from 'react';
import { OpenGraphMetadata, TwitterCardMetadata, validateOpenGraphMetadata, validateTwitterCardMetadata } from '@/lib/seo/social-metadata';

interface SocialMetadataProps {
  openGraph: OpenGraphMetadata;
  twitterCard: TwitterCardMetadata;
}

export const SocialMetadata: React.FC<SocialMetadataProps> = ({ openGraph, twitterCard }) => {
  useEffect(() => {
    // Validate Open Graph metadata
    const ogValidation = validateOpenGraphMetadata(openGraph);
    if (!ogValidation.isValid) {
      console.warn('Invalid Open Graph metadata:', ogValidation.errors);
    }

    // Validate Twitter Card metadata
    const twitterValidation = validateTwitterCardMetadata(twitterCard);
    if (!twitterValidation.isValid) {
      console.warn('Invalid Twitter Card metadata:', twitterValidation.errors);
    }

    // Helper function to update or create meta tag
    const updateMetaTag = (property: string, content: string, isProperty = true) => {
      let element = document.querySelector(
        isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`
      ) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }

      element.content = content;
    };

    // Update Open Graph tags
    updateMetaTag('og:title', openGraph.title, true);
    updateMetaTag('og:description', openGraph.description, true);
    updateMetaTag('og:url', openGraph.url, true);
    updateMetaTag('og:type', openGraph.type, true);
    updateMetaTag('og:image', openGraph.image, true);

    if (openGraph.imageWidth) {
      updateMetaTag('og:image:width', openGraph.imageWidth.toString(), true);
    }

    if (openGraph.imageHeight) {
      updateMetaTag('og:image:height', openGraph.imageHeight.toString(), true);
    }

    if (openGraph.imageType) {
      updateMetaTag('og:image:type', openGraph.imageType, true);
    }

    if (openGraph.siteName) {
      updateMetaTag('og:site_name', openGraph.siteName, true);
    }

    if (openGraph.locale) {
      updateMetaTag('og:locale', openGraph.locale, true);
    }

    // Update Twitter Card tags
    updateMetaTag('twitter:card', twitterCard.card, false);
    updateMetaTag('twitter:title', twitterCard.title, false);
    updateMetaTag('twitter:description', twitterCard.description, false);
    updateMetaTag('twitter:image', twitterCard.image, false);

    if (twitterCard.site) {
      updateMetaTag('twitter:site', twitterCard.site, false);
    }

    if (twitterCard.creator) {
      updateMetaTag('twitter:creator', twitterCard.creator, false);
    }

    if (twitterCard.imageAlt) {
      updateMetaTag('twitter:image:alt', twitterCard.imageAlt, false);
    }

    return () => {
      // Keep the meta tags for persistence across route changes
    };
  }, [openGraph, twitterCard]);

  // This component doesn't render anything visible
  return null;
};

export default SocialMetadata;
