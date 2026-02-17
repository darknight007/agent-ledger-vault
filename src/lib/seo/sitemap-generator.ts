/**
 * Sitemap Generator
 * Generates sitemap.xml for search engine discovery
 */

import { SitemapEntry } from './types';
import { getAllPageConfigs } from './seo.config';

/**
 * Generate sitemap entries from page configs
 */
export function generateSitemapEntries(): SitemapEntry[] {
  const configs = getAllPageConfigs();

  return configs.map((config) => ({
    url: `https://askscrooge.com${config.path}`,
    lastmod: config.lastmod.toISOString().split('T')[0], // YYYY-MM-DD format
    changefreq: config.changefreq,
    priority: config.priority,
  }));
}

/**
 * Generate sitemap XML
 */
export function generateSitemapXML(entries: SitemapEntry[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urlEntries = entries
    .map(
      (entry) => `
  <url>
    <loc>${escapeXML(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('');

  return `${xmlHeader}\n${urlsetOpen}${urlEntries}\n${urlsetClose}`;
}

/**
 * Generate sitemap index XML (for large sitemaps)
 */
export function generateSitemapIndexXML(sitemapUrls: string[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const sitemapindexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const sitemapindexClose = '</sitemapindex>';

  const sitemapEntries = sitemapUrls
    .map(
      (url) => `
  <sitemap>
    <loc>${escapeXML(url)}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`
    )
    .join('');

  return `${xmlHeader}\n${sitemapindexOpen}${sitemapEntries}\n${sitemapindexClose}`;
}

/**
 * Escape XML special characters
 */
export function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Validate sitemap entry
 */
export function validateSitemapEntry(entry: SitemapEntry): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate URL
  if (!entry.url) {
    errors.push('URL is required');
  } else {
    try {
      new URL(entry.url);
    } catch {
      errors.push(`Invalid URL: ${entry.url}`);
    }
  }

  // Validate lastmod
  if (!entry.lastmod) {
    errors.push('lastmod is required');
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(entry.lastmod)) {
      errors.push(`Invalid lastmod format: ${entry.lastmod} (expected YYYY-MM-DD)`);
    }
  }

  // Validate changefreq
  const validChangefreq = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  if (!validChangefreq.includes(entry.changefreq)) {
    errors.push(`Invalid changefreq: ${entry.changefreq}`);
  }

  // Validate priority
  if (entry.priority < 0 || entry.priority > 1) {
    errors.push(`Invalid priority: ${entry.priority} (must be between 0.0 and 1.0)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all sitemap entries
 */
export function validateSitemapEntries(entries: SitemapEntry[]): Map<number, string[]> {
  const errors = new Map<number, string[]>();

  entries.forEach((entry, index) => {
    const validation = validateSitemapEntry(entry);
    if (!validation.isValid) {
      errors.set(index, validation.errors);
    }
  });

  return errors;
}

/**
 * Split sitemap into multiple files (for large sitemaps)
 */
export function splitSitemap(entries: SitemapEntry[], maxEntriesPerFile: number = 50000): SitemapEntry[][] {
  const sitemaps: SitemapEntry[][] = [];

  for (let i = 0; i < entries.length; i += maxEntriesPerFile) {
    sitemaps.push(entries.slice(i, i + maxEntriesPerFile));
  }

  return sitemaps;
}

/**
 * Generate sitemap with automatic splitting
 */
export function generateSitemapWithSplitting(
  entries: SitemapEntry[],
  maxEntriesPerFile: number = 50000
): { sitemaps: string[]; sitemapIndex: string } {
  const sitemaps = splitSitemap(entries, maxEntriesPerFile);

  const sitemapXMLs = sitemaps.map((sitemap) => generateSitemapXML(sitemap));

  const sitemapUrls = sitemapXMLs.map((_, index) => `https://askscrooge.com/sitemap-${index + 1}.xml`);

  const sitemapIndex = generateSitemapIndexXML(sitemapUrls);

  return {
    sitemaps: sitemapXMLs,
    sitemapIndex,
  };
}

/**
 * Get sitemap statistics
 */
export function getSitemapStatistics(entries: SitemapEntry[]): {
  totalEntries: number;
  byChangefreq: Record<string, number>;
  byPriority: Record<string, number>;
  averagePriority: number;
} {
  const stats = {
    totalEntries: entries.length,
    byChangefreq: {} as Record<string, number>,
    byPriority: {} as Record<string, number>,
    averagePriority: 0,
  };

  let totalPriority = 0;

  entries.forEach((entry) => {
    // Count by changefreq
    stats.byChangefreq[entry.changefreq] = (stats.byChangefreq[entry.changefreq] || 0) + 1;

    // Count by priority
    const priorityKey = entry.priority.toFixed(1);
    stats.byPriority[priorityKey] = (stats.byPriority[priorityKey] || 0) + 1;

    totalPriority += entry.priority;
  });

  stats.averagePriority = entries.length > 0 ? totalPriority / entries.length : 0;

  return stats;
}

/**
 * Generate sitemap from page configs
 */
export function generateSitemap(): string {
  const entries = generateSitemapEntries();

  // Validate entries
  const errors = validateSitemapEntries(entries);
  if (errors.size > 0) {
    console.warn('Sitemap validation errors:', errors);
  }

  return generateSitemapXML(entries);
}

/**
 * Generate robots.txt sitemap directive
 */
export function generateRobotsSitemapDirective(): string {
  return 'Sitemap: https://askscrooge.com/sitemap.xml';
}
