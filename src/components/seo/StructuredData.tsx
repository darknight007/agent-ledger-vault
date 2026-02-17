/**
 * StructuredData Component
 * Injects JSON-LD structured data into document head
 */

import { useEffect } from 'react';
import { StructuredDataProps } from '@/lib/seo/types';
import { validateSchema, schemaToJSON } from '@/lib/seo/structured-data';

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data, validate = true }) => {
  useEffect(() => {
    // Validate schema if requested
    if (validate) {
      const validation = validateSchema(data);
      if (!validation.isValid) {
        console.warn(`Invalid ${type} schema:`, validation.errors);
        return;
      }
    }

    // Create or update script tag
    const scriptId = `schema-${type}`;
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement;

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    scriptElement.textContent = schemaToJSON(data);

    return () => {
      // Keep the script tag for persistence across route changes
    };
  }, [type, data, validate]);

  // This component doesn't render anything visible
  return null;
};

export default StructuredData;
