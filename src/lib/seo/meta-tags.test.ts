import { describe, it, expect } from 'vitest';
import {
  generateMetaTitle,
  generateMetaDescription,
  validateMetaTitle,
  validateMetaDescription,
  sanitizeMetaTag,
  areMetaTitlesUnique,
  extractPrimaryKeyword,
  isKeywordInTitle,
  isKeywordInDescription,
  validateMetaTagConsistency,
} from './meta-tags';

describe('Meta Tags Utilities', () => {
  describe('generateMetaTitle', () => {
    it('should generate a valid meta title', () => {
      const title = generateMetaTitle('AI Agent Pricing');
      expect(title.length).toBeGreaterThanOrEqual(50);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).toContain('AskScrooge');
    });

    it('should include primary keyword', () => {
      const title = generateMetaTitle('AI Agent Pricing');
      expect(title).toContain('AI Agent Pricing');
    });

    it('should include suffix if provided', () => {
      const title = generateMetaTitle('AI Agent Pricing', 'AskScrooge', 'Blueprint');
      expect(title).toContain('Blueprint');
    });

    it('should truncate if too long', () => {
      const title = generateMetaTitle('This is a very long keyword that should be truncated');
      expect(title.length).toBeLessThanOrEqual(60);
    });

    it('should pad if too short', () => {
      const title = generateMetaTitle('Short');
      expect(title.length).toBeGreaterThanOrEqual(50);
    });
  });

  describe('generateMetaDescription', () => {
    it('should generate a valid meta description', () => {
      const description = generateMetaDescription(
        'Stop guessing what to charge for your AI agent. AskScrooge gives you pricing models, billing infra, and ROI dashboards so you ship outcomes, not invoices.'
      );
      expect(description.length).toBeGreaterThanOrEqual(150);
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it('should include call to action if provided', () => {
      const cta = 'Start for free today';
      const description = generateMetaDescription(
        'Stop guessing what to charge for your AI agent. AskScrooge gives you pricing models, billing infra, and ROI dashboards so you ship outcomes, not invoices.',
        cta
      );
      expect(description).toContain(cta);
    });

    it('should truncate if too long', () => {
      const longText =
        'This is a very long description that exceeds the maximum character limit for SEO meta descriptions and should be truncated to fit within the 160 character limit';
      const description = generateMetaDescription(longText);
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it('should pad if too short', () => {
      const description = generateMetaDescription('Short');
      expect(description.length).toBeGreaterThanOrEqual(150);
    });
  });

  describe('validateMetaTitle', () => {
    it('should validate a correct title', () => {
      const title = generateMetaTitle('AI Agent Pricing');
      const result = validateMetaTitle(title);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect title too short', () => {
      const result = validateMetaTitle('Short');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('too short'))).toBe(true);
    });

    it('should detect title too long', () => {
      const result = validateMetaTitle('This is a very long title that exceeds the maximum character limit');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('too long'))).toBe(true);
    });

    it('should detect special characters', () => {
      const result = validateMetaTitle('AI Agent <Pricing> — AskScrooge');
      expect(result.warnings.some((w) => w.includes('special characters'))).toBe(true);
    });
  });

  describe('validateMetaDescription', () => {
    it('should validate a correct description', () => {
      const description = generateMetaDescription(
        'Stop guessing what to charge for your AI agent. AskScrooge gives you pricing models, billing infra, and ROI dashboards so you ship outcomes, not invoices.'
      );
      const result = validateMetaDescription(description);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect description too short', () => {
      const result = validateMetaDescription('Short');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('too short'))).toBe(true);
    });

    it('should detect description too long', () => {
      const longText =
        'This is a very long description that exceeds the maximum character limit for SEO meta descriptions and should be flagged as invalid because it is too long';
      const result = validateMetaDescription(longText);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('too long'))).toBe(true);
    });
  });

  describe('sanitizeMetaTag', () => {
    it('should remove angle brackets', () => {
      const result = sanitizeMetaTag('AI Agent <Pricing>');
      expect(result).toBe('AI Agent Pricing');
    });

    it('should escape quotes', () => {
      const result = sanitizeMetaTag('AI Agent "Pricing"');
      expect(result).toBe('AI Agent &quot;Pricing&quot;');
    });

    it('should escape ampersands', () => {
      const result = sanitizeMetaTag('AI & Pricing');
      expect(result).toBe('AI &amp; Pricing');
    });

    it('should trim whitespace', () => {
      const result = sanitizeMetaTag('  AI Agent Pricing  ');
      expect(result).toBe('AI Agent Pricing');
    });
  });

  describe('areMetaTitlesUnique', () => {
    it('should return true for unique titles', () => {
      const titles = ['Title 1', 'Title 2', 'Title 3'];
      expect(areMetaTitlesUnique(titles)).toBe(true);
    });

    it('should return false for duplicate titles', () => {
      const titles = ['Title 1', 'Title 2', 'Title 1'];
      expect(areMetaTitlesUnique(titles)).toBe(false);
    });

    it('should return true for single title', () => {
      const titles = ['Title 1'];
      expect(areMetaTitlesUnique(titles)).toBe(true);
    });

    it('should return true for empty array', () => {
      const titles: string[] = [];
      expect(areMetaTitlesUnique(titles)).toBe(true);
    });
  });

  describe('extractPrimaryKeyword', () => {
    it('should extract keyword from title', () => {
      const title = 'AI Agent Pricing — AskScrooge';
      const keyword = extractPrimaryKeyword(title);
      expect(keyword).toBe('AI Agent Pricing');
    });

    it('should handle titles with multiple dashes', () => {
      const title = 'AI Agent – Pricing – AskScrooge';
      const keyword = extractPrimaryKeyword(title);
      expect(keyword).toBeTruthy();
    });
  });

  describe('isKeywordInTitle', () => {
    it('should find keyword in title', () => {
      const title = 'AI Agent Pricing — AskScrooge';
      expect(isKeywordInTitle(title, 'AI Agent')).toBe(true);
    });

    it('should be case insensitive', () => {
      const title = 'AI Agent Pricing — AskScrooge';
      expect(isKeywordInTitle(title, 'ai agent')).toBe(true);
    });

    it('should return false if keyword not found', () => {
      const title = 'AI Agent Pricing — AskScrooge';
      expect(isKeywordInTitle(title, 'Billing')).toBe(false);
    });
  });

  describe('isKeywordInDescription', () => {
    it('should find keyword in description', () => {
      const description = 'Stop guessing what to charge for your AI agent';
      expect(isKeywordInDescription(description, 'AI agent')).toBe(true);
    });

    it('should be case insensitive', () => {
      const description = 'Stop guessing what to charge for your AI agent';
      expect(isKeywordInDescription(description, 'AI AGENT')).toBe(true);
    });

    it('should return false if keyword not found', () => {
      const description = 'Stop guessing what to charge for your AI agent';
      expect(isKeywordInDescription(description, 'Billing')).toBe(false);
    });
  });

  describe('validateMetaTagConsistency', () => {
    it('should validate consistent meta tags', () => {
      const titles = [
        'AI Agent Pricing — AskScrooge',
        'Research Agent Pricing — AskScrooge',
        'Support Agent Pricing — AskScrooge',
      ];
      const descriptions = [
        'Stop guessing what to charge for your AI agent. AskScrooge gives you pricing models, billing infra, and ROI dashboards so you ship outcomes, not invoices.',
        'Monetize your research agent with outcome-based pricing. Learn pricing strategies, billing models, and ROI optimization for research automation.',
        'Monetize your support agent with outcome-based pricing. Learn pricing strategies, billing models, and ROI optimization for support automation.',
      ];

      const result = validateMetaTagConsistency(titles, descriptions);
      expect(result.hasConsistentFormat).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect inconsistent brand names', () => {
      const titles = [
        'AI Agent Pricing — AskScrooge',
        'Research Agent Pricing',
        'Support Agent Pricing — AskScrooge',
      ];
      const descriptions: string[] = [];

      const result = validateMetaTagConsistency(titles, descriptions);
      expect(result.hasConsistentFormat).toBe(false);
      expect(result.issues.some((i) => i.includes('brand name'))).toBe(true);
    });

    it('should detect inconsistent separators', () => {
      const titles = [
        'AI Agent Pricing — AskScrooge',
        'Research Agent Pricing - AskScrooge',
        'Support Agent Pricing — AskScrooge',
      ];
      const descriptions: string[] = [];

      const result = validateMetaTagConsistency(titles, descriptions);
      expect(result.hasConsistentFormat).toBe(false);
      expect(result.issues.some((i) => i.includes('separator'))).toBe(true);
    });
  });
});
