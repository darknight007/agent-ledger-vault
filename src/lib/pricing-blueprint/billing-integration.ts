import { Blueprint, Meter, Tier } from './types';

export interface BillingMeterConfig {
  meterId: string;
  meterName: string;
  unit: string;
  aggregationType: 'sum' | 'max' | 'count';
  reportingFrequency: 'hourly' | 'daily' | 'monthly';
  accuracy: number;
}

export interface BillingTierConfig {
  tierId: string;
  tierName: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  features: string[];
  usageLimits: {
    meter: string;
    limit: number;
    overage: {
      type: 'per-unit' | 'tiered' | 'blocked';
      price?: number;
    };
  }[];
}

export interface BillingAlert {
  meterId: string;
  threshold: number;
  alertType: 'warning' | 'critical';
  action: 'notify' | 'throttle' | 'block';
  message: string;
}

export interface BillingThrottleRule {
  meterId: string;
  threshold: number;
  throttlePercentage: number;
  duration: number; // in minutes
  resetCondition: 'time' | 'manual';
}

export interface BillingConfiguration {
  blueprintId: string;
  provider: 'stripe' | 'zuora' | 'custom';
  meters: BillingMeterConfig[];
  tiers: BillingTierConfig[];
  alerts: BillingAlert[];
  throttleRules: BillingThrottleRule[];
  fairUsePolicies: string[];
  abuseDetectionRules: string[];
  metadata: {
    createdDate: Date;
    lastUpdated: Date;
    status: 'draft' | 'ready' | 'deployed';
    validatedBy?: string;
  };
}

