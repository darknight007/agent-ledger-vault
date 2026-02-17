/**
 * Phase 2 Checkpoint Tests
 * Verifies batch processing and workflow pipeline functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BatchProcessor } from '../batch-processor';
import {
  WorkflowPipeline,
  InputNormalizerAgent,
  CategoryAndJTBDClassifierAgent,
  ValueMetricDesignerAgent,
  TelemetryFeasibilityAgent,
  PricingArchetypeSelectorAgent,
  PackagingAndTieringAgent,
  PriceMetricCalibrationAgent,
  RiskAndComplianceAgent,
  FinalRecommendationComposerAgent,
} from '../workflow-pipeline';
import {
  RetryMechanism,
  ErrorLogger,
  CircuitBreaker,
  FallbackHandler,
  WorkflowError,
  AgentError,
} from '../error-handling';
import { BatchReportGenerator } from '../batch-reporting';
import { createSampleCatalog } from '../archetype-catalog';

describe('Phase 2 Checkpoint - Batch Processing and Workflow', () => {
  let batchProcessor: BatchProcessor;
  let pipeline: WorkflowPipeline;
  let catalog = createSampleCatalog();

  beforeEach(() => {
    batchProcessor = new BatchProcessor();
    pipeline = new WorkflowPipeline();
    catalog = createSampleCatalog();
  });

  // ========================================================================
  // Batch Processor Tests
  // ========================================================================

  describe('Batch Processor', () => {
    it('should submit a batch and get batch ID', () => {
      const archetypes = catalog.listArchetypes().slice(0, 3);
      const batchId = batchProcessor.submitBatch(archetypes);

      expect(batchId).toBeDefined();
      expect(batchId).toMatch(/^batch-/);
    });

    it('should get batch status', () => {
      const archetypes = catalog.listArchetypes().slice(0, 2);
      const batchId = batchProcessor.submitBatch(archetypes);

      const status = batchProcessor.getBatchStatus(batchId);
      expect(status).toBeDefined();
      expect(status?.batchId).toBe(batchId);
      expect(['queued', 'processing', 'completed']).toContain(status?.state);
      expect(status?.progress.total).toBe(2);
    });

    it('should get active batches', () => {
      const archetypes = catalog.listArchetypes().slice(0, 2);
      batchProcessor.submitBatch(archetypes);

      const active = batchProcessor.getActiveBatches();
      expect(active.length).toBeGreaterThan(0);
    });

    it('should get queue statistics', () => {
      const archetypes = catalog.listArchetypes().slice(0, 2);
      batchProcessor.submitBatch(archetypes);

      const stats = batchProcessor.getQueueStats();
      expect(stats.totalJobs).toBeGreaterThan(0);
    });

    it('should register and retrieve agents', () => {
      const agent = new InputNormalizerAgent();
      batchProcessor.registerAgent(agent);

      const retrieved = batchProcessor.getAgent('InputNormalizer');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('InputNormalizer');
    });

    it('should get all registered agents', () => {
      const agent1 = new InputNormalizerAgent();
      const agent2 = new CategoryAndJTBDClassifierAgent();

      batchProcessor.registerAgent(agent1);
      batchProcessor.registerAgent(agent2);

      const agents = batchProcessor.getAgents();
      expect(agents.length).toBeGreaterThanOrEqual(2);
    });

    it('should get processor statistics', () => {
      const archetypes = catalog.listArchetypes().slice(0, 2);
      batchProcessor.submitBatch(archetypes);

      const stats = batchProcessor.getStatistics();
      expect(stats.totalBatches).toBeGreaterThan(0);
      expect(stats.totalArchetypes).toBeGreaterThan(0);
    });

    it('should cancel a batch', () => {
      const archetypes = catalog.listArchetypes().slice(0, 2);
      const batchId = batchProcessor.submitBatch(archetypes);

      const cancelled = batchProcessor.cancelBatch(batchId);
      expect(cancelled).toBe(true);
    });
  });

  // ========================================================================
  // Workflow Pipeline Tests
  // ========================================================================

  describe('Workflow Pipeline', () => {
    it('should register agents', () => {
      const agent = new InputNormalizerAgent();
      pipeline.registerAgent(agent);

      const retrieved = pipeline.getAgent('InputNormalizer');
      expect(retrieved).toBeDefined();
    });

    it('should get all agents', () => {
      const agents = [
        new InputNormalizerAgent(),
        new CategoryAndJTBDClassifierAgent(),
        new ValueMetricDesignerAgent(),
      ];

      for (const agent of agents) {
        pipeline.registerAgent(agent);
      }

      const allAgents = pipeline.getAgents();
      expect(allAgents.length).toBeGreaterThanOrEqual(3);
    });

    it('should validate pipeline configuration', () => {
      // Empty pipeline should be invalid
      let validation = pipeline.validateConfiguration();
      expect(validation.valid).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);

      // Register all required agents
      const agents = [
        new InputNormalizerAgent(),
        new CategoryAndJTBDClassifierAgent(),
        new ValueMetricDesignerAgent(),
        new TelemetryFeasibilityAgent(),
        new PricingArchetypeSelectorAgent(),
        new PackagingAndTieringAgent(),
        new PriceMetricCalibrationAgent(),
        new RiskAndComplianceAgent(),
        new FinalRecommendationComposerAgent(),
      ];

      for (const agent of agents) {
        pipeline.registerAgent(agent);
      }

      validation = pipeline.validateConfiguration();
      expect(validation.valid).toBe(true);
      expect(validation.issues.length).toBe(0);
    });

    it('should get pipeline statistics', () => {
      const agent = new InputNormalizerAgent();
      pipeline.registerAgent(agent);

      const stats = pipeline.getStatistics();
      expect(stats.agentCount).toBeGreaterThan(0);
      expect(stats.agents.length).toBeGreaterThan(0);
    });

    it('should execute workflow pipeline', async () => {
      // Register all agents
      const agents = [
        new InputNormalizerAgent(),
        new CategoryAndJTBDClassifierAgent(),
        new ValueMetricDesignerAgent(),
        new TelemetryFeasibilityAgent(),
        new PricingArchetypeSelectorAgent(),
        new PackagingAndTieringAgent(),
        new PriceMetricCalibrationAgent(),
        new RiskAndComplianceAgent(),
        new FinalRecommendationComposerAgent(),
      ];

      for (const agent of agents) {
        pipeline.registerAgent(agent);
      }

      const archetype = catalog.getArchetype('research-agent');
      if (archetype) {
        const context = {
          batchId: 'test-batch',
          archetypeId: archetype.id,
          timestamp: new Date(),
          metadata: {},
        };

        const result = await pipeline.execute(archetype, context);

        expect(result.blueprint).toBeDefined();
        expect(result.blueprint.id).toBeDefined();
        expect(result.blueprint.archetypeId).toBe(archetype.id);
        expect(result.outputs.size).toBe(9); // 9 agents
        expect(result.executionTime).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // ========================================================================
  // Error Handling Tests
  // ========================================================================

  describe('Error Handling', () => {
    it('should create workflow error', () => {
      const error = new WorkflowError('TEST_ERROR', 'Test error message', {
        detail: 'test',
      });

      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toContain('Test error message');
      expect(error.details?.detail).toBe('test');
    });

    it('should create agent error', () => {
      const error = new AgentError('TestAgent', 'Agent failed', {
        detail: 'test',
      });

      expect(error.agentName).toBe('TestAgent');
      expect(error.message).toContain('TestAgent');
      expect(error.message).toContain('Agent failed');
    });

    it('should retry with exponential backoff', async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary failure');
        }
        return 'success';
      };

      const policy = {
        maxRetries: 3,
        initialDelayMs: 10,
        maxDelayMs: 100,
        backoffMultiplier: 2,
      };

      const result = await RetryMechanism.executeWithRetry(fn, policy);
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should timeout on long-running operation', async () => {
      const fn = async () => {
        return new Promise((resolve) =>
          setTimeout(() => resolve('done'), 5000)
        );
      };

      try {
        await RetryMechanism.executeWithTimeout(fn, 100, 'test-operation');
        expect.fail('Should have timed out');
      } catch (error) {
        expect(error).toBeInstanceOf(WorkflowError);
        expect((error as WorkflowError).code).toBe('TIMEOUT');
      }
    });

    it('should log errors', () => {
      const logger = new ErrorLogger();
      const error = new Error('Test error');

      logger.log(error, 'high', { context: 'test' });

      const errors = logger.getErrors();
      expect(errors.length).toBe(1);
      expect(errors[0].error.message).toBe('Test error');
      expect(errors[0].severity).toBe('high');
    });

    it('should get error statistics', () => {
      const logger = new ErrorLogger();

      logger.log(new Error('Error 1'), 'low');
      logger.log(new Error('Error 2'), 'high');
      logger.log(new Error('Error 3'), 'high');

      const stats = logger.getStatistics();
      expect(stats.totalErrors).toBe(3);
      expect(stats.bySeverity.low).toBe(1);
      expect(stats.bySeverity.high).toBe(2);
    });

    it('should use circuit breaker', async () => {
      const breaker = new CircuitBreaker(2, 1, 100);

      // Simulate failures to open circuit
      for (let i = 0; i < 2; i++) {
        try {
          await breaker.execute(async () => {
            throw new Error('Failure');
          });
        } catch {
          // Expected
        }
      }

      // Circuit should be open now
      const status = breaker.getStatus();
      expect(status.state).toBe('open');

      // Next call should fail immediately
      try {
        await breaker.execute(async () => 'success');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(WorkflowError);
      }
    });

    it('should use fallback handler', async () => {
      const handler = new FallbackHandler();

      const fn = async () => {
        throw new Error('Primary failed');
      };

      const fallback = async () => 'fallback result';

      const result = await handler.executeWithFallback('test', fn, fallback);
      expect(result).toBe('fallback result');
    });
  });

  // ========================================================================
  // Batch Reporting Tests
  // ========================================================================

  describe('Batch Reporting', () => {
    it('should generate batch report', () => {
      const archetype = catalog.getArchetype('research-agent');
      if (archetype) {
        const results = {
          batchId: 'test-batch',
          blueprints: [
            {
              id: 'bp-1',
              archetypeId: archetype.id,
              archetype,
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
                status: 'draft' as const,
                version: 1,
                qualityScore: 85,
              },
              markdownContent: 'test',
              jsonSchema: {},
            },
          ],
          failedArchetypes: [],
          summary: {
            successCount: 1,
            failureCount: 0,
            averageQualityScore: 85,
            totalProcessingTime: 5000,
          },
        };

        const report = BatchReportGenerator.generateReport(results);

        expect(report.batchId).toBe('test-batch');
        expect(report.summary.successCount).toBe(1);
        expect(report.summary.failureCount).toBe(0);
        expect(report.summary.successRate).toBe(100);
        expect(report.summary.averageQualityScore).toBe(85);
      }
    });

    it('should export report as JSON', () => {
      const archetype = catalog.getArchetype('research-agent');
      if (archetype) {
        const results = {
          batchId: 'test-batch',
          blueprints: [],
          failedArchetypes: [],
          summary: {
            successCount: 0,
            failureCount: 0,
            averageQualityScore: 0,
            totalProcessingTime: 0,
          },
        };

        const report = BatchReportGenerator.generateReport(results);
        const json = BatchReportGenerator.toJSON(report);

        expect(json).toContain('test-batch');
        expect(json).toContain('batchId');
      }
    });

    it('should export report as Markdown', () => {
      const archetype = catalog.getArchetype('research-agent');
      if (archetype) {
        const results = {
          batchId: 'test-batch',
          blueprints: [],
          failedArchetypes: [],
          summary: {
            successCount: 0,
            failureCount: 0,
            averageQualityScore: 0,
            totalProcessingTime: 0,
          },
        };

        const report = BatchReportGenerator.generateReport(results);
        const markdown = BatchReportGenerator.toMarkdown(report);

        expect(markdown).toContain('# Batch Processing Report');
        expect(markdown).toContain('test-batch');
      }
    });

    it('should export report as HTML', () => {
      const archetype = catalog.getArchetype('research-agent');
      if (archetype) {
        const results = {
          batchId: 'test-batch',
          blueprints: [],
          failedArchetypes: [],
          summary: {
            successCount: 0,
            failureCount: 0,
            averageQualityScore: 0,
            totalProcessingTime: 0,
          },
        };

        const report = BatchReportGenerator.generateReport(results);
        const html = BatchReportGenerator.toHTML(report);

        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('Batch Processing Report');
      }
    });

    it('should export report as CSV', () => {
      const archetype = catalog.getArchetype('research-agent');
      if (archetype) {
        const results = {
          batchId: 'test-batch',
          blueprints: [],
          failedArchetypes: [],
          summary: {
            successCount: 0,
            failureCount: 0,
            averageQualityScore: 0,
            totalProcessingTime: 0,
          },
        };

        const report = BatchReportGenerator.generateReport(results);
        const csv = BatchReportGenerator.toCSV(report);

        expect(csv).toContain('Batch Report');
        expect(csv).toContain('test-batch');
      }
    });
  });

  // ========================================================================
  // Integration Tests
  // ========================================================================

  describe('Phase 2 Integration', () => {
    it('should have all required components', () => {
      expect(batchProcessor).toBeDefined();
      expect(pipeline).toBeDefined();
    });

    it('should support full batch processing workflow', () => {
      const archetypes = catalog.listArchetypes().slice(0, 2);
      const batchId = batchProcessor.submitBatch(archetypes);

      expect(batchId).toBeDefined();

      const status = batchProcessor.getBatchStatus(batchId);
      expect(status).toBeDefined();
      expect(status?.progress.total).toBe(2);
    });

    it('should support full workflow pipeline', async () => {
      const agents = [
        new InputNormalizerAgent(),
        new CategoryAndJTBDClassifierAgent(),
        new ValueMetricDesignerAgent(),
        new TelemetryFeasibilityAgent(),
        new PricingArchetypeSelectorAgent(),
        new PackagingAndTieringAgent(),
        new PriceMetricCalibrationAgent(),
        new RiskAndComplianceAgent(),
        new FinalRecommendationComposerAgent(),
      ];

      for (const agent of agents) {
        pipeline.registerAgent(agent);
      }

      const validation = pipeline.validateConfiguration();
      expect(validation.valid).toBe(true);
    });
  });
});
