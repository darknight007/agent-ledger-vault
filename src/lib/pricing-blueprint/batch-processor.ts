/**
 * Batch Processor Core
 * Manages batch submission, queuing, and workflow execution
 */

import {
  Archetype,
  BatchOptions,
  BatchStatus,
  BatchResults,
  FailureReport,
  Blueprint,
  RetryPolicy,
  WorkflowAgent,
} from './types';

/**
 * Batch job representation
 */
interface BatchJob {
  batchId: string;
  archetypes: Archetype[];
  options: BatchOptions;
  state: 'queued' | 'processing' | 'completed' | 'failed';
  progress: {
    total: number;
    completed: number;
    failed: number;
    inProgress: number;
  };
  startTime?: Date;
  endTime?: Date;
  blueprints: Blueprint[];
  failedArchetypes: FailureReport[];
}

/**
 * Batch Processor manages batch processing of archetypes through the workflow
 */
export class BatchProcessor {
  private jobs: Map<string, BatchJob> = new Map();
  private queue: string[] = []; // Queue of batch IDs
  private activeWorkers: number = 0;
  private agents: Map<string, WorkflowAgent> = new Map();
  private defaultOptions: BatchOptions = {
    concurrencyLimit: 5,
    retryPolicy: {
      maxRetries: 3,
      initialDelayMs: 1000,
      maxDelayMs: 60000,
      backoffMultiplier: 2,
    },
    timeoutPerAgent: 300000, // 5 minutes
    priorityLevel: 'normal',
  };

  constructor() {
    this.initializeDefaultOptions();
  }

  /**
   * Registers a workflow agent
   */
  registerAgent(agent: WorkflowAgent): void {
    this.agents.set(agent.name, agent);
  }

  /**
   * Gets a registered agent
   */
  getAgent(name: string): WorkflowAgent | undefined {
    return this.agents.get(name);
  }

  /**
   * Gets all registered agents
   */
  getAgents(): WorkflowAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Submits a batch for processing
   */
  submitBatch(
    archetypes: Archetype[],
    options?: Partial<BatchOptions>
  ): string {
    const batchId = this.generateBatchId();
    const mergedOptions = { ...this.defaultOptions, ...options };

    const job: BatchJob = {
      batchId,
      archetypes,
      options: mergedOptions,
      state: 'queued',
      progress: {
        total: archetypes.length,
        completed: 0,
        failed: 0,
        inProgress: 0,
      },
      blueprints: [],
      failedArchetypes: [],
    };

    this.jobs.set(batchId, job);
    this.queue.push(batchId);

    // Start processing if not at concurrency limit
    this.processNextBatch();

    return batchId;
  }

  /**
   * Gets the status of a batch
   */
  getBatchStatus(batchId: string): BatchStatus | null {
    const job = this.jobs.get(batchId);
    if (!job) return null;

    return {
      batchId,
      state: job.state,
      progress: job.progress,
      startTime: job.startTime || new Date(),
      estimatedCompletionTime: this.estimateCompletionTime(job),
    };
  }

  /**
   * Gets the results of a completed batch
   */
  getBatchResults(batchId: string): BatchResults | null {
    const job = this.jobs.get(batchId);
    if (!job) return null;

    if (job.state !== 'completed' && job.state !== 'failed') {
      return null; // Batch not yet complete
    }

    const totalTime = job.endTime && job.startTime
      ? job.endTime.getTime() - job.startTime.getTime()
      : 0;

    const averageQualityScore =
      job.blueprints.length > 0
        ? job.blueprints.reduce((sum, b) => sum + b.metadata.qualityScore, 0) /
          job.blueprints.length
        : 0;

    return {
      batchId,
      blueprints: job.blueprints,
      failedArchetypes: job.failedArchetypes,
      summary: {
        successCount: job.progress.completed,
        failureCount: job.progress.failed,
        averageQualityScore,
        totalProcessingTime: totalTime,
      },
    };
  }

  /**
   * Cancels a batch
   */
  cancelBatch(batchId: string): boolean {
    const job = this.jobs.get(batchId);
    if (!job) return false;

    if (job.state === 'completed' || job.state === 'failed') {
      return false; // Cannot cancel completed/failed batches
    }

    job.state = 'failed';
    job.endTime = new Date();

    // Remove from queue if still queued
    const queueIndex = this.queue.indexOf(batchId);
    if (queueIndex > -1) {
      this.queue.splice(queueIndex, 1);
    }

    return true;
  }

  /**
   * Gets all active batches
   */
  getActiveBatches(): BatchStatus[] {
    const active: BatchStatus[] = [];

    for (const [batchId, job] of this.jobs.entries()) {
      if (job.state === 'queued' || job.state === 'processing') {
        active.push({
          batchId,
          state: job.state,
          progress: job.progress,
          startTime: job.startTime || new Date(),
          estimatedCompletionTime: this.estimateCompletionTime(job),
        });
      }
    }

    return active;
  }

  /**
   * Gets queue statistics
   */
  getQueueStats(): {
    queueLength: number;
    activeWorkers: number;
    totalJobs: number;
    completedJobs: number;
  } {
    const completedJobs = Array.from(this.jobs.values()).filter(
      (j) => j.state === 'completed' || j.state === 'failed'
    ).length;

    return {
      queueLength: this.queue.length,
      activeWorkers: this.activeWorkers,
      totalJobs: this.jobs.size,
      completedJobs,
    };
  }

