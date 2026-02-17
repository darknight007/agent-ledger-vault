import { describe, it, expect } from 'vitest';
import {
  generateSitemapEntries,
  generateSitemapXML,
  generateSitemapIndexXML,
  escapeXML,
  validateSitemapEntry,
  validateSitemapEntries,
  splitSitemap,
  generateSitemapWithSplitting,
  getSitemapStatistics,
  generateSitemap,
  generateRobotsSitemapDirective,
} from './sitemap-generator';
import { SitemapEntry } from './types';

describe('Sitemap Generator', () => {
  const mockEntries: SitemapEntry[] = [
    {
      url: 'https://askscrooge.com/',
      lastmod: '2024-01-01',
      changefreq: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://askscrooge.com/pricing',
      lastmod: '2024-01-15',
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://askscrooge.com/features',
      lastmod: '2024-01-10',
      changefreq: 'monthly',
      priority: 0.6,
    },
  ];

  describe('generateSitemapEntries', () => {
    it('should generate sitemap entries from configs', () => {
      const entries = generateSitemapEntries();
      expect(entries.length).toBeGreaterThan(0);
      expect(entries[0].url).toContain('https://askscrooge.com');
      expect(entries[0].lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('generateSitemapXML', () => {
    it('should generate valid sitemap XML', () => {
      const xml = generateSitemapXML(mockEntries);
      expect(xml).toContain('<?xml version="1.0"');
      expect(xml).toContain('<urlset');
      expect(xml).toContain('</urlset>');
      expect(xml).toContain('<loc>https://askscrooge.com/</loc>');
    });

    it('should include all entries', () => {
      const xml = generateSitemapXML(mockEntries);
      mockEntries.forEach((entry) => {
        expect(xml).toContain(entry.url);
        expect(xml).toContain(entry.lastmod);
        expect(xml).toContain(entry.changefreq);
        expect(xml).toContain(entry.priority.toString());
      });
    });

    it('should escape special characters', () => {
      const entries: SitemapEntry[] = [
        {
          url: 'https://askscrooge.com/page?param=value&other=test',
          lastmod: '2024-01-01',
          changefreq: 'weekly',
          priority: 0.8,
        },
      ];

      const xml = generateSitemapXML(entries);
      expect(xml).toContain('&amp;');
    });
  });

  describe('generateSitemapIndexXML', () => {
    it('should generate valid sitemap index XML', () => {
      const urls = [
        'https://askscrooge.com/sitemap-1.xml',
        'https://askscrooge.com/sitemap-2.xml',
      ];

      const xml = generateSitemapIndexXML(urls);
      expect(xml).toContain('<?xml version="1.0"');
      expect(xml).toContain('<sitemapindex');
      expect(xml).toContain('</sitemapindex>');
      expect(xml).toContain('sitemap-1.xml');
      expect(xml).toContain('sitemap-2.xml');
    });
  });

  describe('escapeXML', () => {
    it('should escape ampersands', () => {
      expect(escapeXML('A & B')).toBe('A &amp; B');
    });

    it('should escape angle brackets', () => {
      expect(escapeXML('<tag>')).toBe('&lt;tag&gt;');
    });

    it('should escape quotes', () => {
      expect(escapeXML('He said "hello"')).toBe('He said &quot;hello&quot;');
    });

    it('should escape apostrophes', () => {
      expect(escapeXML("It's")).toBe('It&apos;s');
    });
  });

  describe('validateSitemapEntry', () => {
    it('should validate correct entry', () => {
      const result = validateSitemapEntry(mockEntries[0]);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing URL', () => {
      const entry: SitemapEntry = {
        url: '',
        lastmod: '2024-01-01',
        changefreq: 'weekly',
        priority: 0.8,
      };

      const result = validateSitemapEntry(entry);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('URL'))).toBe(true);
    });

    it('should detect invalid URL', () => {
      const entry: SitemapEntry = {
        url: 'not-a-valid-url',
        lastmod: '2024-01-01',
        changefreq: 'weekly',
        priority: 0.8,
      };

      const result = validateSitemapEntry(entry);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid URL'))).toBe(true);
    });

    it('should detect invalid lastmod format', () => {
      const entry: SitemapEntry = {
        url: 'https://askscrooge.com/',
        lastmod: '01-01-2024',
        changefreq: 'weekly',
        priority: 0.8,
      };

      const result = validateSitemapEntry(entry);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('lastmod'))).toBe(true);
    });

    it('should detect invalid changefreq', () => {
      const entry: SitemapEntry = {
        url: 'https://askscrooge.com/',
        lastmod: '2024-01-01',
        changefreq: 'invalid' as any,
        priority: 0.8,
      };

      const result = validateSitemapEntry(entry);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('changefreq'))).toBe(true);
    });

    it('should detect invalid priority', () => {
      const entry: SitemapEntry = {
        url: 'https://askscrooge.com/',
        lastmod: '2024-01-01',
        changefreq: 'weekly',
        priority: 1.5,
      };

      const result = validateSitemapEntry(entry);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('priority'))).toBe(true);
    });
  });

  describe('validateSitemapEntries', () => {
    it('should validate all entries', () => {
      const errors = validateSitemapEntries(mockEntries);
      expect(errors.size).toBe(0);
    });

    it('should detect errors in multiple entries', () => {
      const entries: SitemapEntry[] = [
        mockEntries[0],
        {
          url: 'invalid',
          lastmod: '2024-01-01',
          changefreq: 'weekly',
          priority: 0.8,
        },
      ];

      const errors = validateSitemapEntries(entries);
      expect(errors.size).toBeGreaterThan(0);
    });
  });

  describe('splitSitemap', () => {
    it('should split large sitemap', () => {
      const entries = Array.from({ length: 150000 }, (_, i) => ({
        url: `https://askscrooge.com/page-${i}`,
        lastmod: '2024-01-01',
        changefreq: 'weekly' as const,
        priority: 0.8,
      }));

      const sitemaps = splitSitemap(entries, 50000);
      expect(sitemaps.length).toBe(3);
      expect(sitemaps[0].length).toBe(50000);
      expect(sitemaps[1].length).toBe(50000);
      expect(sitemaps[2].length).toBe(50000);
    });

    it('should not split small sitemap', () => {
      const sitemaps = splitSitemap(mockEntries, 50000);
      expect(sitemaps.length).toBe(1);
      expect(sitemaps[0]).toEqual(mockEntries);
    });
  });

  describe('generateSitemapWithSplitting', () => {
    it('should generate sitemap with splitting', () => {
      const entries = Array.from({ length: 100000 }, (_, i) => ({
        url: `https://askscrooge.com/page-${i}`,
        lastmod: '2024-01-01',
        changefreq: 'weekly' as const,
        priority: 0.8,
      }));

      const result = generateSitemapWithSplitting(entries, 50000);
      expect(result.sitemaps.length).toBe(2);
      expect(result.sitemapIndex).toContain('sitemapindex');
      expect(result.sitemapIndex).toContain('sitemap-1.xml');
      expect(result.sitemapIndex).toContain('sitemap-2.xml');
    });
  });

  describe('getSitemapStatistics', () => {
    it('should calculate statistics', () => {
      const stats = getSitemapStatistics(mockEntries);
      expect(stats.totalEntries).toBe(3);
      expect(stats.byChangefreq['weekly']).toBe(1);
      expect(stats.byChangefreq['monthly']).toBe(2);
      expect(stats.averagePriority).toBeCloseTo(0.8, 1);
    });
  });

  describe('generateSitemap', () => {
    it('should generate complete sitemap', () => {
      const xml = generateSitemap();
      expect(xml).toContain('<?xml version="1.0"');
      expect(xml).toContain('<urlset');
      expect(xml).toContain('https://askscrooge.com/');
    });
  });

  describe('generateRobotsSitemapDirective', () => {
    it('should generate robots.txt sitemap directive', () => {
      const directive = generateRobotsSitemapDirective();
      expect(directive).toBe('Sitemap: https://askscrooge.com/sitemap.xml');
    });
  });
});
