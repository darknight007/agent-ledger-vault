/**
 * Schema validation utilities for Blueprint data
 * Provides validation against JSON schemas and custom validation rules
 */

import Ajv from 'ajv';
import {
  Blueprint,
  Archetype,
  SchemaValidationResult,
  ValidationResult,
} from './types';
import {
  blueprintSchema,
  archetypeSchema,
  batchResultsSchema,
  validationResultSchema,
} from './schemas';

// Initialize JSON Schema validator
const ajv = new Ajv({ allErrors: true, verbose: true });

/**
 * Validates a blueprint against the blueprint schema
 */
export function validateBlueprint(
  blueprint: Blueprint
): SchemaValidationResult {
  try {
    const valid = ajv.validate(blueprintSchema, blueprint);

    if (!valid) {
      const errors = ajv.errorsText().split('\n');
      return {
        valid: false,
        errors,
        warnings: [],
      };
    }

    // Additional custom validations
    const warnings = validateBlueprintCustomRules(blueprint);

    return {
      valid: true,
      errors: [],
      warnings,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      warnings: [],
    };
  }
}

/**
 * Validates an archetype against the archetype schema
 */
export function validateArchetype(
  archetype: Archetype
): SchemaValidationResult {
  try {
    const valid = ajv.validate(archetypeSchema, archetype);

    if (!valid) {
      const errors = ajv.errorsText().split('\n');
      return {
        valid: false,
        errors,
        warnings: [],
      };
    }

    // Additional custom validations
    const warnings = validateArchetypeCustomRules(archetype);

    return {
      valid: true,
      errors: [],
      warnings,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      warnings: [],
    };
  }
}

/**
 * Custom validation rules for blueprints
 */
function validateBlueprintCustomRules(blueprint: Blueprint): string[] {
  const warnings: string[] = [];

  // Check that tiers are logically ordered by price
  const tierPrices = blueprint.tiers.map((t) => t.price);
  for (let i = 1; i < tierPrices.length; i++) {
    if (tierPrices[i] <= tierPrices[i - 1]) {
      warnings.push(
        `Tier prices should be in ascending order. Tier ${i} price (${tierPrices[i]}) is not greater than tier ${i - 1} price (${tierPrices[i - 1]})`
      );
    }
  }

  // Check that all meters have corresponding usage limits
  const meterIds = new Set(blueprint.meters.map((m) => m.id));
  const usageLimitMeters = new Set(
    blueprint.tiers.flatMap((t) => t.usageLimits.map((ul) => ul.meter))
  );

  for (const meter of usageLimitMeters) {
    if (!meterIds.has(meter)) {
      warnings.push(
        `Usage limit references meter "${meter}" which is not defined in meters`
      );
    }
  }

  // Check that value metrics are marked as both measurable and observable
  for (const metric of blueprint.valueMetrics) {
    if (!metric.measurable || !metric.observable) {
      warnings.push(
        `Value metric "${metric.name}" should be both measurable and observable for billing purposes`
      );
    }
  }

  // Check quality score is reasonable
  if (blueprint.metadata.qualityScore < 50) {
    warnings.push(
      `Blueprint quality score is low (${blueprint.metadata.qualityScore}). Consider addressing identified issues.`
    );
  }

  // Check that calibration has reasonable confidence level
  if (blueprint.calibration.confidenceLevel < 0.6) {
    warnings.push(
      `Calibration confidence level is low (${blueprint.calibration.confidenceLevel}). Consider additional market research.`
    );
  }

  return warnings;
}

/**
 * Custom validation rules for archetypes
 */
function validateArchetypeCustomRules(archetype: Archetype): string[] {
  const warnings: string[] = [];

  // Check that market size is reasonable
  if (archetype.estimatedMarketSize < 1000) {
    warnings.push(
      `Estimated market size is very small (${archetype.estimatedMarketSize}). Verify this is intentional.`
    );
  }

  // Check that growth potential is between 0 and 1
  if (archetype.growthPotential < 0 || archetype.growthPotential > 1) {
    warnings.push(
      `Growth potential should be between 0 and 1, got ${archetype.growthPotential}`
    );
  }

  // Check that priority is reasonable
  if (archetype.priority < 0 || archetype.priority > 100) {
    warnings.push(
      `Priority should be between 0 and 100, got ${archetype.priority}`
    );
  }

  // Check that key features are not empty
  if (archetype.keyFeatures.length === 0) {
    warnings.push('Archetype should have at least one key feature');
  }

  return warnings;
}

/**
 * Validates a validation result against the validation result schema
 */
export function validateValidationResult(
  result: ValidationResult
): SchemaValidationResult {
  try {
    const valid = ajv.validate(validationResultSchema, result);

    if (!valid) {
      const errors = ajv.errorsText().split('\n');
      return {
        valid: false,
        errors,
        warnings: [],
      };
    }

    return {
      valid: true,
      errors: [],
      warnings: [],
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      warnings: [],
    };
  }
}

/**
 * Validates that a blueprint has all required sections
 */
