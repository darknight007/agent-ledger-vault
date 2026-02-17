import { Blueprint, Tier, PricingArchetype } from './types';

export interface PricingVariant {
  id: string;
  name: string;
  description: string;
  pricingArchetype: string;
  tiers: Tier[];
  rationale: string;
  pros: string[];
  cons: string[];
  estimatedRevenue: number;
  estimatedCAC: number;
  targetSegment: string;
}

export interface VariantComparison {
  variants: PricingVariant[];
  analysis: {
    revenueComparison: string;
    customerAcquisitionComparison: string;
    churnRiskComparison: string;
    recommendation: string;
  };
}

export interface ImpactEstimate {
  variant: PricingVariant;
  revenueImpact: number;
  cacImpact: number;
  churnRiskChange: number;
  marketReachChange: number;
  implementationComplexity: 'low' | 'medium' | 'high';
}

export class VariantGenerator {
  generateVariants(blueprint: Blueprint): PricingVariant[] {
    const variants: PricingVariant[] = [];

    // Variant 1: More aggressive pricing (higher price points)
    variants.push(this.generateAggressiveVariant(blueprint));

    // Variant 2: More conservative pricing (lower price points)
    variants.push(this.generateConservativeVariant(blueprint));

    // Variant 3: Alternative pricing model
    variants.push(this.generateAlternativeArchetypeVariant(blueprint));

    return variants;
  }

  private generateAggressiveVariant(blueprint: Blueprint): PricingVariant {
    const baseTiers = blueprint.tiers;
    const aggressiveTiers = baseTiers.map((tier) => ({
      ...tier,
      price: Math.round(tier.price * 1.3), // 30% price increase
      usageLimits: tier.usageLimits?.map((ul) => ({
        ...ul,
        limit: Math.round(ul.limit * 0.8), // 20% lower limits
      })),
    }));

    return {
      id: `variant-aggressive-${blueprint.id}`,
      name: 'Premium Positioning',
      description: 'Higher price points targeting premium segment',
      pricingArchetype: blueprint.pricingArchetype.type,
      tiers: aggressiveTiers,
      rationale:
        'This variant positions the product as a premium solution with higher price points and lower usage limits. Targets customers who value quality and support over cost.',
      pros: [
        'Higher revenue per customer',
        'Attracts quality-focused customers',
        'Reduces support burden with lower usage',
        'Improves profit margins',
        'Positions brand as premium',
      ],
      cons: [
        'Lower market penetration',
        'Higher churn risk if value not clearly communicated',
        'Competitive disadvantage on price',
        'Smaller addressable market',
        'May require stronger sales effort',
      ],
      estimatedRevenue: this.estimateRevenue(aggressiveTiers, 0.6), // 60% market penetration
      estimatedCAC: 2500,
      targetSegment: 'Enterprise & Premium',
    };
  }

  private generateConservativeVariant(blueprint: Blueprint): PricingVariant {
    const baseTiers = blueprint.tiers;
    const conservativeTiers = baseTiers.map((tier) => ({
      ...tier,
      price: Math.round(tier.price * 0.7), // 30% price decrease
      usageLimits: tier.usageLimits?.map((ul) => ({
        ...ul,
        limit: Math.round(ul.limit * 1.5), // 50% higher limits
      })),
    }));

    return {
      id: `variant-conservative-${blueprint.id}`,
      name: 'Growth Positioning',
      description: 'Lower price points targeting rapid market penetration',
      pricingArchetype: blueprint.pricingArchetype.type,
      tiers: conservativeTiers,
      rationale:
        'This variant uses aggressive pricing to drive market penetration and customer acquisition. Targets price-sensitive customers and aims for rapid growth.',
      pros: [
        'Faster market penetration',
        'Higher customer acquisition rate',
        'Competitive pricing advantage',
        'Larger addressable market',
        'Better for land-and-expand strategy',
      ],
      cons: [
        'Lower revenue per customer',
        'Margin pressure',
        'May attract price-sensitive customers with lower LTV',
        'Requires higher volume to achieve revenue targets',
        'Competitive race to bottom risk',
      ],
      estimatedRevenue: this.estimateRevenue(conservativeTiers, 1.2), // 120% market penetration
      estimatedCAC: 800,
      targetSegment: 'SMB & Growth',
    };
  }

