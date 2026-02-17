/**
 * 9-Agent Workflow Pipeline
 * Orchestrates sequential execution of 9 specialized agents
 */

import {
  Archetype,
  WorkflowAgent,
  AgentInput,
  AgentOutput,
  WorkflowContext,
  Blueprint,
  ValidationResult,
} from './types';

/**
 * Workflow pipeline that executes agents in sequence
 */
export class WorkflowPipeline {
  private agents: WorkflowAgent[] = [];
  private agentMap: Map<string, WorkflowAgent> = new Map();

  /**
   * Registers an agent in the pipeline
   */
  registerAgent(agent: WorkflowAgent): void {
    this.agents.push(agent);
    this.agentMap.set(agent.name, agent);
  }

  /**
   * Gets all registered agents in order
   */
  getAgents(): WorkflowAgent[] {
    return [...this.agents];
  }

  /**
   * Gets an agent by name
   */
  getAgent(name: string): WorkflowAgent | undefined {
    return this.agentMap.get(name);
  }

  /**
   * Executes the workflow pipeline for an archetype
   */
  async execute(
    archetype: Archetype,
    context: WorkflowContext
  ): Promise<{
    blueprint: Blueprint;
    outputs: Map<string, AgentOutput>;
    executionTime: number;
  }> {
    const startTime = Date.now();
    const outputs = new Map<string, AgentOutput>();
    let currentBlueprint: Partial<Blueprint> = {
      id: `blueprint-${archetype.id}-${Date.now()}`,
      archetypeId: archetype.id,
      archetype,
    };

    try {
      // Execute each agent in sequence
      for (const agent of this.agents) {
        const agentInput: AgentInput = {
          archetype,
          previousOutputs: outputs,
          context,
        };

        // Execute agent with timeout
        const agentOutput = await this.executeAgentWithTimeout(
          agent,
          agentInput,
          context
        );

        // Validate agent output
        const validation = agent.validate(agentOutput);
        if (!validation.passed) {
          throw new Error(
            `Agent ${agent.name} validation failed: ${validation.issues.map((i) => i.description).join(', ')}`
          );
        }

        outputs.set(agent.name, agentOutput);

        // Merge agent output into blueprint
        currentBlueprint = this.mergeAgentOutput(
          currentBlueprint,
          agent.name,
          agentOutput
        );
      }

      const executionTime = Date.now() - startTime;

      return {
        blueprint: currentBlueprint as Blueprint,
        outputs,
        executionTime,
      };
    } catch (error) {
      throw new Error(
        `Workflow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Executes an agent with timeout protection
   */
  private async executeAgentWithTimeout(
    agent: WorkflowAgent,
    input: AgentInput,
    context: WorkflowContext
  ): Promise<AgentOutput> {
    const timeout = 300000; // 5 minutes default

    return Promise.race([
      agent.execute(input),
      new Promise<AgentOutput>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Agent ${agent.name} execution timeout`)),
          timeout
        )
      ),
    ]);
  }

  /**
   * Merges agent output into the blueprint
   */
  private mergeAgentOutput(
    blueprint: Partial<Blueprint>,
    agentName: string,
    output: AgentOutput
  ): Partial<Blueprint> {
    // Agent-specific merging logic
    switch (agentName) {
      case 'InputNormalizer':
        return {
          ...blueprint,
          agentProfile: output.data.agentProfile,
        };

      case 'CategoryAndJTBDClassifier':
        return {
          ...blueprint,
          ...output.data,
        };

      case 'ValueMetricDesigner':
        return {
          ...blueprint,
          valueMetrics: output.data.valueMetrics,
        };

      case 'TelemetryFeasibility':
        return {
          ...blueprint,
          ...output.data,
        };

      case 'PricingArchetypeSelector':
        return {
          ...blueprint,
          pricingArchetype: output.data.pricingArchetype,
        };

      case 'PackagingAndTiering':
        return {
          ...blueprint,
          tiers: output.data.tiers,
        };

      case 'PriceMetricCalibration':
        return {
          ...blueprint,
          meters: output.data.meters,
          calibration: output.data.calibration,
        };

      case 'RiskAndCompliance':
        return {
          ...blueprint,
          risks: output.data.risks,
        };

      case 'FinalRecommendationComposer':
        return {
          ...blueprint,
          recommendations: output.data.recommendations,
          markdownContent: output.data.markdownContent,
          metadata: output.data.metadata,
          jsonSchema: output.data.jsonSchema,
        };

      default:
        return blueprint;
    }
  }

  /**
   * Validates pipeline configuration
   */
  validateConfiguration(): {
    valid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check that all required agents are registered
    const requiredAgents = [
      'InputNormalizer',
      'CategoryAndJTBDClassifier',
      'ValueMetricDesigner',
      'TelemetryFeasibility',
      'PricingArchetypeSelector',
      'PackagingAndTiering',
      'PriceMetricCalibration',
      'RiskAndCompliance',
      'FinalRecommendationComposer',
    ];

    for (const required of requiredAgents) {
      if (!this.agentMap.has(required)) {
        issues.push(`Missing required agent: ${required}`);
      }
    }

    // Check that agents are in correct order
    const agentNames = this.agents.map((a) => a.name);
    for (let i = 0; i < requiredAgents.length; i++) {
      if (agentNames[i] !== requiredAgents[i]) {
        issues.push(
          `Agent order incorrect. Expected ${requiredAgents[i]} at position ${i}, got ${agentNames[i]}`
        );
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  /**
   * Gets pipeline statistics
   */
  getStatistics(): {
    agentCount: number;
    agents: string[];
    isConfigured: boolean;
  } {
    return {
      agentCount: this.agents.length,
      agents: this.agents.map((a) => a.name),
      isConfigured: this.validateConfiguration().valid,
    };
  }

  /**
   * Clears all agents
   */
  clear(): void {
    this.agents = [];
    this.agentMap.clear();
  }
}

/**
 * Base class for implementing workflow agents
 */
export abstract class BaseWorkflowAgent implements WorkflowAgent {
  abstract name: string;

  abstract execute(input: AgentInput): Promise<AgentOutput>;

  validate(output: AgentOutput): ValidationResult {
    const issues: Array<{ id: string; severity: 'low' | 'medium' | 'high'; description: string; recommendation: string }> = [];
    const checks: Array<{ name: string; category: 'completeness' | 'consistency' | 'feasibility' | 'market-alignment'; passed: boolean; details: string }> = [];

    // Basic validation checks
    const agentNameCheck = {
      name: 'Agent Name Present',
      category: 'completeness' as const,
      passed: !!output.agentName,
      details: output.agentName ? 'Agent name is present' : 'Agent name is missing',
    };
    checks.push(agentNameCheck);

    if (!output.agentName) {
      issues.push({
        id: 'agent-name-missing',
        severity: 'high',
        description: 'Agent name is missing',
        recommendation: 'Ensure agent output includes agentName',
      });
    }

    const dataCheck = {
      name: 'Output Data Present',
      category: 'completeness' as const,
      passed: !!output.data,
      details: output.data ? 'Output data is present' : 'Output data is missing',
    };
    checks.push(dataCheck);

    if (!output.data) {
      issues.push({
        id: 'output-data-missing',
        severity: 'high',
        description: 'Agent output data is missing',
        recommendation: 'Ensure agent output includes data object',
      });
    }

    const metadataCheck = {
      name: 'Metadata Present',
      category: 'completeness' as const,
      passed: !!output.metadata,
      details: output.metadata ? 'Metadata is present' : 'Metadata is missing',
    };
    checks.push(metadataCheck);

    if (!output.metadata) {
      issues.push({
        id: 'metadata-missing',
        severity: 'high',
        description: 'Agent metadata is missing',
        recommendation: 'Ensure agent output includes metadata',
      });
    }

    const executionTimeCheck = {
      name: 'Execution Time Recorded',
      category: 'completeness' as const,
      passed: output.metadata?.executionTime !== undefined,
      details: output.metadata?.executionTime !== undefined ? 'Execution time is recorded' : 'Execution time is missing',
    };
    checks.push(executionTimeCheck);

    if (output.metadata?.executionTime === undefined) {
      issues.push({
        id: 'execution-time-missing',
        severity: 'medium',
        description: 'Execution time is missing',
        recommendation: 'Record execution time in agent metadata',
      });
    }

    const score = checks.filter((c) => c.passed).length * 25; // 0-100 scale

    return {
      passed: issues.length === 0,
      score,
      checks,
      issues,
      recommendations: issues.map((i) => i.recommendation),
    };
  }

  /**
   * Helper to create agent output
   */
  protected createOutput(
    data: Record<string, any>,
    executionTime: number,
    tokensUsed: number = 0,
    confidence: number = 0.8
  ): AgentOutput {
    return {
      agentName: this.name,
      data,
      metadata: {
        executionTime,
        tokensUsed,
        confidence,
      },
    };
  }
}

/**
 * Stub implementations of the 9 agents for testing
 */

export class InputNormalizerAgent extends BaseWorkflowAgent {
  name = 'InputNormalizer';

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    // Normalize archetype data into agent profile
    const agentProfile = {
      name: input.archetype.name,
      description: input.archetype.description,
      primaryUseCase: input.archetype.primaryUseCase,
      targetICP: input.archetype.targetICP,
      keyFeatures: input.archetype.keyFeatures,
      estimatedMarketSize: input.archetype.estimatedMarketSize,
      competitivePosition: 'Market leader',
    };

    const executionTime = Date.now() - startTime;
    return this.createOutput({ agentProfile }, executionTime);
  }
}

export class CategoryAndJTBDClassifierAgent extends BaseWorkflowAgent {
  name = 'CategoryAndJTBDClassifier';

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    const data = {
      category: input.archetype.category,
      jtbd: [
        `${input.archetype.primaryUseCase}`,
        'Improve efficiency',
        'Reduce costs',
      ],
      personas: ['Decision maker', 'End user', 'Administrator'],
      usageContexts: ['Daily operations', 'Strategic planning'],
    };

    const executionTime = Date.now() - startTime;
    return this.createOutput(data, executionTime);
  }
}

