/**
 * Canonical URL Generation Utilities
 * Manages canonical URLs to prevent duplicate content issues
 */

const DOMAIN = 'https://askscrooge.com';

/**
 * Generate canonical URL from path
 */
export function generateCanonicalUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Remove trailing slash except for root
  const cleanPath = normalizedPath === '/' ? '/' : normalizedPath.replace(/\/$/, '');

  return `${DOMAIN}${cleanPath}`;
}

/**
 * Remove URL parameters (tracking parameters, etc.)
 */
export function removeUrlParameters(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove all query parameters
    urlObj.search = '';
    return urlObj.toString();
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}

/**
 * Ensure HTTPS protocol
 */
export function ensureHttps(url: string): string {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
}

/**
 * Convert relative URL to absolute
 */
export function toAbsoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${DOMAIN}${normalizedPath}`;
}

/**
 * Validate canonical URL
 */
export function validateCanonicalUrl(url: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!url) {
    errors.push('Canonical URL is required');
    return { isValid: false, errors };
  }

  // Check if URL is absolute
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    errors.push('Canonical URL must be absolute (start with http:// or https://)');
  }

  // Check if URL uses HTTPS
  if (url.startsWith('http://')) {
    errors.push('Canonical URL should use HTTPS protocol');
  }

  // Check if URL has query parameters
  if (url.includes('?')) {
    errors.push('Canonical URL should not include query parameters');
  }

  // Check if URL has fragments
  if (url.includes('#')) {
    errors.push('Canonical URL should not include fragments');
  }

  // Try to parse URL
  try {
    new URL(url);
  } catch {
    errors.push('Canonical URL is not a valid URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Normalize canonical URL
 */
export function normalizeCanonicalUrl(url: string): string {
  let normalized = url;

  // Ensure HTTPS
  normalized = ensureHttps(normalized);

  // Remove parameters
  normalized = removeUrlParameters(normalized);

  // Remove trailing slash (except for root)
  if (normalized !== `${DOMAIN}/`) {
    normalized = normalized.replace(/\/$/, '');
  }

  return normalized;
}

/**
 * Check if two URLs are equivalent (after normalization)
 */
export function areUrlsEquivalent(url1: string, url2: string): boolean {
  const normalized1 = normalizeCanonicalUrl(url1);
  const normalized2 = normalizeCanonicalUrl(url2);
  return normalized1 === normalized2;
}

/**
 * Detect redirect chains
 */
export function detectRedirectChain(canonicalUrl: string, actualUrl: string): boolean {
  // If canonical URL doesn't match actual URL, there might be a redirect chain
  return !areUrlsEquivalent(canonicalUrl, actualUrl);
}

/**
 * Get canonical URL for page
 */
export function getCanonicalUrlForPage(path: string): string {
  const canonical = generateCanonicalUrl(path);
  const validation = validateCanonicalUrl(canonical);

  if (!validation.isValid) {
    console.warn(`Invalid canonical URL for path ${path}:`, validation.errors);
  }

  return canonical;
}

/**
 * Extract path from URL
 */
export function extractPathFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    // If URL parsing fails, assume it's already a path
    return url;
  }
}

/**
 * Check if URL is from same domain
 */
export function isSameDomain(url: string, domain: string = DOMAIN): boolean {
  try {
    const urlObj = new URL(url);
    const domainObj = new URL(domain);
    return urlObj.hostname === domainObj.hostname;
  } catch {
    return false;
  }
}