  private generateAlternativeArchetypeVariant(blueprint: Blueprint): PricingVariant {
    const currentArchetype = blueprint.pricingArchetype.type;
    const alternativeArchetype = this.selectAlternativeArchetype(currentArchetype);

    // Create tiers for alternative archetype
    const alternativeTiers = this.createTiersForArchetype(blueprint, alternativeArchetype);

    return {
      id: `variant-alternative-${blueprint.id}`,
      name: `${alternativeArchetype} Model`,
      description: `Alternative pricing using ${alternativeArchetype} model`,
      pricingArchetype: alternativeArchetype,
      tiers: alternativeTiers,
      rationale: `This variant uses a ${alternativeArchetype} pricing model instead of ${currentArchetype}. This approach may better align with customer preferences and reduce billing complexity.`,
      pros: [
        `${alternativeArchetype} pricing is more predictable for customers`,
        'Simpler billing and support',
        'May reduce churn from bill shock',
        'Different competitive positioning',
        'Appeals to different customer segments',
      ],
      cons: [
        'Requires different telemetry infrastructure',
        'May leave money on the table from power users',
        'Different sales motion required',
        'Harder to scale with usage',
        'May not align with market expectations',
      ],
      estimatedRevenue: this.estimateRevenue(alternativeTiers, 0.9), // 90% market penetration
      estimatedCAC: 1500,
      targetSegment: 'Mid-Market',
    };
  }

  private selectAlternativeArchetype(current: string): string {
    const alternatives: Record<string, string> = {
      'usage-based': 'seat-based',
      'seat-based': 'hybrid',
      hybrid: 'credits',
      credits: 'usage-based',
      'outcome-based': 'seat-based',
      'enterprise-only': 'hybrid',
    };

    return alternatives[current] || 'hybrid';
  }

  private createTiersForArchetype(blueprint: Blueprint, archetype: string): Tier[] {
    const baseTiers = blueprint.tiers;

    if (archetype === 'seat-based') {
      return [
        {
          id: 'seat-tier-1',
          name: 'Starter',
          description: '1-5 seats',
          price: 99,
          billingCycle: 'monthly',
          features: baseTiers[0]?.features || [],
          usageLimits: [{ meter: 'seats', limit: 5, overage: { type: 'per-unit', price: 20 } }],
          targetSegment: 'Small Team',
        },
        {
          id: 'seat-tier-2',
          name: 'Professional',
          description: '6-20 seats',
          price: 299,
          billingCycle: 'monthly',
          features: baseTiers[1]?.features || [],
          usageLimits: [{ meter: 'seats', limit: 20, overage: { type: 'per-unit', price: 15 } }],
          targetSegment: 'Growing Team',
        },
        {
          id: 'seat-tier-3',
          name: 'Enterprise',
          description: '20+ seats',
          price: 999,
          billingCycle: 'monthly',
          features: baseTiers[2]?.features || [],
          usageLimits: [{ meter: 'seats', limit: 999, overage: { type: 'per-unit', price: 10 } }],
          targetSegment: 'Enterprise',
        },
      ];
    }

    if (archetype === 'credits') {
      return [
        {
          id: 'credit-tier-1',
          name: 'Starter',
          description: '10,000 credits/month',
          price: 99,
          billingCycle: 'monthly',
          features: baseTiers[0]?.features || [],
          usageLimits: [{ meter: 'credits', limit: 10000, overage: { type: 'per-unit', price: 0.01 } }],
          targetSegment: 'Small Business',
        },
        {
          id: 'credit-tier-2',
          name: 'Professional',
          description: '50,000 credits/month',
          price: 299,
          billingCycle: 'monthly',
          features: baseTiers[1]?.features || [],
          usageLimits: [{ meter: 'credits', limit: 50000, overage: { type: 'per-unit', price: 0.008 } }],
          targetSegment: 'Mid-Market',
        },
        {
          id: 'credit-tier-3',
          name: 'Enterprise',
          description: 'Unlimited credits',
          price: 999,
          billingCycle: 'monthly',
          features: baseTiers[2]?.features || [],
          usageLimits: [{ meter: 'credits', limit: 999999, overage: { type: 'per-unit', price: 0.005 } }],
          targetSegment: 'Enterprise',
        },
      ];
    }

    // Default to hybrid
    return baseTiers;
  }

