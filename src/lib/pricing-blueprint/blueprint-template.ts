/**
 * Blueprint Template System
 * Provides standardized template validation, formatting, and output generation
 */

import { Blueprint, BlueprintMetadata } from './types';
import { blueprintSchema } from './schemas';
import { validateBlueprint } from './schema-validator';

/**
 * Blueprint template with default structure and validation
 */
export class BlueprintTemplate {
  /**
   * Creates a new blueprint with default metadata
   */
  static createBlueprint(
    archetypeId: string,
    author: string = 'system'
  ): Partial<Blueprint> {
    const now = new Date();

    return {
      metadata: {
        createdDate: now,
        lastUpdated: now,
        author,
        status: 'draft',
        version: 1,
        qualityScore: 0,
      } as BlueprintMetadata,
      valueMetrics: [],
      tiers: [],
      meters: [],
      risks: {
        risks: [],
        complianceIssues: [],
        fairnessAnalysis: '',
        mitigationStrategies: [],
      },
      recommendations: [],
    };
  }

  /**
   * Validates a blueprint against the template schema
   */
  static validate(blueprint: Blueprint): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const result = validateBlueprint(blueprint);
    return {
      valid: result.valid,
      errors: result.errors,
      warnings: result.warnings,
    };
  }

  /**
   * Converts blueprint to JSON format
   */
  static toJSON(blueprint: Blueprint): string {
    return JSON.stringify(blueprint, null, 2);
  }

  /**
   * Converts blueprint to markdown format
   */
  static toMarkdown(blueprint: Blueprint): string {
    const lines: string[] = [];

    // Header
    lines.push(`# Pricing Blueprint: ${blueprint.archetype.name}`);
    lines.push('');

    // Metadata
    lines.push('## Metadata');
    lines.push(`- **Status**: ${blueprint.metadata.status}`);
    lines.push(`- **Version**: ${blueprint.metadata.version}`);
    lines.push(`- **Quality Score**: ${blueprint.metadata.qualityScore}/100`);
    lines.push(`- **Created**: ${blueprint.metadata.createdDate.toISOString()}`);
    lines.push(`- **Last Updated**: ${blueprint.metadata.lastUpdated.toISOString()}`);
    lines.push(`- **Author**: ${blueprint.metadata.author}`);
    lines.push('');

    // Agent Profile
    lines.push('## Agent Profile');
    lines.push(`**Name**: ${blueprint.agentProfile.name}`);
    lines.push(`**Description**: ${blueprint.agentProfile.description}`);
    lines.push(`**Primary Use Case**: ${blueprint.agentProfile.primaryUseCase}`);
    lines.push(`**Target ICP**: ${blueprint.agentProfile.targetICP}`);
    lines.push(`**Estimated Market Size**: $${blueprint.agentProfile.estimatedMarketSize.toLocaleString()}`);
    lines.push(`**Competitive Position**: ${blueprint.agentProfile.competitivePosition}`);
    lines.push('');

    lines.push('### Key Features');
    for (const feature of blueprint.agentProfile.keyFeatures) {
      lines.push(`- ${feature}`);
    }
    lines.push('');

    // Value Metrics
    lines.push('## Value Metrics');
    for (const metric of blueprint.valueMetrics) {
      lines.push(`### ${metric.name}`);
      lines.push(`**Description**: ${metric.description}`);
      lines.push(`**Unit**: ${metric.unit}`);
      lines.push(`**Measurable**: ${metric.measurable ? 'Yes' : 'No'}`);
      lines.push(`**Observable**: ${metric.observable ? 'Yes' : 'No'}`);
      lines.push(`**Frequency**: ${metric.frequency}`);
      if (metric.examples.length > 0) {
        lines.push('**Examples**:');
        for (const example of metric.examples) {
          lines.push(`- ${example}`);
        }
      }
      lines.push('');
    }

    // Pricing Archetype
    lines.push('## Pricing Archetype');
    lines.push(`**Type**: ${blueprint.pricingArchetype.type}`);
    lines.push(`**Rationale**: ${blueprint.pricingArchetype.rationale}`);
    lines.push('');

    lines.push('### Pros');
    for (const pro of blueprint.pricingArchetype.pros) {
      lines.push(`- ${pro}`);
    }
    lines.push('');

    lines.push('### Cons');
    for (const con of blueprint.pricingArchetype.cons) {
      lines.push(`- ${con}`);
    }
    lines.push('');

    // Tiers
    lines.push('## Pricing Tiers');
    for (const tier of blueprint.tiers) {
      lines.push(`### ${tier.name}`);
      lines.push(`**Price**: $${tier.price}/${tier.billingCycle}`);
      lines.push(`**Description**: ${tier.description}`);
      lines.push(`**Target Segment**: ${tier.targetSegment}`);
      lines.push('');

      lines.push('#### Features');
      for (const feature of tier.features) {
        const status = feature.included ? '✓' : '✗';
        const limit = feature.limit ? ` (${feature.limit})` : '';
        lines.push(`- ${status} ${feature.name}${limit}: ${feature.description}`);
      }
      lines.push('');

      if (tier.usageLimits.length > 0) {
        lines.push('#### Usage Limits');
        for (const limit of tier.usageLimits) {
          lines.push(
            `- ${limit.meter}: ${limit.limit} (${limit.overage.type}${limit.overage.price ? ` @ $${limit.overage.price}` : ''})`
          );
        }
        lines.push('');
      }
    }

    // Meters
    lines.push('## Billing Meters');
    for (const meter of blueprint.meters) {
      lines.push(`### ${meter.name}`);
      lines.push(`**Description**: ${meter.description}`);
      lines.push(`**Unit**: ${meter.unit}`);
      lines.push(`**Accuracy**: ${meter.accuracy}%`);
      lines.push(`**Fraud Risk**: ${meter.fraudRisk}`);
      lines.push('');

      const mapping = meter.telemetryMapping;
      lines.push('#### Telemetry Mapping');
      lines.push(`**Implementation Guidance**: ${mapping.implementationGuidance}`);
      lines.push(`**Estimated Effort**: ${mapping.estimatedEffort} hours`);
      lines.push('');

      if (mapping.existingEvents.length > 0) {
        lines.push('**Existing Events**:');
        for (const event of mapping.existingEvents) {
          lines.push(`- ${event.name}: ${event.description}`);
        }
        lines.push('');
      }

      if (mapping.newEventsRequired.length > 0) {
        lines.push('**New Events Required**:');
        for (const event of mapping.newEventsRequired) {
          lines.push(`- ${event.name}: ${event.description}`);
        }
        lines.push('');
      }

      if (mapping.fraudMitigations.length > 0) {
        lines.push('**Fraud Mitigations**:');
        for (const mitigation of mapping.fraudMitigations) {
          lines.push(`- ${mitigation}`);
        }
        lines.push('');
      }
    }

    // Calibration
    lines.push('## Price Calibration');
    lines.push(`**Methodology**: ${blueprint.calibration.methodology}`);
    lines.push(`**Market Alignment**: ${blueprint.calibration.marketAlignment}`);
    lines.push(`**Confidence Level**: ${(blueprint.calibration.confidenceLevel * 100).toFixed(0)}%`);
    lines.push('');

    const comparison = blueprint.calibration.benchmarkComparison;
    lines.push('### Benchmark Comparison');
    lines.push(`**Proposed Price**: $${comparison.proposedPrice}`);
    lines.push(`**Market Average**: $${comparison.marketAverage}`);
    lines.push(`**Percentile Rank**: ${comparison.percentileRank}th`);
    lines.push(`**Is Outlier**: ${comparison.isOutlier ? 'Yes' : 'No'}`);
    lines.push(`**Recommendation**: ${comparison.recommendation}`);
    lines.push('');

    lines.push('### Assumptions');
    for (const assumption of blueprint.calibration.assumptions) {
      lines.push(`- ${assumption}`);
    }
    lines.push('');

    // Risks
    lines.push('## Risk Assessment');
    lines.push(`**Fairness Analysis**: ${blueprint.risks.fairnessAnalysis}`);
    lines.push('');

    if (blueprint.risks.risks.length > 0) {
      lines.push('### Identified Risks');
      for (const risk of blueprint.risks.risks) {
        lines.push(
          `- **${risk.description}** (${risk.severity}/${risk.likelihood}): ${risk.mitigation}`
        );
      }
      lines.push('');
    }

    if (blueprint.risks.complianceIssues.length > 0) {
      lines.push('### Compliance Issues');
      for (const issue of blueprint.risks.complianceIssues) {
        lines.push(`- **${issue.description}** (${issue.severity}): ${issue.resolution}`);
      }
      lines.push('');
    }

    lines.push('### Mitigation Strategies');
    for (const strategy of blueprint.risks.mitigationStrategies) {
      lines.push(`- ${strategy}`);
    }
    lines.push('');

    // Recommendations
    if (blueprint.recommendations.length > 0) {
      lines.push('## Recommendations');
      for (const rec of blueprint.recommendations) {
        lines.push(`### ${rec.title} (${rec.priority})`);
        lines.push(`${rec.description}`);
        lines.push('');
        lines.push(`**Implementation Guidance**: ${rec.implementationGuidance}`);
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  /**
   * Parses a JSON blueprint string
   */
  static fromJSON(jsonString: string): Blueprint {
    try {
      const data = JSON.parse(jsonString);
      // Convert date strings back to Date objects
      if (data.metadata?.createdDate) {
        data.metadata.createdDate = new Date(data.metadata.createdDate);
      }
      if (data.metadata?.lastUpdated) {
        data.metadata.lastUpdated = new Date(data.metadata.lastUpdated);
      }
      return data as Blueprint;
    } catch (error) {
      throw new Error(
        `Failed to parse blueprint JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Gets the schema for validation
   */
  static getSchema() {
    return blueprintSchema;
  }

  /**
   * Validates template consistency across multiple blueprints
   */
  static validateConsistency(blueprints: Blueprint[]): {
    consistent: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    if (blueprints.length === 0) {
      return { consistent: true, issues: [] };
    }

    // Check that all blueprints have the same required sections
    const firstBlueprint = blueprints[0];
    const requiredSections = [
      'agentProfile',
      'valueMetrics',
      'pricingArchetype',
      'tiers',
      'meters',
      'calibration',
      'risks',
      'metadata',
    ];

    for (let i = 1; i < blueprints.length; i++) {
      const blueprint = blueprints[i];

      for (const section of requiredSections) {
        const hasSection = (blueprint as any)[section] !== undefined;
        if (!hasSection) {
          issues.push(
            `Blueprint ${blueprint.id} is missing section: ${section}`
          );
        }
      }

      // Check metadata consistency
      if (blueprint.metadata.version !== firstBlueprint.metadata.version) {
        issues.push(
          `Blueprint ${blueprint.id} has different version (${blueprint.metadata.version}) than first blueprint (${firstBlueprint.metadata.version})`
        );
      }
    }

    return {
      consistent: issues.length === 0,
      issues,
    };
  }

  /**
   * Creates a blueprint version snapshot
   */
  static createVersion(
    blueprint: Blueprint,
    changes: string
  ): {
    version: number;
    timestamp: Date;
    author: string;
    changes: string;
    blueprint: Blueprint;
  } {
    return {
      version: blueprint.metadata.version,
      timestamp: blueprint.metadata.lastUpdated,
      author: blueprint.metadata.author,
      changes,
      blueprint: JSON.parse(JSON.stringify(blueprint)), // Deep copy
    };
  }

  /**
   * Updates blueprint metadata
   */
  static updateMetadata(
    blueprint: Blueprint,
    updates: Partial<BlueprintMetadata>
  ): Blueprint {
    return {
      ...blueprint,
      metadata: {
        ...blueprint.metadata,
        ...updates,
        lastUpdated: new Date(),
      },
    };
  }

  /**
   * Increments blueprint version
   */
  static incrementVersion(blueprint: Blueprint): Blueprint {
    return BlueprintTemplate.updateMetadata(blueprint, {
      version: blueprint.metadata.version + 1,
    });
  }
}
