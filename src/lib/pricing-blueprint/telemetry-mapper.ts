import { Blueprint, Meter, TelemetryEvent, TelemetryMapping } from './types';

export interface ExistingEvent {
  name: string;
  description: string;
  properties: Record<string, string>;
  frequency: 'high' | 'medium' | 'low';
  accuracy: number;
}

export interface MissingEvent {
  name: string;
  description: string;
  properties: Record<string, string>;
  frequency: 'high' | 'medium' | 'low';
  estimatedEffort: number; // in hours
  complexity: 'low' | 'medium' | 'high';
}

export interface EffortEstimate {
  totalHours: number;
  byComplexity: {
    low: number;
    medium: number;
    high: number;
  };
  estimatedTeamDays: number;
  riskFactors: string[];
}

export interface ObservabilityResult {
  meter: Meter;
  isObservable: boolean;
  accuracy: number;
  confidence: number;
  gaps: string[];
  recommendations: string[];
}

export interface FraudVector {
  id: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  meter: string;
}

export class TelemetryMapper {
  private existingEventsRegistry: Map<string, ExistingEvent> = new Map();
  private fraudVectorRegistry: Map<string, FraudVector[]> = new Map();

  constructor() {
    this.initializeExistingEvents();
    this.initializeFraudVectors();
  }

  private initializeExistingEvents(): void {
    // Common existing telemetry events
    const commonEvents: ExistingEvent[] = [
      {
        name: 'user_login',
        description: 'User authentication event',
        properties: { userId: 'string', timestamp: 'date', source: 'string' },
        frequency: 'high',
        accuracy: 99,
      },
      {
        name: 'api_call',
        description: 'API endpoint invocation',
        properties: { endpoint: 'string', userId: 'string', duration: 'number', status: 'number' },
        frequency: 'high',
        accuracy: 99,
      },
      {
        name: 'token_usage',
        description: 'LLM token consumption',
        properties: { userId: 'string', model: 'string', tokens: 'number', cost: 'number' },
        frequency: 'high',
        accuracy: 98,
      },
      {
        name: 'feature_usage',
        description: 'Feature activation event',
        properties: { userId: 'string', featureId: 'string', timestamp: 'date' },
        frequency: 'medium',
        accuracy: 95,
      },
      {
        name: 'document_processed',
        description: 'Document processing completion',
        properties: { userId: 'string', documentId: 'string', pages: 'number', duration: 'number' },
        frequency: 'medium',
        accuracy: 97,
      },
      {
        name: 'workflow_execution',
        description: 'Workflow run completion',
        properties: { userId: 'string', workflowId: 'string', status: 'string', duration: 'number' },
        frequency: 'medium',
        accuracy: 96,
      },
      {
        name: 'report_generated',
        description: 'Report generation event',
        properties: { userId: 'string', reportType: 'string', timestamp: 'date', pages: 'number' },
        frequency: 'low',
        accuracy: 98,
      },
      {
        name: 'integration_call',
        description: 'Third-party integration invocation',
        properties: { userId: 'string', integrationId: 'string', status: 'string', duration: 'number' },
        frequency: 'medium',
        accuracy: 94,
      },
    ];

    commonEvents.forEach((event) => {
      this.existingEventsRegistry.set(event.name, event);
    });
  }

  private initializeFraudVectors(): void {
    // Common fraud vectors by meter type
    const fraudVectors: Map<string, FraudVector[]> = new Map([
      [
        'api_calls',
        [
          {
            id: 'api_spam',
            description: 'Automated API call spam to inflate usage',
            likelihood: 'high',
            impact: 'high',
            mitigation: 'Rate limiting, IP-based throttling, anomaly detection',
            meter: 'api_calls',
          },
          {
            id: 'api_loop',
            description: 'Recursive API calls creating artificial usage',
            likelihood: 'medium',
            impact: 'high',
            mitigation: 'Call depth limits, circuit breakers, timeout enforcement',
            meter: 'api_calls',
          },
        ],
      ],
      [
        'tokens',
        [
          {
            id: 'token_padding',
            description: 'Padding requests with unnecessary tokens',
            likelihood: 'medium',
            impact: 'medium',
            mitigation: 'Token validation, content analysis, usage patterns',
            meter: 'tokens',
          },
          {
            id: 'model_switching',
            description: 'Switching to cheaper models to game pricing',
            likelihood: 'low',
            impact: 'medium',
            mitigation: 'Model enforcement, tier-based model access',
            meter: 'tokens',
          },
        ],
      ],
      [
        'seats',
        [
          {
            id: 'seat_sharing',
            description: 'Multiple users sharing single seat',
            likelihood: 'high',
            impact: 'medium',
            mitigation: 'Concurrent session limits, IP tracking, usage patterns',
            meter: 'seats',
          },
          {
            id: 'account_cycling',
            description: 'Creating/deleting accounts to reset usage',
            likelihood: 'medium',
            impact: 'low',
            mitigation: 'Account history tracking, grace periods, billing holds',
            meter: 'seats',
          },
        ],
      ],
      [
        'documents',
        [
          {
            id: 'document_duplication',
            description: 'Processing same document multiple times',
            likelihood: 'medium',
            impact: 'medium',
            mitigation: 'Content hashing, deduplication, usage tracking',
            meter: 'documents',
          },
        ],
      ],
    ]);

    this.fraudVectorRegistry = fraudVectors;
  }

