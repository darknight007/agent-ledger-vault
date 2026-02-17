/**
 * Phase 3 Checkpoint Tests
 * Verifies QA validation and benchmarking functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { QAValidator, QAReportGenerator } from '../qa-validator';
import { QualityScorer, BatchQualityScorer } from '../quality-scorer';
import { BenchmarkSystem, BenchmarkDataFactory } from '../benchmark-system';
import { createSampleCatalog } from '../archetype-catalog';
import { Blueprint } from '../types';

describe('Phase 3 Checkpoint - QA and Benchmarking', () => {
  let benchmarkSystem: BenchmarkSystem;
  let catalog = createSampleCatalog();
  let sampleBlueprint: Blueprint;

  beforeEach(() => {
    benchmarkSystem = BenchmarkDataFactory.createSampleBenchmarkSystem();
    catalog = createSampleCatalog();

    // Create a sample blueprint for testing
    const archetype = catalog.getArchetype('research-agent');
    if (archetype) {
      const now = new Date();
      sampleBlueprint = {
        id: 'test-bp',
        archetypeId: archetype.id,
        archetype,
        agentProfile: {
          name: archetype.name,
          description: archetype.description,
          primaryUseCase: archetype.primaryUseCase,
          targetICP: archetype.targetICP,
          keyFeatures: archetype.keyFeatures,
          estimatedMarketSize: archetype.estimatedMarketSize,
          competitivePosition: 'Market leader',
        },
        valueMetrics: [
          {
            id: 'vm1',
            name: 'Documents Processed',
            description: 'Number of documents processed',
            unit: 'documents',
            measurable: true,
            observable: true,
            frequency: 'daily',
            examples: ['100 docs/day'],
          },
          {
            id: 'vm2',
            name: 'Time Saved',
            description: 'Hours saved per month',
            unit: 'hours',
            measurable: true,
            observable: true,
            frequency: 'monthly',
            examples: ['40 hours/month'],
          },
        ],
        pricingArchetype: {
          type: 'usage-based',
          rationale: 'Usage-based pricing',
          pros: ['Scales with value'],
          cons: ['Complex billing'],
        },
        tiers: [
          {
            id: 't1',
            name: 'Starter',
            description: 'Starter tier',
            price: 99,
            billingCycle: 'monthly',
            features: [
              { name: 'Feature 1', description: 'Feature 1', included: true },
            ],
            usageLimits: [],
            targetSegment: 'Startups',
          },
          {
            id: 't2',
            name: 'Pro',
            description: 'Pro tier',
            price: 299,
            billingCycle: 'monthly',
            features: [
              { name: 'Feature 1', description: 'Feature 1', included: true },
              { name: 'Feature 2', description: 'Feature 2', included: true },
            ],
            usageLimits: [],
            targetSegment: 'Growing',
          },
        ],
        meters: [
          {
            id: 'm1',
            name: 'API Calls',
            description: 'API calls',
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
          createdDate: now,
          lastUpdated: now,
          author: 'test',
          status: 'draft',
          version: 1,
          qualityScore: 0,
        },
        markdownContent: 'test',
        jsonSchema: {},
      };
    }
  });

  // ========================================================================
  // QA Validator Tests
  // ========================================================================

  describe('QA Validator', () => {
    it('should validate a blueprint', () => {
      const result = QAValidator.validate(sampleBlueprint);

      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.checks.length).toBeGreaterThan(0);
    });

    it('should get validation summary', () => {
      const result = QAValidator.validate(sampleBlueprint);
      const summary = QAValidator.getSummary(result);

      expect(summary.status).toMatch(/pass|warning|fail/);
      expect(summary.message).toBeDefined();
      expect(summary.issueCount).toBeGreaterThanOrEqual(0);
    });

    it('should generate QA report', () => {
      const report = QAValidator.generateReport(sampleBlueprint);

      expect(report.blueprintId).toBe(sampleBlueprint.id);
      expect(report.validation).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.recommendations).toBeDefined();
    });

    it('should export report as markdown', () => {
      const report = QAValidator.generateReport(sampleBlueprint);
      const markdown = QAReportGenerator.toMarkdown(report);

      expect(markdown).toContain('QA Validation Report');
      expect(markdown).toContain(sampleBlueprint.id);
    });

    it('should export report as JSON', () => {
      const report = QAValidator.generateReport(sampleBlueprint);
      const json = QAReportGenerator.toJSON(report);

      expect(json).toContain(sampleBlueprint.id);
      expect(json).toContain('validation');
    });
  });

  // ========================================================================
  // Quality Scorer Tests
  // ========================================================================

  describe('Quality Scorer', () => {
    it('should calculate quality score', () => {
      const score = QualityScorer.calculateScore(sampleBlueprint);

      expect(score.overallScore).toBeGreaterThanOrEqual(0);
      expect(score.overallScore).toBeLessThanOrEqual(100);
      expect(score.completenessScore).toBeGreaterThanOrEqual(0);
      expect(score.consistencyScore).toBeGreaterThanOrEqual(0);
      expect(score.feasibilityScore).toBeGreaterThanOrEqual(0);
      expect(score.marketAlignmentScore).toBeGreaterThanOrEqual(0);
    });

    it('should get quality rating', () => {
      const rating = QualityScorer.getRating(85);

      expect(rating.rating).toBe('Excellent');
      expect(rating.description).toBeDefined();
      expect(rating.recommendation).toBeDefined();
    });

    it('should identify positive and negative factors', () => {
      const score = QualityScorer.calculateScore(sampleBlueprint);

      expect(score.factors.positive).toBeDefined();
      expect(score.factors.negative).toBeDefined();
      expect(Array.isArray(score.factors.positive)).toBe(true);
      expect(Array.isArray(score.factors.negative)).toBe(true);
    });

    it('should compare two blueprints', () => {
      const comparison = QualityScorer.compare(sampleBlueprint, sampleBlueprint);

      expect(comparison.blueprint1Score).toBeDefined();
      expect(comparison.blueprint2Score).toBeDefined();
      expect(comparison.winner).toMatch(/blueprint1|blueprint2|tie/);
      expect(comparison.difference).toBeGreaterThanOrEqual(0);
    });

    it('should generate quality report', () => {
      const report = QualityScorer.generateReport(sampleBlueprint);

      expect(report.blueprintId).toBe(sampleBlueprint.id);
      expect(report.score).toBeDefined();
      expect(report.rating).toBeDefined();
      expect(report.summary).toBeDefined();
    });
  });

  // ========================================================================
  // Batch Quality Scorer Tests
  // ========================================================================

  describe('Batch Quality Scorer', () => {
    it('should score multiple blueprints', () => {
      const blueprints = [sampleBlueprint, sampleBlueprint];
      const result = BatchQualityScorer.scoreBlueprints(blueprints);

      expect(result.blueprints.length).toBe(2);
      expect(result.statistics).toBeDefined();
      expect(result.statistics.averageScore).toBeGreaterThanOrEqual(0);
      expect(result.statistics.medianScore).toBeGreaterThanOrEqual(0);
    });

    it('should calculate statistics', () => {
      const blueprints = [sampleBlueprint];
      const result = BatchQualityScorer.scoreBlueprints(blueprints);

      expect(result.statistics.minScore).toBeLessThanOrEqual(result.statistics.maxScore);
      expect(result.statistics.excellentCount).toBeGreaterThanOrEqual(0);
      expect(result.statistics.goodCount).toBeGreaterThanOrEqual(0);
      expect(result.statistics.fairCount).toBeGreaterThanOrEqual(0);
      expect(result.statistics.poorCount).toBeGreaterThanOrEqual(0);
    });
  });

  // ========================================================================
  // Benchmark System Tests
  // ========================================================================

  describe('Benchmark System', () => {
    it('should register and retrieve benchmarks', () => {
      const benchmark = BenchmarkDataFactory.createSampleBenchmark('Research');
      benchmarkSystem.registerBenchmark('Research', benchmark);

      const retrieved = benchmarkSystem.getBenchmarks('Research');
      expect(retrieved).toBeDefined();
      expect(retrieved?.marketAverage).toBeGreaterThan(0);
    });

    it('should compare with benchmarks', () => {
      const result = benchmarkSystem.compareWithBenchmarks(sampleBlueprint);

      expect(result.category).toBeDefined();
      expect(result.comparison.proposedPrice).toBeGreaterThanOrEqual(0);
      expect(result.comparison.marketAverage).toBeGreaterThanOrEqual(0);
      expect(result.comparison.percentileRank).toBeGreaterThanOrEqual(0);
      expect(result.comparison.percentileRank).toBeLessThanOrEqual(100);
    });

    it('should identify outliers', () => {
      const analysis = benchmarkSystem.identifyOutliers(sampleBlueprint);

      expect(analysis.isOutlier).toBeDefined();
      expect(analysis.deviation).toBeGreaterThanOrEqual(0);
      expect(analysis.percentileRank).toBeGreaterThanOrEqual(0);
      expect(analysis.recommendation).toBeDefined();
    });

    it('should get pricing recommendations', () => {
      const recommendations = benchmarkSystem.getRecommendations(sampleBlueprint);

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);

      for (const rec of recommendations) {
        expect(rec.title).toBeDefined();
        expect(rec.suggestedPrice).toBeGreaterThanOrEqual(0);
        expect(rec.confidence).toBeGreaterThanOrEqual(0);
        expect(rec.confidence).toBeLessThanOrEqual(1);
      }
    });

    it('should get categories', () => {
      const categories = benchmarkSystem.getCategories();

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should create sample benchmark system', () => {
      const system = BenchmarkDataFactory.createSampleBenchmarkSystem();

      expect(system.getCategories().length).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // Integration Tests
  // ========================================================================

  describe('Phase 3 Integration', () => {
    it('should validate and score a blueprint', () => {
      const validation = QAValidator.validate(sampleBlueprint);
      const score = QualityScorer.calculateScore(sampleBlueprint);

      expect(validation.score).toBeDefined();
      expect(score.overallScore).toBeDefined();
    });

    it('should benchmark and validate a blueprint', () => {
      const comparison = benchmarkSystem.compareWithBenchmarks(sampleBlueprint);
      const validation = QAValidator.validate(sampleBlueprint);

      expect(comparison.comparison).toBeDefined();
      expect(validation.score).toBeDefined();
    });

    it('should generate comprehensive reports', () => {
      const qaReport = QAValidator.generateReport(sampleBlueprint);
      const scoreReport = QualityScorer.generateReport(sampleBlueprint);
      const benchmarkComparison = benchmarkSystem.compareWithBenchmarks(sampleBlueprint);

      expect(qaReport).toBeDefined();
      expect(scoreReport).toBeDefined();
      expect(benchmarkComparison).toBeDefined();
    });
  });
});
