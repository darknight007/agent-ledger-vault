import { describe, it, expect } from 'vitest';
import {
  validatePageConfig,
  validateAllConfigs,
  loadPageConfig,
  configToMetadata,
  getAllPageMetadata,
} from './config-loader';
import { seoConfig } from './seo.config';
import { PageConfig } from './types';

describe('SEO Config Loader', () => {
  describe('validatePageConfig', () => {
    it('should validate a correct page configuration', () => {
      const config = seoConfig.home;
      const errors = validatePageConfig(config);
      expect(errors).toHaveLength(0);
    });

    it('should detect title length violations (too short)', () => {
      const config: PageConfig = {
        ...seoConfig.home,
        title: 'Short Title',
      };
      const errors = validatePageConfig(config);
      expect(errors.some((e) => e.field === 'title')).toBe(true);
    });

    it('should detect title length violations (too long)', () => {
      const config: PageConfig = {
        ...seoConfig.home,
        title: 'This is a very long title that exceeds the maximum character limit for SEO',
      };
      const errors = validatePageConfig(config);
      expect(errors.some((e) => e.field === 'title')).toBe(true);
    });

    it('should detect description length violations (too short)', () => {
      const config: PageConfig = {
        ...seoConfig.home,
        description: 'Short description',
      };
      const errors = validatePageConfig(config);
      expect(errors.some((e) => e.field === 'description')).toBe(true);
    });

    it('should detect description length violations (too long)', () => {
      const config: PageConfig = {
        ...seoConfig.home,
        description:
          'This is a very long description that exceeds the maximum character limit for SEO meta descriptions and should be flagged as invalid',
      };
      const errors = validatePageConfig(config);
      expect(errors.some((e) => e.field === 'description')).toBe(true);
    });

    it('should detect missing keywords', () => {
      const config: PageConfig = {
        ...seoConfig.home,
        keywords: [],
      };
      const errors = validatePageConfig(config);
      expect(errors.some((e) => e.field === 'keywords')).toBe(true);
    });

    it('should detect invalid path', () => {
      const config: PageConfig = {
        ...seoConfig.home,
        path: 'invalid-path',
      };
      const errors = validatePageConfig(config);
      expect(errors.some((e) => e.field === 'path')).toBe(true);
    });

    it('should detect invalid priority', () => {
      const config: PageConfig = {
        ...seoConfig.home,
        priority: 1.5,
      };
      const errors = validatePageConfig(config);
      expect(errors.some((e) => e.field === 'priority')).toBe(true);
    });

    it('should detect invalid ogImage URL', () => {
      const config: PageConfig = {
        ...seoConfig.home,
        ogImage: 'not-a-valid-url',
      };
      const errors = validatePageConfig(config);
      expect(errors.some((e) => e.field === 'ogImage')).toBe(true);
    });

    it('should detect negative performance targets', () => {
      const config: PageConfig = {
        ...seoConfig.home,
        performanceTargets: {
          lcp: -100,
          fid: 100,
          cls: 0.1,
        },
      };
      const errors = validatePageConfig(config);
      expect(errors.some((e) => e.field === 'performanceTargets.lcp')).toBe(true);
    });
  });

  describe('validateAllConfigs', () => {
    it('should validate all configurations', () => {
      const results = validateAllConfigs();
      // All default configs should be valid
      expect(results.size).toBe(0);
    });
  });

  describe('loadPageConfig', () => {
    it('should load a valid page configuration', () => {
      const config = loadPageConfig('/');
      expect(config).not.toBeNull();
      expect(config?.path).toBe('/');
    });

    it('should return null for non-existent path', () => {
      const config = loadPageConfig('/non-existent');
      expect(config).toBeNull();
    });

    it('should load research agent blueprint config', () => {
      const config = loadPageConfig('/pricing-blueprints/research-agent');
      expect(config).not.toBeNull();
      expect(config?.id).toBe('research-agent');
    });
  });

  describe('configToMetadata', () => {
    it('should convert config to metadata', () => {
      const config = seoConfig.home;
      const metadata = configToMetadata(config);

      expect(metadata.path).toBe(config.path);
      expect(metadata.title).toBe(config.title);
      expect(metadata.description).toBe(config.description);
      expect(metadata.keywords).toEqual(config.keywords);
      expect(metadata.canonicalUrl).toBe('https://askscrooge.com/');
    });

    it('should set correct ogType for product content', () => {
      const config = seoConfig.researchAgent;
      const metadata = configToMetadata(config);
      expect(metadata.ogType).toBe('product');
    });

    it('should set correct ogType for page content', () => {
      const config = seoConfig.home;
      const metadata = configToMetadata(config);
      expect(metadata.ogType).toBe('website');
    });
  });

  describe('getAllPageMetadata', () => {
    it('should return metadata for all pages', () => {
      const metadata = getAllPageMetadata();
      expect(metadata.length).toBeGreaterThan(0);
      expect(metadata.every((m) => m.path && m.title && m.description)).toBe(true);
    });

    it('should include homepage metadata', () => {
      const metadata = getAllPageMetadata();
      const home = metadata.find((m) => m.path === '/');
      expect(home).toBeDefined();
    });

    it('should include all blueprint pages', () => {
      const metadata = getAllPageMetadata();
      const blueprintPaths = [
        '/pricing-blueprints/research-agent',
        '/pricing-blueprints/social-content-creator-agent',
        '/pricing-blueprints/customer-support-agent',
        '/pricing-blueprints/ai-sdr-agent',
      ];

      blueprintPaths.forEach((path) => {
        expect(metadata.some((m) => m.path === path)).toBe(true);
      });
    });
  });
});