  createMapping(meter: Meter): TelemetryMapping {
    const existingEvents = this.findExistingEvents(meter);
    const newEventsRequired = this.identifyNewEvents(meter);

    const mapping: TelemetryMapping = {
      meter,
      telemetryEvents: [...existingEvents, ...newEventsRequired],
      existingEvents,
      newEventsRequired,
      implementationGuidance: this.generateImplementationGuidance(meter, newEventsRequired),
      estimatedEffort: this.estimateEffort(newEventsRequired),
      fraudMitigations: this.getFraudMitigations(meter.id),
    };

    return mapping;
  }

  private findExistingEvents(meter: Meter): ExistingEvent[] {
    const meterName = meter.name.toLowerCase();
    const existing: ExistingEvent[] = [];

    this.existingEventsRegistry.forEach((event) => {
      if (
        meterName.includes(event.name) ||
        event.name.includes(meterName) ||
        this.isSemanticMatch(meterName, event.name)
      ) {
        existing.push(event);
      }
    });

    // If no exact matches, return some common events as fallback
    if (existing.length === 0) {
      existing.push(this.existingEventsRegistry.get('api_call')!);
    }

    return existing;
  }

  private isSemanticMatch(meterName: string, eventName: string): boolean {
    const meterTokens = meterName.split(/[\s_-]+/).filter((t) => t.length > 0);
    const eventTokens = eventName.split(/[\s_-]+/).filter((t) => t.length > 0);
    const matches = meterTokens.filter((token) => eventTokens.some((et) => et.includes(token) || token.includes(et))).length;
    return matches >= 1;
  }

  private identifyNewEvents(meter: Meter): MissingEvent[] {
    const newEvents: MissingEvent[] = [];

    // Always generate at least one new event for any meter
    newEvents.push({
      name: `${meter.name}_tracking`,
      description: `Detailed tracking of ${meter.name}`,
      properties: { userId: 'string', value: 'number', timestamp: 'date' },
      frequency: 'high',
      estimatedEffort: 3,
      complexity: 'low',
    });

    // Generate additional events based on meter characteristics
    if (meter.name.includes('token')) {
      newEvents.push({
        name: `${meter.name}_detailed`,
        description: `Detailed tracking of ${meter.name} with breakdown by model and operation`,
        properties: { userId: 'string', model: 'string', operation: 'string', count: 'number' },
        frequency: 'high',
        estimatedEffort: 4,
        complexity: 'medium',
      });
    }

    if (meter.name.includes('api') || meter.name.includes('call')) {
      newEvents.push({
        name: `${meter.name}_latency`,
        description: `Latency tracking for ${meter.name}`,
        properties: { userId: 'string', endpoint: 'string', latency: 'number', status: 'number' },
        frequency: 'high',
        estimatedEffort: 3,
        complexity: 'low',
      });
    }

    if (meter.name.includes('document') || meter.name.includes('file')) {
      newEvents.push({
        name: `${meter.name}_metadata`,
        description: `Metadata tracking for ${meter.name}`,
        properties: { userId: 'string', size: 'number', type: 'string', duration: 'number' },
        frequency: 'medium',
        estimatedEffort: 5,
        complexity: 'medium',
      });
    }

    if (meter.name.includes('user') || meter.name.includes('seat')) {
      newEvents.push({
        name: `${meter.name}_activity`,
        description: `Activity tracking for ${meter.name}`,
        properties: { userId: 'string', lastActive: 'date', activityCount: 'number' },
        frequency: 'low',
        estimatedEffort: 2,
        complexity: 'low',
      });
    }

    return newEvents;
  }

  identifyExistingEvents(blueprint: Blueprint): ExistingEvent[] {
    const existing: ExistingEvent[] = [];
    const seen = new Set<string>();

    blueprint.meters.forEach((meter) => {
      const meterExisting = this.findExistingEvents(meter);
      meterExisting.forEach((event) => {
        if (!seen.has(event.name)) {
          existing.push(event);
          seen.add(event.name);
        }
      });
    });

    return existing;
  }

  identifyMissingEvents(blueprint: Blueprint): MissingEvent[] {
    const missing: MissingEvent[] = [];
    const seen = new Set<string>();

    blueprint.meters.forEach((meter) => {
      const meterMissing = this.identifyNewEvents(meter);
      meterMissing.forEach((event) => {
        if (!seen.has(event.name)) {
          missing.push(event);
          seen.add(event.name);
        }
      });
    });

    return missing;
  }

