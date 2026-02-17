/**
 * Breadcrumb Component
 * Displays breadcrumb navigation with schema markup
 */

import { useEffect } from 'react';
import { BreadcrumbProps } from '@/lib/seo/types';
import { generateBreadcrumbSchema } from '@/lib/seo/structured-data';
import { validateBreadcrumbs } from '@/lib/seo/breadcrumbs';

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, includeSchema = true }) => {
  useEffect(() => {
    if (!includeSchema) {
      return;
    }

    // Validate breadcrumbs
    const validation = validateBreadcrumbs(items);
    if (!validation.isValid) {
      console.warn('Invalid breadcrumbs:', validation.errors);
      return;
    }

    // Generate and inject breadcrumb schema
    const schema = generateBreadcrumbSchema(items);

    let scriptElement = document.getElementById('schema-breadcrumb') as HTMLScriptElement;

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'schema-breadcrumb';
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    scriptElement.textContent = JSON.stringify(schema);

    return () => {
      // Keep the script tag for persistence
    };
  }, [items, includeSchema]);

  // Render breadcrumb navigation
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && <span className="text-gray-400">/</span>}
            {index === items.length - 1 ? (
              // Current page (non-clickable)
              <span className="text-gray-600">{item.name}</span>
            ) : (
              // Clickable link
              <a href={item.url} className="text-blue-600 hover:text-blue-800 hover:underline">
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
