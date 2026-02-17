/**
 * JSON Schema definitions for Blueprint validation
 * Provides machine-readable schemas for all core data types
 */

import { JSONSchema } from './types';

// ============================================================================
// Blueprint Schema
// ============================================================================

export const blueprintSchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    id: { type: 'string' },
    archetypeId: { type: 'string' },
    archetype: { $ref: '#/definitions/archetype' },
    agentProfile: { $ref: '#/definitions/agentProfile' },
    valueMetrics: {
      type: 'array',
      items: { $ref: '#/definitions/valueMetric' },
      minItems: 1,
    },
    pricingArchetype: { $ref: '#/definitions/pricingArchetype' },
    tiers: {
      type: 'array',
      items: { $ref: '#/definitions/tier' },
      minItems: 1,
    },
    meters: {
      type: 'array',
      items: { $ref: '#/definitions/meter' },
      minItems: 1,
    },
    calibration: { $ref: '#/definitions/priceCalibration' },
    risks: { $ref: '#/definitions/riskAssessment' },
    recommendations: {
      type: 'array',
      items: { $ref: '#/definitions/recommendation' },
    },
    metadata: { $ref: '#/definitions/blueprintMetadata' },
    markdownContent: { type: 'string' },
    jsonSchema: { type: 'object' },
  },
  required: [
    'id',
    'archetypeId',
    'archetype',
    'agentProfile',
    'valueMetrics',
    'pricingArchetype',
    'tiers',
    'meters',
    'calibration',
    'risks',
    'metadata',
    'markdownContent',
  ],
  additionalProperties: false,
  definitions: {
    archetype: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        primaryUseCase: { type: 'string' },
        targetICP: { type: 'string' },
        keyFeatures: { type: 'array', items: { type: 'string' } },
        estimatedMarketSize: { type: 'number' },
        tokenConsumption: { enum: ['low', 'medium', 'high'] },
        userBaseSize: { type: 'number' },
        growthPotential: { type: 'number' },
        priority: { type: 'number' },
        similarArchetypes: { type: 'array', items: { type: 'string' } },
        metadata: { type: 'object' },
      },
      required: [
        'id',
        'name',
        'description',
        'category',
        'primaryUseCase',
        'targetICP',
        'keyFeatures',
        'estimatedMarketSize',
        'tokenConsumption',
        'userBaseSize',
        'growthPotential',
        'priority',
      ],
      additionalProperties: false,
    },
    agentProfile: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        primaryUseCase: { type: 'string' },
        targetICP: { type: 'string' },
        keyFeatures: { type: 'array', items: { type: 'string' } },
        estimatedMarketSize: { type: 'number' },
        competitivePosition: { type: 'string' },
      },
      required: [
        'name',
        'description',
        'primaryUseCase',
        'targetICP',
        'keyFeatures',
        'estimatedMarketSize',
        'competitivePosition',
      ],
      additionalProperties: false,
    },
    valueMetric: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        unit: { type: 'string' },
        measurable: { type: 'boolean' },
        observable: { type: 'boolean' },
        frequency: { type: 'string' },
        examples: { type: 'array', items: { type: 'string' } },
      },
      required: [
        'id',
        'name',
        'description',
        'unit',
        'measurable',
        'observable',
        'frequency',
      ],
      additionalProperties: false,
    },
    pricingArchetype: {
      type: 'object',
      properties: {
        type: {
          enum: [
            'seat-based',
            'usage-based',
            'credits',
            'hybrid',
            'outcome-based',
            'enterprise-only',
          ],
        },
        rationale: { type: 'string' },
        pros: { type: 'array', items: { type: 'string' } },
        cons: { type: 'array', items: { type: 'string' } },
      },
      required: ['type', 'rationale', 'pros', 'cons'],
      additionalProperties: false,
    },
    tier: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number', minimum: 0 },
        billingCycle: { enum: ['monthly', 'annual'] },
        features: { type: 'array', items: { $ref: '#/definitions/feature' } },
        usageLimits: {
          type: 'array',
          items: { $ref: '#/definitions/usageLimit' },
        },
        targetSegment: { type: 'string' },
      },
      required: [
        'id',
        'name',
        'description',
        'price',
        'billingCycle',
        'features',
        'targetSegment',
      ],
      additionalProperties: false,
    },
    feature: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        included: { type: 'boolean' },
        limit: { type: 'number' },
      },
      required: ['name', 'description', 'included'],
      additionalProperties: false,
    },
    usageLimit: {
      type: 'object',
      properties: {
        meter: { type: 'string' },
        limit: { type: 'number', minimum: 0 },
        overage: {
          type: 'object',
          properties: {
            type: { enum: ['per-unit', 'tiered', 'blocked'] },
            price: { type: 'number' },
          },
          required: ['type'],
          additionalProperties: false,
        },
      },
      required: ['meter', 'limit', 'overage'],
      additionalProperties: false,
    },
    meter: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        unit: { type: 'string' },
        telemetryMapping: { $ref: '#/definitions/telemetryMapping' },
        accuracy: { type: 'number', minimum: 0, maximum: 100 },
        fraudRisk: { enum: ['low', 'medium', 'high'] },
      },
      required: [
        'id',
        'name',
        'description',
        'unit',
        'telemetryMapping',
        'accuracy',
        'fraudRisk',
      ],
      additionalProperties: false,
    },
    telemetryMapping: {
      type: 'object',
      properties: {
        meter: { $ref: '#/definitions/meter' },
        telemetryEvents: {
          type: 'array',
          items: { $ref: '#/definitions/telemetryEvent' },
        },
        existingEvents: {
          type: 'array',
          items: { $ref: '#/definitions/telemetryEvent' },
        },
        newEventsRequired: {
          type: 'array',
          items: { $ref: '#/definitions/telemetryEvent' },
        },
        implementationGuidance: { type: 'string' },
        estimatedEffort: { type: 'number', minimum: 0 },
        fraudMitigations: { type: 'array', items: { type: 'string' } },
      },
      required: [
        'telemetryEvents',
        'existingEvents',
        'newEventsRequired',
        'implementationGuidance',
        'estimatedEffort',
        'fraudMitigations',
      ],
      additionalProperties: false,
    },
    telemetryEvent: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        properties: { type: 'object' },
        frequency: { enum: ['high', 'medium', 'low'] },
        accuracy: { type: 'number', minimum: 0, maximum: 100 },
      },
      required: ['name', 'description', 'properties', 'frequency', 'accuracy'],
      additionalProperties: false,
    },
    priceCalibration: {
      type: 'object',
      properties: {
        methodology: { type: 'string' },
        benchmarkComparison: { $ref: '#/definitions/comparisonResult' },
        marketAlignment: { type: 'string' },
        confidenceLevel: { type: 'number', minimum: 0, maximum: 1 },
        assumptions: { type: 'array', items: { type: 'string' } },
      },
      required: [
        'methodology',
        'benchmarkComparison',
        'marketAlignment',
        'confidenceLevel',
        'assumptions',
      ],
      additionalProperties: false,
    },
    comparisonResult: {
      type: 'object',
      properties: {
        proposedPrice: { type: 'number', minimum: 0 },
        marketAverage: { type: 'number', minimum: 0 },
        percentileRank: { type: 'number', minimum: 0, maximum: 100 },
        isOutlier: { type: 'boolean' },
        recommendation: { type: 'string' },
      },
      required: [
        'proposedPrice',
        'marketAverage',
        'percentileRank',
        'isOutlier',
        'recommendation',
      ],
      additionalProperties: false,
    },
    riskAssessment: {
      type: 'object',
      properties: {
        risks: { type: 'array', items: { $ref: '#/definitions/risk' } },
        complianceIssues: {
          type: 'array',
          items: { $ref: '#/definitions/complianceIssue' },
        },
        fairnessAnalysis: { type: 'string' },
        mitigationStrategies: { type: 'array', items: { type: 'string' } },
      },
      required: [
        'risks',
        'complianceIssues',
        'fairnessAnalysis',
        'mitigationStrategies',
      ],
      additionalProperties: false,
    },
    risk: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        description: { type: 'string' },
        severity: { enum: ['low', 'medium', 'high'] },
        likelihood: { enum: ['low', 'medium', 'high'] },
        mitigation: { type: 'string' },
      },
      required: ['id', 'description', 'severity', 'likelihood', 'mitigation'],
      additionalProperties: false,
    },
    complianceIssue: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        description: { type: 'string' },
        severity: { enum: ['low', 'medium', 'high'] },
        resolution: { type: 'string' },
      },
      required: ['id', 'description', 'severity', 'resolution'],
      additionalProperties: false,
    },
    recommendation: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        priority: { enum: ['low', 'medium', 'high'] },
        implementationGuidance: { type: 'string' },
      },
      required: [
        'id',
        'title',
        'description',
        'priority',
        'implementationGuidance',
      ],
      additionalProperties: false,
    },
    blueprintMetadata: {
      type: 'object',
      properties: {
        createdDate: { type: 'string', format: 'date-time' },
        lastUpdated: { type: 'string', format: 'date-time' },
        author: { type: 'string' },
        status: { enum: ['draft', 'approved', 'published'] },
        version: { type: 'integer', minimum: 1 },
        qualityScore: { type: 'number', minimum: 0, maximum: 100 },
      },
      required: [
        'createdDate',
        'lastUpdated',
        'author',
        'status',
        'version',
        'qualityScore',
      ],
      additionalProperties: false,
    },
  },
};