  estimateImplementationEffort(blueprint: Blueprint): EffortEstimate {
    const missingEvents = this.identifyMissingEvents(blueprint);

    const byComplexity = {
      low: 0,
      medium: 0,
      high: 0,
    };

    let totalHours = 0;

    missingEvents.forEach((event) => {
      byComplexity[event.complexity] += event.estimatedEffort;
      totalHours += event.estimatedEffort;
    });

    // Add overhead for testing, documentation, deployment
    const overhead = totalHours * 0.3;
    totalHours += overhead;

    return {
      totalHours,
      byComplexity,
      estimatedTeamDays: Math.ceil(totalHours / 8),
      riskFactors: this.identifyRiskFactors(blueprint),
    };
  }

  private identifyRiskFactors(blueprint: Blueprint): string[] {
    const risks: string[] = [];

    const highComplexityCount = this.identifyMissingEvents(blueprint).filter(
      (e) => e.complexity === 'high'
    ).length;

    if (highComplexityCount > 2) {
      risks.push('Multiple high-complexity telemetry implementations required');
    }

    const highFrequencyCount = this.identifyMissingEvents(blueprint).filter(
      (e) => e.frequency === 'high'
    ).length;

    if (highFrequencyCount > 3) {
      risks.push('High volume of telemetry events may impact performance');
    }

    const fraudVectors = blueprint.meters.flatMap((m) => this.getFraudMitigations(m.id));
    if (fraudVectors.length > 5) {
      risks.push('Multiple fraud vectors require mitigation strategies');
    }

    return risks;
  }

  validateObservability(meter: Meter): ObservabilityResult {
    const existing = this.findExistingEvents(meter);
    const missing = this.identifyNewEvents({ ...meter });

    const totalEvents = Math.max(existing.length + missing.length, 1);
    const existingAccuracy = existing.length > 0 ? existing.reduce((sum, e) => sum + e.accuracy, 0) / existing.length : 85;

    const gaps: string[] = [];
    const recommendations: string[] = [];

    if (existing.length === 0) {
      gaps.push('No existing telemetry events found for this meter');
      recommendations.push('Implement new telemetry events from scratch');
    }

    if (missing.length > 0) {
      gaps.push(`${missing.length} new telemetry events required`);
      recommendations.push('Prioritize high-frequency events for implementation');
    }

    if (existingAccuracy < 95) {
      gaps.push('Existing telemetry accuracy below 95% threshold');
      recommendations.push('Consider supplementary validation mechanisms');
    }

    const isObservable = existing.length > 0 || missing.length <= 3;
    const accuracy = (existingAccuracy * existing.length + 85 * missing.length) / totalEvents;
    const confidence = Math.min(100, (existing.length / totalEvents) * 100 + 50);

    return {
      meter,
      isObservable,
      accuracy: Math.round(accuracy),
      confidence: Math.round(confidence),
      gaps,
      recommendations,
    };
  }

  identifyFraudVectors(blueprint: Blueprint): FraudVector[] {
    const vectors: FraudVector[] = [];
    const seen = new Set<string>();

    blueprint.meters.forEach((meter) => {
      const meterVectors = this.fraudVectorRegistry.get(meter.id) || [];
      meterVectors.forEach((vector) => {
        if (!seen.has(vector.id)) {
          vectors.push(vector);
          seen.add(vector.id);
        }
      });
    });

    return vectors;
  }

  private generateImplementationGuidance(meter: Meter, newEvents: MissingEvent[]): string {
    if (newEvents.length === 0) {
      return `All telemetry for "${meter.name}" can be captured using existing events.`;
    }

    const guidance = [
      `Implementation guidance for "${meter.name}":`,
      '',
      '1. Existing Events:',
      '   - Leverage existing telemetry infrastructure',
      '   - Minimal engineering effort required',
      '',
      '2. New Events Required:',
      ...newEvents.map((e) => `   - ${e.name}: ${e.description} (${e.complexity} complexity, ~${e.estimatedEffort}h)`),
      '',
      '3. Implementation Steps:',
      '   - Define event schema and properties',
      '   - Implement event capture in application code',
      '   - Add validation and error handling',
      '   - Test with sample data',
      '   - Deploy to production with monitoring',
      '',
      '4. Validation:',
      '   - Verify event capture accuracy',
      '   - Monitor for data quality issues',
      '   - Set up alerts for anomalies',
    ];

    return guidance.join('\n');
  }

  private estimateEffort(newEvents: MissingEvent[]): number {
    return newEvents.reduce((sum, event) => sum + event.estimatedEffort, 0);
  }

  private getFraudMitigations(meterId: string): string[] {
    const vectors = this.fraudVectorRegistry.get(meterId) || [];
    return vectors.map((v) => v.mitigation);
  }
}
