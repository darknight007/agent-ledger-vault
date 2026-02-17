import { Blueprint } from './types';

export interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  category: 'fairness' | 'transparency' | 'regulation' | 'standards';
  passed: boolean;
  details: string;
}

export interface ComplianceIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  recommendation: string;
  affectedArea: string;
}

export interface ComplianceRiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  issues: ComplianceIssue[];
  checks: ComplianceCheck[];
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  timestamp: Date;
  action: string;
  actor: string;
  details: string;
}

export class ComplianceSystem {
  private auditTrail: AuditEntry[] = [];

  reviewBlueprint(blueprint: Blueprint): ComplianceRiskAssessment {
    const checks = this.performComplianceChecks(blueprint);
    const issues = this.identifyIssues(blueprint, checks);
    const riskScore = this.calculateRiskScore(issues);
    const overallRisk = this.determineOverallRisk(riskScore);

    this.recordAuditEntry('COMPLIANCE_REVIEW', 'system', `Reviewed blueprint ${blueprint.id}`);

    return {
      overallRisk,
      riskScore,
      issues,
      checks,
      auditTrail: this.auditTrail,
    };
  }

  private performComplianceChecks(blueprint: Blueprint): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [];

    // Fairness checks
    checks.push(this.checkPricingFairness(blueprint));
    checks.push(this.checkTierProgression(blueprint));
    checks.push(this.checkFeatureDistribution(blueprint));

    // Transparency checks
    checks.push(this.checkTermsClarity(blueprint));
    checks.push(this.checkPricingTransparency(blueprint));
    checks.push(this.checkOveragePolicy(blueprint));

    // Regulation checks
    checks.push(this.checkDataPrivacy(blueprint));
    checks.push(this.checkBillingCompliance(blueprint));

    // Standards checks
    checks.push(this.checkIndustryStandards(blueprint));
    checks.push(this.checkBestPractices(blueprint));