export interface BillingValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export class BillingIntegration {
  private providerAdapters: Map<string, BillingProviderAdapter> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    this.providerAdapters.set('stripe', new StripeBillingAdapter());
    this.providerAdapters.set('zuora', new ZuoraBillingAdapter());
    this.providerAdapters.set('custom', new CustomBillingAdapter());
  }

  generateBillingConfiguration(blueprint: Blueprint, provider: 'stripe' | 'zuora' | 'custom'): BillingConfiguration {
    const meters = this.generateMeterConfigs(blueprint);
    const tiers = this.generateTierConfigs(blueprint);
    const alerts = this.generateAlerts(blueprint);
    const throttleRules = this.generateThrottleRules(blueprint);
    const fairUsePolicies = this.generateFairUsePolicies(blueprint);
    const abuseDetectionRules = this.generateAbuseDetectionRules(blueprint);

    return {
      blueprintId: blueprint.id,
      provider,
      meters,
      tiers,
      alerts,
      throttleRules,
      fairUsePolicies,
      abuseDetectionRules,
      metadata: {
        createdDate: new Date(),
        lastUpdated: new Date(),
        status: 'draft',
      },
    };
  }

  private generateMeterConfigs(blueprint: Blueprint): BillingMeterConfig[] {
    return blueprint.meters.map((meter) => ({
      meterId: meter.id,
      meterName: meter.name,
      unit: meter.unit,
      aggregationType: this.determineAggregationType(meter),
      reportingFrequency: this.determineReportingFrequency(meter),
      accuracy: meter.accuracy || 95,
    }));
  }

  private determineAggregationType(meter: Meter): 'sum' | 'max' | 'count' {
    const name = meter.name.toLowerCase();
    if (name.includes('concurrent') || name.includes('seat') || name.includes('user')) {
      return 'max';
    }
    if (name.includes('count') || name.includes('number')) {
      return 'count';
    }
    return 'sum';
  }

  private determineReportingFrequency(meter: Meter): 'hourly' | 'daily' | 'monthly' {
    const name = meter.name.toLowerCase();
    if (name.includes('real-time') || name.includes('concurrent')) {
      return 'hourly';
    }
    if (name.includes('daily')) {
      return 'daily';
    }
    return 'monthly';
  }

  private generateTierConfigs(blueprint: Blueprint): BillingTierConfig[] {
    return blueprint.tiers.map((tier) => ({
      tierId: tier.id,
      tierName: tier.name,
      price: tier.price,
      billingCycle: tier.billingCycle,
      features: tier.features.map((f) => f.name),
      usageLimits: tier.usageLimits || [],
    }));
  }

  private generateAlerts(blueprint: Blueprint): BillingAlert[] {
    const alerts: BillingAlert[] = [];

    blueprint.meters.forEach((meter) => {
      // Warning alert at 80% of limit
      blueprint.tiers.forEach((tier) => {
        const limit = tier.usageLimits?.find((ul) => ul.meter === meter.id);
        if (limit) {
          alerts.push({
            meterId: meter.id,
            threshold: limit.limit * 0.8,
            alertType: 'warning',
            action: 'notify',
            message: `Usage of ${meter.name} approaching limit (80% threshold)`,
          });

          // Critical alert at 95% of limit
          alerts.push({
            meterId: meter.id,
            threshold: limit.limit * 0.95,
            alertType: 'critical',
            action: 'notify',
            message: `Usage of ${meter.name} critical (95% threshold)`,
          });
        }
      });
    });

    return alerts;
  }

  private generateThrottleRules(blueprint: Blueprint): BillingThrottleRule[] {
    const rules: BillingThrottleRule[] = [];

    blueprint.meters.forEach((meter) => {
      if (meter.name.toLowerCase().includes('api') || meter.name.toLowerCase().includes('call')) {
        blueprint.tiers.forEach((tier) => {
          const limit = tier.usageLimits?.find((ul) => ul.meter === meter.id);
          if (limit && limit.overage?.type === 'blocked') {
            rules.push({
              meterId: meter.id,
              threshold: limit.limit,
              throttlePercentage: 50,
              duration: 60,
              resetCondition: 'time',
            });
          }
        });
      }
    });

    return rules;
  }

  private generateFairUsePolicies(blueprint: Blueprint): string[] {
    return [
      'Usage must be for legitimate business purposes only',
      'Automated abuse or gaming of the pricing system is prohibited',
      'Reselling or redistribution of service is not permitted',
      'Usage patterns must not negatively impact other customers',
      'Excessive usage may result in account suspension',
      'Fair use limits apply to all tiers',
      'Burst usage is allowed but sustained abuse will be addressed',
    ];
  }

  private generateAbuseDetectionRules(blueprint: Blueprint): string[] {
    const rules: string[] = [];

    // API call abuse detection
    if (blueprint.meters.some((m) => m.name.toLowerCase().includes('api'))) {
      rules.push('Detect rapid API call spikes (>10x normal rate)');
      rules.push('Flag recursive API calls exceeding depth limit');
      rules.push('Monitor for distributed attack patterns');
    }

    // Token abuse detection
    if (blueprint.meters.some((m) => m.name.toLowerCase().includes('token'))) {
      rules.push('Detect token padding patterns');
      rules.push('Monitor for unusual model switching behavior');
      rules.push('Flag requests with excessive token counts');
    }

    // Seat abuse detection
    if (blueprint.meters.some((m) => m.name.toLowerCase().includes('seat'))) {
      rules.push('Detect concurrent session anomalies');
      rules.push('Monitor for account cycling patterns');
      rules.push('Flag unusual geographic access patterns');
    }

    // Document abuse detection
    if (blueprint.meters.some((m) => m.name.toLowerCase().includes('document'))) {
      rules.push('Detect duplicate document processing');
      rules.push('Monitor for content hash collisions');
      rules.push('Flag unusual file size patterns');
    }

    return rules;
  }

  validateBillingConfiguration(config: BillingConfiguration): BillingValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validate meters
    if (config.meters.length === 0) {
      errors.push('No billing meters configured');
    }

    config.meters.forEach((meter) => {
      if (meter.accuracy < 90) {
        warnings.push(`Meter "${meter.meterName}" has accuracy below 90% (${meter.accuracy}%)`);
      }
    });

    // Validate tiers
    if (config.tiers.length === 0) {
      errors.push('No billing tiers configured');
    }

    const tierPrices = config.tiers.map((t) => t.price).sort((a, b) => a - b);
    for (let i = 1; i < tierPrices.length; i++) {
      if (tierPrices[i] <= tierPrices[i - 1]) {
        errors.push('Tier prices must be strictly increasing');
      }
    }

    // Validate alerts
    if (config.alerts.length === 0) {
      warnings.push('No billing alerts configured');
      suggestions.push('Consider adding alerts for usage thresholds');
    }

    // Validate throttle rules
    config.throttleRules.forEach((rule) => {
      if (rule.throttlePercentage < 10 || rule.throttlePercentage > 90) {
        warnings.push(`Throttle percentage ${rule.throttlePercentage}% may be too aggressive or lenient`);
      }
    });

    // Validate fair use policies
    if (config.fairUsePolicies.length === 0) {
      warnings.push('No fair use policies defined');
      suggestions.push('Add fair use policies to prevent abuse');
    }

    // Validate abuse detection
    if (config.abuseDetectionRules.length === 0) {
      warnings.push('No abuse detection rules configured');
      suggestions.push('Consider adding abuse detection rules');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  exportConfiguration(config: BillingConfiguration, format: 'json' | 'yaml'): string {
    if (format === 'json') {
      return JSON.stringify(config, null, 2);
    }

    // YAML format
    const lines: string[] = [];
    lines.push(`blueprintId: ${config.blueprintId}`);
    lines.push(`provider: ${config.provider}`);
    lines.push('');
    lines.push('meters:');
    config.meters.forEach((meter) => {
      lines.push(`  - id: ${meter.meterId}`);
      lines.push(`    name: ${meter.meterName}`);
      lines.push(`    unit: ${meter.unit}`);
      lines.push(`    aggregationType: ${meter.aggregationType}`);
      lines.push(`    reportingFrequency: ${meter.reportingFrequency}`);
      lines.push(`    accuracy: ${meter.accuracy}`);
    });
    lines.push('');
    lines.push('tiers:');
    config.tiers.forEach((tier) => {
      lines.push(`  - id: ${tier.tierId}`);
      lines.push(`    name: ${tier.tierName}`);
      lines.push(`    price: ${tier.price}`);
      lines.push(`    billingCycle: ${tier.billingCycle}`);
    });

    return lines.join('\n');
  }

  getProviderAdapter(provider: 'stripe' | 'zuora' | 'custom'): BillingProviderAdapter {
    const adapter = this.providerAdapters.get(provider);
    if (!adapter) {
      throw new Error(`Unknown billing provider: ${provider}`);
    }
    return adapter;
  }
}

