import { describe, it, expect } from 'vitest';
import {
  generateOpenGraphMetadata,
  generateTwitterCardMetadata,
  validateImageDimensions,
  validateImageUrl,
  validateOpenGraphMetadata,
  validateTwitterCardMetadata,
  isImageDimensionOptimal,
  getRecommendedImageDimensions,
  combineSocialMetadata,
} from './social-metadata';

describe('Social Metadata Generators', () => {
  describe('generateOpenGraphMetadata', () => {
    it('should generate basic Open Graph metadata', () => {
      const metadata = generateOpenGraphMetadata({
        title: 'AskScrooge — Price, Bill & Audit Your AI Agents',
        description: 'Stop guessing what to charge for your AI agent',
        url: 'https://askscrooge.com',
        type: 'website',
        image: 'https://askscrooge.com/og-image.svg',
      });

      expect(metadata['og:title']).toBe('AskScrooge — Price, Bill & Audit Your AI Agents');
      expect(metadata['og:description']).toBe('Stop guessing what to charge for your AI agent');
      expect(metadata['og:url']).toBe('https://askscrooge.com');
      expect(metadata['og:type']).toBe('website');
      expect(metadata['og:image']).toBe('https://askscrooge.com/og-image.svg');
    });

    it('should include optional fields when provided', () => {
      const metadata = generateOpenGraphMetadata({
        title: 'AskScrooge',
        description: 'Pricing platform for AI agents',
        url: 'https://askscrooge.com',
        type: 'website',
        image: 'https://askscrooge.com/og-image.svg',
        imageWidth: 1200,
        imageHeight: 630,
        imageType: 'image/svg+xml',
        siteName: 'AskScrooge',
        locale: 'en_US',
      });

      expect(metadata['og:image:width']).toBe('1200');
      expect(metadata['og:image:height']).toBe('630');
      expect(metadata['og:image:type']).toBe('image/svg+xml');
      expect(metadata['og:site_name']).toBe('AskScrooge');
      expect(metadata['og:locale']).toBe('en_US');
    });
  });

  describe('generateTwitterCardMetadata', () => {
    it('should generate basic Twitter Card metadata', () => {
      const metadata = generateTwitterCardMetadata({
        card: 'summary_large_image',
        title: 'AskScrooge — Price, Bill & Audit Your AI Agents',
        description: 'Stop guessing what to charge for your AI agent',
        image: 'https://askscrooge.com/og-image.svg',
      });

      expect(metadata['twitter:card']).toBe('summary_large_image');
      expect(metadata['twitter:title']).toBe('AskScrooge — Price, Bill & Audit Your AI Agents');
      expect(metadata['twitter:description']).toBe('Stop guessing what to charge for your AI agent');
      expect(metadata['twitter:image']).toBe('https://askscrooge.com/og-image.svg');
    });

    it('should include optional fields when provided', () => {
      const metadata = generateTwitterCardMetadata({
        card: 'summary_large_image',
        title: 'AskScrooge',
        description: 'Pricing platform for AI agents',
        image: 'https://askscrooge.com/og-image.svg',
        site: '@agentfi',
        creator: '@agentfi',
        imageAlt: 'AskScrooge logo',
      });

      expect(metadata['twitter:site']).toBe('@agentfi');
      expect(metadata['twitter:creator']).toBe('@agentfi');
      expect(metadata['twitter:image:alt']).toBe('AskScrooge logo');
    });
  });

  describe('validateImageDimensions', () => {
    it('should validate correct image dimensions', () => {
      const result = validateImageDimensions(1200, 630);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate larger image dimensions', () => {
      const result = validateImageDimensions(2400, 1260);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect width too small', () => {
      const result = validateImageDimensions(800, 630);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('width'))).toBe(true);
    });

    it('should detect height too small', () => {
      const result = validateImageDimensions(1200, 400);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('height'))).toBe(true);
    });

    it('should detect both dimensions too small', () => {
      const result = validateImageDimensions(800, 400);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('validateImageUrl', () => {
    it('should validate correct image URL', () => {
      const result = validateImageUrl('https://askscrooge.com/og-image.svg');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing URL', () => {
      const result = validateImageUrl('');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('required'))).toBe(true);
    });

    it('should detect relative URL', () => {
      const result = validateImageUrl('/og-image.svg');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('absolute'))).toBe(true);
    });

    it('should detect HTTP protocol', () => {
      const result = validateImageUrl('http://askscrooge.com/og-image.svg');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('HTTPS'))).toBe(true);
    });

    it('should detect invalid URL', () => {
      const result = validateImageUrl('not-a-valid-url');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('not a valid URL'))).toBe(true);
    });
  });

  describe('validateOpenGraphMetadata', () => {
    it('should validate correct Open Graph metadata', () => {
      const result = validateOpenGraphMetadata({
        title: 'AskScrooge — Price, Bill & Audit Your AI Agents',
        description: 'Stop guessing what to charge for your AI agent',
        url: 'https://askscrooge.com',
        type: 'website',
        image: 'https://askscrooge.com/og-image.svg',
        imageWidth: 1200,
        imageHeight: 630,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing title', () => {
      const result = validateOpenGraphMetadata({
        title: '',
        description: 'Stop guessing what to charge for your AI agent',
        url: 'https://askscrooge.com',
        type: 'website',
        image: 'https://askscrooge.com/og-image.svg',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('og:title'))).toBe(true);
    });

    it('should detect short title', () => {
      const result = validateOpenGraphMetadata({
        title: 'Short',
        description: 'Stop guessing what to charge for your AI agent',
        url: 'https://askscrooge.com',
        type: 'website',
        image: 'https://askscrooge.com/og-image.svg',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('at least 10 characters'))).toBe(true);
    });

    it('should detect missing description', () => {
      const result = validateOpenGraphMetadata({
        title: 'AskScrooge',
        description: '',
        url: 'https://askscrooge.com',
        type: 'website',
        image: 'https://askscrooge.com/og-image.svg',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('og:description'))).toBe(true);
    });

    it('should detect invalid URL', () => {
      const result = validateOpenGraphMetadata({
        title: 'AskScrooge',
        description: 'Pricing platform for AI agents',
        url: 'not-a-valid-url',
        type: 'website',
        image: 'https://askscrooge.com/og-image.svg',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('og:url'))).toBe(true);
    });

    it('should detect invalid image dimensions', () => {
      const result = validateOpenGraphMetadata({
        title: 'AskScrooge',
        description: 'Pricing platform for AI agents',
        url: 'https://askscrooge.com',
        type: 'website',
        image: 'https://askscrooge.com/og-image.svg',
        imageWidth: 800,
        imageHeight: 400,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('width'))).toBe(true);
    });
  });

  describe('validateTwitterCardMetadata', () => {
    it('should validate correct Twitter Card metadata', () => {
      const result = validateTwitterCardMetadata({
        card: 'summary_large_image',
        title: 'AskScrooge — Price, Bill & Audit Your AI Agents',
        description: 'Stop guessing what to charge for your AI agent',
        image: 'https://askscrooge.com/og-image.svg',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid card type', () => {
      const result = validateTwitterCardMetadata({
        card: 'invalid' as any,
        title: 'AskScrooge',
        description: 'Pricing platform for AI agents',
        image: 'https://askscrooge.com/og-image.svg',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('twitter:card'))).toBe(true);
    });
  });

  describe('isImageDimensionOptimal', () => {
    it('should recognize optimal dimensions', () => {
      expect(isImageDimensionOptimal(1200, 630)).toBe(true);
    });

    it('should recognize larger dimensions as optimal', () => {
      expect(isImageDimensionOptimal(2400, 1260)).toBe(true);
    });

    it('should recognize suboptimal width', () => {
      expect(isImageDimensionOptimal(800, 630)).toBe(false);
    });

    it('should recognize suboptimal height', () => {
      expect(isImageDimensionOptimal(1200, 400)).toBe(false);
    });
  });

  describe('getRecommendedImageDimensions', () => {
    it('should return recommended dimensions', () => {
      const dimensions = getRecommendedImageDimensions();
      expect(dimensions.width).toBe(1200);
      expect(dimensions.height).toBe(630);
    });
  });

  describe('combineSocialMetadata', () => {
    it('should combine Open Graph and Twitter Card metadata', () => {
      const combined = combineSocialMetadata(
        {
          title: 'AskScrooge',
          description: 'Pricing platform for AI agents',
          url: 'https://askscrooge.com',
          type: 'website',
          image: 'https://askscrooge.com/og-image.svg',
        },
        {
          card: 'summary_large_image',
          title: 'AskScrooge',
          description: 'Pricing platform for AI agents',
          image: 'https://askscrooge.com/og-image.svg',
        }
      );

      expect(combined['og:title']).toBe('AskScrooge');
      expect(combined['twitter:card']).toBe('summary_large_image');
      expect(Object.keys(combined).length).toBeGreaterThan(5);
    });
  });
});