export class ValueMetricDesignerAgent extends BaseWorkflowAgent {
  name = 'ValueMetricDesigner';

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    const valueMetrics = [
      {
        id: 'metric-1',
        name: 'Tasks Completed',
        description: 'Number of tasks completed by the agent',
        unit: 'count',
        measurable: true,
        observable: true,
        frequency: 'daily',
        examples: ['100 tasks/day', '500 tasks/week'],
      },
      {
        id: 'metric-2',
        name: 'Time Saved',
        description: 'Hours saved per month',
        unit: 'hours',
        measurable: true,
        observable: true,
        frequency: 'monthly',
        examples: ['40 hours/month', '160 hours/month'],
      },
      {
        id: 'metric-3',
        name: 'Cost Reduction',
        description: 'Cost savings achieved',
        unit: 'dollars',
        measurable: true,
        observable: true,
        frequency: 'monthly',
        examples: ['$1000/month', '$5000/month'],
      },
    ];

    const executionTime = Date.now() - startTime;
    return this.createOutput({ valueMetrics }, executionTime);
  }
}

export class TelemetryFeasibilityAgent extends BaseWorkflowAgent {
  name = 'TelemetryFeasibility';

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    const data = {
      feasible: true,
      existingEvents: [
        {
          name: 'task_completed',
          description: 'Fired when a task is completed',
          properties: { task_id: 'string', duration: 'number' },
          frequency: 'high',
          accuracy: 95,
        },
      ],
      newEventsRequired: [
        {
          name: 'cost_saved',
          description: 'Fired when cost is saved',
          properties: { amount: 'number', category: 'string' },
          frequency: 'medium',
          accuracy: 90,
        },
      ],
      implementationGuidance: 'Add event tracking to cost calculation module',
      estimatedEffort: 16,
      fraudMitigations: [
        'Validate cost calculations',
        'Cross-reference with actual transactions',
      ],
    };

