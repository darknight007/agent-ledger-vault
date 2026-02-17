import { describe, it, expect } from 'vitest';
import {
  generateXRobotsTag,
  generateContentSummary,
  generateLLMMetadata,
  generateMachineReadableFacts,
  validateLLMMetadata,
  generateLLMCrawlerDirectives,
  createLLMRobotsTag,
  generateContentTypeIndicator,
  generateAuthorMetadata,
  generatePublicationDateMetadata,
  combineLLMMetadata,
} from './llm-metadata';

describe('LLM Metadata Generators', () => {
  describe('generateXRobotsTag', () => {
    it('should generate default X-Robots-Tag', () => {
      const tag = generateXRobotsTag({});
      expect(tag).toContain('Googlebot');
      expect(tag).toContain('Bingbot');
      expect(tag).toContain('Perplexity');
      expect(tag).toContain('Claude');
      expect(tag).toContain('ChatGPT');
    });

    it('should respect allow/disallow options', () => {
      const tag = generateXRobotsTag({
        allowGooglebot: false,
        allowPerplexity: true,
      });
      expect(tag).not.toContain('Googlebot');
      expect(tag).toContain('Perplexity');
    });

    it('should include noindex directive', () => {
      const tag = generateXRobotsTag({ noindex: true });
      expect(tag).toContain('noindex');
    });

    it('should include nofollow directive', () => {
      const tag = generateXRobotsTag({ nofollow: true });
      expect(tag).toContain('nofollow');
    });
  });

  describe('generateContentSummary', () => {
    it('should generate content summary', () => {
      const summary = generateContentSummary({
        title: 'AskScrooge',
        description: 'Pricing platform for AI agents',
        keywords: ['AI', 'pricing', 'agents'],
        contentType: 'product',
      });

      const parsed = JSON.parse(summary);
      expect(parsed.title).toBe('AskScrooge');
      expect(parsed.description).toBe('Pricing platform for AI agents');
      expect(parsed.keywords).toEqual(['AI', 'pricing', 'agents']);
      expect(parsed.contentType).toBe('product');
      expect(parsed.generatedAt).toBeDefined();
    });
  });

  describe('generateLLMMetadata', () => {
    it('should generate LLM metadata', () => {
      const metadata = generateLLMMetadata({
        contentType: 'product',
        topic: 'AI agent pricing',
        author: 'AskScrooge',
        publicationDate: '2024-01-01T00:00:00Z',
      });

      expect(metadata['llm:content-type']).toBe('product');
      expect(metadata['llm:topic']).toBe('AI agent pricing');
      expect(metadata['llm:author']).toBe('AskScrooge');
      expect(metadata['llm:publication-date']).toBe('2024-01-01T00:00:00Z');
    });

    it('should include facts when provided', () => {
      const metadata = generateLLMMetadata({
        contentType: 'product',
        topic: 'AI agent pricing',
        facts: { category: 'SaaS', industry: 'AI' },
      });

      expect(metadata['llm:facts']).toBeDefined();
      const facts = JSON.parse(metadata['llm:facts']);
      expect(facts.category).toBe('SaaS');
      expect(facts.industry).toBe('AI');
    });
  });

  describe('generateMachineReadableFacts', () => {
    it('should generate machine-readable facts', () => {
      const facts = generateMachineReadableFacts({
        category: 'SaaS',
        industry: 'AI',
        pricing: 'Subscription',
      });

      const parsed = JSON.parse(facts);
      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('Thing');
      expect(parsed.category).toBe('SaaS');
      expect(parsed.industry).toBe('AI');
      expect(parsed.pricing).toBe('Subscription');
    });
  });

  describe('validateLLMMetadata', () => {
    it('should validate correct LLM metadata', () => {
      const result = validateLLMMetadata({
        contentType: 'product',
        topic: 'AI agent pricing',
        author: 'AskScrooge',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing contentType', () => {
      const result = validateLLMMetadata({
        contentType: '' as any,
        topic: 'AI agent pricing',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('contentType'))).toBe(true);
    });

    it('should detect invalid contentType', () => {
      const result = validateLLMMetadata({
        contentType: 'invalid' as any,
        topic: 'AI agent pricing',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('contentType'))).toBe(true);
    });

    it('should detect missing topic', () => {
      const result = validateLLMMetadata({
        contentType: 'product',
        topic: '',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('topic'))).toBe(true);
    });

    it('should detect short topic', () => {
      const result = validateLLMMetadata({
        contentType: 'product',
        topic: 'AI',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('at least 5 characters'))).toBe(true);
    });

    it('should detect invalid publication date', () => {
      const result = validateLLMMetadata({
        contentType: 'product',
        topic: 'AI agent pricing',
        publicationDate: 'not-a-date',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('ISO 8601'))).toBe(true);
    });
  });

  describe('generateLLMCrawlerDirectives', () => {
    it('should generate crawler directives', () => {
      const directives = generateLLMCrawlerDirectives();
      expect(directives['Perplexity']).toBe('index, follow');
      expect(directives['Claude']).toBe('index, follow');
      expect(directives['ChatGPT']).toBe('index, follow');
      expect(directives['Bard']).toBe('index, follow');
      expect(directives['Copilot']).toBe('index, follow');
    });
  });

  describe('createLLMRobotsTag', () => {
    it('should create LLM robots tag', () => {
      const tag = createLLMRobotsTag();
      expect(tag).toContain('Perplexity');
      expect(tag).toContain('Claude');
      expect(tag).toContain('ChatGPT');
      expect(tag).toContain('index, follow');
    });
  });

  describe('generateContentTypeIndicator', () => {
    it('should generate product indicator', () => {
      const indicator = generateContentTypeIndicator('product');
      expect(indicator).toBe('Commercial Product');
    });

    it('should generate service indicator', () => {
      const indicator = generateContentTypeIndicator('service');
      expect(indicator).toBe('Service Offering');
    });

    it('should generate article indicator', () => {
      const indicator = generateContentTypeIndicator('article');
      expect(indicator).toBe('Informational Article');
    });

    it('should generate documentation indicator', () => {
      const indicator = generateContentTypeIndicator('documentation');
      expect(indicator).toBe('Technical Documentation');
    });
  });

  describe('generateAuthorMetadata', () => {
    it('should generate author metadata', () => {
      const metadata = generateAuthorMetadata('AskScrooge');
      expect(metadata['llm:author']).toBe('AskScrooge');
    });

    it('should include role when provided', () => {
      const metadata = generateAuthorMetadata('AskScrooge', 'Company');
      expect(metadata['llm:author']).toBe('AskScrooge');
      expect(metadata['llm:author-role']).toBe('Company');
    });
  });

  describe('generatePublicationDateMetadata', () => {
    it('should generate publication date metadata from string', () => {
      const metadata = generatePublicationDateMetadata('2024-01-01T00:00:00Z');
      expect(metadata['llm:publication-date']).toBe('2024-01-01T00:00:00Z');
      expect(metadata['llm:publication-date-human']).toBeDefined();
    });

    it('should generate publication date metadata from Date', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      const metadata = generatePublicationDateMetadata(date);
      expect(metadata['llm:publication-date']).toBe('2024-01-01T00:00:00Z');
      expect(metadata['llm:publication-date-human']).toBeDefined();
    });
  });

  describe('combineLLMMetadata', () => {
    it('should combine all LLM metadata', () => {
      const combined = combineLLMMetadata({
        contentType: 'product',
        topic: 'AI agent pricing',
        author: 'AskScrooge',
        publicationDate: '2024-01-01T00:00:00Z',
        facts: { category: 'SaaS' },
      });

      expect(combined['llm:content-type']).toBe('product');
      expect(combined['llm:topic']).toBe('AI agent pricing');
      expect(combined['llm:author']).toBe('AskScrooge');
      expect(combined['x-robots-tag']).toBeDefined();
      expect(combined['llm:content-type-indicator']).toBe('Commercial Product');
      expect(combined['llm:facts']).toBeDefined();
    });

    it('should use custom X-Robots-Tag if provided', () => {
      const combined = combineLLMMetadata(
        {
          contentType: 'product',
          topic: 'AI agent pricing',
        },
        'noindex, nofollow'
      );

      expect(combined['x-robots-tag']).toBe('noindex, nofollow');
    });
  });
});
