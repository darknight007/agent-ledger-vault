/**
 * Structured Data (JSON-LD) Generators
 * Generates Schema.org structured data in JSON-LD format
 */

import { BreadcrumbItem } from './types';

/**
 * Organization Schema
 */
export function generateOrganizationSchema(options: {
  name: string;
  description: string;
  url: string;
  logo: string;
  email?: string;
  phone?: string;
  address?: string;
  socialProfiles?: string[];
  foundingDate?: string;
  type?: string;
}): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: options.name,
    description: options.description,
    url: options.url,
    logo: options.logo,
  };

  if (options.email) {
    schema.email = options.email;
  }

  if (options.phone) {
    schema.telephone = options.phone;
  }

  if (options.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: options.address,
    };
  }

  if (options.socialProfiles && options.socialProfiles.length > 0) {
    schema.sameAs = options.socialProfiles;
  }

  if (options.foundingDate) {
    schema.foundingDate = options.foundingDate;
  }

  if (options.type) {
    schema.type = options.type;
  }

  return schema;
}

/**
 * Product Schema
 */
export function generateProductSchema(options: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
  priceCurrency?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
}): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: options.name,
    description: options.description,
    url: options.url,
  };

  if (options.image) {
    schema.image = options.image;
  }

  if (options.price && options.priceCurrency) {
    schema.offers = {
      '@type': 'Offer',
      price: options.price,
      priceCurrency: options.priceCurrency,
      availability: options.availability || 'https://schema.org/InStock',
    };
  }

  if (options.rating && options.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: options.rating,
      reviewCount: options.reviewCount,
    };
  }

  return schema;
}

/**
 * Article Schema
 */
export function generateArticleSchema(options: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  publisher?: string;
}): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    url: options.url,
  };

  if (options.image) {
    schema.image = options.image;
  }

  if (options.author) {
    schema.author = {
      '@type': 'Person',
      name: options.author,
    };
  }

  if (options.datePublished) {
    schema.datePublished = options.datePublished;
  }

  if (options.dateModified) {
    schema.dateModified = options.dateModified;
  }

  if (options.publisher) {
    schema.publisher = {
      '@type': 'Organization',
      name: options.publisher,
    };
  }

  return schema;
}

/**
 * FAQ Page Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Breadcrumb List Schema
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Local Business Schema
 */
export function generateLocalBusinessSchema(options: {
  name: string;
  description: string;
  address: string;
  phone: string;
  email?: string;
  url: string;
  hours?: string;
  latitude?: number;
  longitude?: number;
}): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: options.name,
    description: options.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: options.address,
    },
    telephone: options.phone,
    url: options.url,
  };

  if (options.email) {
    schema.email = options.email;
  }

  if (options.hours) {
    schema.openingHoursSpecification = options.hours;
  }

  if (options.latitude && options.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: options.latitude,
      longitude: options.longitude,
    };
  }

  return schema;
}

/**
 * Validate JSON-LD Schema
 */
export function validateSchema(schema: Record<string, any>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for required @context
  if (!schema['@context']) {
    errors.push('Missing @context property');
  }

  // Check for required @type
  if (!schema['@type']) {
    errors.push('Missing @type property');
  }

  // Validate @context format
  if (schema['@context'] && typeof schema['@context'] !== 'string') {
    errors.push('@context must be a string');
  }

  // Check for common required fields based on type
  const type = schema['@type'];
  if (type === 'Organization' && !schema.name) {
    errors.push('Organization schema requires name property');
  }

  if (type === 'Product' && !schema.name) {
    errors.push('Product schema requires name property');
  }

  if (type === 'Article' && !schema.headline) {
    errors.push('Article schema requires headline property');
  }

  if (type === 'FAQPage' && !schema.mainEntity) {
    errors.push('FAQPage schema requires mainEntity property');
  }

  if (type === 'BreadcrumbList' && !schema.itemListElement) {
    errors.push('BreadcrumbList schema requires itemListElement property');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Convert schema to JSON string
 */
export function schemaToJSON(schema: Record<string, any>): string {
  return JSON.stringify(schema);
}

/**
 * Create script tag for schema
 */
export function createSchemaScript(schema: Record<string, any>): string {
  return `<script type="application/ld+json">${schemaToJSON(schema)}</script>`;
}
