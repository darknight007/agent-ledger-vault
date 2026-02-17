/**
 * Phase 1 Checkpoint Tests
 * Verifies that data models, templates, and catalog systems work correctly
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Blueprint, Archetype, BlueprintMetadata } from '../types';
import { BlueprintTemplate } from '../blueprint-template';
import { ArchetypeCatalog, createSampleCatalog } from '../archetype-catalog';
import {
  validateBlueprint,
  validateArchetype,
  validateBlueprintCompleteness,
  validateTierDifferentiation,
  validateMetricObservability,
  calculateBlueprintQualityScore,
} from '../schema-validator';
import {
  InMemoryArchetypeStorage,
  ArchetypeStorageFactory,
  CachedArchetypeStorage,
} from '../archetype-storage';

describe('Phase 1 Checkpoint - Data Models and Catalog', () => {
  let catalog: ArchetypeCatalog;

  beforeEach(() => {
    catalog = createSampleCatalog();
  });

  // ========================================================================
  // Blueprint Template Tests
  // ========================================================================

  describe('Blueprint Template System', () => {
    it('should create a blueprint with default metadata', () => {
      const blueprint = BlueprintTemplate.createBlueprint(
        'test-archetype',
        'test-author'
      );

      expect(blueprint.metadata).toBeDefined();
      expect(blueprint.metadata?.status).toBe('draft');
      expect(blueprint.metadata?.version).toBe(1);
      expect(blueprint.metadata?.author).toBe('test-author');
      expect(blueprint.metadata?.qualityScore).toBe(0);
    });

    it('should convert blueprint to JSON and back', () => {
      const blueprint: Blueprint = {
        id: 'test-blueprint',
        archetypeId: 'test-archetype',
        archetype: {
          id: 'test-archetype',
          name: 'Test Archetype',
          description: 'A test archetype',
          category: 'Test',
          primaryUseCase: 'Testing',
          targetICP: 'Test ICP',
          keyFeatures: ['feature1', 'feature2'],
          estimatedMarketSize: 1000000,
          tokenConsumption: 'medium',
          userBaseSize: 1000,
          growthPotential: 0.8,
          priority: 50,
          similarArchetypes: [],
          metadata: {},
        },
        agentProfile: {
          name: 'Test Agent',
          description: 'A test agent',
          primaryUseCase: 'Testing',
          targetICP: 'Test ICP',
          keyFeatures: ['feature1'],
          estimatedMarketSize: 1000000,
          competitivePosition: 'Mid-market',
        },
        valueMetrics: [
          {
            id: 'metric1',
            name: 'Metric 1',
            description: 'Test metric',
            unit: 'count',
            measurable: true,
            observable: true,
            frequency: 'daily',
            examples: ['example1'],
          },
        ],
        pricingArchetype: {
          type: 'usage-based',
          rationale: 'Usage-based pricing makes sense',
          pros: ['pro1'],
          cons: ['con1'],
        },
        tiers: [
          {
            id: 'tier1',
            name: 'Starter',
            description: 'Starter tier',
            price: 99,
            billingCycle: 'monthly',
            features: [
              {
                name: 'Feature 1',
                description: 'Feature 1 description',
                included: true,
              },
            ],
            usageLimits: [],
            targetSegment: 'Startups',
          },
        ],
        meters: [
          {
            id: 'meter1',
            name: 'API Calls',
            description: 'Number of API calls',
            unit: 'calls',
            telemetryMapping: {
              meter: {} as any,
              telemetryEvents: [],
              existingEvents: [],
              newEventsRequired: [],
              implementationGuidance: 'Track API calls',
              estimatedEffort: 10,
              fraudMitigations: [],
            },
            accuracy: 95,
            fraudRisk: 'low',
          },
        ],
        calibration: {
          methodology: 'Market-based',
          benchmarkComparison: {
            proposedPrice: 99,
            marketAverage: 100,
            percentileRank: 50,
            isOutlier: false,
            recommendation: 'Price is competitive',
          },
          marketAlignment: 'Well-aligned',
          confidenceLevel: 0.8,
          assumptions: ['assumption1'],
        },
        risks: {
          risks: [],
          complianceIssues: [],
          fairnessAnalysis: 'Pricing is fair',
          mitigationStrategies: [],
        },
        recommendations: [],
        metadata: {
          createdDate: new Date(),
          lastUpdated: new Date(),
          author: 'test-author',
          status: 'draft',
          version: 1,
          qualityScore: 75,
        },
        markdownContent: '# Test Blueprint',
      };

      const json = BlueprintTemplate.toJSON(blueprint);
      expect(json).toBeDefined();
      expect(json).toContain('test-blueprint');

      const parsed = BlueprintTemplate.fromJSON(json);
      expect(parsed.id).toBe(blueprint.id);
      expect(parsed.metadata.author).toBe('test-author');
    });

    it('should convert blueprint to markdown', () => {
      const blueprint: Blueprint = {
        id: 'test-blueprint',
        archetypeId: 'test-archetype',
        archetype: {
          id: 'test-archetype',
          name: 'Test Archetype',
          description: 'A test archetype',
          category: 'Test',
          primaryUseCase: 'Testing',
          targetICP: 'Test ICP',
          keyFeatures: ['feature1'],
          estimatedMarketSize: 1000000,
          tokenConsumption: 'medium',
          userBaseSize: 1000,
          growthPotential: 0.8,
          priority: 50,
          similarArchetypes: [],
          metadata: {},
        },
        agentProfile: {
          name: 'Test Agent',
          description: 'A test agent',
          primaryUseCase: 'Testing',
          targetICP: 'Test ICP',
          keyFeatures: ['feature1'],
          estimatedMarketSize: 1000000,
          competitivePosition: 'Mid-market',
        },
        valueMetrics: [],
        pricingArchetype: {
          type: 'usage-based',
          rationale: 'Usage-based pricing',
          pros: [],
          cons: [],
        },
        tiers: [],
        meters: [],
        calibration: {
          methodology: 'Market-based',
          benchmarkComparison: {
            proposedPrice: 99,
            marketAverage: 100,
            percentileRank: 50,
            isOutlier: false,
            recommendation: 'Competitive',
          },
          marketAlignment: 'Well-aligned',
          confidenceLevel: 0.8,
          assumptions: [],
        },
        risks: {
          risks: [],
          complianceIssues: [],
          fairnessAnalysis: 'Fair',
          mitigationStrategies: [],
        },
        recommendations: [],
        metadata: {
          createdDate: new Date(),
          lastUpdated: new Date(),
          author: 'test-author',
          status: 'draft',
          version: 1,
          qualityScore: 75,
        },
        markdownContent: '# Test',
      };

      const markdown = BlueprintTemplate.toMarkdown(blueprint);
      expect(markdown).toContain('# Pricing Blueprint: Test Archetype');
      expect(markdown).toContain('Test Agent');
      expect(markdown).toContain('usage-based');
    });

    it('should update blueprint metadata', () => {
      const blueprint: Blueprint = {
        id: 'test',
        archetypeId: 'test',
        archetype: {} as any,
        agentProfile: {} as any,
        valueMetrics: [],
        pricingArchetype: {} as any,
        tiers: [],
        meters: [],
        calibration: {} as any,
        risks: {} as any,
        recommendations: [],
        metadata: {
          createdDate: new Date('2024-01-01'),
          lastUpdated: new Date('2024-01-01'),
          author: 'original',
          status: 'draft',
          version: 1,
          qualityScore: 50,
        },
        markdownContent: '',
      };

      const updated = BlueprintTemplate.updateMetadata(blueprint, {
        status: 'approved',
        qualityScore: 85,
      });

      expect(updated.metadata.status).toBe('approved');
      expect(updated.metadata.qualityScore).toBe(85);
      expect(updated.metadata.lastUpdated.getTime()).toBeGreaterThan(
        blueprint.metadata.lastUpdated.getTime()
      );
    });

    it('should increment blueprint version', () => {
      const blueprint: Blueprint = {
        id: 'test',
        archetypeId: 'test',
        archetype: {} as any,
        agentProfile: {} as any,
        valueMetrics: [],
        pricingArchetype: {} as any,
        tiers: [],
        meters: [],
        calibration: {} as any,
        risks: {} as any,
        recommendations: [],
        metadata: {
          createdDate: new Date(),
          lastUpdated: new Date(),
          author: 'test',
          status: 'draft',
          version: 1,
          qualityScore: 50,
        },
        markdownContent: '',
      };

      const incremented = BlueprintTemplate.incrementVersion(blueprint);
      expect(incremented.metadata.version).toBe(2);
    });
  });

  // ========================================================================
  // Archetype Catalog Tests
  // ========================================================================

  describe('Archetype Catalog System', () => {
    it('should have sample archetypes loaded', () => {
      expect(catalog.getCount()).toBeGreaterThan(0);
    });

    it('should retrieve archetype by ID', () => {
      const archetype = catalog.getArchetype('research-agent');
      expect(archetype).toBeDefined();
      expect(archetype?.name).toBe('Research Agent');
    });

    it('should list archetypes with filtering', () => {
      const research = catalog.listArchetypes({ category: 'Research' });
      expect(research.length).toBeGreaterThan(0);
      expect(research[0].category).toBe('Research');
    });

    it('should search archetypes by query', () => {
      const results = catalog.searchArchetypes('research');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain('Research');
    });

    it('should find similar archetypes', () => {
      const archetype = catalog.getArchetype('research-agent');
      if (archetype) {
        const similar = catalog.getSimilarArchetypes(archetype, 3);
        expect(similar.length).toBeGreaterThan(0);
        expect(similar[0].id).not.toBe(archetype.id);
      }
    });

    it('should get categories and use cases', () => {
      const categories = catalog.getCategories();
      expect(categories.length).toBeGreaterThan(0);

      const useCases = catalog.getUseCases();
      expect(useCases.length).toBeGreaterThan(0);
    });

    it('should get statistics', () => {
      const stats = catalog.getStatistics();
      expect(stats.totalCount).toBeGreaterThan(0);
      expect(stats.averageMarketSize).toBeGreaterThan(0);
      expect(stats.categories).toBeGreaterThan(0);
    });

    it('should export and import catalog', () => {
      const json = catalog.toJSON();
      expect(json).toBeDefined();
      expect(json).toContain('research-agent');

      const newCatalog = new ArchetypeCatalog();
      newCatalog.fromJSON(json);
      expect(newCatalog.getCount()).toBe(catalog.getCount());
    });

    it('should update archetype priority', () => {
      catalog.updatePriority('research-agent', 100);
      const archetype = catalog.getArchetype('research-agent');
      expect(archetype?.priority).toBe(100);
    });

    it('should get top archetypes by priority', () => {
      const top = catalog.getTopByPriority(3);
      expect(top.length).toBeLessThanOrEqual(3);
      if (top.length > 1) {
        expect(top[0].priority).toBeGreaterThanOrEqual(top[1].priority);
      }
    });
  });

  // ========================================================================
  // Schema Validation Tests
  // ========================================================================

  describe('Schema Validation', () => {
    it('should validate archetype schema', () => {
      const archetype = catalog.getArchetype('research-agent');
      if (archetype) {
        const result = validateArchetype(archetype);
        expect(result.valid).toBe(true);
      }
    });

    it('should detect invalid archetype', () => {
      const invalidArchetype = {
        id: 'invalid',
        name: '', // Empty name should fail
        description: 'Test',
        category: 'Test',
        primaryUseCase: 'Test',
        targetICP: 'Test',
        keyFeatures: [],
        estimatedMarketSize: 1000,
        tokenConsumption: 'medium',
        userBaseSize: 100,
        growthPotential: 0.5,
        priority: 50,
      };

      const result = validateArchetype(invalidArchetype as any);
      expect(result.valid).toBe(false);
    });

    it('should validate blueprint completeness', () => {
      const blueprint: Blueprint = {
        id: 'test',
        archetypeId: 'test',
        archetype: {} as any,
        agentProfile: {} as any,
        valueMetrics: [{ id: '1', name: 'test', description: 'test', unit: 'count', measurable: true, observable: true, frequency: 'daily', examples: [] }],
        pricingArchetype: {} as any,
        tiers: [{ id: '1', name: 'test', description: 'test', price: 100, billingCycle: 'monthly', features: [], usageLimits: [], targetSegment: 'test' }],
        meters: [{ id: '1', name: 'test', description: 'test', unit: 'count', telemetryMapping: {} as any, accuracy: 90, fraudRisk: 'low' }],
        calibration: {} as any,
        risks: {} as any,
        recommendations: [],
        metadata: {} as any,
        markdownContent: 'test',
      };

      const result = validateBlueprintCompleteness(blueprint);
      expect(result.complete).toBe(true); // All required fields are present
    });
  });

  // ========================================================================
  // Storage Tests
  // ========================================================================

  describe('Archetype Storage', () => {
    it('should save and load archetype from in-memory storage', async () => {
      const storage = new InMemoryArchetypeStorage();
      const archetype = catalog.getArchetype('research-agent');

      if (archetype) {
        await storage.save(archetype);
        const loaded = await storage.load(archetype.id);
        expect(loaded).toBeDefined();
        expect(loaded?.name).toBe(archetype.name);
      }
    });

    it('should check if archetype exists', async () => {
      const storage = new InMemoryArchetypeStorage();
      const archetype = catalog.getArchetype('research-agent');

      if (archetype) {
        await storage.save(archetype);
        const exists = await storage.exists(archetype.id);
        expect(exists).toBe(true);
      }
    });

    it('should delete archetype from storage', async () => {
      const storage = new InMemoryArchetypeStorage();
      const archetype = catalog.getArchetype('research-agent');

      if (archetype) {
        await storage.save(archetype);
        await storage.delete(archetype.id);
        const exists = await storage.exists(archetype.id);
        expect(exists).toBe(false);
      }
    });

    it('should use cached storage', async () => {
      const backend = new InMemoryArchetypeStorage();
      const cached = new CachedArchetypeStorage(backend, 1000);
      const archetype = catalog.getArchetype('research-agent');

      if (archetype) {
        await cached.save(archetype);
        const stats = (cached as any).getCacheStats();
        expect(stats.size).toBe(1);
      }
    });

    it('should create storage from factory', () => {
      const storage = ArchetypeStorageFactory.createInMemoryStorage();
      expect(storage).toBeDefined();
    });
  });

  // ========================================================================
  // Integration Tests
  // ========================================================================

  describe('Phase 1 Integration', () => {
    it('should have all required data models defined', () => {
      const archetype = catalog.getArchetype('research-agent');
      expect(archetype).toBeDefined();
      expect(archetype?.id).toBeDefined();
      expect(archetype?.name).toBeDefined();
      expect(archetype?.category).toBeDefined();
      expect(archetype?.keyFeatures).toBeDefined();
    });

    it('should support full blueprint lifecycle', () => {
      const blueprint = BlueprintTemplate.createBlueprint(
        'research-agent',
        'test-user'
      );
      expect(blueprint.metadata?.status).toBe('draft');

      const updated = BlueprintTemplate.updateMetadata(blueprint as Blueprint, {
        status: 'approved',
      });
      expect(updated.metadata?.status).toBe('approved');

      const incremented = BlueprintTemplate.incrementVersion(updated);
      expect(incremented.metadata?.version).toBe(2);
    });

    it('should validate catalog consistency', () => {
      const archetypes = catalog.listArchetypes();
      expect(archetypes.length).toBeGreaterThan(0);

      for (const archetype of archetypes) {
        const validation = validateArchetype(archetype);
        expect(validation.valid).toBe(true);
      }
    });
  });
});
