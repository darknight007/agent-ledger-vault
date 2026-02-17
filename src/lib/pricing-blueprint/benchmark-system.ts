/**
 * Benchmark System
 * Maintains competitive pricing data and provides benchmarking analysis
 */

import {
  Blueprint,
  BenchmarkData,
  CompetitorPricing,
  PricingTrend,
  OutlierAnalysis,
  PricingRecommendation,
} from './types';

/**
 * Benchmark System for competitive analysis
 */
export class BenchmarkSystem {
  private benchmarks: Map<string, BenchmarkData> = new Map();
  private trends: Map<string, PricingTrend[]> = new Map();

  /**
   * Registers benchmark data for a category
   */
  registerBenchmark(category: string, data: BenchmarkData): void {
    this.benchmarks.set(category, data);
  }

  /**
   * Gets benchmark data for a category
   */
  getBenchmarks(category: string): BenchmarkData | null {
    return this.benchmarks.get(category) || null;
  }

  /**
   * Compares blueprint pricing against benchmarks
   */
  compareWithBenchmarks(blueprint: Blueprint): {
    category: string;
    comparison: {
      proposedPrice: number;
      marketAverage: number;
      percentileRank: number;
      isOutlier: boolean;
      recommendation: string;
    };
  } {
    const category = blueprint.archetype.category;
    const benchmarkData = this.getBenchmarks(category);

    if (!benchmarkData) {
      return {
        category,
        comparison: {
          proposedPrice: blueprint.tiers[0]?.price || 0,
          marketAverage: 0,
          percentileRank: 50,
          isOutlier: false,
          recommendation: 'No benchmark data available for this category',
        },
      };
    }

    const proposedPrice = blueprint.tiers[0]?.price || 0;
    const marketAverage = benchmarkData.marketAverage;
    const percentileRank = this.calculatePercentileRank(
      proposedPrice,
      benchmarkData
    );

    const isOutlier =
      percentileRank < 10 || percentileRank > 90;

    let recommendation = 'Pricing is competitive';
    if (percentileRank < 25) {
      recommendation = 'Pricing is below market average - consider value proposition';
    } else if (percentileRank > 75) {
      recommendation = 'Pricing is above market average - ensure premium value';
    }

    return {
      category,
      comparison: {
        proposedPrice,
        marketAverage,
        percentileRank,
        isOutlier,
        recommendation,
      },
    };
  }

  /**
   * Identifies pricing outliers
   */
  identifyOutliers(blueprint: Blueprint): OutlierAnalysis {
    const comparison = this.compareWithBenchmarks(blueprint);

    return {
      isOutlier: comparison.comparison.isOutlier,
      deviation: Math.abs(
        comparison.comparison.proposedPrice - comparison.comparison.marketAverage
      ),
      percentileRank: comparison.comparison.percentileRank,
      recommendation: comparison.comparison.recommendation,
    };
  }

  /**
   * Gets pricing recommendations
   */
  getRecommendations(blueprint: Blueprint): PricingRecommendation[] {
    const recommendations: PricingRecommendation[] = [];
    const comparison = this.compareWithBenchmarks(blueprint);
    const benchmarkData = this.getBenchmarks(blueprint.archetype.category);

    if (!benchmarkData) {
      return recommendations;
    }

    // Recommendation 1: Market average pricing
    recommendations.push({
      title: 'Market Average Pricing',
      description: 'Price at market average for maximum market penetration',
      suggestedPrice: benchmarkData.marketAverage,
      rationale: 'Aligns with competitor pricing',
      confidence: 0.8,
    });

    // Recommendation 2: Premium pricing
    const premiumPrice = benchmarkData.percentiles.p75;
    recommendations.push({
      title: 'Premium Positioning',
      description: 'Price at 75th percentile for premium positioning',
      suggestedPrice: premiumPrice,
      rationale: 'Positions product as premium offering',
      confidence: 0.7,
    });

    // Recommendation 3: Value pricing
    const valuePrice = benchmarkData.percentiles.p25;
    recommendations.push({
      title: 'Value Positioning',
      description: 'Price at 25th percentile for value positioning',
      suggestedPrice: valuePrice,
      rationale: 'Attracts price-sensitive customers',
      confidence: 0.75,
    });

    return recommendations;
  }

  /**
   * Tracks pricing trends
   */
  recordTrend(category: string, trend: PricingTrend): void {
    if (!this.trends.has(category)) {
      this.trends.set(category, []);
    }
    this.trends.get(category)!.push(trend);
  }

