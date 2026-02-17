import { Blueprint, Tier } from './types';

export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl: string;
  companyName: string;
}

export interface PricingPageConfig {
  blueprint: Blueprint;
  branding: BrandingConfig;
  includeCalculator: boolean;
  includeComparison: boolean;
  includeFAQ: boolean;
  ctaText?: string;
  ctaUrl?: string;
}

export class PricingPageGenerator {
  generatePage(config: PricingPageConfig): string {
    const sections = [
      this.generateHeader(config),
      this.generateHero(config),
      this.generateTierCards(config),
      config.includeCalculator ? this.generateCalculator(config) : '',
      config.includeComparison ? this.generateComparisonTable(config) : '',
      config.includeFAQ ? this.generateFAQ(config) : '',
      this.generateCTA(config),
      this.generateFooter(config),
    ].filter((s) => s.length > 0);

    return this.wrapInHTML(sections.join('\n'), config);
  }

  private generateHeader(config: PricingPageConfig): string {
    return `
    <header style="background-color: ${config.branding.primaryColor}; color: white; padding: 20px; text-align: center;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <img src="${config.branding.logoUrl}" alt="${config.branding.companyName}" style="height: 40px; margin-bottom: 10px;">
        <h1 style="margin: 0; font-family: ${config.branding.fontFamily};">${config.branding.companyName}</h1>
      </div>
    </header>`;
  }

  private generateHero(config: PricingPageConfig): string {
    const archetype = config.blueprint.archetype;
    return `
    <section style="background: linear-gradient(135deg, ${config.branding.primaryColor}, ${config.branding.secondaryColor}); color: white; padding: 60px 20px; text-align: center;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="font-size: 2.5em; margin-bottom: 20px; font-family: ${config.branding.fontFamily};">${archetype.name} Pricing</h2>
        <p style="font-size: 1.2em; margin-bottom: 10px;">${archetype.description}</p>
        <p style="font-size: 1em; opacity: 0.9;">Choose the perfect plan for your needs</p>
      </div>
    </section>`;
  }

  private generateTierCards(config: PricingPageConfig): string {
    const cards = config.blueprint.tiers
      .map((tier) => this.generateTierCard(tier, config))
      .join('\n');

    return `
    <section style="padding: 60px 20px; background-color: #f9f9f9;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: 2em; margin-bottom: 40px; font-family: ${config.branding.fontFamily};">Our Plans</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          ${cards}
        </div>
      </div>
    </section>`;
  }