  private estimateRevenue(tiers: Tier[], marketPenetration: number): number {
    const avgPrice = tiers.reduce((sum, t) => sum + t.price, 0) / tiers.length;
    const estimatedCustomers = Math.round(1000 * marketPenetration);
    return avgPrice * estimatedCustomers * 12; // Annual revenue
  }

  compareVariants(variants: PricingVariant[]): VariantComparison {
    const revenues = variants.map((v) => v.estimatedRevenue);
    const maxRevenue = Math.max(...revenues);
    const minRevenue = Math.min(...revenues);

    const cacs = variants.map((v) => v.estimatedCAC);
    const maxCAC = Math.max(...cacs);
    const minCAC = Math.min(...cacs);

    return {
      variants,
      analysis: {
        revenueComparison: `Revenue ranges from $${minRevenue.toLocaleString()} to $${maxRevenue.toLocaleString()} annually. The ${variants[revenues.indexOf(maxRevenue)].name} variant generates the highest revenue.`,
        customerAcquisitionComparison: `CAC ranges from $${minCAC} to $${maxCAC}. The ${variants[cacs.indexOf(minCAC)].name} variant has the lowest acquisition cost, enabling faster growth.`,
        churnRiskComparison: `The ${variants[0].name} variant has higher churn risk due to premium pricing. The ${variants[1].name} variant has lower churn risk but requires higher volume. The ${variants[2].name} variant offers a balanced approach.`,
        recommendation: `We recommend starting with the ${variants[1].name} variant to establish market presence, then gradually shift toward the ${variants[0].name} variant as brand recognition increases. Monitor churn and CAC metrics closely.`,
      },
    };
  }

  estimateImpact(variant: PricingVariant, baseline: PricingVariant): ImpactEstimate {
    const revenueImpact = ((variant.estimatedRevenue - baseline.estimatedRevenue) / baseline.estimatedRevenue) * 100;
    const cacImpact = ((variant.estimatedCAC - baseline.estimatedCAC) / baseline.estimatedCAC) * 100;

    // Estimate churn risk change (higher price = higher churn risk)
    const priceRatio = variant.tiers[0]?.price / baseline.tiers[0]?.price || 1;
    const churnRiskChange = (priceRatio - 1) * 100;

    // Estimate market reach change (lower price = higher reach)
    const marketReachChange = (1 / priceRatio - 1) * 100;

    return {
      variant,
      revenueImpact,
      cacImpact,
      churnRiskChange,
      marketReachChange,
      implementationComplexity: this.estimateComplexity(variant),
    };
  }

  private estimateComplexity(variant: PricingVariant): 'low' | 'medium' | 'high' {
    if (variant.pricingArchetype === 'seat-based') {
      return 'low';
    }
    if (variant.pricingArchetype === 'credits') {
      return 'medium';
    }
    return 'high';
  }

  generateVariantReport(variants: PricingVariant[], comparison: VariantComparison): string {
    const sections = [
      '# Pricing Variant Analysis',
      '',
      '## Overview',
      `This report analyzes ${variants.length} alternative pricing models for your product.`,
      '',
      '## Variants',
      ...variants.map((v) => this.generateVariantSection(v)),
      '',
      '## Comparison',
      `### Revenue Impact`,
      comparison.analysis.revenueComparison,
      '',
      `### Customer Acquisition`,
      comparison.analysis.customerAcquisitionComparison,
      '',
      `### Churn Risk`,
      comparison.analysis.churnRiskComparison,
      '',
      '## Recommendation',
      comparison.analysis.recommendation,
    ];

    return sections.join('\n');
  }

  private generateVariantSection(variant: PricingVariant): string {
    const tierSummary = variant.tiers.map((t) => `- ${t.name}: $${t.price}/${t.billingCycle}`).join('\n');

    return `
### ${variant.name}
**Description**: ${variant.description}

**Pricing Model**: ${variant.pricingArchetype}

**Tiers**:
${tierSummary}

**Rationale**: ${variant.rationale}

**Pros**:
${variant.pros.map((p) => `- ${p}`).join('\n')}

**Cons**:
${variant.cons.map((c) => `- ${c}`).join('\n')}

**Estimated Annual Revenue**: $${variant.estimatedRevenue.toLocaleString()}
**Estimated CAC**: $${variant.estimatedCAC}
**Target Segment**: ${variant.targetSegment}
`;
  }
}
