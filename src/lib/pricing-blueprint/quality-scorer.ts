/**
 * Quality Scoring Algorithm
 * Calculates comprehensive quality scores for pricing blueprints
 */

import { Blueprint, ValidationResult } from './types';
import { QAValidator } from './qa-validator';

/**
 * Quality score breakdown
 */
export interface QualityScoreBreakdown {
  overallScore: number;
  completenessScore: number;
  consistencyScore: number;
  feasibilityScore: number;
  marketAlignmentScore: number;
  breakdown: {
    completeness: { score: number; weight: number; weighted: number };
    consistency: { score: number; weight: number; weighted: number };
    feasibility: { score: number; weight: number; weighted: number };
    marketAlignment: { score: number; weight: number; weighted: number };
  };
  factors: {
    positive: string[];
    negative: string[];
  };
}

/**
 * Quality Scorer for calculating comprehensive quality scores
 */
export class QualityScorer {
  // Weights for different scoring categories (must sum to 1.0)
  private static readonly WEIGHTS = {
    completeness: 0.25,
    consistency: 0.25,
    feasibility: 0.30,
    marketAlignment: 0.20,
  };

  /**
   * Calculates a comprehensive quality score for a blueprint
   */
  static calculateScore(blueprint: Blueprint): QualityScoreBreakdown {
    const validation = QAValidator.validate(blueprint);

    // Calculate category scores
    const completenessScore = this.calculateCategoryScore(
      validation,
      'completeness'
    );
    const consistencyScore = this.calculateCategoryScore(
      validation,
      'consistency'
    );
    const feasibilityScore = this.calculateCategoryScore(
      validation,
      'feasibility'
    );
    const marketAlignmentScore = this.calculateCategoryScore(
      validation,
      'market-alignment'
    );

    // Calculate weighted overall score
    const overallScore =
      completenessScore * this.WEIGHTS.completeness +
      consistencyScore * this.WEIGHTS.consistency +
      feasibilityScore * this.WEIGHTS.feasibility +
      marketAlignmentScore * this.WEIGHTS.marketAlignment;

    // Identify positive and negative factors
    const factors = this.identifyFactors(blueprint, validation);

    return {
      overallScore: Math.round(overallScore),
      completenessScore: Math.round(completenessScore),
      consistencyScore: Math.round(consistencyScore),
      feasibilityScore: Math.round(feasibilityScore),
      marketAlignmentScore: Math.round(marketAlignmentScore),
      breakdown: {
        completeness: {
          score: completenessScore,
          weight: this.WEIGHTS.completeness,
          weighted: completenessScore * this.WEIGHTS.completeness,
        },
        consistency: {
          score: consistencyScore,
          weight: this.WEIGHTS.consistency,
          weighted: consistencyScore * this.WEIGHTS.consistency,
        },
        feasibility: {
          score: feasibilityScore,
          weight: this.WEIGHTS.feasibility,
          weighted: feasibilityScore * this.WEIGHTS.feasibility,
        },
        marketAlignment: {
          score: marketAlignmentScore,
          weight: this.WEIGHTS.marketAlignment,
          weighted: marketAlignmentScore * this.WEIGHTS.marketAlignment,
        },
      },
      factors,
    };
  }

  /**
   * Calculates score for a specific category
   */
  private static calculateCategoryScore(
    validation: ValidationResult,
    category: 'completeness' | 'consistency' | 'feasibility' | 'market-alignment'
  ): number {
    const categoryChecks = validation.checks.filter((c) => c.category === category);

    if (categoryChecks.length === 0) {
      return 100; // No checks for this category
    }

    const passedChecks = categoryChecks.filter((c) => c.passed).length;
    const categoryScore = (passedChecks / categoryChecks.length) * 100;

    // Apply penalty for issues in this category
    const categoryIssues = validation.issues.filter((i) => {
      // Map issue IDs to categories
      if (i.id.includes('missing') || i.id.includes('no-')) return category === 'completeness';
      if (i.id.includes('tier') || i.id.includes('metric') || i.id.includes('pricing')) return category === 'consistency';
      if (i.id.includes('observability') || i.id.includes('telemetry') || i.id.includes('calibration')) return category === 'feasibility';
      if (i.id.includes('competitiveness') || i.id.includes('risk') || i.id.includes('compliance')) return category === 'market-alignment';
      return false;
    });

    let penalty = 0;
    for (const issue of categoryIssues) {
      if (issue.severity === 'high') {
        penalty += 15;
      } else if (issue.severity === 'medium') {
        penalty += 8;
      } else {
        penalty += 3;
      }
    }

    return Math.max(0, categoryScore - penalty);
  }