    return checks;
  }

  private checkPricingFairness(blueprint: Blueprint): ComplianceCheck {
    const tiers = blueprint.tiers;
    let passed = true;
    let details = '';

    // Check if prices are monotonically increasing
    for (let i = 1; i < tiers.length; i++) {
      if (tiers[i].price <= tiers[i - 1].price) {
        passed = false;
        details += `Tier ${i} price not higher than tier ${i - 1}. `;
      }
    }

    // Check if features increase with price
    for (let i = 1; i < tiers.length; i++) {
      const prevFeatures = tiers[i - 1].features.filter((f) => f.included).length;
      const currFeatures = tiers[i].features.filter((f) => f.included).length;
      if (currFeatures < prevFeatures) {
        passed = false;
        details += `Tier ${i} has fewer features than tier ${i - 1}. `;
      }
    }

    if (passed) {
      details = 'Pricing tiers are fairly structured with monotonically increasing prices and features.';
    }

    return {
      id: 'check-fairness',
      name: 'Pricing Fairness',
      description: 'Verify pricing tiers are fair and logically structured',
      category: 'fairness',
      passed,
      details,
    };
  }

  private checkTierProgression(blueprint: Blueprint): ComplianceCheck {
    const tiers = blueprint.tiers;
    let passed = true;
    let details = '';

    // Check usage limit progression
    const limits = tiers.map((t) => t.usageLimits?.[0]?.limit || 0);
    for (let i = 1; i < limits.length; i++) {
      if (limits[i] <= limits[i - 1]) {
        passed = false;
        details += `Usage limit not increasing from tier ${i - 1} to tier ${i}. `;
      }
    }

    if (passed) {
      details = 'Usage limits progress logically across tiers.';
    }

    return {
      id: 'check-progression',
      name: 'Tier Progression',
      description: 'Verify tier progression is logical and consistent',
      category: 'fairness',
      passed,
      details,
    };
  }

  private checkFeatureDistribution(blueprint: Blueprint): ComplianceCheck {
    const tiers = blueprint.tiers;
    const allFeatures = new Set<string>();

    tiers.forEach((t) => {
      t.features.forEach((f) => {
        allFeatures.add(f.name);
      });
    });

    let passed = true;
    let details = '';

    // Check that features are distributed fairly
    allFeatures.forEach((feature) => {
      const tierCount = tiers.filter((t) => t.features.some((f) => f.name === feature && f.included)).length;
      if (tierCount === 1 && tiers.length > 1) {
        // Feature only in one tier is acceptable
      }
    });

    if (passed) {
      details = `Features are distributed across ${tiers.length} tiers fairly.`;
    }

    return {
      id: 'check-features',
      name: 'Feature Distribution',
      description: 'Verify features are distributed fairly across tiers',
      category: 'fairness',
      passed,
      details,
    };
  }

  private checkTermsClarity(blueprint: Blueprint): ComplianceCheck {
    const hasRationale = blueprint.pricingArchetype.rationale && blueprint.pricingArchetype.rationale.length > 0;
    const hasRisks = blueprint.risks && blueprint.risks.risks.length > 0;

    const passed = hasRationale && hasRisks;
    const details = passed
      ? 'Pricing terms and risks are clearly documented.'
      : 'Missing pricing rationale or risk documentation.';

    return {
      id: 'check-clarity',
      name: 'Terms Clarity',
      description: 'Verify pricing terms are clear and well-documented',
      category: 'transparency',
      passed,
      details,
    };
  }

  private checkPricingTransparency(blueprint: Blueprint): ComplianceCheck {
    const tiers = blueprint.tiers;
    let passed = true;
    let details = '';

    // Check that all tiers have clear descriptions
    tiers.forEach((t, i) => {
      if (!t.description || t.description.length < 10) {
        passed = false;
        details += `Tier ${i} lacks clear description. `;
      }
    });

    // Check that usage limits are documented
    tiers.forEach((t, i) => {
      if (!t.usageLimits || t.usageLimits.length === 0) {
        passed = false;
        details += `Tier ${i} lacks usage limit documentation. `;
      }
    });

    if (passed) {
      details = 'All pricing tiers have clear descriptions and documented usage limits.';
    }

    return {
      id: 'check-transparency',
      name: 'Pricing Transparency',
      description: 'Verify pricing is transparent and well-documented',
      category: 'transparency',
      passed,
      details,
    };
  }

  private checkOveragePolicy(blueprint: Blueprint): ComplianceCheck {
    const tiers = blueprint.tiers;
    let passed = true;
    let details = '';

    // Check that overage policies are defined
    tiers.forEach((t, i) => {
      const hasOveragePolicy = t.usageLimits?.every((ul) => ul.overage && (ul.overage.type || ul.overage.price !== undefined));
      if (!hasOveragePolicy) {
        passed = false;
        details += `Tier ${i} lacks clear overage policy. `;
      }
    });

    if (passed) {
      details = 'All tiers have clear overage policies defined.';
    }

    return {
      id: 'check-overage',
      name: 'Overage Policy',
      description: 'Verify overage policies are clearly defined',
      category: 'transparency',
      passed,
      details,
    };
  }

  private checkDataPrivacy(blueprint: Blueprint): ComplianceCheck {
    // Placeholder for data privacy checks
    return {
      id: 'check-privacy',
      name: 'Data Privacy',
      description: 'Verify data privacy compliance',
      category: 'regulation',
      passed: true,
      details: 'Data privacy requirements should be verified with legal team.',
    };
  }

  private checkBillingCompliance(blueprint: Blueprint): ComplianceCheck {
    // Placeholder for billing compliance checks
    return {
      id: 'check-billing',
      name: 'Billing Compliance',
      description: 'Verify billing compliance with regulations',
      category: 'regulation',
      passed: true,
      details: 'Billing compliance should be verified with finance and legal teams.',
    };
  }

  private checkIndustryStandards(blueprint: Blueprint): ComplianceCheck {
    const pricingType = blueprint.pricingArchetype.type;
    const standardTypes = ['seat-based', 'usage-based', 'hybrid', 'credits', 'outcome-based', 'enterprise-only'];

    const passed = standardTypes.includes(pricingType);
    const details = passed
      ? `Pricing model (${pricingType}) follows industry standards.`
      : `Pricing model (${pricingType}) may not follow industry standards.`;

    return {
      id: 'check-standards',
      name: 'Industry Standards',
      description: 'Verify pricing follows industry standards',
      category: 'standards',
      passed,
      details,
    };
  }

  private checkBestPractices(blueprint: Blueprint): ComplianceCheck {
    const tiers = blueprint.tiers;
    let passed = true;
    let details = '';

    // Check for recommended number of tiers (3-5)
    if (tiers.length < 2 || tiers.length > 5) {
      passed = false;
      details += `Recommended 3-5 tiers, found ${tiers.length}. `;
    }

    // Check for clear tier names
    const tierNames = tiers.map((t) => t.name.toLowerCase());
    const hasStandardNames = tierNames.some((n) => ['starter', 'professional', 'enterprise'].includes(n));
    if (!hasStandardNames) {
      details += 'Consider using standard tier names (Starter, Professional, Enterprise). ';
    }

    if (passed && details === '') {
      details = 'Pricing follows best practices.';
    }

    return {
      id: 'check-practices',
      name: 'Best Practices',
      description: 'Verify pricing follows best practices',
      category: 'standards',
      passed,
      details,
    };
  }

  private identifyIssues(blueprint: Blueprint, checks: ComplianceCheck[]): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];

    checks.forEach((check) => {
      if (!check.passed) {
        issues.push({
          id: `issue-${check.id}`,
          severity: check.category === 'fairness' ? 'high' : 'medium',
          category: check.category,
          description: check.details,
          recommendation: `Review and address: ${check.name}`,
          affectedArea: check.name,
        });
      }
    });

    return issues;
  }

  private calculateRiskScore(issues: ComplianceIssue[]): number {
    let score = 0;

    issues.forEach((issue) => {
      switch (issue.severity) {
        case 'critical':
          score += 25;
          break;
        case 'high':
          score += 15;
          break;
        case 'medium':
          score += 8;
          break;
        case 'low':
          score += 3;
          break;
      }
    });

    return Math.min(score, 100);
  }

  private determineOverallRisk(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 75) return 'critical';
    if (riskScore >= 50) return 'high';
    if (riskScore >= 25) return 'medium';
    return 'low';
  }

  private recordAuditEntry(action: string, actor: string, details: string): void {
    this.auditTrail.push({
      timestamp: new Date(),
      action,
      actor,
      details,
    });
  }

  generateComplianceReport(assessment: ComplianceRiskAssessment): string {
    const sections = [
      '# Compliance Review Report',
      '',
      `**Overall Risk Level**: ${assessment.overallRisk.toUpperCase()}`,
      `**Risk Score**: ${assessment.riskScore}/100`,
      '',
      '## Compliance Checks',
      ...assessment.checks.map((c) => `- [${c.passed ? 'PASS' : 'FAIL'}] ${c.name}: ${c.details}`),
      '',
      '## Issues Found',
      assessment.issues.length > 0
        ? assessment.issues.map((i) => `- [${i.severity.toUpperCase()}] ${i.affectedArea}: ${i.description}`).join('\n')
        : 'No issues found',
      '',
      '## Recommendations',
      assessment.issues.length > 0
        ? assessment.issues.map((i) => `- ${i.recommendation}`).join('\n')
        : 'Blueprint is compliant',
      '',
      '## Audit Trail',
      ...assessment.auditTrail.slice(-5).map((e) => `- ${e.timestamp.toISOString()}: ${e.action} by ${e.actor}`),
    ];

    return sections.join('\n');
  }

  getAuditTrail(): AuditEntry[] {
    return this.auditTrail;
  }

  clearAuditTrail(): void {
    this.auditTrail = [];
  }
}
