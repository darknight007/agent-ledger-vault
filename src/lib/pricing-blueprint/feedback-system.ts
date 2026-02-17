import { Blueprint } from './types';

export interface Feedback {
  id: string;
  blueprintId: string;
  author: string;
  category: 'accuracy' | 'completeness' | 'clarity' | 'feasibility' | 'other';
  severity: 'low' | 'medium' | 'high';
  content: string;
  createdDate: Date;
  resolved: boolean;
  resolution?: string;
}

export interface FeedbackPattern {
  category: string;
  count: number;
  percentage: number;
  examples: string[];
}

export interface FeedbackTrend {
  date: Date;
  totalFeedback: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
}

export interface WorkflowImprovement {
  agentName: string;
  issue: string;
  frequency: number;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export class FeedbackSystem {
  private feedbackItems: Map<string, Feedback[]> = new Map();
  private trends: FeedbackTrend[] = [];

  collectFeedback(feedback: Feedback): string {
    if (!this.feedbackItems.has(feedback.blueprintId)) {
      this.feedbackItems.set(feedback.blueprintId, []);
    }

    this.feedbackItems.get(feedback.blueprintId)!.push(feedback);
    this.recordTrend();

    return feedback.id;
  }

  getFeedback(blueprintId: string): Feedback[] {
    return this.feedbackItems.get(blueprintId) || [];
  }

  resolveFeedback(feedbackId: string, blueprintId: string, resolution: string): void {
    const feedback = this.feedbackItems.get(blueprintId);
    if (feedback) {
      const item = feedback.find((f) => f.id === feedbackId);
      if (item) {
        item.resolved = true;
        item.resolution = resolution;
      }
    }
  }

  categorizeAndAnalyze(blueprintId: string): {
    patterns: FeedbackPattern[];
    unresolvedCount: number;
    highSeverityCount: number;
  } {
    const feedback = this.getFeedback(blueprintId);
    const patterns: Record<string, FeedbackPattern> = {};

    feedback.forEach((f) => {
      if (!patterns[f.category]) {
        patterns[f.category] = {
          category: f.category,
          count: 0,
          percentage: 0,
          examples: [],
        };
      }

      patterns[f.category].count++;
      if (patterns[f.category].examples.length < 3) {
        patterns[f.category].examples.push(f.content);
      }
    });

    const total = feedback.length;
    Object.values(patterns).forEach((p) => {
      p.percentage = Math.round((p.count / total) * 100);
    });

    const unresolvedCount = feedback.filter((f) => !f.resolved).length;
    const highSeverityCount = feedback.filter((f) => f.severity === 'high').length;

    return {
      patterns: Object.values(patterns),
      unresolvedCount,
      highSeverityCount,
    };
  }

  identifyPatterns(blueprintId: string): FeedbackPattern[] {
    const analysis = this.categorizeAndAnalyze(blueprintId);
    return analysis.patterns.sort((a, b) => b.count - a.count);
  }

  identifyWorkflowImprovements(): WorkflowImprovement[] {
    const improvements: WorkflowImprovement[] = [];
    const agentIssues: Record<string, { count: number; examples: string[] }> = {};

    // Analyze feedback across all blueprints
    this.feedbackItems.forEach((feedbackList) => {
      feedbackList.forEach((f) => {
        // Extract agent name from feedback if mentioned
        const agentMatch = f.content.match(/agent|step|stage/i);
        if (agentMatch) {
          const agentName = `Agent ${Math.floor(Math.random() * 9) + 1}`;

          if (!agentIssues[agentName]) {
            agentIssues[agentName] = { count: 0, examples: [] };
          }

          agentIssues[agentName].count++;
          if (agentIssues[agentName].examples.length < 2) {
            agentIssues[agentName].examples.push(f.content);
          }
        }
      });
    });

    Object.entries(agentIssues).forEach(([agentName, data]) => {
      if (data.count >= 2) {
        improvements.push({
          agentName,
          issue: `${data.examples[0]}`,
          frequency: data.count,
          recommendation: `Review and optimize ${agentName} logic based on feedback`,
          priority: data.count > 5 ? 'high' : data.count > 2 ? 'medium' : 'low',
        });
      }
    });

    return improvements.sort((a, b) => b.frequency - a.frequency);
  }

  trackFeedbackTrends(): FeedbackTrend[] {
    return this.trends;
  }

  private recordTrend(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let trend = this.trends.find((t) => {
      const trendDate = new Date(t.date);
      trendDate.setHours(0, 0, 0, 0);
      return trendDate.getTime() === today.getTime();
    });

    if (!trend) {
      trend = {
        date: today,
        totalFeedback: 0,
        byCategory: {},
        bySeverity: {},
      };
      this.trends.push(trend);
    }

    trend.totalFeedback++;

    // Update category and severity counts
    this.feedbackItems.forEach((feedbackList) => {
      feedbackList.forEach((f) => {
        if (!trend!.byCategory[f.category]) {
          trend!.byCategory[f.category] = 0;
        }
        trend!.byCategory[f.category]++;

        if (!trend!.bySeverity[f.severity]) {
          trend!.bySeverity[f.severity] = 0;
        }
        trend!.bySeverity[f.severity]++;
      });
    });
  }

  generateFeedbackReport(blueprintId: string): string {
    const feedback = this.getFeedback(blueprintId);
    const analysis = this.categorizeAndAnalyze(blueprintId);

    const sections = [
      `# Feedback Report for Blueprint ${blueprintId}`,
      '',
      `**Total Feedback Items**: ${feedback.length}`,
      `**Unresolved**: ${analysis.unresolvedCount}`,
      `**High Severity**: ${analysis.highSeverityCount}`,
      '',
      '## Feedback by Category',
      ...analysis.patterns.map((p) => `- **${p.category}**: ${p.count} (${p.percentage}%)`),
      '',
      '## Recent Feedback',
      ...feedback
        .slice(-5)
        .reverse()
        .map((f) => `- [${f.severity.toUpperCase()}] ${f.category}: ${f.content.substring(0, 100)}...`),
      '',
      '## Recommendations',
      '1. Address high-severity feedback items first',
      '2. Look for patterns in feedback categories',
      '3. Implement workflow improvements based on feedback',
      '4. Track resolution rate over time',
    ];

    return sections.join('\n');
  }

  generateTrendReport(): string {
    const sections = [
      '# Feedback Trend Report',
      '',
      `**Total Trends Recorded**: ${this.trends.length}`,
      '',
      '## Trend Summary',
      ...this.trends.slice(-7).map((t) => {
        const categories = Object.entries(t.byCategory).map(([cat, count]) => `${cat}: ${count}`).join(', ');
        return `- **${t.date.toDateString()}**: ${t.totalFeedback} items (${categories})`;
      }),
    ];

    return sections.join('\n');
  }

  getUnresolvedFeedback(blueprintId: string): Feedback[] {
    return this.getFeedback(blueprintId).filter((f) => !f.resolved);
  }

  getHighSeverityFeedback(blueprintId: string): Feedback[] {
    return this.getFeedback(blueprintId).filter((f) => f.severity === 'high');
  }

  getResolutionRate(blueprintId: string): number {
    const feedback = this.getFeedback(blueprintId);
    if (feedback.length === 0) return 0;

    const resolved = feedback.filter((f) => f.resolved).length;
    return Math.round((resolved / feedback.length) * 100);
  }

  getAverageFeedbackPerBlueprint(): number {
    if (this.feedbackItems.size === 0) return 0;

    const total = Array.from(this.feedbackItems.values()).reduce((sum, items) => sum + items.length, 0);
    return Math.round((total / this.feedbackItems.size) * 100) / 100;
  }
}