interface BillingProviderAdapter {
  name: string;
  generateProviderConfig(config: BillingConfiguration): Record<string, any>;
  validateProviderConfig(config: Record<string, any>): boolean;
}

class StripeBillingAdapter implements BillingProviderAdapter {
  name = 'Stripe';

  generateProviderConfig(config: BillingConfiguration): Record<string, any> {
    return {
      products: config.tiers.map((tier) => ({
        id: `prod_${tier.tierId}`,
        name: tier.tierName,
        description: `${tier.tierName} tier`,
        prices: [
          {
            id: `price_${tier.tierId}`,
            amount: Math.round(tier.price * 100),
            currency: 'usd',
            recurring: {
              interval: tier.billingCycle === 'monthly' ? 'month' : 'year',
              interval_count: 1,
            },
          },
        ],
      })),
      meters: config.meters.map((meter) => ({
        id: `meter_${meter.meterId}`,
        display_name: meter.meterName,
        event_name: meter.meterName,
        value_in_decimal: true,
      })),
    };
  }

  validateProviderConfig(config: Record<string, any>): boolean {
    return config.products && config.meters && Array.isArray(config.products) && Array.isArray(config.meters);
  }
}

class ZuoraBillingAdapter implements BillingProviderAdapter {
  name = 'Zuora';

  generateProviderConfig(config: BillingConfiguration): Record<string, any> {
    return {
      productCatalog: {
        products: config.tiers.map((tier) => ({
          id: `zuora_prod_${tier.tierId}`,
          name: tier.tierName,
          ratePlans: [
            {
              id: `zuora_rp_${tier.tierId}`,
              name: `${tier.tierName} Plan`,
              charges: config.meters.map((meter) => ({
                id: `zuora_charge_${meter.meterId}`,
                name: meter.meterName,
                type: 'Usage',
                model: 'Tiered',
              })),
            },
          ],
        })),
      },
      usageMeters: config.meters.map((meter) => ({
        id: `zuora_meter_${meter.meterId}`,
        name: meter.meterName,
        unit: meter.unit,
      })),
    };
  }

  validateProviderConfig(config: Record<string, any>): boolean {
    return config.productCatalog && config.usageMeters;
  }
}

class CustomBillingAdapter implements BillingProviderAdapter {
  name = 'Custom';

  generateProviderConfig(config: BillingConfiguration): Record<string, any> {
    return {
      version: '1.0',
      blueprintId: config.blueprintId,
      tiers: config.tiers,
      meters: config.meters,
      alerts: config.alerts,
      throttleRules: config.throttleRules,
      policies: {
        fairUse: config.fairUsePolicies,
        abuseDetection: config.abuseDetectionRules,
      },
    };
  }

  validateProviderConfig(config: Record<string, any>): boolean {
    return config.version && config.tiers && config.meters;
  }
}
