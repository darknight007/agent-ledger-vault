import { describe, it, expect } from 'vitest';
import {
  generateRobotsTxt,
  generateRobotsForUserAgent,
  validateRobotsTxt,
  parseRobotsTxt,
  isPathAllowed,
  generateRobotsForLLMCrawlers,
  getRecommendedRobotsTxt,
} from './robots-generator';

describe('Robots Generator', () => {
  describe('generateRobotsTxt', () => {
    it('should generate default robots.txt', () => {
      const robots = generateRobotsTxt();
      expect(robots).toContain('User-agent: Googlebot');
      expect(robots).toContain('User-agent: Bingbot');
      expect(robots).toContain('User-agent: Perplexity');
      expect(robots).toContain('User-agent: Claude');
      expect(robots).toContain('User-agent: ChatGPT');
      expect(robots).toContain('User-agent: *');
      expect(robots).toContain('Sitemap:');
    });

    it('should include allow directives', () => {
      const robots = generateRobotsTxt({ allowPublicPages: true });
      expect(robots).toContain('Allow: /');
    });

    it('should include disallow directives', () => {
      const robots = generateRobotsTxt({ disallowAdmin: true });
      expect(robots).toContain('Disallow: /admin');
    });

    it('should include crawl-delay', () => {
      const robots = generateRobotsTxt({ crawlDelay: 2 });
      expect(robots).toContain('Crawl-delay: 2');
    });

    it('should include sitemap', () => {
      const robots = generateRobotsTxt({ sitemapUrl: 'https://example.com/sitemap.xml' });
      expect(robots).toContain('Sitemap: https://example.com/sitemap.xml');
    });

    it('should respect configuration options', () => {
      const robots = generateRobotsTxt({
        allowPublicPages: false,
        disallowAdmin: false,
      });
      expect(robots).not.toContain('Allow: /');
      expect(robots).not.toContain('Disallow: /admin');
    });
  });

  describe('generateRobotsForUserAgent', () => {
    it('should generate robots for specific user agent', () => {
      const robots = generateRobotsForUserAgent('Googlebot', {
        allow: ['/'],
        disallow: ['/admin'],
      });

      expect(robots).toContain('User-agent: Googlebot');
      expect(robots).toContain('Allow: /');
      expect(robots).toContain('Disallow: /admin');
    });

    it('should include crawl-delay', () => {
      const robots = generateRobotsForUserAgent('Googlebot', {
        crawlDelay: 2,
      });

      expect(robots).toContain('Crawl-delay: 2');
    });
  });

  describe('validateRobotsTxt', () => {
    it('should validate correct robots.txt', () => {
      const robots = generateRobotsTxt();
      const result = validateRobotsTxt(robots);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect empty content', () => {
      const result = validateRobotsTxt('');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('empty'))).toBe(true);
    });

    it('should detect missing User-agent', () => {
      const result = validateRobotsTxt('Allow: /\nDisallow: /admin');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('User-agent'))).toBe(true);
    });

    it('should detect invalid directives', () => {
      const result = validateRobotsTxt('User-agent: *\nInvalid-directive: /');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid directive'))).toBe(true);
    });

    it('should allow comments', () => {
      const robots = 'User-agent: *\n# This is a comment\nAllow: /';
      const result = validateRobotsTxt(robots);
      expect(result.isValid).toBe(true);
    });
  });

  describe('parseRobotsTxt', () => {
    it('should parse robots.txt content', () => {
      const robots = `User-agent: Googlebot
Allow: /
Disallow: /admin

User-agent: *
Allow: /
Disallow: /private`;

      const rules = parseRobotsTxt(robots);
      expect(rules.has('Googlebot')).toBe(true);
      expect(rules.has('*')).toBe(true);
    });

    it('should parse directives correctly', () => {
      const robots = `User-agent: Googlebot
Allow: /
Allow: /*.css$
Disallow: /admin`;

      const rules = parseRobotsTxt(robots);
      const googlebot = rules.get('Googlebot');
      expect(googlebot?.get('allow')).toEqual(['/', '/*.css$']);
      expect(googlebot?.get('disallow')).toEqual(['/admin']);
    });
  });

  describe('isPathAllowed', () => {
    it('should allow public paths', () => {
      const robots = generateRobotsTxt();
      expect(isPathAllowed(robots, '/', 'Googlebot')).toBe(true);
      expect(isPathAllowed(robots, '/pricing', 'Googlebot')).toBe(true);
    });

    it('should disallow admin paths', () => {
      const robots = generateRobotsTxt();
      expect(isPathAllowed(robots, '/admin', 'Googlebot')).toBe(false);
      expect(isPathAllowed(robots, '/admin/users', 'Googlebot')).toBe(false);
    });

    it('should disallow private paths', () => {
      const robots = generateRobotsTxt();
      expect(isPathAllowed(robots, '/private', 'Googlebot')).toBe(false);
    });

    it('should use default rules if user agent not found', () => {
      const robots = `User-agent: *
Allow: /
Disallow: /admin`;

      expect(isPathAllowed(robots, '/', 'UnknownBot')).toBe(true);
      expect(isPathAllowed(robots, '/admin', 'UnknownBot')).toBe(false);
    });

    it('should handle specific allow rules', () => {
      const robots = `User-agent: *
Disallow: /
Allow: /public`;

      expect(isPathAllowed(robots, '/public', '*')).toBe(true);
      expect(isPathAllowed(robots, '/private', '*')).toBe(false);
    });
  });

  describe('generateRobotsForLLMCrawlers', () => {
    it('should generate robots for LLM crawlers', () => {
      const robots = generateRobotsForLLMCrawlers();
      expect(robots).toContain('User-agent: Perplexity');
      expect(robots).toContain('User-agent: Claude');
      expect(robots).toContain('User-agent: ChatGPT');
      expect(robots).toContain('User-agent: Bard');
      expect(robots).toContain('User-agent: Copilot');
    });

    it('should allow public pages for LLM crawlers', () => {
      const robots = generateRobotsForLLMCrawlers();
      expect(isPathAllowed(robots, '/', 'Perplexity')).toBe(true);
      expect(isPathAllowed(robots, '/pricing', 'Claude')).toBe(true);
    });

    it('should disallow admin for LLM crawlers', () => {
      const robots = generateRobotsForLLMCrawlers();
      expect(isPathAllowed(robots, '/admin', 'Perplexity')).toBe(false);
      expect(isPathAllowed(robots, '/admin', 'Claude')).toBe(false);
    });
  });

  describe('getRecommendedRobotsTxt', () => {
    it('should return recommended robots.txt', () => {
      const robots = getRecommendedRobotsTxt();
      expect(robots).toContain('User-agent:');
      expect(robots).toContain('Allow:');
      expect(robots).toContain('Disallow:');
      expect(robots).toContain('Sitemap:');
    });
  });
});
