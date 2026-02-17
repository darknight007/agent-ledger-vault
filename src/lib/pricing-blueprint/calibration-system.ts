import { Blueprint } from './types';

export interface UsagePattern {
  meterId: string;
  meterName: string;
  averageUsage: number;
  p50Usage: number;
  p90Usage: number;
  p99Usage: number;
  frequency: 'high' | 'medium' | 'low';
}

export interface CustomerSegmentMetrics {
  segment: string;
  customerCount: number;
  averageRevenue: number;
  churnRate: number;
  npsScore: number;
  usagePatterns: UsagePattern[];
}

export interface PricingAnomaly {
  id: string;
  type: 'underpriced' | 'overpriced' | 'usage_spike' | 'churn_risk';
  severity: 'low' | 'medium' | 'high';
  description: string;
  affectedSegment: string;
  recommendation: string;
}

export interface CalibrationRecommendation {
  type: 'price_increase' | 'price_decrease' | 'tier_restructure' | 'feature_reallocation';
  currentValue: number;
  recommendedValue: number;
  rationale: string;
  expectedImpact: string;
  confidence: number;
}

export interface CalibrationReport {
  blueprintId: string;
  generatedDate: Date;
  segmentMetrics: CustomerSegmentMetrics[];
  anomalies: PricingAnomaly[];
  recommendations: CalibrationRecommendation[];
  profitabilityAnalysis: {
    currentMargin: number;
    targetMargin: number;
    marginGap: number;
  };
  summary: string;
}

export class CalibrationSystem {
  generateCalibrationReport(blueprint: Blueprint, usageData: Map<string, UsagePattern[]>): CalibrationReport {
    const segmentMetrics = this.analyzeSegments(blueprint, usageData);
    const anomalies = this.identifyAnomalies(blueprint, segmentMetrics);
    const recommendations = this.generateRecommendations(blueprint, segmentMetrics, anomalies);
    const profitability = this.analyzeProfitability(blueprint, segmentMetrics);

    return {
      blueprintId: blueprint.id,
      generatedDate: new Date(),
      segmentMetrics,
      anomalies,
      recommendations,
      profitabilityAnalysis: profitability,
      summary: this.generateSummary(blueprint, segmentMetrics, anomalies, recommendations),
    };
  }

  private analyzeSegments(blueprint: Blueprint, usageData: Map<string, UsagePattern[]>): CustomerSegmentMetrics[] {
    const segments: CustomerSegmentMetrics[] = [];

    blueprint.tiers.forEach((tier) => {
      const tierUsageData = usageData.get(tier.id) || [];

      segments.push({
        segment: tier.name,
        customerCount: Math.floor(Math.random() * 100) + 10, // Simulated
        averageRevenue: tier.price * 12,
        churnRate: Math.random() * 0.1,
        npsScore: Math.floor(Math.random() * 30) + 50,
        usagePatterns: tierUsageData,
      });
    });

    return segments;
  }

