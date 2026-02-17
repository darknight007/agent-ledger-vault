import { describe, it, expect } from 'vitest';
import {
  CACHE_CONTROL_HEADERS,
  ASSET_PATTERNS,
  getCacheControlHeader,
  COMPRESSION_CONFIG,
  ASSET_OPTIMIZATION,
  PERFORMANCE_BUDGETS,
} from './caching-config';

describe('Caching Configuration', () => {
  describe('CACHE_CONTROL_HEADERS', () => {
    it('should have correct cache control headers', () => {
      expect(CACHE_CONTROL_HEADERS.html).toBe('public, max-age=0, must-revalidate');
      expect(CACHE_CONTROL_HEADERS.bundle).toContain('immutable');
      expect(CACHE_CONTROL_HEADERS.image).toContain('31536000');
      expect(CACHE_CONTROL_HEADERS.font).toContain('31536000');
      expect(CACHE_CONTROL_HEADERS.seo).toContain('86400');
    });

    it('should have default cache control header', () => {
      expect(CACHE_CONTROL_HEADERS.default).toBe('public, max-age=0, must-revalidate');
    });
  });

  describe('ASSET_PATTERNS', () => {
    it('should match HTML files', () => {
      expect(ASSET_PATTERNS.html.test('index.html')).toBe(true);
      expect(ASSET_PATTERNS.html.test('page.HTML')).toBe(true);
      expect(ASSET_PATTERNS.html.test('page.js')).toBe(false);
    });

    it('should match JavaScript files', () => {
      expect(ASSET_PATTERNS.js.test('bundle.js')).toBe(true);
      expect(ASSET_PATTERNS.js.test('script.JS')).toBe(true);
      expect(ASSET_PATTERNS.js.test('style.css')).toBe(false);
    });

    it('should match CSS files', () => {
      expect(ASSET_PATTERNS.css.test('style.css')).toBe(true);
      expect(ASSET_PATTERNS.css.test('main.CSS')).toBe(true);
      expect(ASSET_PATTERNS.css.test('script.js')).toBe(false);
    });

    it('should match image files', () => {
      expect(ASSET_PATTERNS.image.test('image.png')).toBe(true);
      expect(ASSET_PATTERNS.image.test('photo.jpg')).toBe(true);
      expect(ASSET_PATTERNS.image.test('graphic.svg')).toBe(true);
      expect(ASSET_PATTERNS.image.test('image.webp')).toBe(true);
      expect(ASSET_PATTERNS.image.test('file.txt')).toBe(false);
    });

    it('should match font files', () => {
      expect(ASSET_PATTERNS.font.test('font.woff')).toBe(true);
      expect(ASSET_PATTERNS.font.test('font.woff2')).toBe(true);
      expect(ASSET_PATTERNS.font.test('font.ttf')).toBe(true);
      expect(ASSET_PATTERNS.font.test('font.otf')).toBe(true);
      expect(ASSET_PATTERNS.font.test('file.txt')).toBe(false);
    });

    it('should match SEO files', () => {
      expect(ASSET_PATTERNS.seo.test('sitemap.xml')).toBe(true);
      expect(ASSET_PATTERNS.seo.test('robots.txt')).toBe(true);
      expect(ASSET_PATTERNS.seo.test('index.html')).toBe(false);
    });
  });

  describe('getCacheControlHeader', () => {
    it('should return HTML cache header for HTML files', () => {
      const header = getCacheControlHeader('index.html');
      expect(header).toBe(CACHE_CONTROL_HEADERS.html);
    });

    it('should return bundle cache header for JavaScript files', () => {
      const header = getCacheControlHeader('bundle.js');
      expect(header).toBe(CACHE_CONTROL_HEADERS.bundle);
    });

    it('should return bundle cache header for CSS files', () => {
      const header = getCacheControlHeader('style.css');
      expect(header).toBe(CACHE_CONTROL_HEADERS.bundle);
    });

    it('should return image cache header for image files', () => {
      const header = getCacheControlHeader('image.png');
      expect(header).toBe(CACHE_CONTROL_HEADERS.image);
    });

    it('should return font cache header for font files', () => {
      const header = getCacheControlHeader('font.woff2');
      expect(header).toBe(CACHE_CONTROL_HEADERS.font);
    });

    it('should return SEO cache header for SEO files', () => {
      const header = getCacheControlHeader('sitemap.xml');
      expect(header).toBe(CACHE_CONTROL_HEADERS.seo);
    });

    it('should return default cache header for unknown files', () => {
      const header = getCacheControlHeader('unknown.xyz');
      expect(header).toBe(CACHE_CONTROL_HEADERS.default);
    });
  });

  describe('COMPRESSION_CONFIG', () => {
    it('should have gzip compression enabled', () => {
      expect(COMPRESSION_CONFIG.gzip.enabled).toBe(true);
      expect(COMPRESSION_CONFIG.gzip.threshold).toBeGreaterThan(0);
      expect(COMPRESSION_CONFIG.gzip.level).toBeGreaterThan(0);
    });

    it('should have brotli compression enabled', () => {
      expect(COMPRESSION_CONFIG.brotli.enabled).toBe(true);
      expect(COMPRESSION_CONFIG.brotli.threshold).toBeGreaterThan(0);
      expect(COMPRESSION_CONFIG.brotli.level).toBeGreaterThan(0);
    });

    it('should have reasonable compression thresholds', () => {
      expect(COMPRESSION_CONFIG.gzip.threshold).toBe(COMPRESSION_CONFIG.brotli.threshold);
    });
  });

  describe('ASSET_OPTIMIZATION', () => {
    it('should have image optimization config', () => {
      expect(ASSET_OPTIMIZATION.images.lazyLoad).toBe(true);
      expect(ASSET_OPTIMIZATION.images.responsive).toBe(true);
      expect(Array.isArray(ASSET_OPTIMIZATION.images.formats)).toBe(true);
    });

    it('should have font optimization config', () => {
      expect(ASSET_OPTIMIZATION.fonts.preload).toBe(true);
      expect(ASSET_OPTIMIZATION.fonts.fontDisplay).toBe('swap');
      expect(ASSET_OPTIMIZATION.fonts.subset).toBe(true);
    });

    it('should have CSS optimization config', () => {
      expect(ASSET_OPTIMIZATION.css.codeSplit).toBe(true);
      expect(ASSET_OPTIMIZATION.css.minify).toBe(true);
    });

    it('should have JavaScript optimization config', () => {
      expect(ASSET_OPTIMIZATION.js.routeCodeSplit).toBe(true);
      expect(ASSET_OPTIMIZATION.js.minify).toBe(true);
      expect(ASSET_OPTIMIZATION.js.removeConsole).toBe(true);
    });
  });

  describe('PERFORMANCE_BUDGETS', () => {
    it('should have reasonable performance budgets', () => {
      expect(PERFORMANCE_BUDGETS.js).toBeGreaterThan(0);
      expect(PERFORMANCE_BUDGETS.css).toBeGreaterThan(0);
      expect(PERFORMANCE_BUDGETS.total).toBeGreaterThan(0);
      expect(PERFORMANCE_BUDGETS.lcp).toBeGreaterThan(0);
      expect(PERFORMANCE_BUDGETS.fid).toBeGreaterThan(0);
      expect(PERFORMANCE_BUDGETS.cls).toBeGreaterThan(0);
    });

    it('should have total budget greater than individual budgets', () => {
      expect(PERFORMANCE_BUDGETS.total).toBeGreaterThanOrEqual(PERFORMANCE_BUDGETS.js);
      expect(PERFORMANCE_BUDGETS.total).toBeGreaterThanOrEqual(PERFORMANCE_BUDGETS.css);
    });

    it('should have performance thresholds matching Core Web Vitals', () => {
      expect(PERFORMANCE_BUDGETS.lcp).toBeLessThanOrEqual(2500);
      expect(PERFORMANCE_BUDGETS.fid).toBeLessThanOrEqual(100);
      expect(PERFORMANCE_BUDGETS.cls).toBeLessThanOrEqual(0.1);
    });
  });
});
