/**
 * QA Validation System
 * Comprehensive validation of pricing blueprints against quality standards
 */

import { Blueprint, ValidationResult, ValidationCheck, ValidationIssue } from './types';
import {
  validateBlueprintCompleteness,
  validateTierDifferentiation,
  validateMetricObservability,
  validatePricingCompetitiveness,
  validateTelemetryFeasibility,
} from './schema-validator';

/**
 * QA Validator for comprehensive blueprint validation
 */
export class QAValidator {
  /**
   * Validates a blueprint against all QA checks
   */
  static validate(blueprint: Blueprint): ValidationResult {
    const checks: ValidationCheck[] = [];
    const issues: ValidationIssue[] = [];
    const recommendations: string[] = [];

    // Run all validation checks
    const completenessCheck = this.checkCompleteness(blueprint);
    checks.push(...completenessCheck.checks);
    issues.push(...completenessCheck.issues);
    recommendations.push(...completenessCheck.recommendations);

    const consistencyCheck = this.checkConsistency(blueprint);
    checks.push(...consistencyCheck.checks);
    issues.push(...consistencyCheck.issues);
    recommendations.push(...consistencyCheck.recommendations);

    const feasibilityCheck = this.checkFeasibility(blueprint);
    checks.push(...feasibilityCheck.checks);
    issues.push(...feasibilityCheck.issues);
    recommendations.push(...feasibilityCheck.recommendations);

    const marketAlignmentCheck = this.checkMarketAlignment(blueprint);
    checks.push(...marketAlignmentCheck.checks);
    issues.push(...marketAlignmentCheck.issues);
    recommendations.push(...marketAlignmentCheck.recommendations);

    // Calculate overall score
    const passedChecks = checks.filter((c) => c.passed).length;
    const score = (passedChecks / checks.length) * 100;

    return {
      passed: issues.filter((i) => i.severity === 'high').length === 0,
      score: Math.round(score),
      checks,
      issues,
      recommendations,
    };
  }

  /**
   * Checks blueprint completeness
   */
  private static checkCompleteness(blueprint: Blueprint): {
    checks: ValidationCheck[];
    issues: ValidationIssue[];
    recommendations: string[];
  } {
    const checks: ValidationCheck[] = [];
    const issues: ValidationIssue[] = [];
    const recommendations: string[] = [];

    const completeness = validateBlueprintCompleteness(blueprint);

    const check: ValidationCheck = {
      name: 'Blueprint Completeness',
      category: 'completeness',
      passed: completeness.complete,
      details: completeness.complete
        ? 'All required sections present'
        : `Missing sections: ${completeness.missingFields.join(', ')}`,
    };
    checks.push(check);

    if (!completeness.complete) {
      for (const field of completeness.missingFields) {
        issues.push({
          id: `missing-${field}`,
          severity: 'high',
          description: `Required section missing: ${field}`,
          recommendation: `Add ${field} to the blueprint`,
        });
      }
      recommendations.push('Ensure all required blueprint sections are populated');
    }

    // Check for populated content
    if (blueprint.valueMetrics.length === 0) {
      issues.push({
        id: 'no-value-metrics',
        severity: 'high',
        description: 'No value metrics defined',
        recommendation: 'Define at least 2-3 value metrics for the pricing model',
      });
    }

    if (blueprint.tiers.length < 2) {
      issues.push({
        id: 'insufficient-tiers',
        severity: 'medium',
        description: 'Fewer than 2 pricing tiers defined',
        recommendation: 'Define at least 2 pricing tiers (e.g., Starter, Pro)',
      });
    }

    if (blueprint.meters.length === 0) {
      issues.push({
        id: 'no-meters',
        severity: 'high',
        description: 'No billing meters defined',
        recommendation: 'Define at least one billing meter for usage tracking',
      });
    }

    return { checks, issues, recommendations };
  }

