/**
 * Breadcrumb Generation Utilities
 * Generates breadcrumb navigation and schema markup
 */

import { BreadcrumbItem } from './types';
import { generateBreadcrumbSchema } from './structured-data';

/**
 * Generate breadcrumbs from path
 */
export function generateBreadcrumbsFromPath(path: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always add home
  breadcrumbs.push({
    name: 'Home',
    url: 'https://askscrooge.com/',
  });

  // Skip if root path
  if (path === '/') {
    return breadcrumbs;
  }

  // Split path and build breadcrumbs
  const segments = path.split('/').filter((s) => s);

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Format segment name (convert kebab-case to Title Case)
    const name = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Don't add the last segment (current page) as clickable
    if (index < segments.length - 1) {
      breadcrumbs.push({
        name,
        url: `https://askscrooge.com${currentPath}`,
      });
    } else {
      // Last segment is current page (non-clickable)
      breadcrumbs.push({
        name,
        url: `https://askscrooge.com${currentPath}`,
      });
    }
  });

  return breadcrumbs;
}

/**
 * Validate breadcrumb structure
 */
export function validateBreadcrumbs(breadcrumbs: BreadcrumbItem[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!breadcrumbs || breadcrumbs.length === 0) {
    errors.push('Breadcrumbs array must not be empty');
    return { isValid: false, errors };
  }

  // Check if first item is home
  if (breadcrumbs[0].name !== 'Home') {
    errors.push('First breadcrumb item must be "Home"');
  }

  // Check if first item links to home
  if (!breadcrumbs[0].url.endsWith('/')) {
    errors.push('First breadcrumb URL must be root path');
  }

  // Validate each breadcrumb
  breadcrumbs.forEach((item, index) => {
    if (!item.name) {
      errors.push(`Breadcrumb ${index} is missing name`);
    }

    if (!item.url) {
      errors.push(`Breadcrumb ${index} is missing URL`);
    } else {
      try {
        new URL(item.url);
      } catch {
        errors.push(`Breadcrumb ${index} has invalid URL: ${item.url}`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchemaFromPath(path: string): Record<string, any> {
  const breadcrumbs = generateBreadcrumbsFromPath(path);
  return generateBreadcrumbSchema(breadcrumbs);
}

/**
 * Format breadcrumb for display
 */
export function formatBreadcrumbForDisplay(breadcrumbs: BreadcrumbItem[], separator: string = '>'): string {
  return breadcrumbs.map((item) => item.name).join(` ${separator} `);
}

/**
 * Get breadcrumb path segments
 */
export function getBreadcrumbSegments(path: string): string[] {
  return path.split('/').filter((s) => s);
}

/**
 * Check if breadcrumb is current page
 */
export function isBreadcrumbCurrentPage(breadcrumb: BreadcrumbItem, currentPath: string): boolean {
  const breadcrumbPath = breadcrumb.url.replace('https://askscrooge.com', '');
  return breadcrumbPath === currentPath || breadcrumbPath === `${currentPath}/`;
}

/**
 * Get parent breadcrumb
 */
export function getParentBreadcrumb(breadcrumbs: BreadcrumbItem[]): BreadcrumbItem | null {
  if (breadcrumbs.length < 2) {
    return null;
  }

  return breadcrumbs[breadcrumbs.length - 2];
}

/**
 * Get breadcrumb depth
 */
export function getBreadcrumbDepth(path: string): number {
  if (path === '/') {
    return 1;
  }

  return path.split('/').filter((s) => s).length + 1;
}

/**
 * Validate breadcrumb hierarchy
 */
export function validateBreadcrumbHierarchy(breadcrumbs: BreadcrumbItem[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if breadcrumbs are in correct order
  for (let i = 0; i < breadcrumbs.length - 1; i++) {
    const current = breadcrumbs[i];
    const next = breadcrumbs[i + 1];

    // Next breadcrumb URL should contain current breadcrumb URL
    if (!next.url.includes(current.url.replace('https://askscrooge.com/', ''))) {
      errors.push(`Breadcrumb hierarchy is incorrect at position ${i}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Truncate breadcrumb name if too long
 */
export function truncateBreadcrumbName(name: string, maxLength: number = 30): string {
  if (name.length <= maxLength) {
    return name;
  }

  return name.substring(0, maxLength - 3) + '...';
}

/**
 * Create breadcrumb with truncation
 */
export function createTruncatedBreadcrumb(item: BreadcrumbItem, maxLength: number = 30): BreadcrumbItem {
  return {
    ...item,
    name: truncateBreadcrumbName(item.name, maxLength),
  };
}

/**
 * Get breadcrumbs with truncation
 */
export function getTruncatedBreadcrumbs(breadcrumbs: BreadcrumbItem[], maxLength: number = 30): BreadcrumbItem[] {
  return breadcrumbs.map((item) => createTruncatedBreadcrumb(item, maxLength));
}
