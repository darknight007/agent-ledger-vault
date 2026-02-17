import { describe, it, expect, beforeEach } from 'vitest';
import { BlueprintRepository } from '../blueprint-repository';
import { CalibrationSystem } from '../calibration-system';
import { FeedbackSystem } from '../feedback-system';
import { ComplianceSystem } from '../compliance-system';
import { Blueprint, Archetype } from '../types';

describe('Phase 6: Optimization, Deployment, and Feedback Loops', () => {
  let repository: BlueprintRepository;
  let calibrationSystem: CalibrationSystem;
  let feedbackSystem: FeedbackSystem;
  let complianceSystem: ComplianceSystem;

  beforeEach(() => {
    repository = new BlueprintRepository();
    calibrationSystem = new CalibrationSystem();
    feedbackSystem = new FeedbackSystem();
    complianceSystem = new ComplianceSystem();
  });

  const createTestBlueprint = (): Blueprint => ({
    id: 'test-blueprint-1',
    archetypeId: 'archetype-1',
    archetype: {
      id: 'archetype-1',
      name: 'Analytics AI',
      description: 'AI-powered analytics',
      category: 'Analytics',
      primaryUseCase: 'Data Analysis',
      targetICP: 'Enterprise',
      keyFeatures: ['Real-time Analytics', 'Dashboards'],
      estimatedMarketSize: 2000000,
      tokenConsumption: 'medium',
      userBaseSize: 5000,
      growthPotential: 0.25,
      priority: 1,
      similarArchetypes: [],
      metadata: {},
    } as Archetype,
    agentProfile: {
      name: 'Analytics AI',
      description: 'AI-powered analytics',
      primaryUseCase: 'Data Analysis',
      targetICP: 'Enterprise',
      keyFeatures: ['Real-time Analytics'],
      estimatedMarketSize: 2000000,
      competitivePosition: 'Leader',
    },
    valueMetrics: [
      {
        id: 'metric-1',
        name: 'Queries Processed',
        description: 'Number of queries',
        unit: 'queries',
        measurable: true,
        observable: true,
        frequency: 'daily',
        examples: ['1000 queries/day'],
      },
    ],
    pricingArchetype: {
      type: 'usage-based',
      rationale: 'Usage-based pricing',
      pros: ['Fair pricing'],
      cons: ['Requires telemetry'],
    },
    tiers: [
      {
        id: 'tier-1',
        name: 'Starter',
        description: 'For small teams',
        price: 99,
        billingCycle: 'monthly',
        features: [{ name: 'Basic Analytics', description: 'Basic', included: true }],
        usageLimits: [{ meter: 'queries', limit: 1000, overage: { type: 'per-unit', price: 0.1 } }],
        targetSegment: 'Small',
      },
      {
        id: 'tier-2',
        name: 'Professional',
        description: 'For growing teams',
        price: 299,
        billingCycle: 'monthly',
        features: [
          { name: 'Basic Analytics', description: 'Basic', included: true },
          { name: 'Advanced Analytics', description: 'Advanced', included: true },
        ],
        usageLimits: [{ meter: 'queries', limit: 10000, overage: { type: 'per-unit', price: 0.05 } }],
        targetSegment: 'Mid-Market',
      },
      {
        id: 'tier-3',
        name: 'Enterprise',
        description: 'For large organizations',
        price: 999,
        billingCycle: 'monthly',
        features: [
          { name: 'Basic Analytics', description: 'Basic', included: true },
          { name: 'Advanced Analytics', description: 'Advanced', included: true },
          { name: 'Custom Analytics', description: 'Custom', included: true },
        ],
        usageLimits: [{ meter: 'queries', limit: 100000, overage: { type: 'per-unit', price: 0.02 } }],
        targetSegment: 'Enterprise',
      },
    ],
    meters: [
      {
        id: 'meter-1',
        name: 'Queries Processed',
        description: 'Number of queries',
        unit: 'queries',
        telemetryMapping: {} as any,
        accuracy: 98,
        fraudRisk: 'low',
      },
    ],
    calibration: {
      methodology: 'Value-based',
      benchmarkComparison: {
        proposedPrice: 99,
        marketAverage: 100,
        percentileRank: 50,
        isOutlier: false,
        recommendation: 'Competitive',
      },
      marketAlignment: 'Aligned',
      confidenceLevel: 0.85,
      assumptions: ['Assumption 1'],
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

  describe('Blueprint Repository', () => {
    it('should store and retrieve blueprints', () => {
      const blueprint = createTestBlueprint();
      const id = repository.store(blueprint);

      expect(id).toBe(blueprint.id);
      const retrieved = repository.retrieve(id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(blueprint.id);
    });

    it('should search blueprints', () => {
      const blueprint1 = createTestBlueprint();
      const blueprint2 = createTestBlueprint();
      blueprint2.id = 'test-blueprint-2';
      blueprint2.metadata.status = 'published';

      repository.store(blueprint1);
      repository.store(blueprint2);

      const results = repository.search({ status: 'published' });
      expect(results.length).toBe(1);
      expect(results[0].id).toBe(blueprint2.id);
    });

    it('should update blueprints', () => {
      const blueprint = createTestBlueprint();
      repository.store(blueprint);

      repository.update(blueprint.id, { metadata: { ...blueprint.metadata, qualityScore: 95 } });

      const updated = repository.retrieve(blueprint.id);
      expect(updated?.metadata.qualityScore).toBe(95);
      expect(updated?.metadata.version).toBe(2);
    });

    it('should track version history', () => {
      const blueprint = createTestBlueprint();
      repository.store(blueprint);
      repository.update(blueprint.id, { metadata: { ...blueprint.metadata, qualityScore: 90 } });

      const history = repository.getVersionHistory(blueprint.id);
      expect(history.length).toBe(2);
      expect(history[0].version).toBe(1);
      expect(history[1].version).toBe(2);
    });

    it('should add and retrieve comments', () => {
      const blueprint = createTestBlueprint();
      repository.store(blueprint);

      const comment = {
        id: 'comment-1',
        author: 'reviewer',
        content: 'Great pricing model',
        createdDate: new Date(),
        resolved: false,
      };

      repository.addComment(blueprint.id, comment);
      const comments = repository.getComments(blueprint.id);

      expect(comments.length).toBe(1);
      expect(comments[0].content).toBe('Great pricing model');
    });

    it('should export blueprints in multiple formats', () => {
      const blueprint = createTestBlueprint();
      repository.store(blueprint);

      const json = repository.export(blueprint.id, 'json');
      expect(json).toContain(blueprint.id);

      const markdown = repository.export(blueprint.id, 'markdown');
      expect(markdown).toContain(blueprint.archetype.name);

      const yaml = repository.export(blueprint.id, 'yaml');
      expect(yaml).toContain('id:');
    });

    it('should track tags', () => {
      const blueprint = createTestBlueprint();
      repository.store(blueprint);

      repository.addTag(blueprint.id, 'high-priority');
      repository.addTag(blueprint.id, 'reviewed');

      const tags = repository.getTags(blueprint.id);
      expect(tags.length).toBe(2);
      expect(tags).toContain('high-priority');
    });

    it('should provide statistics', () => {
      const blueprint1 = createTestBlueprint();
      const blueprint2 = createTestBlueprint();
      blueprint2.id = 'test-blueprint-2';
      blueprint2.metadata.status = 'published';

      repository.store(blueprint1);
      repository.store(blueprint2);

      const stats = repository.getStatistics();
      expect(stats.totalBlueprints).toBe(2);
      expect(stats.byStatus.draft).toBe(1);
      expect(stats.byStatus.published).toBe(1);
      expect(stats.averageQualityScore).toBeGreaterThan(0);
    });
  });

  describe('Calibration System', () => {
    it('should generate calibration report', () => {
      const blueprint = createTestBlueprint();
      const usageData = new Map();

      const report = calibrationSystem.generateCalibrationReport(blueprint, usageData);

      expect(report).toBeDefined();
      expect(report.blueprintId).toBe(blueprint.id);
      expect(report.segmentMetrics).toBeDefined();
      expect(report.anomalies).toBeDefined();
      expect(report.recommendations).toBeDefined();
      expect(report.profitabilityAnalysis).toBeDefined();
    });

    it('should identify pricing anomalies', () => {
      const blueprint = createTestBlueprint();
      const usageData = new Map();

      const report = calibrationSystem.generateCalibrationReport(blueprint, usageData);

      expect(Array.isArray(report.anomalies)).toBe(true);
      report.anomalies.forEach((anomaly) => {
        expect(anomaly.id).toBeDefined();
        expect(anomaly.type).toMatch(/underpriced|overpriced|usage_spike|churn_risk/);
        expect(anomaly.severity).toMatch(/low|medium|high/);
      });
    });

    it('should generate recommendations', () => {
      const blueprint = createTestBlueprint();
      const usageData = new Map();

      const report = calibrationSystem.generateCalibrationReport(blueprint, usageData);

      expect(Array.isArray(report.recommendations)).toBe(true);
      report.recommendations.forEach((rec) => {
        expect(rec.type).toBeDefined();
        expect(rec.rationale).toBeDefined();
        expect(rec.confidence).toBeGreaterThanOrEqual(0);
        expect(rec.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should identify upsell opportunities', () => {
      const blueprint = createTestBlueprint();
      const usageData = new Map();
      const report = calibrationSystem.generateCalibrationReport(blueprint, usageData);

      const opportunities = calibrationSystem.identifyUpsellOpportunities(blueprint, report.segmentMetrics);

      expect(Array.isArray(opportunities)).toBe(true);
      opportunities.forEach((opp) => {
        expect(opp.segment).toBeDefined();
        expect(opp.opportunity).toBeDefined();
        expect(opp.estimatedRevenue).toBeGreaterThanOrEqual(0);
      });
    });

    it('should generate calibration markdown', () => {
      const blueprint = createTestBlueprint();
      const usageData = new Map();
      const report = calibrationSystem.generateCalibrationReport(blueprint, usageData);

      const markdown = calibrationSystem.generateCalibrationMarkdown(report);

      expect(typeof markdown).toBe('string');
      expect(markdown).toContain('# Pricing Calibration Report');
      expect(markdown).toContain('## Segment Analysis');
    });
  });

  describe('Feedback System', () => {
    it('should collect feedback', () => {
      const blueprint = createTestBlueprint();
      repository.store(blueprint);

      const feedback = {
        id: 'feedback-1',
        blueprintId: blueprint.id,
        author: 'reviewer',
        category: 'accuracy' as const,
        severity: 'medium' as const,
        content: 'Pricing seems accurate',
        createdDate: new Date(),
        resolved: false,
      };

      const id = feedbackSystem.collectFeedback(feedback);
      expect(id).toBe('feedback-1');

      const collected = feedbackSystem.getFeedback(blueprint.id);
      expect(collected.length).toBe(1);
    });

    it('should categorize feedback', () => {
      const blueprint = createTestBlueprint();

      const feedback1 = {
        id: 'feedback-1',
        blueprintId: blueprint.id,
        author: 'reviewer1',
        category: 'accuracy' as const,
        severity: 'low' as const,
        content: 'Accurate',
        createdDate: new Date(),
        resolved: false,
      };

      const feedback2 = {
        id: 'feedback-2',
        blueprintId: blueprint.id,
        author: 'reviewer2',
        category: 'completeness' as const,
        severity: 'medium' as const,
        content: 'Missing details',
        createdDate: new Date(),
        resolved: false,
      };

      feedbackSystem.collectFeedback(feedback1);
      feedbackSystem.collectFeedback(feedback2);

      const analysis = feedbackSystem.categorizeAndAnalyze(blueprint.id);

      expect(analysis.patterns.length).toBe(2);
      expect(analysis.unresolvedCount).toBe(2);
    });

    it('should resolve feedback', () => {
      const blueprint = createTestBlueprint();

      const feedback = {
        id: 'feedback-1',
        blueprintId: blueprint.id,
        author: 'reviewer',
        category: 'accuracy' as const,
        severity: 'low' as const,
        content: 'Test',
        createdDate: new Date(),
        resolved: false,
      };

      feedbackSystem.collectFeedback(feedback);
      feedbackSystem.resolveFeedback('feedback-1', blueprint.id, 'Fixed');

      const unresolved = feedbackSystem.getUnresolvedFeedback(blueprint.id);
      expect(unresolved.length).toBe(0);
    });

    it('should identify workflow improvements', () => {
      const blueprint = createTestBlueprint();

      const feedback = {
        id: 'feedback-1',
        blueprintId: blueprint.id,
        author: 'reviewer',
        category: 'feasibility' as const,
        severity: 'high' as const,
        content: 'Agent 1 needs improvement',
        createdDate: new Date(),
        resolved: false,
      };

      feedbackSystem.collectFeedback(feedback);
      const improvements = feedbackSystem.identifyWorkflowImprovements();

      expect(Array.isArray(improvements)).toBe(true);
    });

    it('should calculate resolution rate', () => {
      const blueprint = createTestBlueprint();

      const feedback1 = {
        id: 'feedback-1',
        blueprintId: blueprint.id,
        author: 'reviewer1',
        category: 'accuracy' as const,
        severity: 'low' as const,
        content: 'Test 1',
        createdDate: new Date(),
        resolved: true,
      };

      const feedback2 = {
        id: 'feedback-2',
        blueprintId: blueprint.id,
        author: 'reviewer2',
        category: 'completeness' as const,
        severity: 'low' as const,
        content: 'Test 2',
        createdDate: new Date(),
        resolved: false,
      };

      feedbackSystem.collectFeedback(feedback1);
      feedbackSystem.collectFeedback(feedback2);

      const rate = feedbackSystem.getResolutionRate(blueprint.id);
      expect(rate).toBe(50);
    });
  });

  describe('Compliance System', () => {
    it('should review blueprint for compliance', () => {
      const blueprint = createTestBlueprint();
      const assessment = complianceSystem.reviewBlueprint(blueprint);

      expect(assessment).toBeDefined();
      expect(assessment.overallRisk).toMatch(/low|medium|high|critical/);
      expect(assessment.riskScore).toBeGreaterThanOrEqual(0);
      expect(assessment.riskScore).toBeLessThanOrEqual(100);
      expect(Array.isArray(assessment.checks)).toBe(true);
      expect(Array.isArray(assessment.issues)).toBe(true);
    });

    it('should perform compliance checks', () => {
      const blueprint = createTestBlueprint();
      const assessment = complianceSystem.reviewBlueprint(blueprint);

      expect(assessment.checks.length).toBeGreaterThan(0);
      assessment.checks.forEach((check) => {
        expect(check.id).toBeDefined();
        expect(check.name).toBeDefined();
        expect(typeof check.passed).toBe('boolean');
        expect(check.details).toBeDefined();
      });
    });

    it('should identify compliance issues', () => {
      const blueprint = createTestBlueprint();
      const assessment = complianceSystem.reviewBlueprint(blueprint);

      assessment.issues.forEach((issue) => {
        expect(issue.id).toBeDefined();
        expect(issue.severity).toMatch(/low|medium|high|critical/);
        expect(issue.category).toBeDefined();
        expect(issue.description).toBeDefined();
      });
    });

    it('should generate compliance report', () => {
      const blueprint = createTestBlueprint();
      const assessment = complianceSystem.reviewBlueprint(blueprint);
      const report = complianceSystem.generateComplianceReport(assessment);

      expect(typeof report).toBe('string');
      expect(report).toContain('# Compliance Review Report');
      expect(report).toContain('Overall Risk Level');
      expect(report).toContain('Risk Score');
    });

    it('should maintain audit trail', () => {
      const blueprint = createTestBlueprint();
      complianceSystem.reviewBlueprint(blueprint);

      const trail = complianceSystem.getAuditTrail();
      expect(Array.isArray(trail)).toBe(true);
      expect(trail.length).toBeGreaterThan(0);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete Phase 6 workflow', () => {
      const blueprint = createTestBlueprint();

      // Store blueprint
      repository.store(blueprint);
      const retrieved = repository.retrieve(blueprint.id);
      expect(retrieved).toBeDefined();

      // Generate calibration report
      const usageData = new Map();
      const calibrationReport = calibrationSystem.generateCalibrationReport(blueprint, usageData);
      expect(calibrationReport).toBeDefined();

      // Collect feedback
      const feedback = {
        id: 'feedback-1',
        blueprintId: blueprint.id,
        author: 'reviewer',
        category: 'accuracy' as const,
        severity: 'low' as const,
        content: 'Good pricing',
        createdDate: new Date(),
        resolved: false,
      };
      feedbackSystem.collectFeedback(feedback);

      // Review compliance
      const compliance = complianceSystem.reviewBlueprint(blueprint);
      expect(compliance).toBeDefined();
    });

    it('should handle multiple blueprints', () => {
      const blueprints = [createTestBlueprint(), createTestBlueprint()];
      blueprints[1].id = 'test-blueprint-2';

      blueprints.forEach((bp) => {
        repository.store(bp);
        complianceSystem.reviewBlueprint(bp);
      });

      const all = repository.listAll();
      expect(all.length).toBe(2);

      const stats = repository.getStatistics();
      expect(stats.totalBlueprints).toBe(2);
    });
  });
});
