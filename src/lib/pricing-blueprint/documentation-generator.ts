import { Blueprint } from './types';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Resource {
  title: string;
  url: string;
  type: 'documentation' | 'guide' | 'template' | 'tool';
}

export interface Documentation {
  rationale: string;
  assumptions: string[];
  tradeoffs: string[];
  riskAssessment: string;
  implementationChecklist: ChecklistItem[];
  faq: FAQItem[];
  relatedResources: Resource[];
}

export class DocumentationGenerator {
  generateFullDocumentation(blueprint: Blueprint): Documentation {
    return {
      rationale: this.generateRationale(blueprint),
      assumptions: this.generateAssumptions(blueprint),
      tradeoffs: this.generateTradeoffs(blueprint),
      riskAssessment: this.generateRiskAssessment(blueprint),
      implementationChecklist: this.generateImplementationChecklist(blueprint),
      faq: this.generateFAQ(blueprint),
      relatedResources: this.generateRelatedResources(blueprint),
    };
  }

  private generateRationale(blueprint: Blueprint): string {
    const archetype = blueprint.archetype;
    const pricingType = blueprint.pricingArchetype.type;

    return `
## Pricing Rationale

### Market Position
${archetype.name} targets the ${archetype.targetICP} segment with an estimated market size of ${archetype.estimatedMarketSize.toLocaleString()} potential customers. The product addresses the following use cases:
- ${archetype.keyFeatures.join('\n- ')}

### Pricing Strategy
We have selected a **${pricingType}** pricing model for the following reasons:

**Alignment with Customer Value:**
- Customers perceive value based on ${blueprint.valueMetrics.map((m) => m.name).join(', ')}
- This pricing model directly ties costs to customer value realization
- Reduces friction for new customers while capturing value from power users

**Competitive Positioning:**
- Market analysis shows ${pricingType} models are standard in this category
- Our pricing is positioned at the ${blueprint.calibration.benchmarkComparison.percentileRank}th percentile
- This provides competitive advantage while maintaining healthy margins

**Business Model Fit:**
- Supports both self-serve and enterprise sales motions
- Enables land-and-expand growth strategy
- Provides predictable recurring revenue

### Tier Structure
The pricing includes ${blueprint.tiers.length} tiers designed to serve different customer segments:
${blueprint.tiers.map((t) => `- **${t.name}** ($${t.price}/${t.billingCycle}): ${t.description}`).join('\n')}
`;
  }

  private generateAssumptions(blueprint: Blueprint): string[] {
    return [
      `Customer acquisition cost (CAC) is approximately 3-6 months of subscription value`,
      `Average customer lifetime value (LTV) is 24+ months`,
      `${Math.round((blueprint.calibration.confidenceLevel * 100) / 100)}% of customers will stay within tier usage limits`,
      `Telemetry accuracy for billing meters is ${blueprint.meters[0]?.accuracy || 95}%+`,
      `Market demand for ${blueprint.archetype.name} will grow 20-30% annually`,
      `Competitive pricing will remain relatively stable over the next 12 months`,
      `No major regulatory changes will impact pricing or billing`,
      `Customer support costs are approximately 10-15% of revenue`,
    ];
  }

  private generateTradeoffs(blueprint: Blueprint): string[] {
    const pricingType = blueprint.pricingArchetype.type;

    return [
      `**Simplicity vs. Precision**: ${pricingType} pricing is simpler than outcome-based but may not capture all value`,
      `**Acquisition vs. Retention**: Lower entry price increases acquisition but may reduce per-customer revenue`,
      `**Predictability vs. Flexibility**: Fixed tiers provide predictability but limit customization`,
      `**Billing Complexity**: Usage-based pricing requires robust telemetry infrastructure`,
      `**Customer Perception**: Some customers may perceive usage-based pricing as unpredictable`,
      `**Competitive Response**: Competitors may undercut on price, requiring continuous optimization`,
    ];
  }

  private generateRiskAssessment(blueprint: Blueprint): string {
    const highRisks = blueprint.risks.risks.filter((r) => r.severity === 'high');
    const mediumRisks = blueprint.risks.risks.filter((r) => r.severity === 'medium');

    return `
## Risk Assessment

### High-Risk Factors (${highRisks.length})
${highRisks.map((r) => `- **${r.description}** (Likelihood: ${r.likelihood})\n  Mitigation: ${r.mitigation}`).join('\n')}

### Medium-Risk Factors (${mediumRisks.length})
${mediumRisks.map((r) => `- **${r.description}** (Likelihood: ${r.likelihood})\n  Mitigation: ${r.mitigation}`).join('\n')}

### Compliance & Fairness
${blueprint.risks.fairnessAnalysis}

### Recommended Monitoring
- Track customer churn by tier and usage pattern
- Monitor support tickets related to billing and pricing
- Conduct quarterly pricing reviews with sales and customer success teams
- Analyze competitor pricing changes monthly
`;
  }

