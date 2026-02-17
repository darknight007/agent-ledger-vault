import { describe, it, expect } from 'vitest';
import {
  generateOrganizationSchema,
  generateProductSchema,
  generateArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateLocalBusinessSchema,
  validateSchema,
  schemaToJSON,
  createSchemaScript,
} from './structured-data';

describe('Structured Data (JSON-LD) Generators', () => {
  describe('generateOrganizationSchema', () => {
    it('should generate valid organization schema', () => {
      const schema = generateOrganizationSchema({
        name: 'AskScrooge',
        description: 'Monetary middleware for AI agents',
        url: 'https://askscrooge.com',
        logo: 'https://askscrooge.com/logo.svg',
      });

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('AskScrooge');
      expect(schema.description).toBe('Monetary middleware for AI agents');
      expect(schema.url).toBe('https://askscrooge.com');
      expect(schema.logo).toBe('https://askscrooge.com/logo.svg');
    });

    it('should include optional fields when provided', () => {
      const schema = generateOrganizationSchema({
        name: 'AskScrooge',
        description: 'Monetary middleware for AI agents',
        url: 'https://askscrooge.com',
        logo: 'https://askscrooge.com/logo.svg',
        email: 'hello@askscrooge.com',
        phone: '+1-555-0123',
        socialProfiles: ['https://twitter.com/agentfi', 'https://linkedin.com/company/askscrooge'],
      });

      expect(schema.email).toBe('hello@askscrooge.com');
      expect(schema.telephone).toBe('+1-555-0123');
      expect(schema.sameAs).toHaveLength(2);
    });
  });

  describe('generateProductSchema', () => {
    it('should generate valid product schema', () => {
      const schema = generateProductSchema({
        name: 'Research Agent Pricing Blueprint',
        description: 'Monetize your research agent',
        url: 'https://askscrooge.com/pricing-blueprints/research-agent',
        image: 'https://askscrooge.com/og-image.svg',
      });

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe('Research Agent Pricing Blueprint');
      expect(schema.description).toBe('Monetize your research agent');
    });

    it('should include pricing information when provided', () => {
      const schema = generateProductSchema({
        name: 'Research Agent Pricing Blueprint',
        description: 'Monetize your research agent',
        url: 'https://askscrooge.com/pricing-blueprints/research-agent',
        price: '99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      });

      expect(schema.offers).toBeDefined();
      expect(schema.offers.price).toBe('99');
      expect(schema.offers.priceCurrency).toBe('USD');
    });

    it('should include rating information when provided', () => {
      const schema = generateProductSchema({
        name: 'Research Agent Pricing Blueprint',
        description: 'Monetize your research agent',
        url: 'https://askscrooge.com/pricing-blueprints/research-agent',
        rating: 4.5,
        reviewCount: 100,
      });

      expect(schema.aggregateRating).toBeDefined();
      expect(schema.aggregateRating.ratingValue).toBe(4.5);
      expect(schema.aggregateRating.reviewCount).toBe(100);
    });
  });

  describe('generateArticleSchema', () => {
    it('should generate valid article schema', () => {
      const schema = generateArticleSchema({
        headline: 'How to Price Your AI Agent',
        description: 'A comprehensive guide to pricing AI agents',
        url: 'https://askscrooge.com/blog/pricing-guide',
        author: 'AskScrooge',
        datePublished: '2024-01-01T00:00:00Z',
      });

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Article');
      expect(schema.headline).toBe('How to Price Your AI Agent');
      expect(schema.author.name).toBe('AskScrooge');
    });

    it('should include optional fields when provided', () => {
      const schema = generateArticleSchema({
        headline: 'How to Price Your AI Agent',
        description: 'A comprehensive guide to pricing AI agents',
        url: 'https://askscrooge.com/blog/pricing-guide',
        image: 'https://askscrooge.com/blog-image.jpg',
        author: 'AskScrooge',
        datePublished: '2024-01-01T00:00:00Z',
        dateModified: '2024-01-15T00:00:00Z',
        publisher: 'AskScrooge',
      });

      expect(schema.image).toBe('https://askscrooge.com/blog-image.jpg');
      expect(schema.dateModified).toBe('2024-01-15T00:00:00Z');
      expect(schema.publisher.name).toBe('AskScrooge');
    });
  });

  describe('generateFAQSchema', () => {
    it('should generate valid FAQ schema', () => {
      const faqs = [
        { question: 'What is AskScrooge?', answer: 'AskScrooge is a pricing platform for AI agents' },
        { question: 'How much does it cost?', answer: 'Pricing starts at $99/month' },
      ];

      const schema = generateFAQSchema(faqs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity[0].name).toBe('What is AskScrooge?');
      expect(schema.mainEntity[0].acceptedAnswer.text).toBe('AskScrooge is a pricing platform for AI agents');
    });

    it('should handle empty FAQ list', () => {
      const schema = generateFAQSchema([]);
      expect(schema.mainEntity).toHaveLength(0);
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate valid breadcrumb schema', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://askscrooge.com/' },
        { name: 'Pricing Blueprints', url: 'https://askscrooge.com/pricing-blueprints' },
        { name: 'Research Agent', url: 'https://askscrooge.com/pricing-blueprints/research-agent' },
      ];

      const schema = generateBreadcrumbSchema(breadcrumbs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[2].position).toBe(3);
    });
  });

  describe('generateLocalBusinessSchema', () => {
    it('should generate valid local business schema', () => {
      const schema = generateLocalBusinessSchema({
        name: 'AskScrooge',
        description: 'Monetary middleware for AI agents',
        address: '123 Main St, San Francisco, CA 94105',
        phone: '+1-555-0123',
        url: 'https://askscrooge.com',
      });

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('LocalBusiness');
      expect(schema.name).toBe('AskScrooge');
      expect(schema.address.streetAddress).toBe('123 Main St, San Francisco, CA 94105');
    });

    it('should include optional fields when provided', () => {
      const schema = generateLocalBusinessSchema({
        name: 'AskScrooge',
        description: 'Monetary middleware for AI agents',
        address: '123 Main St, San Francisco, CA 94105',
        phone: '+1-555-0123',
        url: 'https://askscrooge.com',
        email: 'hello@askscrooge.com',
        latitude: 37.7749,
        longitude: -122.4194,
      });

      expect(schema.email).toBe('hello@askscrooge.com');
      expect(schema.geo.latitude).toBe(37.7749);
      expect(schema.geo.longitude).toBe(-122.4194);
    });
  });

  describe('validateSchema', () => {
    it('should validate correct schema', () => {
      const schema = generateOrganizationSchema({
        name: 'AskScrooge',
        description: 'Monetary middleware for AI agents',
        url: 'https://askscrooge.com',
        logo: 'https://askscrooge.com/logo.svg',
      });

      const result = validateSchema(schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing @context', () => {
      const schema = { '@type': 'Organization', name: 'AskScrooge' };
      const result = validateSchema(schema);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('@context'))).toBe(true);
    });

    it('should detect missing @type', () => {
      const schema = { '@context': 'https://schema.org', name: 'AskScrooge' };
      const result = validateSchema(schema);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('@type'))).toBe(true);
    });

    it('should detect missing required Organization fields', () => {
      const schema = { '@context': 'https://schema.org', '@type': 'Organization' };
      const result = validateSchema(schema);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('name'))).toBe(true);
    });
  });

  describe('schemaToJSON', () => {
    it('should convert schema to JSON string', () => {
      const schema = { '@context': 'https://schema.org', '@type': 'Organization', name: 'AskScrooge' };
      const json = schemaToJSON(schema);
      expect(typeof json).toBe('string');
      expect(JSON.parse(json)).toEqual(schema);
    });
  });

  describe('createSchemaScript', () => {
    it('should create valid script tag', () => {
      const schema = { '@context': 'https://schema.org', '@type': 'Organization', name: 'AskScrooge' };
      const script = createSchemaScript(schema);
      expect(script).toContain('<script type="application/ld+json">');
      expect(script).toContain('</script>');
      expect(script).toContain('AskScrooge');
    });
  });
});
