/**
 * Archetype Catalog System
 * Manages 100+ AI agent archetypes with classification, search, and filtering
 */

import { Archetype, ArchetypeFilter } from './types';
import { validateArchetype } from './schema-validator';

/**
 * In-memory archetype catalog with search and filtering capabilities
 */
export class ArchetypeCatalog {
  private archetypes: Map<string, Archetype> = new Map();
  private categoryIndex: Map<string, Set<string>> = new Map();
  private useCaseIndex: Map<string, Set<string>> = new Map();

  /**
   * Adds an archetype to the catalog
   */
  addArchetype(archetype: Archetype): void {
    // Validate archetype
    const validation = validateArchetype(archetype);
    if (!validation.valid) {
      throw new Error(
        `Invalid archetype: ${validation.errors.join(', ')}`
      );
    }

    // Add to main storage
    this.archetypes.set(archetype.id, archetype);

    // Update indexes
    this.updateCategoryIndex(archetype);
    this.updateUseCaseIndex(archetype);
  }

  /**
   * Retrieves an archetype by ID
   */
  getArchetype(id: string): Archetype | undefined {
    return this.archetypes.get(id);
  }

  /**
   * Lists all archetypes with optional filtering
   */
  listArchetypes(filter?: ArchetypeFilter): Archetype[] {
    let results = Array.from(this.archetypes.values());

    if (!filter) {
      return results;
    }

    // Filter by category
    if (filter.category) {
      const categoryIds = this.categoryIndex.get(filter.category) || new Set();
      results = results.filter((a) => categoryIds.has(a.id));
    }

    // Filter by use case
    if (filter.useCase) {
      const useCaseIds = this.useCaseIndex.get(filter.useCase) || new Set();
      results = results.filter((a) => useCaseIds.has(a.id));
    }

    // Filter by minimum priority
    if (filter.minPriority !== undefined) {
      results = results.filter((a) => a.priority >= filter.minPriority!);
    }

    // Filter by token consumption
    if (filter.tokenConsumption) {
      results = results.filter((a) => a.tokenConsumption === filter.tokenConsumption);
    }

    return results;
  }

  /**
   * Searches archetypes by name or description
   */
  searchArchetypes(query: string): Archetype[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.archetypes.values()).filter(
      (a) =>
        a.name.toLowerCase().includes(lowerQuery) ||
        a.description.toLowerCase().includes(lowerQuery) ||
        a.primaryUseCase.toLowerCase().includes(lowerQuery) ||
        a.keyFeatures.some((f) => f.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Gets similar archetypes based on category and features
   */
  getSimilarArchetypes(archetype: Archetype, limit: number = 5): Archetype[] {
    const similar: Array<{ archetype: Archetype; score: number }> = [];

    for (const other of this.archetypes.values()) {
      if (other.id === archetype.id) continue;

      let score = 0;

      // Same category: +3 points
      if (other.category === archetype.category) {
        score += 3;
      }

      // Same token consumption: +2 points
      if (other.tokenConsumption === archetype.tokenConsumption) {
        score += 2;
      }

      // Similar market size (within 50%): +1 point
      const marketSizeRatio =
        other.estimatedMarketSize / archetype.estimatedMarketSize;
      if (marketSizeRatio > 0.5 && marketSizeRatio < 2) {
        score += 1;
      }

      // Shared features: +0.5 per feature
      const sharedFeatures = other.keyFeatures.filter((f) =>
        archetype.keyFeatures.includes(f)
      );
      score += sharedFeatures.length * 0.5;

      if (score > 0) {
        similar.push({ archetype: other, score });
      }
    }

    // Sort by score descending and return top N
    return similar
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.archetype);
  }

  /**
   * Updates archetype priority
   */
  updatePriority(archetypeId: string, priority: number): void {
    const archetype = this.archetypes.get(archetypeId);
    if (!archetype) {
      throw new Error(`Archetype not found: ${archetypeId}`);
    }

    if (priority < 0 || priority > 100) {
      throw new Error('Priority must be between 0 and 100');
    }

    archetype.priority = priority;
  }

  /**
   * Gets all unique categories
   */
  getCategories(): string[] {
    return Array.from(this.categoryIndex.keys()).sort();
  }

  /**
   * Gets all unique use cases
   */
  getUseCases(): string[] {
    return Array.from(this.useCaseIndex.keys()).sort();
  }

  /**
   * Gets archetype count by category
   */
  getCountByCategory(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const [category, ids] of this.categoryIndex.entries()) {
      counts[category] = ids.size;
    }
    return counts;
  }

  /**
   * Gets archetype count by token consumption
   */
  getCountByTokenConsumption(): Record<string, number> {
    const counts: Record<string, number> = { low: 0, medium: 0, high: 0 };
    for (const archetype of this.archetypes.values()) {
      counts[archetype.tokenConsumption]++;
    }
    return counts;
  }

