import { Blueprint } from './types';

export interface SearchQuery {
  archetype?: string;
  category?: string;
  minQualityScore?: number;
  status?: 'draft' | 'approved' | 'published';
  dateRange?: { start: Date; end: Date };
}

export interface BlueprintVersion {
  version: number;
  blueprintId: string;
  createdDate: Date;
  author: string;
  changes: string;
  previousVersion?: BlueprintVersion;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdDate: Date;
  resolved: boolean;
}

export interface BlueprintMetadata {
  blueprintId: string;
  versions: BlueprintVersion[];
  comments: Comment[];
  tags: string[];
  lastAccessedDate: Date;
  accessCount: number;
}

export class BlueprintRepository {
  private blueprints: Map<string, Blueprint> = new Map();
  private metadata: Map<string, BlueprintMetadata> = new Map();
  private versionHistory: Map<string, BlueprintVersion[]> = new Map();

  store(blueprint: Blueprint): string {
    this.blueprints.set(blueprint.id, blueprint);

    // Initialize metadata if not exists
    if (!this.metadata.has(blueprint.id)) {
      this.metadata.set(blueprint.id, {
        blueprintId: blueprint.id,
        versions: [
          {
            version: 1,
            blueprintId: blueprint.id,
            createdDate: new Date(),
            author: blueprint.metadata.author,
            changes: 'Initial version',
          },
        ],
        comments: [],
        tags: [],
        lastAccessedDate: new Date(),
        accessCount: 1,
      });
    }

    return blueprint.id;
  }

  retrieve(blueprintId: string): Blueprint | null {
    const blueprint = this.blueprints.get(blueprintId);
    if (blueprint) {
      const meta = this.metadata.get(blueprintId);
      if (meta) {
        meta.lastAccessedDate = new Date();
        meta.accessCount++;
      }
    }
    return blueprint || null;
  }

  search(query: SearchQuery): Blueprint[] {
    const results: Blueprint[] = [];

    this.blueprints.forEach((blueprint) => {
      let matches = true;

      if (query.archetype && !blueprint.archetype.name.toLowerCase().includes(query.archetype.toLowerCase())) {
        matches = false;
      }

      if (query.category && blueprint.archetype.category !== query.category) {
        matches = false;
      }

      if (query.minQualityScore && blueprint.metadata.qualityScore < query.minQualityScore) {
        matches = false;
      }

      if (query.status && blueprint.metadata.status !== query.status) {
        matches = false;
      }

      if (query.dateRange) {
        if (blueprint.metadata.createdDate < query.dateRange.start || blueprint.metadata.createdDate > query.dateRange.end) {
          matches = false;
        }
      }

      if (matches) {
        results.push(blueprint);
      }
    });

    return results;
  }

  update(blueprintId: string, updates: Partial<Blueprint>): void {
    const existing = this.blueprints.get(blueprintId);
    if (!existing) {
      throw new Error(`Blueprint ${blueprintId} not found`);
    }

    const updated = { ...existing, ...updates };
    updated.metadata.lastUpdated = new Date();
    updated.metadata.version++;

    this.blueprints.set(blueprintId, updated);

    // Add version history
    const meta = this.metadata.get(blueprintId);
    if (meta) {
      meta.versions.push({
        version: updated.metadata.version,
        blueprintId,
        createdDate: new Date(),
        author: updated.metadata.author,
        changes: `Updated to version ${updated.metadata.version}`,
        previousVersion: meta.versions[meta.versions.length - 1],
      });
    }
  }

  delete(blueprintId: string): void {
    this.blueprints.delete(blueprintId);
    this.metadata.delete(blueprintId);
    this.versionHistory.delete(blueprintId);
  }

  getVersionHistory(blueprintId: string): BlueprintVersion[] {
    const meta = this.metadata.get(blueprintId);
    return meta?.versions || [];
  }

  addComment(blueprintId: string, comment: Comment): void {
    const meta = this.metadata.get(blueprintId);
    if (!meta) {
      throw new Error(`Blueprint ${blueprintId} not found`);
    }

    meta.comments.push(comment);
  }

  getComments(blueprintId: string): Comment[] {
    const meta = this.metadata.get(blueprintId);
    return meta?.comments || [];
  }