  private generateTierCard(tier: Tier, config: PricingPageConfig): string {
    const features = tier.features.map((f) => `<li style="padding: 8px 0;">✓ ${f.name}</li>`).join('\n');

    const limits = tier.usageLimits
      ?.map((ul) => `<li style="padding: 8px 0; color: #666;">• ${ul.meter}: ${ul.limit.toLocaleString()} ${ul.overage?.type === 'blocked' ? '(hard limit)' : '(+ overage)'}</li>`)
      .join('\n') || '';

    return `
    <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-top: 4px solid ${config.branding.primaryColor};">
      <h3 style="font-size: 1.5em; margin-bottom: 10px; font-family: ${config.branding.fontFamily};">${tier.name}</h3>
      <p style="color: #666; margin-bottom: 20px;">${tier.description}</p>
      <div style="margin-bottom: 20px;">
        <span style="font-size: 2.5em; font-weight: bold; color: ${config.branding.primaryColor};">$${tier.price}</span>
        <span style="color: #666;">/${tier.billingCycle}</span>
      </div>
      <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
        ${features}
      </ul>
      ${limits ? `<div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;"><p style="font-weight: bold; margin-bottom: 10px;">Usage Limits:</p><ul style="list-style: none; padding: 0;">${limits}</ul></div>` : ''}
      <button style="width: 100%; padding: 12px; background-color: ${config.branding.primaryColor}; color: white; border: none; border-radius: 4px; font-size: 1em; cursor: pointer; font-weight: bold;">
        Get Started
      </button>
    </div>`;
  }

  private generateCalculator(config: PricingPageConfig): string {
    const meters = config.blueprint.meters.slice(0, 3); // Show first 3 meters

    const inputs = meters
      .map(
        (meter) => `
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">${meter.name} (${meter.unit})</label>
        <input type="number" placeholder="Enter ${meter.name}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" data-meter="${meter.id}">
      </div>`
      )
      .join('\n');

    return `
    <section style="padding: 60px 20px; background-color: white;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: 2em; margin-bottom: 40px; font-family: ${config.branding.fontFamily};">Pricing Calculator</h2>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px;">
          ${inputs}
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd;">
            <p style="font-size: 1.2em; margin-bottom: 10px;">Estimated Monthly Cost:</p>
            <p style="font-size: 2.5em; font-weight: bold; color: ${config.branding.primaryColor};">$<span id="estimated-cost">0</span></p>
          </div>
        </div>
      </div>
    </section>`;
  }

  private generateComparisonTable(config: PricingPageConfig): string {
    const tiers = config.blueprint.tiers;
    const allFeatures = Array.from(new Set(tiers.flatMap((t) => t.features.map((f) => f.name))));

    const headerRow = `
      <tr>
        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Feature</th>
        ${tiers.map((t) => `<th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd; background-color: ${config.branding.primaryColor}; color: white;">${t.name}</th>`).join('\n')}
      </tr>`;

    const featureRows = allFeatures
      .map((feature) => {
        const cells = tiers
          .map((tier) => {
            const hasFeature = tier.features.some((f) => f.name === feature);
            return `<td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee;">${hasFeature ? '✓' : '—'}</td>`;
          })
          .join('\n');

        return `
        <tr>
          <td style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; font-weight: 500;">${feature}</td>
          ${cells}
        </tr>`;
      })
      .join('\n');

    return `
    <section style="padding: 60px 20px; background-color: #f9f9f9;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: 2em; margin-bottom: 40px; font-family: ${config.branding.fontFamily};">Feature Comparison</h2>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
            ${headerRow}
            ${featureRows}
          </table>
        </div>
      </div>
    </section>`;
  }

  private generateFAQ(config: PricingPageConfig): string {
    const faqs = [
      {
        question: 'Can I change my plan later?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, bank transfers, and wire transfers for enterprise customers.',
      },
      {
        question: 'Is there a free trial?',
        answer: 'Yes, we offer a 14-day free trial for all plans. No credit card required.',
      },
      {
        question: 'What happens if I exceed my usage limits?',
        answer: 'Depending on your plan, you can either pay per-unit overage charges or upgrade to a higher tier.',
      },
      {
        question: 'Do you offer discounts for annual billing?',
        answer: 'Yes, annual plans include a 20% discount compared to monthly billing.',
      },
    ];

    const faqItems = faqs
      .map(
        (faq) => `
      <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: ${config.branding.primaryColor}; font-family: ${config.branding.fontFamily};">${faq.question}</h4>
        <p style="margin: 0; color: #666;">${faq.answer}</p>
      </div>`
      )
      .join('\n');

    return `
    <section style="padding: 60px 20px; background-color: white;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: 2em; margin-bottom: 40px; font-family: ${config.branding.fontFamily};">Frequently Asked Questions</h2>
        ${faqItems}
      </div>
    </section>`;
  }

  private generateCTA(config: PricingPageConfig): string {
    return `
    <section style="background-color: ${config.branding.primaryColor}; color: white; padding: 60px 20px; text-align: center;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="font-size: 2em; margin-bottom: 20px; font-family: ${config.branding.fontFamily};">Ready to get started?</h2>
        <p style="font-size: 1.1em; margin-bottom: 30px;">Join thousands of customers using ${config.blueprint.archetype.name}</p>
        <a href="${config.ctaUrl || '#'}" style="display: inline-block; background-color: white; color: ${config.branding.primaryColor}; padding: 15px 40px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 1.1em;">
          ${config.ctaText || 'Start Free Trial'}
        </a>
      </div>
    </section>`;
  }

  private generateFooter(config: PricingPageConfig): string {
    return `
    <footer style="background-color: #333; color: white; padding: 40px 20px; text-align: center;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <p style="margin: 0; opacity: 0.8;">© 2024 ${config.branding.companyName}. All rights reserved.</p>
      </div>
    </footer>`;
  }

  private wrapInHTML(content: string, config: PricingPageConfig): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.blueprint.archetype.name} Pricing</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: ${config.branding.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    @media (max-width: 768px) {
      h1 { font-size: 1.8em; }
      h2 { font-size: 1.5em; }
      .tier-card { margin-bottom: 20px; }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
  }
}