  /**
   * Identifies positive and negative factors affecting the score
   */
  private static identifyFactors(
    blueprint: Blueprint,
    validation: ValidationResult
  ): { positive: string[]; negative: string[] } {
    const positive: string[] = [];
    const negative: string[] = [];

    // Positive factors
    if (blueprint.valueMetrics.length >= 3) {
      positive.push('Comprehensive value metrics defined');
    }

    if (blueprint.tiers.length >= 3) {
      positive.push('Well-structured tier hierarchy');
    }

    if (blueprint.calibration.confidenceLevel >= 0.8) {
      positive.push('High calibration confidence');
    }

    if (blueprint.risks.mitigationStrategies.length >= 2) {
      positive.push('Comprehensive risk mitigation strategies');
    }

    if (blueprint.meters.every((m) => m.accuracy >= 90)) {
      positive.push('High-accuracy billing meters');
    }

    if (blueprint.recommendations.length >= 2) {
      positive.push('Detailed implementation recommendations');
    }

    // Negative factors
    if (blueprint.valueMetrics.length < 2) {
      negative.push('Insufficient value metrics');
    }

    if (blueprint.tiers.length < 2) {
      negative.push('Insufficient pricing tiers');
    }

    if (blueprint.meters.length === 0) {
      negative.push('No billing meters defined');
    }

    if (blueprint.calibration.confidenceLevel < 0.6) {
      negative.push('Low calibration confidence');
    }

    if (blueprint.risks.complianceIssues.length > 0) {
      negative.push('Unresolved compliance issues');
    }

    if (validation.issues.filter((i) => i.severity === 'high').length > 0) {
      negative.push('Critical validation issues present');
    }

    if (blueprint.pricingArchetype.type === 'enterprise-only') {
      negative.push('Limited market reach with enterprise-only pricing');
    }

    return { positive, negative };
  }

  /**
   * Gets a quality rating based on score
   */
  static getRating(score: number): {
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
    recommendation: string;
  } {
    if (score >= 85) {
      return {
        rating: 'Excellent',
        description: 'Blueprint meets all quality standards',
        recommendation: 'Ready for implementation',
      };
    } else if (score >= 70) {
      return {
        rating: 'Good',
        description: 'Blueprint meets most quality standards',
        recommendation: 'Address minor issues before implementation',
      };
    } else if (score >= 50) {
      return {
        rating: 'Fair',
        description: 'Blueprint has several quality issues',
        recommendation: 'Significant revisions needed before implementation',
      };
    } else {
      return {
        rating: 'Poor',
        description: 'Blueprint has critical quality issues',
        recommendation: 'Major revisions required; consider redesign',
      };
    }
  }

  /**
   * Compares two blueprints by quality score
   */
  static compare(
    blueprint1: Blueprint,
    blueprint2: Blueprint
  ): {
    blueprint1Score: number;
    blueprint2Score: number;
    winner: 'blueprint1' | 'blueprint2' | 'tie';
    difference: number;
  } {
    const score1 = this.calculateScore(blueprint1).overallScore;
    const score2 = this.calculateScore(blueprint2).overallScore;

    let winner: 'blueprint1' | 'blueprint2' | 'tie' = 'tie';
    if (score1 > score2) {
      winner = 'blueprint1';
    } else if (score2 > score1) {
      winner = 'blueprint2';
    }

    return {
      blueprint1Score: score1,
      blueprint2Score: score2,
      winner,
      difference: Math.abs(score1 - score2),
    };
  }

  /**
   * Generates a quality report
   */
  static generateReport(blueprint: Blueprint): {
    blueprintId: string;
    score: QualityScoreBreakdown;
    rating: ReturnType<typeof this.getRating>;
    summary: string;
  } {
    const score = this.calculateScore(blueprint);
    const rating = this.getRating(score.overallScore);

    const summary = `
Blueprint Quality Report
========================
Overall Score: ${score.overallScore}/100 (${rating.rating})

Category Scores:
- Completeness: ${score.completenessScore}/100
- Consistency: ${score.consistencyScore}/100
- Feasibility: ${score.feasibilityScore}/100
- Market Alignment: ${score.marketAlignmentScore}/100

Positive Factors:
${score.factors.positive.map((f) => `✓ ${f}`).join('\n')}

Negative Factors:
${score.factors.negative.map((f) => `✗ ${f}`).join('\n')}

Recommendation: ${rating.recommendation}
    `.trim();

    return {
      blueprintId: blueprint.id,
      score,
      rating,
      summary,
    };
  }
}

/**
 * Batch Quality Scorer for scoring multiple blueprints
 */
export class BatchQualityScorer {
  /**
   * Scores multiple blueprints and returns statistics
   */
  static scoreBlueprints(blueprints: Blueprint[]): {
    blueprints: Array<{
      id: string;
      score: number;
      rating: string;
    }>;
    statistics: {
      averageScore: number;
      medianScore: number;
      minScore: number;
      maxScore: number;
      excellentCount: number;
      goodCount: number;
      fairCount: number;
      poorCount: number;
    };
  } {
    const scores = blueprints.map((bp) => {
      const score = QualityScorer.calculateScore(bp).overallScore;
      const rating = QualityScorer.getRating(score).rating;
      return { id: bp.id, score, rating };
    });

    const scoreValues = scores.map((s) => s.score);
    scoreValues.sort((a, b) => a - b);

    const averageScore = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
    const medianScore =
      scoreValues.length % 2 === 0
        ? (scoreValues[scoreValues.length / 2 - 1] + scoreValues[scoreValues.length / 2]) / 2
        : scoreValues[Math.floor(scoreValues.length / 2)];

    const ratingCounts = {
      Excellent: 0,
      Good: 0,
      Fair: 0,
      Poor: 0,
    };

    for (const score of scores) {
      ratingCounts[score.rating as keyof typeof ratingCounts]++;
    }

    return {
      blueprints: scores,
      statistics: {
        averageScore: Math.round(averageScore),
        medianScore,
        minScore: Math.min(...scoreValues),
        maxScore: Math.max(...scoreValues),
        excellentCount: ratingCounts.Excellent,
        goodCount: ratingCounts.Good,
        fairCount: ratingCounts.Fair,
        poorCount: ratingCounts.Poor,
      },
    };
  }
}