    const executionTime = Date.now() - startTime;
    return this.createOutput(data, executionTime);
  }
}

export class PricingArchetypeSelectorAgent extends BaseWorkflowAgent {
  name = 'PricingArchetypeSelector';

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    const pricingArchetype = {
      type: 'usage-based' as const,
      rationale:
        'Usage-based pricing aligns with customer value and scales with success',
      pros: [
        'Scales with customer success',
        'Fair pricing model',
        'Predictable revenue',
      ],
      cons: [
        'Requires telemetry infrastructure',
        'Complex billing logic',
        'Potential for bill shock',
      ],
    };

    const executionTime = Date.now() - startTime;
    return this.createOutput({ pricingArchetype }, executionTime);
  }
}

export class PackagingAndTieringAgent extends BaseWorkflowAgent {
  name = 'PackagingAndTiering';

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    const tiers = [
      {
        id: 'tier-starter',
        name: 'Starter',
        description: 'For small teams getting started',
        price: 99,
        billingCycle: 'monthly' as const,
        features: [
          {
            name: 'Basic Features',
            description: 'Core functionality',
            included: true,
          },
          {
            name: 'API Access',
            description: 'REST API access',
            included: true,
            limit: 1000,
          },
          {
            name: 'Support',
            description: 'Email support',
            included: true,
          },
        ],
        usageLimits: [
          {
            meter: 'api_calls',
            limit: 10000,
            overage: { type: 'per-unit' as const, price: 0.01 },
          },
        ],
        targetSegment: 'Startups',
      },
      {
        id: 'tier-pro',
        name: 'Pro',
        description: 'For growing teams',
        price: 299,
        billingCycle: 'monthly' as const,
        features: [
          {
            name: 'Advanced Features',
            description: 'Advanced functionality',
            included: true,
          },
          {
            name: 'API Access',
            description: 'REST API access',
            included: true,
            limit: 10000,
          },
          {
            name: 'Priority Support',
            description: 'Priority email support',
            included: true,
          },
        ],
        usageLimits: [
          {
            meter: 'api_calls',
            limit: 100000,
            overage: { type: 'per-unit' as const, price: 0.005 },
          },
        ],
        targetSegment: 'Growing companies',
      },
      {
        id: 'tier-enterprise',
        name: 'Enterprise',
        description: 'For large organizations',
        price: 999,
        billingCycle: 'monthly' as const,
        features: [
          {
            name: 'All Features',
            description: 'All features included',
            included: true,
          },
          {
            name: 'Dedicated Support',
            description: 'Dedicated account manager',
            included: true,
          },
          {
            name: 'Custom Integration',
            description: 'Custom integrations',
            included: true,
          },
        ],
        usageLimits: [
          {
            meter: 'api_calls',
            limit: 1000000,
            overage: { type: 'per-unit' as const, price: 0.001 },
          },
        ],
        targetSegment: 'Enterprise',
      },
    ];