  /**
   * Gets top N archetypes by priority
   */
  getTopByPriority(limit: number = 10): Archetype[] {
    return Array.from(this.archetypes.values())
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  }

  /**
   * Gets total archetype count
   */
  getCount(): number {
    return this.archetypes.size;
  }

  /**
   * Exports catalog as JSON
   */
  toJSON(): string {
    const data = {
      count: this.archetypes.size,
      archetypes: Array.from(this.archetypes.values()),
      categories: this.getCategories(),
      useCases: this.getUseCases(),
      countByCategory: this.getCountByCategory(),
      countByTokenConsumption: this.getCountByTokenConsumption(),
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Imports catalog from JSON
   */
  fromJSON(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data.archetypes)) {
        throw new Error('Invalid catalog format: archetypes must be an array');
      }

      for (const archetype of data.archetypes) {
        this.addArchetype(archetype);
      }
    } catch (error) {
      throw new Error(
        `Failed to import catalog: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Clears all archetypes
   */
  clear(): void {
    this.archetypes.clear();
    this.categoryIndex.clear();
    this.useCaseIndex.clear();
  }

  /**
   * Gets statistics about the catalog
   */
  getStatistics(): {
    totalCount: number;
    averageMarketSize: number;
    averagePriority: number;
    averageGrowthPotential: number;
    categories: number;
    useCases: number;
  } {
    const archetypes = Array.from(this.archetypes.values());

    if (archetypes.length === 0) {
      return {
        totalCount: 0,
        averageMarketSize: 0,
        averagePriority: 0,
        averageGrowthPotential: 0,
        categories: 0,
        useCases: 0,
      };
    }

    const totalMarketSize = archetypes.reduce(
      (sum, a) => sum + a.estimatedMarketSize,
      0
    );
    const totalPriority = archetypes.reduce((sum, a) => sum + a.priority, 0);
    const totalGrowth = archetypes.reduce(
      (sum, a) => sum + a.growthPotential,
      0
    );

    return {
      totalCount: archetypes.length,
      averageMarketSize: totalMarketSize / archetypes.length,
      averagePriority: totalPriority / archetypes.length,
      averageGrowthPotential: totalGrowth / archetypes.length,
      categories: this.categoryIndex.size,
      useCases: this.useCaseIndex.size,
    };
  }

  /**
   * Private: Updates category index
   */
  private updateCategoryIndex(archetype: Archetype): void {
    if (!this.categoryIndex.has(archetype.category)) {
      this.categoryIndex.set(archetype.category, new Set());
    }
    this.categoryIndex.get(archetype.category)!.add(archetype.id);
  }

  /**
   * Private: Updates use case index
   */
  private updateUseCaseIndex(archetype: Archetype): void {
    if (!this.useCaseIndex.has(archetype.primaryUseCase)) {
      this.useCaseIndex.set(archetype.primaryUseCase, new Set());
    }
    this.useCaseIndex.get(archetype.primaryUseCase)!.add(archetype.id);
  }
}

/**
 * Factory function to create a pre-populated catalog with sample archetypes
 */
export function createSampleCatalog(): ArchetypeCatalog {
  const catalog = new ArchetypeCatalog();

  // Sample archetypes (4 existing + 6 new examples)
  const sampleArchetypes: Archetype[] = [
    {
      id: 'research-agent',
      name: 'Research Agent',
      description: 'Conducts comprehensive research and analysis',
      category: 'Research',
      primaryUseCase: 'Market research and competitive analysis',
      targetICP: 'Enterprise research teams',
      keyFeatures: [
        'Web search',
        'Document analysis',
        'Report generation',
        'Data synthesis',
      ],
      estimatedMarketSize: 50000000,
      tokenConsumption: 'high',
      userBaseSize: 5000,
      growthPotential: 0.8,
      priority: 95,
      similarArchetypes: [],
      metadata: {},
    },
    {
      id: 'social-content-creator',
      name: 'Social Content Creator Agent',
      description: 'Creates and optimizes social media content',
      category: 'Content Creation',
      primaryUseCase: 'Social media content generation',
      targetICP: 'Marketing teams and content creators',
      keyFeatures: [
        'Content generation',
        'Platform optimization',
        'Scheduling',
        'Analytics',
      ],
      estimatedMarketSize: 75000000,
      tokenConsumption: 'medium',
      userBaseSize: 12000,
      growthPotential: 0.9,
      priority: 90,
      similarArchetypes: [],
      metadata: {},
    },
    {
      id: 'customer-support-agent',
      name: 'Customer Support Agent',
      description: 'Handles customer inquiries and support tickets',
      category: 'Customer Support',
      primaryUseCase: 'Customer service automation',
      targetICP: 'SaaS companies and e-commerce',
      keyFeatures: [
        'Ticket management',
        'Knowledge base search',
        'Response generation',
        'Escalation handling',
      ],
      estimatedMarketSize: 100000000,
      tokenConsumption: 'medium',
      userBaseSize: 20000,
      growthPotential: 0.85,
      priority: 92,
      similarArchetypes: [],
      metadata: {},
    },
    {
      id: 'ai-sdr-agent',
      name: 'AI SDR Agent',
      description: 'Automates sales development and lead qualification',
      category: 'Sales',
      primaryUseCase: 'Sales development and lead generation',
      targetICP: 'B2B SaaS companies',
      keyFeatures: [
        'Lead qualification',
        'Email outreach',
        'Meeting scheduling',
        'Pipeline management',
      ],
      estimatedMarketSize: 80000000,
      tokenConsumption: 'medium',
      userBaseSize: 8000,
      growthPotential: 0.88,
      priority: 88,
      similarArchetypes: [],
      metadata: {},
    },
    {
      id: 'code-review-agent',
      name: 'Code Review Agent',
      description: 'Performs automated code review and quality checks',
      category: 'Development',
      primaryUseCase: 'Code quality and security review',
      targetICP: 'Software development teams',
      keyFeatures: [
        'Code analysis',
        'Security scanning',
        'Performance review',
        'Best practices checking',
      ],
      estimatedMarketSize: 60000000,
      tokenConsumption: 'high',
      userBaseSize: 10000,
      growthPotential: 0.82,
      priority: 85,
      similarArchetypes: [],
      metadata: {},
    },
    {
      id: 'data-analyst-agent',
      name: 'Data Analyst Agent',
      description: 'Analyzes data and generates insights',
      category: 'Analytics',
      primaryUseCase: 'Data analysis and reporting',
      targetICP: 'Data teams and business analysts',
      keyFeatures: [
        'Data processing',
        'Statistical analysis',
        'Visualization',
        'Report generation',
      ],
      estimatedMarketSize: 55000000,
      tokenConsumption: 'high',
      userBaseSize: 7000,
      growthPotential: 0.8,
      priority: 80,
      similarArchetypes: [],
      metadata: {},
    },
    {
      id: 'hr-recruiter-agent',
      name: 'HR Recruiter Agent',
      description: 'Automates recruitment and candidate screening',
      category: 'Human Resources',
      primaryUseCase: 'Recruitment and candidate screening',
      targetICP: 'HR departments and recruiting firms',
      keyFeatures: [
        'Resume screening',
        'Candidate matching',
        'Interview scheduling',
        'Offer generation',
      ],
      estimatedMarketSize: 45000000,
      tokenConsumption: 'low',
      userBaseSize: 6000,
      growthPotential: 0.75,
      priority: 75,
      similarArchetypes: [],
      metadata: {},
    },
    {
      id: 'legal-document-agent',
      name: 'Legal Document Agent',
      description: 'Generates and reviews legal documents',
      category: 'Legal',
      primaryUseCase: 'Legal document generation and review',
      targetICP: 'Law firms and legal departments',
      keyFeatures: [
        'Document generation',
        'Contract review',
        'Compliance checking',
        'Risk assessment',
      ],
      estimatedMarketSize: 40000000,
      tokenConsumption: 'high',
      userBaseSize: 4000,
      growthPotential: 0.7,
      priority: 70,
      similarArchetypes: [],
      metadata: {},
    },
    {
      id: 'email-marketing-agent',
      name: 'Email Marketing Agent',
      description: 'Creates and optimizes email marketing campaigns',
      category: 'Marketing',
      primaryUseCase: 'Email campaign creation and optimization',
      targetICP: 'Marketing teams and agencies',
      keyFeatures: [
        'Email generation',
        'A/B testing',
        'Segmentation',
        'Performance analytics',
      ],
      estimatedMarketSize: 65000000,
      tokenConsumption: 'medium',
      userBaseSize: 9000,
      growthPotential: 0.83,
      priority: 82,
      similarArchetypes: [],
      metadata: {},
    },
    {
      id: 'product-manager-agent',
      name: 'Product Manager Agent',
      description: 'Assists with product management and roadmapping',
      category: 'Product Management',
      primaryUseCase: 'Product strategy and roadmapping',
      targetICP: 'Product teams and startups',
      keyFeatures: [
        'Roadmap generation',
        'Feature prioritization',
        'User research',
        'Competitive analysis',
      ],
      estimatedMarketSize: 35000000,
      tokenConsumption: 'medium',
      userBaseSize: 5500,
      growthPotential: 0.78,
      priority: 78,
      similarArchetypes: [],
      metadata: {},
    },
  ];

  for (const archetype of sampleArchetypes) {
    catalog.addArchetype(archetype);
  }

  return catalog;
}
