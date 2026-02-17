import { describe, it, expect } from 'vitest';
import {
  generateCanonicalUrl,
  removeUrlParameters,
  ensureHttps,
  toAbsoluteUrl,
  validateCanonicalUrl,
  normalizeCanonicalUrl,
  areUrlsEquivalent,
  detectRedirectChain,
  getCanonicalUrlForPage,
  extractPathFromUrl,
  isSameDomain,
} from './canonical-url';

describe('Canonical URL Utilities', () => {
  describe('generateCanonicalUrl', () => {
    it('should generate canonical URL from path', () => {
      const url = generateCanonicalUrl('/pricing-blueprints/research-agent');
      expect(url).toBe('https://askscrooge.com/pricing-blueprints/research-agent');
    });

    it('should handle root path', () => {
      const url = generateCanonicalUrl('/');
      expect(url).toBe('https://askscrooge.com/');
    });

    it('should add leading slash if missing', () => {
      const url = generateCanonicalUrl('pricing-blueprints/research-agent');
      expect(url).toBe('https://askscrooge.com/pricing-blueprints/research-agent');
    });

    it('should remove trailing slash', () => {
      const url = generateCanonicalUrl('/pricing-blueprints/research-agent/');
      expect(url).toBe('https://askscrooge.com/pricing-blueprints/research-agent');
    });
  });

  describe('removeUrlParameters', () => {
    it('should remove query parameters', () => {
      const url = 'https://askscrooge.com/pricing?utm_source=google&utm_medium=cpc';
      const result = removeUrlParameters(url);
      expect(result).toBe('https://askscrooge.com/pricing');
    });

    it('should handle URLs without parameters', () => {
      const url = 'https://askscrooge.com/pricing';
      const result = removeUrlParameters(url);
      expect(result).toBe('https://askscrooge.com/pricing');
    });

    it('should handle invalid URLs gracefully', () => {
      const url = 'not-a-valid-url';
      const result = removeUrlParameters(url);
      expect(result).toBe('not-a-valid-url');
    });
  });

  describe('ensureHttps', () => {
    it('should convert HTTP to HTTPS', () => {
      const url = 'http://askscrooge.com/pricing';
      const result = ensureHttps(url);
      expect(result).toBe('https://askscrooge.com/pricing');
    });

    it('should keep HTTPS URLs unchanged', () => {
      const url = 'https://askscrooge.com/pricing';
      const result = ensureHttps(url);
      expect(result).toBe('https://askscrooge.com/pricing');
    });

    it('should handle URLs without protocol', () => {
      const url = 'askscrooge.com/pricing';
      const result = ensureHttps(url);
      expect(result).toBe('askscrooge.com/pricing');
    });
  });

  describe('toAbsoluteUrl', () => {
    it('should convert relative path to absolute URL', () => {
      const url = toAbsoluteUrl('/pricing');
      expect(url).toBe('https://askscrooge.com/pricing');
    });

    it('should keep absolute URLs unchanged', () => {
      const url = toAbsoluteUrl('https://askscrooge.com/pricing');
      expect(url).toBe('https://askscrooge.com/pricing');
    });

    it('should add leading slash to relative paths', () => {
      const url = toAbsoluteUrl('pricing');
      expect(url).toBe('https://askscrooge.com/pricing');
    });
  });

  describe('validateCanonicalUrl', () => {
    it('should validate correct canonical URL', () => {
      const result = validateCanonicalUrl('https://askscrooge.com/pricing');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect relative URLs', () => {
      const result = validateCanonicalUrl('/pricing');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('absolute'))).toBe(true);
    });

    it('should detect HTTP protocol', () => {
      const result = validateCanonicalUrl('http://askscrooge.com/pricing');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('HTTPS'))).toBe(true);
    });

    it('should detect query parameters', () => {
      const result = validateCanonicalUrl('https://askscrooge.com/pricing?utm_source=google');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('query parameters'))).toBe(true);
    });

    it('should detect fragments', () => {
      const result = validateCanonicalUrl('https://askscrooge.com/pricing#section');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('fragments'))).toBe(true);
    });

    it('should detect invalid URLs', () => {
      const result = validateCanonicalUrl('not-a-valid-url');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('not a valid URL'))).toBe(true);
    });
  });

  describe('normalizeCanonicalUrl', () => {
    it('should normalize URL with HTTP', () => {
      const url = normalizeCanonicalUrl('http://askscrooge.com/pricing/');
      expect(url).toBe('https://askscrooge.com/pricing');
    });

    it('should normalize URL with parameters', () => {
      const url = normalizeCanonicalUrl('https://askscrooge.com/pricing?utm_source=google');
      expect(url).toBe('https://askscrooge.com/pricing');
    });

    it('should keep root URL with trailing slash', () => {
      const url = normalizeCanonicalUrl('https://askscrooge.com/');
      expect(url).toBe('https://askscrooge.com/');
    });

    it('should remove trailing slash from non-root URLs', () => {
      const url = normalizeCanonicalUrl('https://askscrooge.com/pricing/');
      expect(url).toBe('https://askscrooge.com/pricing');
    });
  });

  describe('areUrlsEquivalent', () => {
    it('should recognize equivalent URLs', () => {
      const url1 = 'https://askscrooge.com/pricing';
      const url2 = 'https://askscrooge.com/pricing/';
      expect(areUrlsEquivalent(url1, url2)).toBe(true);
    });

    it('should recognize equivalent URLs with different protocols', () => {
      const url1 = 'http://askscrooge.com/pricing';
      const url2 = 'https://askscrooge.com/pricing';
      expect(areUrlsEquivalent(url1, url2)).toBe(true);
    });

    it('should recognize equivalent URLs with parameters', () => {
      const url1 = 'https://askscrooge.com/pricing?utm_source=google';
      const url2 = 'https://askscrooge.com/pricing';
      expect(areUrlsEquivalent(url1, url2)).toBe(true);
    });

    it('should detect different URLs', () => {
      const url1 = 'https://askscrooge.com/pricing';
      const url2 = 'https://askscrooge.com/features';
      expect(areUrlsEquivalent(url1, url2)).toBe(false);
    });
  });

  describe('detectRedirectChain', () => {
    it('should detect redirect chain', () => {
      const canonical = 'https://askscrooge.com/pricing';
      const actual = 'https://askscrooge.com/pricing/';
      expect(detectRedirectChain(canonical, actual)).toBe(false); // They're equivalent
    });

    it('should detect actual redirect chain', () => {
      const canonical = 'https://askscrooge.com/pricing';
      const actual = 'https://askscrooge.com/features';
      expect(detectRedirectChain(canonical, actual)).toBe(true);
    });
  });

  describe('getCanonicalUrlForPage', () => {
    it('should get canonical URL for page', () => {
      const url = getCanonicalUrlForPage('/pricing');
      expect(url).toBe('https://askscrooge.com/pricing');
    });

    it('should handle root path', () => {
      const url = getCanonicalUrlForPage('/');
      expect(url).toBe('https://askscrooge.com/');
    });
  });

  describe('extractPathFromUrl', () => {
    it('should extract path from URL', () => {
      const path = extractPathFromUrl('https://askscrooge.com/pricing');
      expect(path).toBe('/pricing');
    });

    it('should handle URLs with query parameters', () => {
      const path = extractPathFromUrl('https://askscrooge.com/pricing?utm_source=google');
      expect(path).toBe('/pricing');
    });

    it('should handle relative paths', () => {
      const path = extractPathFromUrl('/pricing');
      expect(path).toBe('/pricing');
    });
  });

  describe('isSameDomain', () => {
    it('should recognize same domain', () => {
      const result = isSameDomain('https://askscrooge.com/pricing');
      expect(result).toBe(true);
    });

    it('should recognize different domain', () => {
      const result = isSameDomain('https://example.com/pricing');
      expect(result).toBe(false);
    });

    it('should handle subdomains', () => {
      const result = isSameDomain('https://blog.askscrooge.com/pricing');
      expect(result).toBe(false);
    });
  });
});