  export(blueprintId: string, format: 'json' | 'markdown' | 'yaml'): string {
    const blueprint = this.retrieve(blueprintId);
    if (!blueprint) {
      throw new Error(`Blueprint ${blueprintId} not found`);
    }

    if (format === 'json') {
      return JSON.stringify(blueprint, null, 2);
    }

    if (format === 'markdown') {
      return this.exportMarkdown(blueprint);
    }

    if (format === 'yaml') {
      return this.exportYAML(blueprint);
    }

    throw new Error(`Unsupported format: ${format}`);
  }

  private exportMarkdown(blueprint: Blueprint): string {
    const sections = [
      `# ${blueprint.archetype.name} - Pricing Blueprint`,
      '',
      `**Status**: ${blueprint.metadata.status}`,
      `**Quality Score**: ${blueprint.metadata.qualityScore}/100`,
      `**Version**: ${blueprint.metadata.version}`,
      '',
      '## Archetype Profile',
      `- **Name**: ${blueprint.archetype.name}`,
      `- **Description**: ${blueprint.archetype.description}`,
      `- **Category**: ${blueprint.archetype.category}`,
      `- **Primary Use Case**: ${blueprint.archetype.primaryUseCase}`,
      `- **Target ICP**: ${blueprint.archetype.targetICP}`,
      '',
      '## Pricing Model',
      `- **Type**: ${blueprint.pricingArchetype.type}`,
      `- **Rationale**: ${blueprint.pricingArchetype.rationale}`,
      '',
      '## Tiers',
      ...blueprint.tiers.map((t) => `### ${t.name}\n- **Price**: $${t.price}/${t.billingCycle}\n- **Description**: ${t.description}`),
      '',
      '## Meters',
      ...blueprint.meters.map((m) => `- **${m.name}**: ${m.description} (${m.unit})`),
    ];

    return sections.join('\n');
  }

  private exportYAML(blueprint: Blueprint): string {
    const lines = [
      `id: ${blueprint.id}`,
      `archetypeId: ${blueprint.archetypeId}`,
      `archetype:`,
      `  name: ${blueprint.archetype.name}`,
      `  description: ${blueprint.archetype.description}`,
      `  category: ${blueprint.archetype.category}`,
      `pricingArchetype:`,
      `  type: ${blueprint.pricingArchetype.type}`,
      `  rationale: ${blueprint.pricingArchetype.rationale}`,
      `tiers:`,
      ...blueprint.tiers.map((t) => `  - name: ${t.name}\n    price: ${t.price}\n    billingCycle: ${t.billingCycle}`),
      `metadata:`,
      `  status: ${blueprint.metadata.status}`,
      `  qualityScore: ${blueprint.metadata.qualityScore}`,
      `  version: ${blueprint.metadata.version}`,
    ];

    return lines.join('\n');
  }

  listAll(): Blueprint[] {
    return Array.from(this.blueprints.values());
  }

  getMetadata(blueprintId: string): BlueprintMetadata | null {
    return this.metadata.get(blueprintId) || null;
  }

  addTag(blueprintId: string, tag: string): void {
    const meta = this.metadata.get(blueprintId);
    if (meta && !meta.tags.includes(tag)) {
      meta.tags.push(tag);
    }
  }

  removeTag(blueprintId: string, tag: string): void {
    const meta = this.metadata.get(blueprintId);
    if (meta) {
      meta.tags = meta.tags.filter((t) => t !== tag);
    }
  }

  getTags(blueprintId: string): string[] {
    const meta = this.metadata.get(blueprintId);
    return meta?.tags || [];
  }

  getStatistics(): {
    totalBlueprints: number;
    byStatus: Record<string, number>;
    averageQualityScore: number;
    mostAccessed: Blueprint | null;
  } {
    const blueprints = Array.from(this.blueprints.values());
    const byStatus: Record<string, number> = { draft: 0, approved: 0, published: 0 };

    blueprints.forEach((b) => {
      byStatus[b.metadata.status]++;
    });

    const avgScore = blueprints.length > 0 ? blueprints.reduce((sum, b) => sum + b.metadata.qualityScore, 0) / blueprints.length : 0;

    let mostAccessed: Blueprint | null = null;
    let maxAccess = 0;

    this.metadata.forEach((meta) => {
      if (meta.accessCount > maxAccess) {
        maxAccess = meta.accessCount;
        mostAccessed = this.blueprints.get(meta.blueprintId) || null;
      }
    });

    return {
      totalBlueprints: blueprints.length,
      byStatus,
      averageQualityScore: Math.round(avgScore * 100) / 100,
      mostAccessed,
    };
  }
}