// ============================================================================
// Archetype Schema
// ============================================================================

export const archetypeSchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 10 },
    category: { type: 'string', minLength: 1 },
    primaryUseCase: { type: 'string', minLength: 1 },
    targetICP: { type: 'string', minLength: 1 },
    keyFeatures: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
    },
    estimatedMarketSize: { type: 'number', minimum: 0 },
    tokenConsumption: { enum: ['low', 'medium', 'high'] },
    userBaseSize: { type: 'number', minimum: 0 },
    growthPotential: { type: 'number', minimum: 0, maximum: 1 },
    priority: { type: 'number', minimum: 0, maximum: 100 },
    similarArchetypes: { type: 'array', items: { type: 'string' } },
    metadata: { type: 'object' },
  },
  required: [
    'id',
    'name',
    'description',
    'category',
    'primaryUseCase',
    'targetICP',
    'keyFeatures',
    'estimatedMarketSize',
    'tokenConsumption',
    'userBaseSize',
    'growthPotential',
    'priority',
  ],
  additionalProperties: false,
};

// ============================================================================
// Batch Results Schema
// ============================================================================

export const batchResultsSchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    batchId: { type: 'string' },
    blueprints: {
      type: 'array',
      items: { $ref: '#/definitions/blueprint' },
    },
    failedArchetypes: {
      type: 'array',
      items: { $ref: '#/definitions/failureReport' },
    },
    summary: {
      type: 'object',
      properties: {
        successCount: { type: 'integer', minimum: 0 },
        failureCount: { type: 'integer', minimum: 0 },
        averageQualityScore: { type: 'number', minimum: 0, maximum: 100 },
        totalProcessingTime: { type: 'number', minimum: 0 },
      },
      required: [
        'successCount',
        'failureCount',
        'averageQualityScore',
        'totalProcessingTime',
      ],
      additionalProperties: false,
    },
  },
  required: ['batchId', 'blueprints', 'failedArchetypes', 'summary'],
  additionalProperties: false,
  definitions: {
    blueprint: blueprintSchema,
    failureReport: {
      type: 'object',
      properties: {
        archetypeId: { type: 'string' },
        archetypeName: { type: 'string' },
        error: { type: 'string' },
        failedAgent: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        retryCount: { type: 'integer', minimum: 0 },
      },
      required: [
        'archetypeId',
        'archetypeName',
        'error',
        'failedAgent',
        'timestamp',
        'retryCount',
      ],
      additionalProperties: false,
    },
  },
};

// ============================================================================
// Validation Result Schema
// ============================================================================

export const validationResultSchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    passed: { type: 'boolean' },
    score: { type: 'number', minimum: 0, maximum: 100 },
    checks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          category: {
            enum: [
              'completeness',
              'consistency',
              'feasibility',
              'market-alignment',
            ],
          },
          passed: { type: 'boolean' },
          details: { type: 'string' },
        },
        required: ['name', 'category', 'passed', 'details'],
        additionalProperties: false,
      },
    },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          severity: { enum: ['low', 'medium', 'high'] },
          description: { type: 'string' },
          recommendation: { type: 'string' },
        },
        required: ['id', 'severity', 'description', 'recommendation'],
        additionalProperties: false,
      },
    },
    recommendations: { type: 'array', items: { type: 'string' } },
  },
  required: ['passed', 'score', 'checks', 'issues', 'recommendations'],
  additionalProperties: false,
};