  /**
   * Checks blueprint consistency
   */
  private static checkConsistency(blueprint: Blueprint): {
    checks: ValidationCheck[];
    issues: ValidationIssue[];
    recommendations: string[];
  } {
    const checks: ValidationCheck[] = [];
    const issues: ValidationIssue[] = [];
    const recommendations: string[] = [];

    // Check tier differentiation
    const tierDiff = validateTierDifferentiation(blueprint);
    const tierCheck: ValidationCheck = {
      name: 'Tier Differentiation',
      category: 'consistency',
      passed: tierDiff.valid,
      details: tierDiff.valid
        ? 'Tiers are properly differentiated'
        : `Tier issues: ${tierDiff.issues.join('; ')}`,
    };
    checks.push(tierCheck);

    if (!tierDiff.valid) {
      for (const issue of tierDiff.issues) {
        issues.push({
          id: `tier-${issues.length}`,
          severity: 'medium',
          description: issue,
          recommendation: 'Ensure each tier has distinct pricing and features',
        });
      }
      recommendations.push('Review tier structure for proper differentiation');
    }

    // Check metric consistency
    const metricCheck: ValidationCheck = {
      name: 'Metric Consistency',
      category: 'consistency',
      passed: blueprint.valueMetrics.every((m) => m.unit && m.frequency),
      details: blueprint.valueMetrics.every((m) => m.unit && m.frequency)
        ? 'All metrics have unit and frequency'
        : 'Some metrics missing unit or frequency',
    };
    checks.push(metricCheck);

    if (!metricCheck.passed) {
      issues.push({
        id: 'metric-consistency',
        severity: 'medium',
        description: 'Some metrics missing unit or frequency information',
        recommendation: 'Ensure all metrics have clear unit and frequency definitions',
      });
    }

    // Check pricing consistency
    const pricingCheck: ValidationCheck = {
      name: 'Pricing Consistency',
      category: 'consistency',
      passed: blueprint.tiers.every((t) => t.price > 0),
      details: blueprint.tiers.every((t) => t.price > 0)
        ? 'All tiers have valid pricing'
        : 'Some tiers have invalid pricing',
    };
    checks.push(pricingCheck);

    if (!pricingCheck.passed) {
      issues.push({
        id: 'pricing-consistency',
        severity: 'high',
        description: 'Some tiers have invalid or zero pricing',
        recommendation: 'Ensure all tiers have positive pricing values',
      });
    }

    return { checks, issues, recommendations };
  }

  /**
   * Checks blueprint feasibility
   */
  private static checkFeasibility(blueprint: Blueprint): {
    checks: ValidationCheck[];
    issues: ValidationIssue[];
    recommendations: string[];
  } {
    const checks: ValidationCheck[] = [];
    const issues: ValidationIssue[] = [];
    const recommendations: string[] = [];

    // Check metric observability
    const observability = validateMetricObservability(blueprint);
    const observabilityCheck: ValidationCheck = {
      name: 'Metric Observability',
      category: 'feasibility',
      passed: observability.valid,
      details: observability.valid
        ? 'All metrics are observable'
        : `Observability issues: ${observability.issues.join('; ')}`,
    };
    checks.push(observabilityCheck);

    if (!observability.valid) {
      for (const issue of observability.issues) {
        issues.push({
          id: `observability-${issues.length}`,
          severity: 'high',
          description: issue,
          recommendation: 'Ensure metrics can be measured and tracked',
        });
      }
      recommendations.push('Review metric definitions for observability');
    }

    // Check telemetry feasibility
    const telemetry = validateTelemetryFeasibility(blueprint);
    const telemetryCheck: ValidationCheck = {
      name: 'Telemetry Feasibility',
      category: 'feasibility',
      passed: telemetry.valid,
      details: telemetry.valid
        ? 'Telemetry requirements are feasible'
        : `Telemetry issues: ${telemetry.issues.join('; ')}`,
    };
    checks.push(telemetryCheck);

    if (!telemetry.valid) {
      for (const issue of telemetry.issues) {
        issues.push({
          id: `telemetry-${issues.length}`,
          severity: 'medium',
          description: issue,
          recommendation: 'Review telemetry requirements with engineering team',
        });
      }
      recommendations.push('Validate telemetry implementation feasibility');
    }

    // Check calibration confidence
    const calibrationCheck: ValidationCheck = {
      name: 'Calibration Confidence',
      category: 'feasibility',
      passed: blueprint.calibration.confidenceLevel >= 0.6,
      details:
        blueprint.calibration.confidenceLevel >= 0.6
          ? `Calibration confidence is adequate (${(blueprint.calibration.confidenceLevel * 100).toFixed(0)}%)`
          : `Calibration confidence is low (${(blueprint.calibration.confidenceLevel * 100).toFixed(0)}%)`,
    };
    checks.push(calibrationCheck);

    if (!calibrationCheck.passed) {
      issues.push({
        id: 'low-calibration-confidence',
        severity: 'medium',
        description: 'Calibration confidence level is below 60%',
        recommendation: 'Conduct additional market research to improve confidence',
      });
    }

    return { checks, issues, recommendations };
  }

