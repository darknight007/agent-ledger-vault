/**
 * Batch Reporting
 * Generates comprehensive reports for batch processing results
 */

import { BatchResults, Blueprint, FailureReport } from './types';

/**
 * Report types
 */
export type ReportFormat = 'json' | 'markdown' | 'html' | 'csv';

/**
 * Batch report data structure
 */
export interface BatchReport {
  batchId: string;
  generatedAt: Date;
  summary: {
    totalArchetypes: number;
    successCount: number;
    failureCount: number;
    successRate: number;
    averageQualityScore: number;
    totalProcessingTime: number;
    averageProcessingTimePerArchetype: number;
  };
  blueprints: Array<{
    id: string;
    archetypeId: string;
    archetypeName: string;
    qualityScore: number;
    status: string;
  }>;
  failures: Array<{
    archetypeId: string;
    archetypeName: string;
    error: string;
    failedAgent: string;
    timestamp: Date;
    retryCount: number;
  }>;
  recommendations: string[];
}

/**
 * Batch Report Generator
 */
export class BatchReportGenerator {
  /**
   * Generates a report from batch results
   */
  static generateReport(results: BatchResults): BatchReport {
    const totalArchetypes = results.blueprints.length + results.failedArchetypes.length;
    const successCount = results.blueprints.length;
    const failureCount = results.failedArchetypes.length;
    const successRate = totalArchetypes > 0 ? (successCount / totalArchetypes) * 100 : 0;

    const averageQualityScore =
      successCount > 0
        ? results.blueprints.reduce((sum, b) => sum + b.metadata.qualityScore, 0) /
          successCount
        : 0;

    const averageProcessingTimePerArchetype =
      totalArchetypes > 0 ? results.summary.totalProcessingTime / totalArchetypes : 0;

    const blueprintSummaries = results.blueprints.map((b) => ({
      id: b.id,
      archetypeId: b.archetypeId,
      archetypeName: b.archetype.name,
      qualityScore: b.metadata.qualityScore,
      status: b.metadata.status,
    }));

    const recommendations = this.generateRecommendations(
      results,
      successRate,
      averageQualityScore
    );

    return {
      batchId: results.batchId,
      generatedAt: new Date(),
      summary: {
        totalArchetypes,
        successCount,
        failureCount,
        successRate,
        averageQualityScore,
        totalProcessingTime: results.summary.totalProcessingTime,
        averageProcessingTimePerArchetype,
      },
      blueprints: blueprintSummaries,
      failures: results.failedArchetypes,
      recommendations,
    };
  }