  private identifyAnomalies(blueprint: Blueprint, segments: CustomerSegmentMetrics[]): PricingAnomaly[] {
    const anomalies: PricingAnomaly[] = [];

    segments.forEach((segment) => {
      // Check for underpricing
      if (segment.churnRate < 0.02 && segment.npsScore > 70) {
        anomalies.push({
          id: `anomaly-underpriced-${segment.segment}`,
          type: 'underpriced',
          severity: 'medium',
          description: `${segment.segment} tier shows high satisfaction and low churn, indicating potential underpricing`,
          affectedSegment: segment.segment,
          recommendation: `Consider 10-15% price increase for ${segment.segment} tier`,
        });
      }

      // Check for overpricing
      if (segment.churnRate > 0.08) {
        anomalies.push({
          id: `anomaly-overpriced-${segment.segment}`,
          type: 'overpriced',
          severity: 'high',
          description: `${segment.segment} tier shows high churn rate, indicating potential overpricing`,
          affectedSegment: segment.segment,
          recommendation: `Consider 10-20% price decrease or feature enhancement for ${segment.segment} tier`,
        });
      }

      // Check for usage spikes
      segment.usagePatterns.forEach((pattern) => {
        if (pattern.p99Usage > pattern.p50Usage * 5) {
          anomalies.push({
            id: `anomaly-spike-${segment.segment}-${pattern.meterId}`,
            type: 'usage_spike',
            severity: 'medium',
            description: `${segment.segment} tier shows high variance in ${pattern.meterName} usage (p99 is 5x p50)`,
            affectedSegment: segment.segment,
            recommendation: `Review usage limits for ${pattern.meterName} or implement tiered overage pricing`,
          });
        }
      });

      // Check for churn risk
      if (segment.churnRate > 0.05 && segment.npsScore < 60) {
        anomalies.push({
          id: `anomaly-churn-${segment.segment}`,
          type: 'churn_risk',
          severity: 'high',
          description: `${segment.segment} tier shows elevated churn risk with low NPS`,
          affectedSegment: segment.segment,
          recommendation: `Conduct customer interviews to understand pain points; consider feature additions or pricing adjustments`,
        });
      }
    });

    return anomalies;
  }

  private generateRecommendations(
    blueprint: Blueprint,
    segments: CustomerSegmentMetrics[],
    anomalies: PricingAnomaly[]
  ): CalibrationRecommendation[] {
    const recommendations: CalibrationRecommendation[] = [];

    // Price adjustment recommendations
    anomalies.forEach((anomaly) => {
      if (anomaly.type === 'underpriced') {
        const tier = blueprint.tiers.find((t) => t.name === anomaly.affectedSegment);
        if (tier) {
          recommendations.push({
            type: 'price_increase',
            currentValue: tier.price,
            recommendedValue: Math.round(tier.price * 1.12),
            rationale: 'High satisfaction and low churn indicate room for price increase',
            expectedImpact: 'Estimated 5-10% revenue increase with minimal churn impact',
            confidence: 0.75,
          });
        }
      }

      if (anomaly.type === 'overpriced') {
        const tier = blueprint.tiers.find((t) => t.name === anomaly.affectedSegment);
        if (tier) {
          recommendations.push({
            type: 'price_decrease',
            currentValue: tier.price,
            recommendedValue: Math.round(tier.price * 0.85),
            rationale: 'High churn indicates pricing is above market tolerance',
            expectedImpact: 'Estimated 20-30% churn reduction, 10-15% revenue decrease',
            confidence: 0.8,
          });
        }
      }
    });

    // Tier restructuring recommendations
    if (segments.length > 0) {
      const avgChurn = segments.reduce((sum, s) => sum + s.churnRate, 0) / segments.length;
      if (avgChurn > 0.05) {
        recommendations.push({
          type: 'tier_restructure',
          currentValue: blueprint.tiers.length,
          recommendedValue: blueprint.tiers.length + 1,
          rationale: 'High average churn suggests need for better tier segmentation',
          expectedImpact: 'Additional tier could capture mid-market segment, reducing churn',
          confidence: 0.65,
        });
      }
    }

    return recommendations;
  }

  private analyzeProfitability(blueprint: Blueprint, segments: CustomerSegmentMetrics[]): {
    currentMargin: number;
    targetMargin: number;
    marginGap: number;
  } {
    const currentMargin = 0.6; // Assume 60% current margin
    const targetMargin = 0.7; // Target 70% margin
    const marginGap = targetMargin - currentMargin;

    return {
      currentMargin: Math.round(currentMargin * 100),
      targetMargin: Math.round(targetMargin * 100),
      marginGap: Math.round(marginGap * 100),
    };
  }