  /**
   * Private: Processes the next batch in queue
   */
  private async processNextBatch(): Promise<void> {
    if (
      this.activeWorkers >= this.defaultOptions.concurrencyLimit ||
      this.queue.length === 0
    ) {
      return;
    }

    const batchId = this.queue.shift();
    if (!batchId) return;

    const job = this.jobs.get(batchId);
    if (!job) return;

    this.activeWorkers++;
    job.state = 'processing';
    job.startTime = new Date();

    try {
      await this.processBatch(job);
      job.state = 'completed';
    } catch (error) {
      job.state = 'failed';
    } finally {
      job.endTime = new Date();
      this.activeWorkers--;

      // Process next batch
      this.processNextBatch();
    }
  }

  /**
   * Private: Processes a single batch
   */
  private async processBatch(job: BatchJob): Promise<void> {
    for (const archetype of job.archetypes) {
      job.progress.inProgress++;

      try {
        // Process archetype through workflow
        const blueprint = await this.processArchetype(archetype, job.options);
        job.blueprints.push(blueprint);
        job.progress.completed++;
      } catch (error) {
        const failureReport: FailureReport = {
          archetypeId: archetype.id,
          archetypeName: archetype.name,
          error: error instanceof Error ? error.message : 'Unknown error',
          failedAgent: 'unknown',
          timestamp: new Date(),
          retryCount: 0,
        };
        job.failedArchetypes.push(failureReport);
        job.progress.failed++;
      } finally {
        job.progress.inProgress--;
      }
    }
  }

  /**
   * Private: Processes a single archetype through the workflow
   */
  private async processArchetype(
    archetype: Archetype,
    options: BatchOptions
  ): Promise<Blueprint> {
    // This is a placeholder - actual implementation will execute the 9-agent workflow
    // For now, return a minimal blueprint structure
    const now = new Date();

    return {
      id: `blueprint-${archetype.id}-${Date.now()}`,
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
      valueMetrics: [],
      pricingArchetype: {
        type: 'usage-based',
        rationale: 'Usage-based pricing aligns with customer value',
        pros: ['Scales with customer success', 'Fair pricing'],
        cons: ['Requires telemetry', 'Complex billing'],
      },
      tiers: [],
      meters: [],
      calibration: {
        methodology: 'Market-based pricing',
        benchmarkComparison: {
          proposedPrice: 100,
          marketAverage: 100,
          percentileRank: 50,
          isOutlier: false,
          recommendation: 'Pricing is competitive',
        },
        marketAlignment: 'Well-aligned with market',
        confidenceLevel: 0.7,
        assumptions: ['Market size estimates are accurate'],
      },
      risks: {
        risks: [],
        complianceIssues: [],
        fairnessAnalysis: 'Pricing is fair and transparent',
        mitigationStrategies: [],
      },
      recommendations: [],
      metadata: {
        createdDate: now,
        lastUpdated: now,
        author: 'batch-processor',
        status: 'draft',
        version: 1,
        qualityScore: 70,
      },
      markdownContent: `# Pricing Blueprint: ${archetype.name}`,
      jsonSchema: {},
    };
  }

  /**
   * Private: Estimates completion time for a batch
   */
  private estimateCompletionTime(job: BatchJob): Date {
    if (!job.startTime) {
      return new Date();
    }

    // Estimate based on average processing time per archetype
    const avgTimePerArchetype = 30000; // 30 seconds per archetype
    const remainingArchetypes =
      job.progress.total - job.progress.completed - job.progress.inProgress;
    const estimatedRemainingTime = remainingArchetypes * avgTimePerArchetype;

    return new Date(Date.now() + estimatedRemainingTime);
  }

  /**
   * Private: Generates a unique batch ID
   */
  private generateBatchId(): string {
    return `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: Initializes default options
   */
  private initializeDefaultOptions(): void {
    // Can be overridden by environment variables
    const concurrency = parseInt(
      process.env.BATCH_CONCURRENCY_LIMIT || '5',
      10
    );
    const maxRetries = parseInt(process.env.BATCH_MAX_RETRIES || '3', 10);
    const timeout = parseInt(process.env.BATCH_TIMEOUT_MS || '300000', 10);

    this.defaultOptions = {
      concurrencyLimit: concurrency,
      retryPolicy: {
        maxRetries,
        initialDelayMs: 1000,
        maxDelayMs: 60000,
        backoffMultiplier: 2,
      },
      timeoutPerAgent: timeout,
      priorityLevel: 'normal',
    };
  }

  /**
   * Gets processor statistics
   */
  getStatistics(): {
    totalBatches: number;
    completedBatches: number;
    failedBatches: number;
    totalArchetypes: number;
    totalBlueprints: number;
    totalFailures: number;
    averageProcessingTime: number;
  } {
    let totalArchetypes = 0;
    let totalBlueprints = 0;
    let totalFailures = 0;
    let completedBatches = 0;
    let failedBatches = 0;
    let totalProcessingTime = 0;

    for (const job of this.jobs.values()) {
      totalArchetypes += job.archetypes.length;
      totalBlueprints += job.blueprints.length;
      totalFailures += job.failedArchetypes.length;

      if (job.state === 'completed') {
        completedBatches++;
        if (job.startTime && job.endTime) {
          totalProcessingTime += job.endTime.getTime() - job.startTime.getTime();
        }
      } else if (job.state === 'failed') {
        failedBatches++;
      }
    }

    const averageProcessingTime =
      completedBatches > 0 ? totalProcessingTime / completedBatches : 0;

    return {
      totalBatches: this.jobs.size,
      completedBatches,
      failedBatches,
      totalArchetypes,
      totalBlueprints,
      totalFailures,
      averageProcessingTime,
    };
  }

  /**
   * Clears all jobs (for testing)
   */
  clear(): void {
    this.jobs.clear();
    this.queue = [];
    this.activeWorkers = 0;
  }
}