  /**
   * Gets pricing trends for a category
   */
  getTrends(category: string): PricingTrend[] {
    return this.trends.get(category) || [];
  }

  /**
   * Analyzes pricing trends
   */
  analyzeTrends(category: string): {
    trend: 'increasing' | 'decreasing' | 'stable';
    averageChange: number;
    recommendation: string;
  } {
    const trends = this.getTrends(category);

    if (trends.length < 2) {
      return {
        trend: 'stable',
        averageChange: 0,
        recommendation: 'Insufficient data for trend analysis',
      };
    }

    const changes: number[] = [];
    for (let i = 1; i < trends.length; i++) {
      const change = trends[i].averagePrice - trends[i - 1].averagePrice;
      changes.push(change);
    }

    const averageChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    let recommendation = 'Market pricing is stable';

    if (averageChange > 5) {
      trend = 'increasing';
      recommendation = 'Market prices are increasing - consider raising prices';
    } else if (averageChange < -5) {
      trend = 'decreasing';
      recommendation = 'Market prices are decreasing - monitor competitive pressure';
    }

    return { trend, averageChange, recommendation };
  }

  /**
   * Private: Calculates percentile rank
   */
  private calculatePercentileRank(price: number, benchmarkData: BenchmarkData): number {
    const allPrices = benchmarkData.competitors.map((c) => c.pricing);
    allPrices.sort((a, b) => a - b);

    let rank = 0;
    for (const p of allPrices) {
      if (p <= price) {
        rank++;
      }
    }

    return (rank / allPrices.length) * 100;
  }

  /**
   * Gets all registered categories
   */
  getCategories(): string[] {
    return Array.from(this.benchmarks.keys());
  }

  /**
   * Clears all benchmarks
   */
  clear(): void {
    this.benchmarks.clear();
    this.trends.clear();
  }
}

/**
 * Factory for creating sample benchmark data
 */
export class BenchmarkDataFactory {
  /**
   * Creates sample benchmark data for a category
   */
  static createSampleBenchmark(category: string): BenchmarkData {
    const competitors: CompetitorPricing[] = [
      {
        competitor: 'Competitor A',
        product: `${category} Solution A`,
        pricing: 99,
        pricingModel: 'seat-based',
        features: ['Feature 1', 'Feature 2'],
        targetSegment: 'SMB',
      },
      {
        competitor: 'Competitor B',
        product: `${category} Solution B`,
        pricing: 199,
        pricingModel: 'usage-based',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        targetSegment: 'Mid-market',
      },
      {
        competitor: 'Competitor C',
        product: `${category} Solution C`,
        pricing: 299,
        pricingModel: 'hybrid',
        features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
        targetSegment: 'Enterprise',
      },
      {
        competitor: 'Competitor D',
        product: `${category} Solution D`,
        pricing: 149,
        pricingModel: 'usage-based',
        features: ['Feature 1', 'Feature 2'],
        targetSegment: 'SMB',
      },
    ];

    const prices = competitors.map((c) => c.pricing).sort((a, b) => a - b);
    const marketAverage = prices.reduce((a, b) => a + b, 0) / prices.length;
    const marketMedian = prices[Math.floor(prices.length / 2)];

    return {
      competitors,
      marketAverage,
      marketMedian,
      percentiles: {
        p25: prices[Math.floor(prices.length * 0.25)],
        p50: prices[Math.floor(prices.length * 0.5)],
        p75: prices[Math.floor(prices.length * 0.75)],
        p90: prices[Math.floor(prices.length * 0.9)],
      },
      trends: [
        {
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          averagePrice: marketAverage - 10,
          medianPrice: marketMedian - 5,
          trend: 'stable',
        },
        {
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          averagePrice: marketAverage - 5,
          medianPrice: marketMedian,
          trend: 'increasing',
        },
        {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          averagePrice: marketAverage,
          medianPrice: marketMedian + 5,
          trend: 'increasing',
        },
      ],
    };
  }

  /**
   * Creates a benchmark system with sample data for common categories
   */
  static createSampleBenchmarkSystem(): BenchmarkSystem {
    const system = new BenchmarkSystem();

    const categories = [
      'Research',
      'Content Creation',
      'Customer Support',
      'Sales',
      'Development',
      'Analytics',
      'Human Resources',
      'Legal',
      'Marketing',
      'Product Management',
    ];

    for (const category of categories) {
      const benchmark = this.createSampleBenchmark(category);
      system.registerBenchmark(category, benchmark);
    }

    return system;
  }
}
