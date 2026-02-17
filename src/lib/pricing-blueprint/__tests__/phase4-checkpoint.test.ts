import { describe, it, expect, beforeEach } from 'vitest';
import { TelemetryMapper } from '../telemetry-mapper';
import { BillingIntegration } from '../billing-integration';
import { Blueprint, Meter, Tier, Archetype } from '../types';

describe('Phase 4: Telemetry Mapping and Billing Integration', () => {
  let telemetryMapper: TelemetryMapper;
  let billingIntegration: BillingIntegration;

  beforeEach(() => {
    telemetryMapper = new TelemetryMapper();
    billingIntegration = new BillingIntegration();
  });

  // Helper function to create test blueprint
  const createTestBlueprint = (): Blueprint => ({
    id: 'test-blueprint-1',
    archetypeId: 'archetype-1',
    archetype: {
      id: 'archetype-1',
      name: 'Test Agent',
      description: 'Test agent for pricing',
      category: 'AI Agent',
      primaryUseCase: 'Document Processing',
      targetICP: 'Enterprise',
      keyFeatures: ['Feature 1', 'Feature 2'],
      estimatedMarketSize: 1000000,
      tokenConsumption: 'high',
      userBaseSize: 5000,
      growthPotential: 0.25,
      priority: 1,
      similarArchetypes: [],
      metadata: {},
    } as Archetype,
    agentProfile: {
      name: 'Test Agent',
      description: 'Test agent',
      primaryUseCase: 'Document Processing',
      targetICP: 'Enterprise',
      keyFeatures: ['Feature 1'],
      estimatedMarketSize: 1000000,
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
        description: 'Starter tier',
        price: 99,
        billingCycle: 'monthly',
        features: [{ name: 'Feature 1', description: 'Feature 1', included: true }],
        usageLimits: [
          {
            meter: 'meter-1',
            limit: 1000,
            overage: { type: 'per-unit', price: 0.1 },
          },
        ],
        targetSegment: 'Small Business',
      },
      {
        id: 'tier-2',
        name: 'Professional',
        description: 'Professional tier',
        price: 299,
        billingCycle: 'monthly',
        features: [
          { name: 'Feature 1', description: 'Feature 1', included: true },
          { name: 'Feature 2', description: 'Feature 2', included: true },
        ],
        usageLimits: [
          {
            meter: 'meter-1',
            limit: 10000,
            overage: { type: 'per-unit', price: 0.05 },
          },
        ],
        targetSegment: 'Mid-Market',
      },
    ],
    meters: [
      {
        id: 'meter-1',
        name: 'API Calls',
        description: 'Number of API calls',
        unit: 'calls',
        telemetryMapping: {
          meter: {
            id: 'meter-1',
            name: 'API Calls',
            description: 'Number of API calls',
            unit: 'calls',
            telemetryMapping: {} as any,
            accuracy: 95,
            fraudRisk: 'medium',
          },
          telemetryEvents: [],
          existingEvents: [],
          newEventsRequired: [],
          implementationGuidance: '',
          estimatedEffort: 0,
          fraudMitigations: [],
        },
        accuracy: 95,
        fraudRisk: 'medium',
      },
      {
        id: 'meter-2',
        name: 'Tokens Used',
        description: 'Number of tokens used',
        unit: 'tokens',
        telemetryMapping: {
          meter: {
            id: 'meter-2',
            name: 'Tokens Used',
            description: 'Number of tokens used',
            unit: 'tokens',
            telemetryMapping: {} as any,
            accuracy: 98,
            fraudRisk: 'low',
          },
          telemetryEvents: [],
          existingEvents: [],
          newEventsRequired: [],
          implementationGuidance: '',
          estimatedEffort: 0,
          fraudMitigations: [],
        },
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
      risks: [],
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

  describe('Telemetry Mapper', () => {
    it('should create telemetry mapping for a meter', () => {
      const meter: Meter = {
        id: 'meter-1',
        name: 'API Calls',
        description: 'Number of API calls',
        unit: 'calls',
        telemetryMapping: {} as any,
        accuracy: 95,
        fraudRisk: 'medium',
      };

      const mapping = telemetryMapper.createMapping(meter);

      expect(mapping).toBeDefined();
      expect(mapping.meter).toEqual(meter);
      expect(mapping.telemetryEvents).toBeDefined();
      expect(Array.isArray(mapping.telemetryEvents)).toBe(true);
      expect(mapping.existingEvents).toBeDefined();
      expect(mapping.newEventsRequired).toBeDefined();
      expect(mapping.implementationGuidance).toBeDefined();
      expect(mapping.estimatedEffort).toBeGreaterThanOrEqual(0);
      expect(mapping.fraudMitigations).toBeDefined();
    });

    it('should identify existing telemetry events for a blueprint', () => {
      const blueprint = createTestBlueprint();
      const existing = telemetryMapper.identifyExistingEvents(blueprint);

      expect(Array.isArray(existing)).toBe(true);
      expect(existing.length).toBeGreaterThan(0);
      existing.forEach((event) => {
        expect(event.name).toBeDefined();
        expect(event.description).toBeDefined();
        expect(event.frequency).toMatch(/high|medium|low/);
        expect(event.accuracy).toBeGreaterThanOrEqual(0);
        expect(event.accuracy).toBeLessThanOrEqual(100);
      });
    });

    it('should identify missing telemetry events for a blueprint', () => {
      const blueprint = createTestBlueprint();
      const missing = telemetryMapper.identifyMissingEvents(blueprint);

      expect(Array.isArray(missing)).toBe(true);
      missing.forEach((event) => {
        expect(event.name).toBeDefined();
        expect(event.description).toBeDefined();
        expect(event.frequency).toMatch(/high|medium|low/);
        expect(event.estimatedEffort).toBeGreaterThan(0);
        expect(event.complexity).toMatch(/low|medium|high/);
      });
    });

    it('should estimate implementation effort for a blueprint', () => {
      const blueprint = createTestBlueprint();
      const effort = telemetryMapper.estimateImplementationEffort(blueprint);

      expect(effort).toBeDefined();
      expect(effort.totalHours).toBeGreaterThan(0);
      expect(effort.byComplexity).toBeDefined();
      expect(effort.byComplexity.low).toBeGreaterThanOrEqual(0);
      expect(effort.byComplexity.medium).toBeGreaterThanOrEqual(0);
      expect(effort.byComplexity.high).toBeGreaterThanOrEqual(0);
      expect(effort.estimatedTeamDays).toBeGreaterThan(0);
      expect(Array.isArray(effort.riskFactors)).toBe(true);
    });

    it('should validate observability of a meter', () => {
      const meter: Meter = {
        id: 'meter-1',
        name: 'API Calls',
        description: 'Number of API calls',
        unit: 'calls',
        telemetryMapping: {} as any,
        accuracy: 95,
        fraudRisk: 'medium',
      };

      const result = telemetryMapper.validateObservability(meter);

      expect(result).toBeDefined();
      expect(result.meter).toEqual(meter);
      expect(typeof result.isObservable).toBe('boolean');
      expect(result.accuracy).toBeGreaterThanOrEqual(0);
      expect(result.accuracy).toBeLessThanOrEqual(100);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(Array.isArray(result.gaps)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('should identify fraud vectors for a blueprint', () => {
      const blueprint = createTestBlueprint();
      const vectors = telemetryMapper.identifyFraudVectors(blueprint);

      expect(Array.isArray(vectors)).toBe(true);
      vectors.forEach((vector) => {
        expect(vector.id).toBeDefined();
        expect(vector.description).toBeDefined();
        expect(vector.likelihood).toMatch(/low|medium|high/);
        expect(vector.impact).toMatch(/low|medium|high/);
        expect(vector.mitigation).toBeDefined();
        expect(vector.meter).toBeDefined();
      });
    });
  });

  describe('Billing Integration', () => {
    it('should generate billing configuration for a blueprint', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');

      expect(config).toBeDefined();
      expect(config.blueprintId).toBe(blueprint.id);
      expect(config.provider).toBe('stripe');
      expect(Array.isArray(config.meters)).toBe(true);
      expect(config.meters.length).toBeGreaterThan(0);
      expect(Array.isArray(config.tiers)).toBe(true);
      expect(config.tiers.length).toBeGreaterThan(0);
      expect(Array.isArray(config.alerts)).toBe(true);
      expect(Array.isArray(config.throttleRules)).toBe(true);
      expect(Array.isArray(config.fairUsePolicies)).toBe(true);
      expect(Array.isArray(config.abuseDetectionRules)).toBe(true);
      expect(config.metadata).toBeDefined();
      expect(config.metadata.status).toBe('draft');
    });

    it('should generate meter configurations', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');

      config.meters.forEach((meter) => {
        expect(meter.meterId).toBeDefined();
        expect(meter.meterName).toBeDefined();
        expect(meter.unit).toBeDefined();
        expect(meter.aggregationType).toMatch(/sum|max|count/);
        expect(meter.reportingFrequency).toMatch(/hourly|daily|monthly/);
        expect(meter.accuracy).toBeGreaterThanOrEqual(0);
        expect(meter.accuracy).toBeLessThanOrEqual(100);
      });
    });

    it('should generate tier configurations', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');

      config.tiers.forEach((tier) => {
        expect(tier.tierId).toBeDefined();
        expect(tier.tierName).toBeDefined();
        expect(tier.price).toBeGreaterThan(0);
        expect(tier.billingCycle).toMatch(/monthly|annual/);
        expect(Array.isArray(tier.features)).toBe(true);
        expect(Array.isArray(tier.usageLimits)).toBe(true);
      });
    });

    it('should generate billing alerts', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');

      expect(config.alerts.length).toBeGreaterThan(0);
      config.alerts.forEach((alert) => {
        expect(alert.meterId).toBeDefined();
        expect(alert.threshold).toBeGreaterThan(0);
        expect(alert.alertType).toMatch(/warning|critical/);
        expect(alert.action).toMatch(/notify|throttle|block/);
        expect(alert.message).toBeDefined();
      });
    });

    it('should generate throttle rules', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');

      config.throttleRules.forEach((rule) => {
        expect(rule.meterId).toBeDefined();
        expect(rule.threshold).toBeGreaterThan(0);
        expect(rule.throttlePercentage).toBeGreaterThan(0);
        expect(rule.throttlePercentage).toBeLessThanOrEqual(100);
        expect(rule.duration).toBeGreaterThan(0);
        expect(rule.resetCondition).toMatch(/time|manual/);
      });
    });

    it('should generate fair use policies', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');

      expect(config.fairUsePolicies.length).toBeGreaterThan(0);
      config.fairUsePolicies.forEach((policy) => {
        expect(typeof policy).toBe('string');
        expect(policy.length).toBeGreaterThan(0);
      });
    });

    it('should generate abuse detection rules', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');

      expect(config.abuseDetectionRules.length).toBeGreaterThan(0);
      config.abuseDetectionRules.forEach((rule) => {
        expect(typeof rule).toBe('string');
        expect(rule.length).toBeGreaterThan(0);
      });
    });

    it('should validate billing configuration', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');
      const validation = billingIntegration.validateBillingConfiguration(config);

      expect(validation).toBeDefined();
      expect(typeof validation.valid).toBe('boolean');
      expect(Array.isArray(validation.errors)).toBe(true);
      expect(Array.isArray(validation.warnings)).toBe(true);
      expect(Array.isArray(validation.suggestions)).toBe(true);
    });

    it('should export configuration as JSON', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');
      const json = billingIntegration.exportConfiguration(config, 'json');

      expect(typeof json).toBe('string');
      expect(json.length).toBeGreaterThan(0);
      const parsed = JSON.parse(json);
      expect(parsed.blueprintId).toBe(blueprint.id);
      expect(parsed.provider).toBe('stripe');
    });

    it('should export configuration as YAML', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');
      const yaml = billingIntegration.exportConfiguration(config, 'yaml');

      expect(typeof yaml).toBe('string');
      expect(yaml.length).toBeGreaterThan(0);
      expect(yaml).toContain('blueprintId:');
      expect(yaml).toContain('provider:');
      expect(yaml).toContain('meters:');
      expect(yaml).toContain('tiers:');
    });

    it('should support multiple billing providers', () => {
      const blueprint = createTestBlueprint();

      const stripeConfig = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');
      expect(stripeConfig.provider).toBe('stripe');

      const zuoraConfig = billingIntegration.generateBillingConfiguration(blueprint, 'zuora');
      expect(zuoraConfig.provider).toBe('zuora');

      const customConfig = billingIntegration.generateBillingConfiguration(blueprint, 'custom');
      expect(customConfig.provider).toBe('custom');
    });

    it('should get provider adapter', () => {
      const stripeAdapter = billingIntegration.getProviderAdapter('stripe');
      expect(stripeAdapter).toBeDefined();
      expect(stripeAdapter.name).toBe('Stripe');

      const zuoraAdapter = billingIntegration.getProviderAdapter('zuora');
      expect(zuoraAdapter).toBeDefined();
      expect(zuoraAdapter.name).toBe('Zuora');

      const customAdapter = billingIntegration.getProviderAdapter('custom');
      expect(customAdapter).toBeDefined();
      expect(customAdapter.name).toBe('Custom');
    });

    it('should generate provider-specific configurations', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');
      const stripeAdapter = billingIntegration.getProviderAdapter('stripe');
      const providerConfig = stripeAdapter.generateProviderConfig(config);

      expect(providerConfig).toBeDefined();
      expect(providerConfig.products).toBeDefined();
      expect(providerConfig.meters).toBeDefined();
      expect(Array.isArray(providerConfig.products)).toBe(true);
      expect(Array.isArray(providerConfig.meters)).toBe(true);
    });

    it('should validate provider configurations', () => {
      const blueprint = createTestBlueprint();
      const config = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');
      const stripeAdapter = billingIntegration.getProviderAdapter('stripe');
      const providerConfig = stripeAdapter.generateProviderConfig(config);
      const isValid = stripeAdapter.validateProviderConfig(providerConfig);

      expect(typeof isValid).toBe('boolean');
      expect(isValid).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete telemetry and billing workflow', () => {
      const blueprint = createTestBlueprint();

      // Step 1: Map telemetry
      const telemetryMappings = blueprint.meters.map((meter) => telemetryMapper.createMapping(meter));
      expect(telemetryMappings.length).toBeGreaterThan(0);

      // Step 2: Estimate implementation effort
      const effort = telemetryMapper.estimateImplementationEffort(blueprint);
      expect(effort.totalHours).toBeGreaterThan(0);

      // Step 3: Generate billing configuration
      const billingConfig = billingIntegration.generateBillingConfiguration(blueprint, 'stripe');
      expect(billingConfig).toBeDefined();

      // Step 4: Validate billing configuration
      const validation = billingIntegration.validateBillingConfiguration(billingConfig);
      expect(validation).toBeDefined();
    });

    it('should handle multiple blueprints in batch', () => {
      const blueprints = [createTestBlueprint(), createTestBlueprint()];
      blueprints[1].id = 'test-blueprint-2';

      const results = blueprints.map((blueprint) => ({
        blueprint,
        telemetryMapping: telemetryMapper.identifyExistingEvents(blueprint),
        billingConfig: billingIntegration.generateBillingConfiguration(blueprint, 'stripe'),
      }));

      expect(results.length).toBe(2);
      results.forEach((result) => {
        expect(result.blueprint).toBeDefined();
        expect(result.telemetryMapping).toBeDefined();
        expect(result.billingConfig).toBeDefined();
      });
    });
  });
});