    const executionTime = Date.now() - startTime;
    return this.createOutput({ tiers }, executionTime);
  }
}

export class PriceMetricCalibrationAgent extends BaseWorkflowAgent {
  name = 'PriceMetricCalibration';

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    const meters = [
      {
        id: 'meter-api-calls',
        name: 'API Calls',
        description: 'Number of API calls made',
        unit: 'calls',
        telemetryMapping: {
          meter: {} as any,
          telemetryEvents: [],
          existingEvents: [],
          newEventsRequired: [],
          implementationGuidance: 'Track API calls in gateway',
          estimatedEffort: 8,
          fraudMitigations: ['Rate limiting', 'Request validation'],
        },
        accuracy: 98,
        fraudRisk: 'low' as const,
      },
    ];

    const calibration = {
      methodology: 'Market-based pricing with value-based adjustments',
      benchmarkComparison: {
        proposedPrice: 299,
        marketAverage: 300,
        percentileRank: 50,
        isOutlier: false,
        recommendation: 'Pricing is competitive and well-aligned',
      },
      marketAlignment: 'Well-aligned with market expectations',
      confidenceLevel: 0.85,
      assumptions: [
        'Market size estimates are accurate',
        'Competitor pricing data is current',
        'Value metrics are measurable',
      ],
    };

    const executionTime = Date.now() - startTime;
    return this.createOutput({ meters, calibration }, executionTime);
  }
}

export class RiskAndComplianceAgent extends BaseWorkflowAgent {
  name = 'RiskAndCompliance';

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    const risks = {
      risks: [
        {
          id: 'risk-1',
          description: 'Bill shock from unexpected usage spikes',
          severity: 'medium' as const,
          likelihood: 'medium' as const,
          mitigation: 'Implement usage alerts and caps',
        },
      ],
      complianceIssues: [],
      fairnessAnalysis:
        'Pricing is fair and transparent. Usage-based model aligns with customer value.',
      mitigationStrategies: [
        'Implement usage alerts at 80% of limit',
        'Provide usage dashboard',
        'Offer annual prepayment discount',
      ],
    };

    const executionTime = Date.now() - startTime;
    return this.createOutput({ risks }, executionTime);
  }
}

export class FinalRecommendationComposerAgent extends BaseWorkflowAgent {
  name = 'FinalRecommendationComposer';

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    const recommendations = [
      {
        id: 'rec-1',
        title: 'Implement Usage Monitoring',
        description: 'Set up real-time usage monitoring dashboard',
        priority: 'high' as const,
        implementationGuidance:
          'Integrate with analytics platform to track API calls',
      },
      {
        id: 'rec-2',
        title: 'Create Customer Onboarding Guide',
        description: 'Develop pricing and usage guide for customers',
        priority: 'medium' as const,
        implementationGuidance: 'Create documentation and video tutorials',
      },
    ];

    const markdownContent = `# Pricing Blueprint: ${input.archetype.name}

## Executive Summary
This pricing blueprint recommends a usage-based pricing model for ${input.archetype.name}.

## Pricing Tiers
- Starter: $99/month
- Pro: $299/month
- Enterprise: $999/month

## Key Metrics
- API Calls
- Time Saved
- Cost Reduction

## Recommendations
See above for detailed recommendations.
`;

    const metadata = {
      createdDate: new Date(),
      lastUpdated: new Date(),
      author: 'workflow-pipeline',
      status: 'draft' as const,
      version: 1,
      qualityScore: 85,
    };

    const executionTime = Date.now() - startTime;
    return this.createOutput(
      {
        recommendations,
        markdownContent,
        metadata,
        jsonSchema: {},
      },
      executionTime
    );
  }
}
