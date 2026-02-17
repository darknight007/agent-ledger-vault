import { describe, it, expect } from 'vitest';
import {
  generateBreadcrumbsFromPath,
  validateBreadcrumbs,
  generateBreadcrumbSchemaFromPath,
  formatBreadcrumbForDisplay,
  getBreadcrumbSegments,
  isBreadcrumbCurrentPage,
  getParentBreadcrumb,
  getBreadcrumbDepth,
  validateBreadcrumbHierarchy,
  truncateBreadcrumbName,
  createTruncatedBreadcrumb,
  getTruncatedBreadcrumbs,
} from './breadcrumbs';

describe('Breadcrumb Utilities', () => {
  describe('generateBreadcrumbsFromPath', () => {
    it('should generate breadcrumbs for root path', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/');
      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0].name).toBe('Home');
      expect(breadcrumbs[0].url).toBe('https://askscrooge.com/');
    });

    it('should generate breadcrumbs for single segment path', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/pricing');
      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0].name).toBe('Home');
      expect(breadcrumbs[1].name).toBe('Pricing');
    });

    it('should generate breadcrumbs for multi-segment path', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/pricing-blueprints/research-agent');
      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].name).toBe('Home');
      expect(breadcrumbs[1].name).toBe('Pricing Blueprints');
      expect(breadcrumbs[2].name).toBe('Research Agent');
    });

    it('should format kebab-case to Title Case', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/pricing-blueprints/social-content-creator-agent');
      expect(breadcrumbs[2].name).toBe('Social Content Creator Agent');
    });

    it('should generate correct URLs', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/pricing-blueprints/research-agent');
      expect(breadcrumbs[1].url).toBe('https://askscrooge.com/pricing-blueprints');
      expect(breadcrumbs[2].url).toBe('https://askscrooge.com/pricing-blueprints/research-agent');
    });
  });

  describe('validateBreadcrumbs', () => {
    it('should validate correct breadcrumbs', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/pricing-blueprints/research-agent');
      const result = validateBreadcrumbs(breadcrumbs);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect empty breadcrumbs', () => {
      const result = validateBreadcrumbs([]);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('empty'))).toBe(true);
    });

    it('should detect missing home breadcrumb', () => {
      const result = validateBreadcrumbs([
        { name: 'Pricing', url: 'https://askscrooge.com/pricing' },
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Home'))).toBe(true);
    });

    it('should detect invalid URLs', () => {
      const result = validateBreadcrumbs([
        { name: 'Home', url: 'https://askscrooge.com/' },
        { name: 'Pricing', url: 'not-a-valid-url' },
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('invalid URL'))).toBe(true);
    });

    it('should detect missing names', () => {
      const result = validateBreadcrumbs([
        { name: 'Home', url: 'https://askscrooge.com/' },
        { name: '', url: 'https://askscrooge.com/pricing' },
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('missing name'))).toBe(true);
    });
  });

  describe('generateBreadcrumbSchemaFromPath', () => {
    it('should generate valid breadcrumb schema', () => {
      const schema = generateBreadcrumbSchemaFromPath('/pricing-blueprints/research-agent');
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe('Home');
    });
  });

  describe('formatBreadcrumbForDisplay', () => {
    it('should format breadcrumbs for display', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/pricing-blueprints/research-agent');
      const formatted = formatBreadcrumbForDisplay(breadcrumbs);
      expect(formatted).toBe('Home > Pricing Blueprints > Research Agent');
    });

    it('should use custom separator', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/pricing-blueprints/research-agent');
      const formatted = formatBreadcrumbForDisplay(breadcrumbs, '/');
      expect(formatted).toBe('Home / Pricing Blueprints / Research Agent');
    });
  });

  describe('getBreadcrumbSegments', () => {
    it('should extract segments from path', () => {
      const segments = getBreadcrumbSegments('/pricing-blueprints/research-agent');
      expect(segments).toEqual(['pricing-blueprints', 'research-agent']);
    });

    it('should handle root path', () => {
      const segments = getBreadcrumbSegments('/');
      expect(segments).toHaveLength(0);
    });
  });

  describe('isBreadcrumbCurrentPage', () => {
    it('should detect current page breadcrumb', () => {
      const breadcrumb = { name: 'Research Agent', url: 'https://askscrooge.com/pricing-blueprints/research-agent' };
      expect(isBreadcrumbCurrentPage(breadcrumb, '/pricing-blueprints/research-agent')).toBe(true);
    });

    it('should handle trailing slash', () => {
      const breadcrumb = { name: 'Research Agent', url: 'https://askscrooge.com/pricing-blueprints/research-agent/' };
      expect(isBreadcrumbCurrentPage(breadcrumb, '/pricing-blueprints/research-agent')).toBe(true);
    });

    it('should detect non-current page', () => {
      const breadcrumb = { name: 'Pricing', url: 'https://askscrooge.com/pricing' };
      expect(isBreadcrumbCurrentPage(breadcrumb, '/pricing-blueprints/research-agent')).toBe(false);
    });
  });

  describe('getParentBreadcrumb', () => {
    it('should get parent breadcrumb', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/pricing-blueprints/research-agent');
      const parent = getParentBreadcrumb(breadcrumbs);
      expect(parent?.name).toBe('Pricing Blueprints');
    });

    it('should return null for single breadcrumb', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/');
      const parent = getParentBreadcrumb(breadcrumbs);
      expect(parent).toBeNull();
    });
  });

  describe('getBreadcrumbDepth', () => {
    it('should calculate depth for root path', () => {
      expect(getBreadcrumbDepth('/')).toBe(1);
    });

    it('should calculate depth for single segment', () => {
      expect(getBreadcrumbDepth('/pricing')).toBe(2);
    });

    it('should calculate depth for multi-segment path', () => {
      expect(getBreadcrumbDepth('/pricing-blueprints/research-agent')).toBe(3);
    });
  });

  describe('validateBreadcrumbHierarchy', () => {
    it('should validate correct hierarchy', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/pricing-blueprints/research-agent');
      const result = validateBreadcrumbHierarchy(breadcrumbs);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect incorrect hierarchy', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://askscrooge.com/' },
        { name: 'Research Agent', url: 'https://askscrooge.com/research-agent' },
        { name: 'Pricing Blueprints', url: 'https://askscrooge.com/pricing-blueprints' },
      ];
      const result = validateBreadcrumbHierarchy(breadcrumbs);
      expect(result.isValid).toBe(false);
    });
  });

  describe('truncateBreadcrumbName', () => {
    it('should not truncate short names', () => {
      const name = 'Pricing';
      expect(truncateBreadcrumbName(name)).toBe('Pricing');
    });

    it('should truncate long names', () => {
      const name = 'This is a very long breadcrumb name that should be truncated';
      const truncated = truncateBreadcrumbName(name, 30);
      expect(truncated.length).toBeLessThanOrEqual(30);
      expect(truncated).toContain('...');
    });

    it('should use custom max length', () => {
      const name = 'This is a long name';
      const truncated = truncateBreadcrumbName(name, 10);
      expect(truncated.length).toBeLessThanOrEqual(10);
    });
  });

  describe('createTruncatedBreadcrumb', () => {
    it('should create truncated breadcrumb', () => {
      const breadcrumb = { name: 'This is a very long breadcrumb name', url: 'https://askscrooge.com/path' };
      const truncated = createTruncatedBreadcrumb(breadcrumb, 20);
      expect(truncated.name.length).toBeLessThanOrEqual(20);
      expect(truncated.url).toBe(breadcrumb.url);
    });
  });

  describe('getTruncatedBreadcrumbs', () => {
    it('should truncate all breadcrumbs', () => {
      const breadcrumbs = generateBreadcrumbsFromPath('/pricing-blueprints/social-content-creator-agent');
      const truncated = getTruncatedBreadcrumbs(breadcrumbs, 20);
      expect(truncated.every((b) => b.name.length <= 20)).toBe(true);
    });
  });
});
