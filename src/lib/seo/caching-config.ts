/**
 * Caching Configuration
 * Defines cache strategies for different asset types
 */

/**
 * Cache control headers for different asset types
 */
export const CACHE_CONTROL_HEADERS = {
  // HTML files - no cache, always revalidate
  html: 'public, max-age=0, must-revalidate',
  
  // JavaScript and CSS bundles - long-term cache with immutable flag
  // These files have content hashes in their names, so they can be cached forever
  bundle: 'public, max-age=31536000, immutable', // 1 year
  
  // Images - long-term cache
  image: 'public, max-age=31536000, immutable', // 1 year
  
  // Fonts - long-term cache
  font: 'public, max-age=31536000, immutable', // 1 year
  
  // Sitemap and robots.txt - moderate cache
  seo: 'public, max-age=86400', // 1 day
  
  // API responses - short cache
  api: 'public, max-age=300', // 5 minutes
  
  // Default - no cache
  default: 'public, max-age=0, must-revalidate',
};

/**
 * Asset type patterns for cache control
 */
export const ASSET_PATTERNS = {
  html: /\.html$/i,
  js: /\.js$/i,
  css: /\.css$/i,
  image: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
  font: /\.(woff|woff2|ttf|otf|eot)$/i,
  seo: /(sitemap\.xml|robots\.txt)$/i,
};

/**
 * Get cache control header for a given file path
 * @param filePath - The file path to determine cache strategy for
 * @returns Cache control header value
 */
export function getCacheControlHeader(filePath: string): string {
  if (ASSET_PATTERNS.html.test(filePath)) {
    return CACHE_CONTROL_HEADERS.html;
  }
  if (ASSET_PATTERNS.js.test(filePath) || ASSET_PATTERNS.css.test(filePath)) {
    return CACHE_CONTROL_HEADERS.bundle;
  }
  if (ASSET_PATTERNS.image.test(filePath)) {
    return CACHE_CONTROL_HEADERS.image;
  }
  if (ASSET_PATTERNS.font.test(filePath)) {
    return CACHE_CONTROL_HEADERS.font;
  }
  if (ASSET_PATTERNS.seo.test(filePath)) {
    return CACHE_CONTROL_HEADERS.seo;
  }
  return CACHE_CONTROL_HEADERS.default;
}

/**
 * Compression configuration
 */
export const COMPRESSION_CONFIG = {
  // Enable gzip compression
  gzip: {
    enabled: true,
    threshold: 10240, // Only compress files larger than 10KB
    level: 9, // Maximum compression level
  },
  
  // Enable brotli compression (better compression ratio than gzip)
  brotli: {
    enabled: true,
    threshold: 10240,
    level: 11, // Maximum compression level
  },
};

/**
 * Asset optimization configuration
 */
export const ASSET_OPTIMIZATION = {
  // Image optimization
  images: {
    // Lazy load images below the fold
    lazyLoad: true,
    // Use responsive images with srcset
    responsive: true,
    // Optimize image formats (WebP, AVIF)
    formats: ['webp', 'avif'],
  },
  
  // Font optimization
  fonts: {
    // Preload critical fonts
    preload: true,
    // Use font-display: swap for better performance
    fontDisplay: 'swap',
    // Subset fonts to reduce file size
    subset: true,
  },
  
  // CSS optimization
  css: {
    // Critical CSS inlining
    inlineCritical: false,
    // CSS code splitting
    codeSplit: true,
    // Minify CSS
    minify: true,
  },
  
  // JavaScript optimization
  js: {
    // Code splitting for routes
    routeCodeSplit: true,
    // Minify JavaScript
    minify: true,
    // Remove console logs in production
    removeConsole: true,
  },
};

/**
 * Performance budgets
 */
export const PERFORMANCE_BUDGETS = {
  // JavaScript bundle size budget (in KB)
  js: 200,
  
  // CSS bundle size budget (in KB)
  css: 50,
  
  // Total bundle size budget (in KB)
  total: 300,
  
  // Largest Contentful Paint budget (in ms)
  lcp: 2500,
  
  // First Input Delay budget (in ms)
  fid: 100,
  
  // Cumulative Layout Shift budget (unitless)
  cls: 0.1,
};