  private generateSummary(
    blueprint: Blueprint,
    segments: CustomerSegmentMetrics[],
    anomalies: PricingAnomaly[],
    recommendations: CalibrationRecommendation[]
  ): string {
    const highSeverityAnomalies = anomalies.filter((a) => a.severity === 'high').length;
    const priceRecommendations = recommendations.filter((r) => r.type === 'price_increase' || r.type === 'price_decrease').length;

    return `
Calibration Report Summary for ${blueprint.archetype.name}

Current State:
- ${segments.length} pricing tiers analyzed
- Average NPS: ${Math.round(segments.reduce((sum, s) => sum + s.npsScore, 0) / segments.length)}
- Average Churn: ${Math.round((segments.reduce((sum, s) => sum + s.churnRate, 0) / segments.length) * 100)}%

Key Findings:
- ${highSeverityAnomalies} high-severity pricing anomalies identified
- ${priceRecommendations} price adjustment recommendations
- Profitability gap: ${this.analyzeProfitability(blueprint, segments).marginGap}%

Recommended Actions:
1. Review and implement ${recommendations.length} calibration recommendations
2. Monitor ${anomalies.length} identified anomalies
3. Conduct quarterly pricing reviews
4. Track customer satisfaction and churn metrics
`;
  }

  identifyUpsellOpportunities(blueprint: Blueprint, segments: CustomerSegmentMetrics[]): Array<{
    segment: string;
    opportunity: string;
    estimatedRevenue: number;
    implementation: string;
  }> {
    const opportunities: Array<{
      segment: string;
      opportunity: string;
      estimatedRevenue: number;
      implementation: string;
    }> = [];

    segments.forEach((segment, index) => {
      // Identify upsell to next tier
      if (index < segments.length - 1) {
        const nextTier = blueprint.tiers[index + 1];
        const currentTier = blueprint.tiers[index];

        if (nextTier && currentTier) {
          const upsellRevenue = (nextTier.price - currentTier.price) * segment.customerCount * 12;

          opportunities.push({
            segment: segment.segment,
            opportunity: `Upsell to ${nextTier.name} tier`,
            estimatedRevenue: upsellRevenue,
            implementation: `Target high-usage customers in ${segment.segment} with ${nextTier.name} features`,
          });
        }
      }

      // Identify add-on opportunities
      if (segment.npsScore > 70) {
        opportunities.push({
          segment: segment.segment,
          opportunity: 'Premium add-ons',
          estimatedRevenue: segment.customerCount * 50 * 12,
          implementation: `Offer premium features (priority support, custom integrations) to ${segment.segment} customers`,
        });
      }
    });

    return opportunities;
  }

  generateCalibrationMarkdown(report: CalibrationReport): string {
    const sections = [
      `# Pricing Calibration Report`,
      `**Generated**: ${report.generatedDate.toISOString()}`,
      `**Blueprint**: ${report.blueprintId}`,
      '',
      '## Executive Summary',
      report.summary,
      '',
      '## Segment Analysis',
      ...report.segmentMetrics.map(
        (s) => `
### ${s.name}
- **Customers**: ${s.customerCount}
- **Average Revenue**: $${s.averageRevenue.toLocaleString()}/year
- **Churn Rate**: ${(s.churnRate * 100).toFixed(1)}%
- **NPS Score**: ${s.npsScore}
`
      ),
      '',
      '## Pricing Anomalies',
      report.anomalies.length > 0
        ? report.anomalies.map((a) => `- **${a.type}** (${a.severity}): ${a.description}\n  Recommendation: ${a.recommendation}`).join('\n')
        : 'No anomalies detected',
      '',
      '## Recommendations',
      report.recommendations.map((r) => `- **${r.type}**: ${r.currentValue} → ${r.recommendedValue}\n  ${r.rationale}`).join('\n'),
      '',
      '## Profitability Analysis',
      `- Current Margin: ${report.profitabilityAnalysis.currentMargin}%`,
      `- Target Margin: ${report.profitabilityAnalysis.targetMargin}%`,
      `- Gap: ${report.profitabilityAnalysis.marginGap}%`,
    ];

    return sections.join('\n');
  }
}
