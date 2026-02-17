/**
 * LLMMetadata Component
 * Injects LLM-specific metadata into document head
 */

import { useEffect } from 'react';
import { LLMMetadataConfig, validateLLMMetadata, createLLMRobotsTag } from '@/lib/seo/llm-metadata';

interface LLMMetadataProps {
  config: LLMMetadataConfig;
}

export const LLMMetadata: React.FC<LLMMetadataProps> = ({ config }) => {
  useEffect(() => {
    // Validate LLM metadata
    const validation = validateLLMMetadata(config);
    if (!validation.isValid) {
      console.warn('Invalid LLM metadata:', validation.errors);
      return;
    }

    // Helper function to update or create meta tag
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }

      element.content = content;
    };

    // Update LLM-specific meta tags
    updateMetaTag('llm:content-type', config.contentType);
    updateMetaTag('llm:topic', config.topic);

    if (config.author) {
      updateMetaTag('llm:author', config.author);
    }

    if (config.publicationDate) {
      updateMetaTag('llm:publication-date', config.publicationDate);
    }

    if (config.facts) {
      updateMetaTag('llm:facts', JSON.stringify(config.facts));
    }

    // Update X-Robots-Tag header for LLM crawlers
    updateMetaTag('x-robots-tag', createLLMRobotsTag());

    return () => {
      // Keep the meta tags for persistence across route changes
    };
  }, [config]);

  // This component doesn't render anything visible
  return null;
};

export default LLMMetadata;
