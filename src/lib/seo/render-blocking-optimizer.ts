/**
 * Render-Blocking Resource Optimizer
 * Utilities to minimize render-blocking resources and optimize resource loading
 */

/**
 * Configuration for render-blocking optimization
 */
export interface RenderBlockingConfig {
  // Defer non-critical CSS
  deferNonCriticalCSS: boolean;
  // Defer non-critical JavaScript
  deferNonCriticalJS: boolean;
  // Enable resource hints (preload, prefetch)
  enableResourceHints: boolean;
  // Lazy load images below the fold
  lazyLoadImages: boolean;
  // Inline critical CSS
  inlineCriticalCSS: boolean;
}

/**
 * Default configuration
 */
export const DEFAULT_RENDER_BLOCKING_CONFIG: RenderBlockingConfig = {
  deferNonCriticalCSS: true,
  deferNonCriticalJS: true,
  enableResourceHints: true,
  lazyLoadImages: true,
  inlineCriticalCSS: false,
};

/**
 * Defer non-critical CSS by converting link tags to load asynchronously
 * @param selector - CSS selector for link tags to defer
 */
export function deferNonCriticalCSS(selector: string = 'link[rel="stylesheet"][data-defer="true"]'): void {
  if (typeof document === 'undefined') return;

  const links = document.querySelectorAll(selector);
  links.forEach((link) => {
    const linkElement = link as HTMLLinkElement;
    if (linkElement.rel === 'stylesheet') {
      // Create a new link element for async loading
      const newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = linkElement.href;
      newLink.media = 'print';
      newLink.onload = () => {
        newLink.media = 'all';
      };
      document.head.appendChild(newLink);
      // Remove the original blocking link
      linkElement.remove();
    }
  });
}

/**
 * Add resource hints for preloading critical resources
 * @param resources - Array of resource URLs to preload
 */
export function addResourceHints(resources: string[]): void {
  if (typeof document === 'undefined') return;

  resources.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;

    // Determine resource type from URL
    if (url.endsWith('.js')) {
      link.as = 'script';
    } else if (url.endsWith('.css')) {
      link.as = 'style';
    } else if (url.endsWith('.woff') || url.endsWith('.woff2')) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (url.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
      link.as = 'image';
    }

    document.head.appendChild(link);
  });
}

/**
 * Add prefetch hints for non-critical resources
 * @param resources - Array of resource URLs to prefetch
 */
export function addPrefetchHints(resources: string[]): void {
  if (typeof document === 'undefined') return;

  resources.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Enable lazy loading for images
 * Uses Intersection Observer API for dynamic lazy loading
 */
export function enableLazyLoadingImages(): void {
  if (typeof document === 'undefined' || !('IntersectionObserver' in window)) return;

  const images = document.querySelectorAll('img[data-lazy="true"]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.getAttribute('data-src');
        const srcset = img.getAttribute('data-srcset');

        if (src) {
          img.src = src;
        }
        if (srcset) {
          img.srcset = srcset;
        }

        img.removeAttribute('data-lazy');
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Defer script execution until after page load
 * @param scriptSrc - URL of script to defer
 */
export function deferScriptExecution(scriptSrc: string): void {
  if (typeof document === 'undefined') return;

  const script = document.createElement('script');
  script.src = scriptSrc;
  script.defer = true;
  document.body.appendChild(script);
}

/**
 * Load script asynchronously
 * @param scriptSrc - URL of script to load
 */
export function loadScriptAsync(scriptSrc: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Document not available'));
      return;
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${scriptSrc}`));
    document.body.appendChild(script);
  });
}

/**
 * Optimize render-blocking resources
 * @param config - Configuration for optimization
 */
export function optimizeRenderBlockingResources(config: RenderBlockingConfig = DEFAULT_RENDER_BLOCKING_CONFIG): void {
  if (typeof document === 'undefined') return;

  if (config.deferNonCriticalCSS) {
    deferNonCriticalCSS();
  }

  if (config.enableResourceHints) {
    // Preload critical resources
    const criticalResources = document.querySelectorAll('[data-preload="true"]');
    const preloadUrls = Array.from(criticalResources).map((el) => el.getAttribute('href') || el.getAttribute('src')).filter(Boolean) as string[];
    if (preloadUrls.length > 0) {
      addResourceHints(preloadUrls);
    }
  }

  if (config.lazyLoadImages) {
    enableLazyLoadingImages();
  }
}

/**
 * Get render-blocking resources report
 * Analyzes the page for render-blocking resources
 */
export function getRenderBlockingReport(): {
  blockingScripts: string[];
  blockingStyles: string[];
  totalBlockingResources: number;
} {
  if (typeof document === 'undefined') {
    return {
      blockingScripts: [],
      blockingStyles: [],
      totalBlockingResources: 0,
    };
  }

  const blockingScripts: string[] = [];
  const blockingStyles: string[] = [];

  // Find render-blocking scripts (no async or defer attributes)
  document.querySelectorAll('script[src]').forEach((script) => {
    const hasAsync = script.hasAttribute('async');
    const hasDefer = script.hasAttribute('defer');
    if (!hasAsync && !hasDefer) {
      const src = script.getAttribute('src');
      if (src) blockingScripts.push(src);
    }
  });

  // Find render-blocking stylesheets
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href) blockingStyles.push(href);
  });

  return {
    blockingScripts,
    blockingStyles,
    totalBlockingResources: blockingScripts.length + blockingStyles.length,
  };
}