  /**
   * Checks market alignment
   */
  private static checkMarketAlignment(blueprint: Blueprint): {
    checks: ValidationCheck[];
    issues: ValidationIssue[];
    recommendations: string[];
  } {
    const checks: ValidationCheck[] = [];
    const issues: ValidationIssue[] = [];
    const recommendations: string[] = [];

    // Check pricing competitiveness
    const competitiveness = validatePricingCompetitiveness(blueprint);
    const competitivenessCheck: ValidationCheck = {
      name: 'Pricing Competitiveness',
      category: 'market-alignment',
      passed: competitiveness.valid,
      details: competitiveness.valid
        ? 'Pricing is competitive'
        : `Competitiveness issues: ${competitiveness.issues.join('; ')}`,
    };
    checks.push(competitivenessCheck);

    if (!competitiveness.valid) {
      for (const issue of competitiveness.issues) {
        issues.push({
          id: `competitiveness-${issues.length}`,
          severity: 'low',
          description: issue,
          recommendation: 'Review pricing strategy against market benchmarks',
        });
      }
      recommendations.push('Validate pricing against competitor offerings');
    }

    // Check risk assessment
    const riskCheck: ValidationCheck = {
      name: 'Risk Assessment',
      category: 'market-alignment',
      passed: blueprint.risks.risks.length > 0 || blueprint.risks.mitigationStrategies.length > 0,
      details:
        blueprint.risks.risks.length > 0 || blueprint.risks.mitigationStrategies.length > 0
          ? 'Risks identified and mitigations in place'
          : 'No risks identified',
    };
    checks.push(riskCheck);

    if (!riskCheck.passed) {
      issues.push({
        id: 'no-risk-assessment',
        severity: 'low',
        description: 'No risks identified in pricing model',
        recommendation: 'Conduct risk assessment for potential pricing issues',
      });
    }

    // Check compliance
    const complianceCheck: ValidationCheck = {
      name: 'Compliance Review',
      category: 'market-alignment',
      passed: blueprint.risks.complianceIssues.length === 0,
      details:
        blueprint.risks.complianceIssues.length === 0
          ? 'No compliance issues identified'
          : `${blueprint.risks.complianceIssues.length} compliance issues found`,
    };
    checks.push(complianceCheck);

    if (!complianceCheck.passed) {
      for (const issue of blueprint.risks.complianceIssues) {
        issues.push({
          id: `compliance-${issue.id}`,
          severity: 'high',
          description: issue.description,
          recommendation: issue.resolution,
        });
      }
      recommendations.push('Address all compliance issues before publishing');
    }

    return { checks, issues, recommendations };
  }

  /**
   * Generates a quality score for a blueprint
   */
  static calculateQualityScore(blueprint: Blueprint): number {
    const validation = this.validate(blueprint);
    return validation.score;
  }

  /**
   * Gets a summary of validation results
   */
  static getSummary(validation: ValidationResult): {
    status: 'pass' | 'warning' | 'fail';
    message: string;
    issueCount: number;
    criticalIssues: number;
  } {
    const criticalIssues = validation.issues.filter((i) => i.severity === 'high').length;
    const warningIssues = validation.issues.filter((i) => i.severity === 'medium').length;

    let status: 'pass' | 'warning' | 'fail' = 'pass';
    let message = 'Blueprint passed all QA checks';

    if (criticalIssues > 0) {
      status = 'fail';
      message = `Blueprint has ${criticalIssues} critical issue(s) that must be resolved`;
    } else if (warningIssues > 0) {
      status = 'warning';
      message = `Blueprint has ${warningIssues} warning(s) that should be reviewed`;
    }

    return {
      status,
      message,
      issueCount: validation.issues.length,
      criticalIssues,
    };
  }

  /**
   * Generates a detailed QA report
   */
  static generateReport(blueprint: Blueprint): {
    blueprintId: string;
    validation: ValidationResult;
    summary: {
      status: 'pass' | 'warning' | 'fail';
      message: string;
      issueCount: number;
      criticalIssues: number;
    };
    recommendations: string[];
  } {
    const validation = this.validate(blueprint);
    const summary = this.getSummary(validation);

    return {
      blueprintId: blueprint.id,
      validation,
      summary,
      recommendations: validation.recommendations,
    };
  }
}

/**
 * QA Report Generator for exporting reports
 */
export class QAReportGenerator {
  /**
   * Exports QA report as markdown
   */
  static toMarkdown(report: ReturnType<typeof QAValidator.generateReport>): string {
    const lines: string[] = [];

    lines.push(`# QA Validation Report`);
    lines.push(`**Blueprint ID**: ${report.blueprintId}`);
    lines.push(`**Status**: ${report.summary.status.toUpperCase()}`);
    lines.push(`**Quality Score**: ${report.validation.score}/100`);
    lines.push('');

    lines.push('## Summary');
    lines.push(`${report.summary.message}`);
    lines.push(`- Total Issues: ${report.summary.issueCount}`);
    lines.push(`- Critical Issues: ${report.summary.criticalIssues}`);
    lines.push('');

    // Checks
    lines.push('## Validation Checks');
    lines.push('');
    lines.push('| Check | Category | Status |');
    lines.push('|-------|----------|--------|');

    for (const check of report.validation.checks) {
      const status = check.passed ? '✓ Pass' : '✗ Fail';
      lines.push(`| ${check.name} | ${check.category} | ${status} |`);
    }
    lines.push('');

    // Issues
    if (report.validation.issues.length > 0) {
      lines.push('## Issues');
      lines.push('');

      for (const issue of report.validation.issues) {
        lines.push(`### ${issue.description} (${issue.severity.toUpperCase()})`);
        lines.push(`**Recommendation**: ${issue.recommendation}`);
        lines.push('');
      }
    }

    // Recommendations
    if (report.recommendations.length > 0) {
      lines.push('## Recommendations');
      for (const rec of report.recommendations) {
        lines.push(`- ${rec}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Exports QA report as JSON
   */
  static toJSON(report: ReturnType<typeof QAValidator.generateReport>): string {
    return JSON.stringify(report, null, 2);
  }
}
