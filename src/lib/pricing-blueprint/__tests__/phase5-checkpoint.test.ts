import { describe, it, expect, beforeEach } from 'vitest';
import { PricingPageGenerator, BrandingConfig } from '../pricing-page-generator';
import { DocumentationGenerator } from '../documentation-generator';
import { VariantGenerator } from '../variant-generator';
import { Blueprint, Archetype } from '../types';

describe('Phase 5: Output Generation', () => {
  let pricingPageGenerator: PricingPageGenerator;
  let documentationGenerator: DocumentationGenerator;
  let variantGenerator: VariantGenerator;

  beforeEach(() => {
    pricingPageGenerator = new PricingPageGenerator();
    documentationGenerator = new DocumentationGenerator();
    variantGenerator = new VariantGenerator();
  });

  // Helper function to create test blueprint
  const createTestBlueprint = (): Blueprint => ({
    id: 'test-blueprint-1',
    archetypeId: 'archetype-1',
    archetype: {
      id: 'archetype-1',
      name: 'Document AI',
      description: 'AI-powered document processing',
      category: 'AI Agent',
      primaryUseCase: 'Document Processing',
      targetICP: 'Enterprise',
      keyFeatures: ['OCR', 'Classification', 'Extraction'],
      estimatedMarketSize: 5000000,
      tokenConsumption: 'high',
      userBaseSize: 10000,
      growthPotential: 0.3,
      priority: 1,
      similarArchetypes: [],
      metadata: {},
    } as Archetype,
    agentProfile: {
      name: 'Document AI',
      description: 'AI-powered document processing',
      primaryUseCase: 'Document Processing',
      targetICP: 'Enterprise',
      keyFeatures: ['OCR', 'Classification', 'Extraction'],
      estimatedMarketSize: 5000000,
      competitivePosition: 'Leader',
    },
    valueMetrics: [
      {
        id: 'metric-1',
        name: 'Documents Processed',
        description: 'Number of documents processed',
        unit: 'documents',
        measurable: true,
        observable: true,
        frequency: 'daily',
        examples: ['100 documents/day'],
      },
    ],
    pricingArchetype: {
      type: 'usage-based',
      rationale: 'Usage-based pricing aligns with customer value',
      pros: ['Aligns with usage', 'Fair pricing'],
      cons: ['Requires telemetry'],
    },
    tiers: [
      {
        id: 'tier-1',
        name: 'Starter',
        description: 'For small teams',
        price: 99,
        billingCycle: 'monthly',
        features: [
          { name: 'Basic OCR', description: 'Basic OCR', included: true },
          { name: 'Email Support', description: 'Email Support', included: true },
        ],
        usageLimits: [
          {
            meter: 'documents',
            limit: 1000,
            overage: { type: 'per-unit', price: 0.1 },
          },
        ],
        targetSegment: 'Small Business',
      },
      {
        id: 'tier-2',
        name: 'Professional',
        description: 'For growing teams',
        price: 299,
        billingCycle: 'monthly',
        features: [
          { name: 'Advanced OCR', description: 'Advanced OCR', included: true },
          { name: 'Classification', description: 'Classification', included: true },
          { name: 'Priority Support', description: 'Priority Support', included: true },
        ],
        usageLimits: [
          {
            meter: 'documents',
            limit: 10000,
            overage: { type: 'per-unit', price: 0.05 },
          },
        ],
        targetSegment: 'Mid-Market',
      },
      {
        id: 'tier-3',
        name: 'Enterprise',
        description: 'For large organizations',
        price: 999,
        billingCycle: 'monthly',
        features: [
          { name: 'Advanced OCR', description: 'Advanced OCR', included: true },
          { name: 'Classification', description: 'Classification', included: true },
          { name: 'Extraction', description: 'Extraction', included: true },
          { name: 'Dedicated Support', description: 'Dedicated Support', included: true },
        ],
        usageLimits: [
          {
            meter: 'documents',
            limit: 100000,
            overage: { type: 'per-unit', price: 0.02 },
          },
        ],
        targetSegment: 'Enterprise',
      },
    ],
    meters: [
      {
        id: 'meter-1',
        name: 'Documents Processed',
        description: 'Number of documents processed',
        unit: 'documents',
        telemetryMapping: {} as any,
        accuracy: 98,
        fraudRisk: 'low',
      },
    ],
    calibration: {
      methodology: 'Value-based pricing',
      benchmarkComparison: {
        proposedPrice: 99,
        marketAverage: 100,
        percentileRank: 50,
        isOutlier: false,
        recommendation: 'Pricing is competitive',
      },
      marketAlignment: 'Aligned with market',
      confidenceLevel: 0.85,
      assumptions: ['Assumption 1'],
    },
    risks: {
      risks: [
        {
          id: 'risk-1',
          description: 'High token consumption',
          severity: 'high',
          likelihood: 'medium',
          mitigation: 'Implement token limits',
        },
      ],
      complianceIssues: [],
      fairnessAnalysis: 'Fair pricing',
      mitigationStrategies: [],
    },
    recommendations: [],
    metadata: {
      createdDate: new Date(),
      lastUpdated: new Date(),
      author: 'Test',
      status: 'draft',
      version: 1,
      qualityScore: 85,
    },
    markdownContent: '',
    jsonSchema: {},
    pricingPage: '',
    documentation: {
      rationale: '',
      assumptions: [],
      tradeoffs: [],
      riskAssessment: '',
      implementationChecklist: [],
      faq: [],
      relatedResources: [],
    },
    variants: [],
  });

  const createBrandingConfig = (): BrandingConfig => ({
    primaryColor: '#0066cc',
    secondaryColor: '#00cc99',
    fontFamily: 'Segoe UI',
    logoUrl: 'https://example.com/logo.png',
    companyName: 'Document AI',
  });

  describe('Pricing Page Generator', () => {
    it('should generate a complete pricing page', () => {
      const blueprint = createTestBlueprint();
      const branding = createBrandingConfig();

      const html = pricingPageGenerator.generatePage({
        blueprint,
        branding,
        includeCalculator: true,
        includeComparison: true,
        includeFAQ: true,
      });

      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('</html>');
      expect(html).toContain(blueprint.archetype.name);
    });

    it('should include all tier cards', () => {
      const blueprint = createTestBlueprint();
      const branding = createBrandingConfig();

      const html = pricingPageGenerator.generatePage({
        blueprint,
        branding,
        includeCalculator: false,
        includeComparison: false,
        includeFAQ: false,
      });

      blueprint.tiers.forEach((tier) => {
        expect(html).toContain(tier.name);
        expect(html).toContain(`$${tier.price}`);
      });
    });

    it('should include pricing calculator when enabled', () => {
      const blueprint = createTestBlueprint();
      const branding = createBrandingConfig();

      const html = pricingPageGenerator.generatePage({
        blueprint,
        branding,
        includeCalculator: true,
        includeComparison: false,
        includeFAQ: false,
      });

      expect(html).toContain('Pricing Calculator');
      expect(html).toContain('Estimated Monthly Cost');
    });

    it('should include comparison table when enabled', () => {
      const blueprint = createTestBlueprint();
      const branding = createBrandingConfig();

      const html = pricingPageGenerator.generatePage({
        blueprint,
        branding,
        includeCalculator: false,
        includeComparison: true,
        includeFAQ: false,
      });

      expect(html).toContain('Feature Comparison');
      expect(html).toContain('<table');
    });

    it('should include FAQ when enabled', () => {
      const blueprint = createTestBlueprint();
      const branding = createBrandingConfig();

      const html = pricingPageGenerator.generatePage({
        blueprint,
        branding,
        includeCalculator: false,
        includeComparison: false,
        includeFAQ: true,
      });

      expect(html).toContain('Frequently Asked Questions');
      expect(html).toContain('Can I change my plan later?');
    });

    it('should apply branding colors', () => {
      const blueprint = createTestBlueprint();
      const branding = createBrandingConfig();

      const html = pricingPageGenerator.generatePage({
        blueprint,
        branding,
        includeCalculator: false,
        includeComparison: false,
        includeFAQ: false,
      });

      expect(html).toContain(branding.primaryColor);
      expect(html).toContain(branding.secondaryColor);
      expect(html).toContain(branding.fontFamily);
    });

    it('should be responsive', () => {
      const blueprint = createTestBlueprint();
      const branding = createBrandingConfig();

      const html = pricingPageGenerator.generatePage({
        blueprint,
        branding,
        includeCalculator: false,
        includeComparison: false,
        includeFAQ: false,
      });

      expect(html).toContain('viewport');
      expect(html).toContain('max-width');
    });
  });

  describe('Documentation Generator', () => {
    it('should generate full documentation', () => {
      const blueprint = createTestBlueprint();
      const doc = documentationGenerator.generateFullDocumentation(blueprint);

      expect(doc).toBeDefined();
      expect(doc.rationale).toBeDefined();
      expect(doc.assumptions).toBeDefined();
      expect(doc.tradeoffs).toBeDefined();
      expect(doc.riskAssessment).toBeDefined();
      expect(doc.implementationChecklist).toBeDefined();
      expect(doc.faq).toBeDefined();
      expect(doc.relatedResources).toBeDefined();
    });

    it('should generate rationale', () => {
      const blueprint = createTestBlueprint();
      const doc = documentationGenerator.generateFullDocumentation(blueprint);

      expect(doc.rationale.length).toBeGreaterThan(0);
      expect(doc.rationale).toContain(blueprint.archetype.name);
      expect(doc.rationale).toContain(blueprint.pricingArchetype.type);
    });

    it('should generate assumptions', () => {
      const blueprint = createTestBlueprint();
      const doc = documentationGenerator.generateFullDocumentation(blueprint);

      expect(Array.isArray(doc.assumptions)).toBe(true);
      expect(doc.assumptions.length).toBeGreaterThan(0);
      doc.assumptions.forEach((a) => {
        expect(typeof a).toBe('string');
        expect(a.length).toBeGreaterThan(0);
      });
    });

    it('should generate tradeoffs', () => {
      const blueprint = createTestBlueprint();
      const doc = documentationGenerator.generateFullDocumentation(blueprint);

      expect(Array.isArray(doc.tradeoffs)).toBe(true);
      expect(doc.tradeoffs.length).toBeGreaterThan(0);
      doc.tradeoffs.forEach((t) => {
        expect(typeof t).toBe('string');
        expect(t.length).toBeGreaterThan(0);
      });
    });

    it('should generate implementation checklist', () => {
      const blueprint = createTestBlueprint();
      const doc = documentationGenerator.generateFullDocumentation(blueprint);

      expect(Array.isArray(doc.implementationChecklist)).toBe(true);
      expect(doc.implementationChecklist.length).toBeGreaterThan(0);
      doc.implementationChecklist.forEach((item) => {
        expect(item.id).toBeDefined();
        expect(item.title).toBeDefined();
        expect(item.owner).toBeDefined();
        expect(item.priority).toMatch(/high|medium|low/);
      });
    });

    it('should generate FAQ', () => {
      const blueprint = createTestBlueprint();
      const doc = documentationGenerator.generateFullDocumentation(blueprint);

      expect(Array.isArray(doc.faq)).toBe(true);
      expect(doc.faq.length).toBeGreaterThan(0);
      doc.faq.forEach((item) => {
        expect(item.question).toBeDefined();
        expect(item.answer).toBeDefined();
      });
    });

    it('should generate markdown documentation', () => {
      const blueprint = createTestBlueprint();
      const markdown = documentationGenerator.generateMarkdownDocumentation(blueprint);

      expect(typeof markdown).toBe('string');
      expect(markdown.length).toBeGreaterThan(0);
      expect(markdown).toContain('# ');
      expect(markdown).toContain(blueprint.archetype.name);
    });

    it('should generate JSON documentation', () => {
      const blueprint = createTestBlueprint();
      const json = documentationGenerator.generateJSONDocumentation(blueprint);

      expect(typeof json).toBe('string');
      const parsed = JSON.parse(json);
      expect(parsed.blueprintId).toBe(blueprint.id);
      expect(parsed.archetypeName).toBe(blueprint.archetype.name);
      expect(parsed.documentation).toBeDefined();
    });
  });

  describe('Variant Generator', () => {
    it('should generate 3 variants', () => {
      const blueprint = createTestBlueprint();
      const variants = variantGenerator.generateVariants(blueprint);

      expect(Array.isArray(variants)).toBe(true);
      expect(variants.length).toBe(3);
    });

    it('should generate aggressive variant', () => {
      const blueprint = createTestBlueprint();
      const variants = variantGenerator.generateVariants(blueprint);
      const aggressive = variants.find((v) => v.name === 'Premium Positioning');

      expect(aggressive).toBeDefined();
      expect(aggressive?.tiers[0].price).toBeGreaterThan(blueprint.tiers[0].price);
      expect(aggressive?.pros.length).toBeGreaterThan(0);
      expect(aggressive?.cons.length).toBeGreaterThan(0);
    });

    it('should generate conservative variant', () => {
      const blueprint = createTestBlueprint();
      const variants = variantGenerator.generateVariants(blueprint);
      const conservative = variants.find((v) => v.name === 'Growth Positioning');

      expect(conservative).toBeDefined();
      expect(conservative?.tiers[0].price).toBeLessThan(blueprint.tiers[0].price);
      expect(conservative?.pros.length).toBeGreaterThan(0);
      expect(conservative?.cons.length).toBeGreaterThan(0);
    });

    it('should generate alternative archetype variant', () => {
      const blueprint = createTestBlueprint();
      const variants = variantGenerator.generateVariants(blueprint);
      const alternative = variants[2];

      expect(alternative).toBeDefined();
      expect(alternative.pricingArchetype).not.toBe(blueprint.pricingArchetype.type);
      expect(alternative.tiers.length).toBeGreaterThan(0);
    });

    it('should compare variants', () => {
      const blueprint = createTestBlueprint();
      const variants = variantGenerator.generateVariants(blueprint);
      const comparison = variantGenerator.compareVariants(variants);

      expect(comparison).toBeDefined();
      expect(comparison.variants.length).toBe(3);
      expect(comparison.analysis).toBeDefined();
      expect(comparison.analysis.revenueComparison).toBeDefined();
      expect(comparison.analysis.customerAcquisitionComparison).toBeDefined();
      expect(comparison.analysis.churnRiskComparison).toBeDefined();
      expect(comparison.analysis.recommendation).toBeDefined();
    });

    it('should estimate impact', () => {
      const blueprint = createTestBlueprint();
      const variants = variantGenerator.generateVariants(blueprint);
      const impact = variantGenerator.estimateImpact(variants[0], variants[1]);

      expect(impact).toBeDefined();
      expect(typeof impact.revenueImpact).toBe('number');
      expect(typeof impact.cacImpact).toBe('number');
      expect(typeof impact.churnRiskChange).toBe('number');
      expect(typeof impact.marketReachChange).toBe('number');
      expect(impact.implementationComplexity).toMatch(/low|medium|high/);
    });

    it('should generate variant report', () => {
      const blueprint = createTestBlueprint();
      const variants = variantGenerator.generateVariants(blueprint);
      const comparison = variantGenerator.compareVariants(variants);
      const report = variantGenerator.generateVariantReport(variants, comparison);

      expect(typeof report).toBe('string');
      expect(report.length).toBeGreaterThan(0);
      expect(report).toContain('# Pricing Variant Analysis');
      expect(report).toContain('## Variants');
      expect(report).toContain('## Comparison');
    });
  });

  describe('Integration Tests', () => {
    it('should generate complete output package', () => {
      const blueprint = createTestBlueprint();
      const branding = createBrandingConfig();

      // Generate pricing page
      const pricingPage = pricingPageGenerator.generatePage({
        blueprint,
        branding,
        includeCalculator: true,
        includeComparison: true,
        includeFAQ: true,
      });

      // Generate documentation
      const documentation = documentationGenerator.generateFullDocumentation(blueprint);
      const markdownDoc = documentationGenerator.generateMarkdownDocumentation(blueprint);

      // Generate variants
      const variants = variantGenerator.generateVariants(blueprint);
      const comparison = variantGenerator.compareVariants(variants);

      expect(pricingPage.length).toBeGreaterThan(0);
      expect(documentation).toBeDefined();
      expect(markdownDoc.length).toBeGreaterThan(0);
      expect(variants.length).toBe(3);
      expect(comparison).toBeDefined();
    });

    it('should handle multiple blueprints', () => {
      const blueprints = [createTestBlueprint(), createTestBlueprint()];
      blueprints[1].id = 'test-blueprint-2';
      blueprints[1].archetype.name = 'Video AI';

      const branding = createBrandingConfig();

      const results = blueprints.map((blueprint) => ({
        pricingPage: pricingPageGenerator.generatePage({
          blueprint,
          branding,
          includeCalculator: true,
          includeComparison: true,
          includeFAQ: true,
        }),
        documentation: documentationGenerator.generateFullDocumentation(blueprint),
        variants: variantGenerator.generateVariants(blueprint),
      }));

      expect(results.length).toBe(2);
      results.forEach((result) => {
        expect(result.pricingPage.length).toBeGreaterThan(0);
        expect(result.documentation).toBeDefined();
        expect(result.variants.length).toBe(3);
      });
    });
  });
});