export function validateBlueprintCompleteness(
  blueprint: Blueprint
): {
  complete: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  // Check required sections
  if (!blueprint.agentProfile) missingFields.push('agentProfile');
  if (!blueprint.valueMetrics || blueprint.valueMetrics.length === 0)
    missingFields.push('valueMetrics');
  if (!blueprint.pricingArchetype) missingFields.push('pricingArchetype');
  if (!blueprint.tiers || blueprint.tiers.length === 0) missingFields.push('tiers');
  if (!blueprint.meters || blueprint.meters.length === 0)
    missingFields.push('meters');
  if (!blueprint.calibration) missingFields.push('calibration');
  if (!blueprint.risks) missingFields.push('risks');
  if (!blueprint.metadata) missingFields.push('metadata');
  if (!blueprint.markdownContent) missingFields.push('markdownContent');

  return {
    complete: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Validates that tiers are properly differentiated
 */
export function validateTierDifferentiation(
  blueprint: Blueprint
): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (blueprint.tiers.length < 2) {
    return { valid: true, issues: [] };
  }

  // Check that each tier has different features or limits
  for (let i = 0; i < blueprint.tiers.length - 1; i++) {
    const tier1 = blueprint.tiers[i];
    const tier2 = blueprint.tiers[i + 1];

    // Check price difference
    if (tier2.price <= tier1.price) {
      issues.push(
        `Tier "${tier2.name}" price (${tier2.price}) should be higher than tier "${tier1.name}" price (${tier1.price})`
      );
    }

    // Check feature count difference
    const features1 = tier1.features.filter((f) => f.included).length;
    const features2 = tier2.features.filter((f) => f.included).length;

    if (features2 <= features1) {
      issues.push(
        `Tier "${tier2.name}" should include more features than tier "${tier1.name}"`
      );
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Validates that value metrics are observable
 */
export function validateMetricObservability(
  blueprint: Blueprint
): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  for (const metric of blueprint.valueMetrics) {
    if (!metric.observable) {
      issues.push(
        `Value metric "${metric.name}" is not marked as observable. This may cause billing implementation issues.`
      );
    }

    if (!metric.measurable) {
      issues.push(
        `Value metric "${metric.name}" is not marked as measurable. This may cause billing implementation issues.`
      );
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Validates pricing competitiveness
 */
export function validatePricingCompetitiveness(
  blueprint: Blueprint
): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  const comparison = blueprint.calibration.benchmarkComparison;

  if (comparison.isOutlier) {
    issues.push(
      `Pricing is an outlier compared to market benchmarks. Proposed: ${comparison.proposedPrice}, Market Average: ${comparison.marketAverage}`
    );
  }

  if (comparison.percentileRank < 25) {
    issues.push(
      `Pricing is in the bottom 25% of market. Consider if this is intentional for market penetration.`
    );
  }

  if (comparison.percentileRank > 90) {
    issues.push(
      `Pricing is in the top 10% of market. Ensure value proposition justifies premium pricing.`
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Validates telemetry feasibility
 */
export function validateTelemetryFeasibility(
  blueprint: Blueprint
): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  for (const meter of blueprint.meters) {
    const mapping = meter.telemetryMapping;

    if (mapping.newEventsRequired.length > 0) {
      if (mapping.estimatedEffort > 40) {
        issues.push(
          `Meter "${meter.name}" requires significant telemetry implementation (${mapping.estimatedEffort} hours). Consider simplifying the meter.`
        );
      }
    }

    if (meter.accuracy < 80) {
      issues.push(
        `Meter "${meter.name}" has low accuracy (${meter.accuracy}%). This may cause billing disputes.`
      );
    }

    if (meter.fraudRisk === 'high') {
      issues.push(
        `Meter "${meter.name}" has high fraud risk. Ensure mitigation strategies are in place.`
      );
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Calculates a comprehensive quality score for a blueprint
 */
export function calculateBlueprintQualityScore(
  blueprint: Blueprint,
  validationResults: {
    completeness: { complete: boolean; missingFields: string[] };
    tierDifferentiation: { valid: boolean; issues: string[] };
    metricObservability: { valid: boolean; issues: string[] };
    pricingCompetitiveness: { valid: boolean; issues: string[] };
    telemetryFeasibility: { valid: boolean; issues: string[] };
  }
): number {
  let score = 100;

  // Deduct for missing fields
  score -= validationResults.completeness.missingFields.length * 5;

  // Deduct for tier differentiation issues
  score -= validationResults.tierDifferentiation.issues.length * 3;

  // Deduct for metric observability issues
  score -= validationResults.metricObservability.issues.length * 5;

  // Deduct for pricing competitiveness issues
  score -= validationResults.pricingCompetitiveness.issues.length * 3;

  // Deduct for telemetry feasibility issues
  score -= validationResults.telemetryFeasibility.issues.length * 4;

  // Bonus for high confidence calibration
  if (blueprint.calibration.confidenceLevel > 0.8) {
    score += 5;
  }

  // Bonus for low risk assessment
  if (blueprint.risks.risks.length === 0) {
    score += 3;
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}