  /**
   * Exports report as JSON
   */
  static toJSON(report: BatchReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Exports report as Markdown
   */
  static toMarkdown(report: BatchReport): string {
    const lines: string[] = [];

    lines.push(`# Batch Processing Report`);
    lines.push(`**Batch ID**: ${report.batchId}`);
    lines.push(`**Generated**: ${report.generatedAt.toISOString()}`);
    lines.push('');

    // Summary section
    lines.push('## Summary');
    lines.push(`- **Total Archetypes**: ${report.summary.totalArchetypes}`);
    lines.push(`- **Successful**: ${report.summary.successCount}`);
    lines.push(`- **Failed**: ${report.summary.failureCount}`);
    lines.push(`- **Success Rate**: ${report.summary.successRate.toFixed(1)}%`);
    lines.push(
      `- **Average Quality Score**: ${report.summary.averageQualityScore.toFixed(1)}/100`
    );
    lines.push(
      `- **Total Processing Time**: ${(report.summary.totalProcessingTime / 1000).toFixed(1)}s`
    );
    lines.push(
      `- **Avg Time per Archetype**: ${(report.summary.averageProcessingTimePerArchetype / 1000).toFixed(1)}s`
    );
    lines.push('');

    // Blueprints section
    if (report.blueprints.length > 0) {
      lines.push('## Generated Blueprints');
      lines.push('');
      lines.push('| Archetype | Quality Score | Status |');
      lines.push('|-----------|---------------|--------|');

      for (const blueprint of report.blueprints) {
        lines.push(
          `| ${blueprint.archetypeName} | ${blueprint.qualityScore}/100 | ${blueprint.status} |`
        );
      }
      lines.push('');
    }

    // Failures section
    if (report.failures.length > 0) {
      lines.push('## Failed Archetypes');
      lines.push('');
      lines.push('| Archetype | Error | Agent | Retries |');
      lines.push('|-----------|-------|-------|---------|');

      for (const failure of report.failures) {
        lines.push(
          `| ${failure.archetypeName} | ${failure.error} | ${failure.failedAgent} | ${failure.retryCount} |`
        );
      }
      lines.push('');
    }

    // Recommendations section
    if (report.recommendations.length > 0) {
      lines.push('## Recommendations');
      for (const rec of report.recommendations) {
        lines.push(`- ${rec}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Exports report as HTML
   */
  static toHTML(report: BatchReport): string {
    const html: string[] = [];

    html.push('<!DOCTYPE html>');
    html.push('<html>');
    html.push('<head>');
    html.push('<meta charset="UTF-8">');
    html.push('<title>Batch Processing Report</title>');
    html.push('<style>');
    html.push('body { font-family: Arial, sans-serif; margin: 20px; }');
    html.push('h1 { color: #333; }');
    html.push('h2 { color: #666; margin-top: 20px; }');
    html.push('table { border-collapse: collapse; width: 100%; margin: 10px 0; }');
    html.push('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
    html.push('th { background-color: #f2f2f2; }');
    html.push('.summary { background-color: #f9f9f9; padding: 10px; border-radius: 5px; }');
    html.push('.success { color: green; }');
    html.push('.failure { color: red; }');
    html.push('</style>');
    html.push('</head>');
    html.push('<body>');

    html.push('<h1>Batch Processing Report</h1>');
    html.push(`<p><strong>Batch ID:</strong> ${report.batchId}</p>`);
    html.push(`<p><strong>Generated:</strong> ${report.generatedAt.toISOString()}</p>`);

    // Summary section
    html.push('<div class="summary">');
    html.push('<h2>Summary</h2>');
    html.push('<ul>');
    html.push(`<li>Total Archetypes: ${report.summary.totalArchetypes}</li>`);
    html.push(
      `<li class="success">Successful: ${report.summary.successCount}</li>`
    );
    html.push(
      `<li class="failure">Failed: ${report.summary.failureCount}</li>`
    );
    html.push(
      `<li>Success Rate: ${report.summary.successRate.toFixed(1)}%</li>`
    );
    html.push(
      `<li>Average Quality Score: ${report.summary.averageQualityScore.toFixed(1)}/100</li>`
    );
    html.push(
      `<li>Total Processing Time: ${(report.summary.totalProcessingTime / 1000).toFixed(1)}s</li>`
    );
    html.push('</ul>');
    html.push('</div>');

    // Blueprints section
    if (report.blueprints.length > 0) {
      html.push('<h2>Generated Blueprints</h2>');
      html.push('<table>');
      html.push('<tr><th>Archetype</th><th>Quality Score</th><th>Status</th></tr>');

      for (const blueprint of report.blueprints) {
        html.push('<tr>');
        html.push(`<td>${blueprint.archetypeName}</td>`);
        html.push(`<td>${blueprint.qualityScore}/100</td>`);
        html.push(`<td>${blueprint.status}</td>`);
        html.push('</tr>');
      }
      html.push('</table>');
    }

    // Failures section
    if (report.failures.length > 0) {
      html.push('<h2>Failed Archetypes</h2>');
      html.push('<table>');
      html.push(
        '<tr><th>Archetype</th><th>Error</th><th>Agent</th><th>Retries</th></tr>'
      );

      for (const failure of report.failures) {
        html.push('<tr>');
        html.push(`<td>${failure.archetypeName}</td>`);
        html.push(`<td>${failure.error}</td>`);
        html.push(`<td>${failure.failedAgent}</td>`);
        html.push(`<td>${failure.retryCount}</td>`);
        html.push('</tr>');
      }
      html.push('</table>');
    }

    // Recommendations section
    if (report.recommendations.length > 0) {
      html.push('<h2>Recommendations</h2>');
      html.push('<ul>');
      for (const rec of report.recommendations) {
        html.push(`<li>${rec}</li>`);
      }
      html.push('</ul>');
    }

    html.push('</body>');
    html.push('</html>');

    return html.join('\n');
  }

  /**
   * Exports report as CSV
   */
  static toCSV(report: BatchReport): string {
    const lines: string[] = [];

    // Header
    lines.push('Batch Report');
    lines.push(`Batch ID,${report.batchId}`);
    lines.push(`Generated,${report.generatedAt.toISOString()}`);
    lines.push('');

    // Summary
    lines.push('Summary');
    lines.push('Metric,Value');
    lines.push(`Total Archetypes,${report.summary.totalArchetypes}`);
    lines.push(`Successful,${report.summary.successCount}`);
    lines.push(`Failed,${report.summary.failureCount}`);
    lines.push(`Success Rate,${report.summary.successRate.toFixed(1)}%`);
    lines.push(
      `Average Quality Score,${report.summary.averageQualityScore.toFixed(1)}`
    );
    lines.push(
      `Total Processing Time,${(report.summary.totalProcessingTime / 1000).toFixed(1)}s`
    );
    lines.push('');

    // Blueprints
    if (report.blueprints.length > 0) {
      lines.push('Generated Blueprints');
      lines.push('Archetype,Quality Score,Status');
      for (const blueprint of report.blueprints) {
        lines.push(
          `"${blueprint.archetypeName}",${blueprint.qualityScore},${blueprint.status}`
        );
      }
      lines.push('');
    }

    // Failures
    if (report.failures.length > 0) {
      lines.push('Failed Archetypes');
      lines.push('Archetype,Error,Agent,Retries');
      for (const failure of report.failures) {
        lines.push(
          `"${failure.archetypeName}","${failure.error}",${failure.failedAgent},${failure.retryCount}`
        );
      }
    }

    return lines.join('\n');
  }

  /**
   * Exports report in specified format
   */
  static export(report: BatchReport, format: ReportFormat): string {
    switch (format) {
      case 'json':
        return this.toJSON(report);
      case 'markdown':
        return this.toMarkdown(report);
      case 'html':
        return this.toHTML(report);
      case 'csv':
        return this.toCSV(report);
      default:
        throw new Error(`Unsupported report format: ${format}`);
    }
  }

  /**
   * Generates recommendations based on batch results
   */
  private static generateRecommendations(
    results: BatchResults,
    successRate: number,
    averageQualityScore: number
  ): string[] {
    const recommendations: string[] = [];

    // Success rate recommendations
    if (successRate < 80) {
      recommendations.push(
        `Success rate is ${successRate.toFixed(1)}%. Investigate failed archetypes to improve reliability.`
      );
    }

    if (successRate === 100) {
      recommendations.push('Excellent! All archetypes processed successfully.');
    }

    // Quality score recommendations
    if (averageQualityScore < 70) {
      recommendations.push(
        `Average quality score is ${averageQualityScore.toFixed(1)}/100. Review and improve blueprint generation logic.`
      );
    }

    if (averageQualityScore >= 85) {
      recommendations.push(
        `High quality scores (${averageQualityScore.toFixed(1)}/100). Consider using these blueprints as templates.`
      );
    }

    // Failure analysis
    if (results.failedArchetypes.length > 0) {
      const failedAgents = new Set(
        results.failedArchetypes.map((f) => f.failedAgent)
      );
      if (failedAgents.size === 1) {
        const agent = Array.from(failedAgents)[0];
        recommendations.push(
          `All failures occurred in ${agent} agent. Debug this agent's implementation.`
        );
      }
    }

    // Processing time recommendations
    const avgTimePerArchetype = results.summary.totalProcessingTime / (results.blueprints.length + results.failedArchetypes.length);
    if (avgTimePerArchetype > 60000) {
      recommendations.push(
        `Average processing time is ${(avgTimePerArchetype / 1000).toFixed(1)}s per archetype. Consider optimizing agent execution.`
      );
    }

    return recommendations;
  }
}