  private generateImplementationChecklist(blueprint: Blueprint): ChecklistItem[] {
    return [
      {
        id: 'eng-1',
        title: 'Implement Telemetry Events',
        description: `Set up telemetry collection for ${blueprint.meters.length} billing meters`,
        owner: 'Engineering',
        priority: 'high',
        completed: false,
      },
      {
        id: 'eng-2',
        title: 'Configure Billing System',
        description: 'Configure pricing tiers and meters in billing system',
        owner: 'Engineering',
        priority: 'high',
        completed: false,
      },
      {
        id: 'eng-3',
        title: 'Implement Usage Alerts',
        description: 'Set up alerts for customers approaching usage limits',
        owner: 'Engineering',
        priority: 'medium',
        completed: false,
      },
      {
        id: 'product-1',
        title: 'Update Pricing Page',
        description: 'Deploy new pricing page with tier information',
        owner: 'Product',
        priority: 'high',
        completed: false,
      },
      {
        id: 'product-2',
        title: 'Create Pricing Documentation',
        description: 'Document pricing model, tiers, and overage policies',
        owner: 'Product',
        priority: 'high',
        completed: false,
      },
      {
        id: 'sales-1',
        title: 'Train Sales Team',
        description: 'Train sales team on new pricing model and positioning',
        owner: 'Sales',
        priority: 'high',
        completed: false,
      },
      {
        id: 'support-1',
        title: 'Update Support Documentation',
        description: 'Update support docs with pricing FAQs and troubleshooting',
        owner: 'Support',
        priority: 'medium',
        completed: false,
      },
      {
        id: 'finance-1',
        title: 'Set Up Revenue Recognition',
        description: 'Configure revenue recognition rules for new pricing model',
        owner: 'Finance',
        priority: 'high',
        completed: false,
      },
      {
        id: 'legal-1',
        title: 'Review Terms of Service',
        description: 'Update ToS with new pricing terms and fair use policies',
        owner: 'Legal',
        priority: 'high',
        completed: false,
      },
      {
        id: 'qa-1',
        title: 'Test Billing Calculations',
        description: 'QA test all tier combinations and overage scenarios',
        owner: 'QA',
        priority: 'high',
        completed: false,
      },
    ];
  }

  private generateFAQ(blueprint: Blueprint): FAQItem[] {
    return [
      {
        question: 'How is my usage calculated?',
        answer: `Your usage is calculated based on ${blueprint.meters.map((m) => m.name).join(', ')}. We measure usage in real-time and bill you at the end of each billing cycle.`,
      },
      {
        question: 'What happens if I exceed my tier limits?',
        answer: `Depending on your tier, you can either pay overage charges or upgrade to a higher tier. We'll notify you when you're approaching your limits.`,
      },
      {
        question: 'Can I change my plan mid-cycle?',
        answer: `Yes, you can upgrade or downgrade at any time. Changes take effect immediately, and we'll prorate your billing accordingly.`,
      },
      {
        question: 'How accurate is the usage tracking?',
        answer: `Our telemetry has ${blueprint.meters[0]?.accuracy || 95}%+ accuracy. We continuously monitor and improve our tracking systems.`,
      },
      {
        question: 'Do you offer volume discounts?',
        answer: `For enterprise customers with high usage, we offer custom pricing. Please contact our sales team for details.`,
      },
      {
        question: 'What is your refund policy?',
        answer: `We offer a 30-day money-back guarantee if you're not satisfied. After that, refunds are available on a case-by-case basis.`,
      },
      {
        question: 'How do you handle billing disputes?',
        answer: `If you believe there's an error in your bill, contact our support team within 30 days. We'll investigate and adjust if necessary.`,
      },
      {
        question: 'Is there a contract required?',
        answer: `No, all plans are month-to-month. Enterprise customers can opt for annual contracts with discounts.`,
      },
    ];
  }

  private generateRelatedResources(blueprint: Blueprint): Resource[] {
    return [
      {
        title: 'Pricing Model Guide',
        url: '/docs/pricing-guide',
        type: 'guide',
      },
      {
        title: 'Billing FAQ',
        url: '/docs/billing-faq',
        type: 'documentation',
      },
      {
        title: 'Usage Tracking Documentation',
        url: '/docs/usage-tracking',
        type: 'documentation',
      },
      {
        title: 'Pricing Calculator',
        url: '/pricing-calculator',
        type: 'tool',
      },
      {
        title: 'ROI Calculator',
        url: '/roi-calculator',
        type: 'tool',
      },
      {
        title: 'Implementation Checklist Template',
        url: '/templates/implementation-checklist',
        type: 'template',
      },
    ];
  }

  generateMarkdownDocumentation(blueprint: Blueprint): string {
    const doc = this.generateFullDocumentation(blueprint);

    const sections = [
      `# ${blueprint.archetype.name} - Pricing Documentation`,
      '',
      `**Generated**: ${new Date().toISOString()}`,
      `**Status**: ${blueprint.metadata.status}`,
      `**Quality Score**: ${blueprint.metadata.qualityScore}/100`,
      '',
      doc.rationale,
      '',
      '## Assumptions',
      doc.assumptions.map((a) => `- ${a}`).join('\n'),
      '',
      '## Trade-offs',
      doc.tradeoffs.map((t) => `- ${t}`).join('\n'),
      '',
      doc.riskAssessment,
      '',
      '## Implementation Checklist',
      doc.implementationChecklist
        .map((item) => `- [ ] **${item.title}** (${item.owner}, ${item.priority})\n  ${item.description}`)
        .join('\n'),
      '',
      '## Frequently Asked Questions',
      doc.faq.map((item) => `### ${item.question}\n${item.answer}`).join('\n\n'),
      '',
      '## Related Resources',
      doc.relatedResources.map((r) => `- [${r.title}](${r.url}) (${r.type})`).join('\n'),
    ];

    return sections.join('\n');
  }

  generateJSONDocumentation(blueprint: Blueprint): string {
    const doc = this.generateFullDocumentation(blueprint);
    return JSON.stringify(
      {
        blueprintId: blueprint.id,
        archetypeName: blueprint.archetype.name,
        generatedAt: new Date().toISOString(),
        documentation: doc,
      },
      null,
      2
    );
  }
}
