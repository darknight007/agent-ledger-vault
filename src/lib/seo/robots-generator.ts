/**
 * Robots.txt Generator
 * Generates robots.txt for search engine crawling directives
 */

/**
 * Robots.txt configuration
 */
export interface RobotsConfig {
  allowPublicPages?: boolean;
  allowAssets?: boolean;
  disallowAdmin?: boolean;
  disallowPrivate?: boolean;
  crawlDelay?: number;
  requestRate?: number;
  sitemapUrl?: string;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(config: RobotsConfig = {}): string {
  const {
    allowPublicPages = true,
    allowAssets = true,
    disallowAdmin = true,
    disallowPrivate = true,
    crawlDelay = 1,
    sitemapUrl = 'https://askscrooge.com/sitemap.xml',
  } = config;

  const lines: string[] = [];

  // Googlebot directives
  lines.push('User-agent: Googlebot');
  if (allowPublicPages) {
    lines.push('Allow: /');
  }
  if (allowAssets) {
    lines.push('Allow: /*.css$');
    lines.push('Allow: /*.js$');
    lines.push('Allow: /*.jpg$');
    lines.push('Allow: /*.jpeg$');
    lines.push('Allow: /*.png$');
    lines.push('Allow: /*.gif$');
    lines.push('Allow: /*.svg$');
    lines.push('Allow: /*.webp$');
  }
  if (disallowAdmin) {
    lines.push('Disallow: /admin');
    lines.push('Disallow: /admin/');
  }
  if (disallowPrivate) {
    lines.push('Disallow: /private');
    lines.push('Disallow: /private/');
  }
  if (crawlDelay > 0) {
    lines.push(`Crawl-delay: ${crawlDelay}`);
  }
  lines.push('');

  // Bingbot directives
  lines.push('User-agent: Bingbot');
  if (allowPublicPages) {
    lines.push('Allow: /');
  }
  if (disallowAdmin) {
    lines.push('Disallow: /admin');
    lines.push('Disallow: /admin/');
  }
  if (disallowPrivate) {
    lines.push('Disallow: /private');
    lines.push('Disallow: /private/');
  }
  lines.push('');

  // Perplexity directives (LLM crawler)
  lines.push('User-agent: Perplexity');
  if (allowPublicPages) {
    lines.push('Allow: /');
  }
  if (disallowAdmin) {
    lines.push('Disallow: /admin');
  }
  lines.push('');

  // Claude directives (LLM crawler)
  lines.push('User-agent: Claude');
  if (allowPublicPages) {
    lines.push('Allow: /');
  }
  if (disallowAdmin) {
    lines.push('Disallow: /admin');
  }
  lines.push('');

  // ChatGPT directives (LLM crawler)
  lines.push('User-agent: ChatGPT');
  if (allowPublicPages) {
    lines.push('Allow: /');
  }
  if (disallowAdmin) {
    lines.push('Disallow: /admin');
  }
  lines.push('');

  // Default directives for all other crawlers
  lines.push('User-agent: *');
  if (allowPublicPages) {
    lines.push('Allow: /');
  }
  if (disallowAdmin) {
    lines.push('Disallow: /admin');
    lines.push('Disallow: /admin/');
  }
  if (disallowPrivate) {
    lines.push('Disallow: /private');
    lines.push('Disallow: /private/');
  }
  lines.push('');

  // Sitemap directive
  if (sitemapUrl) {
    lines.push(`Sitemap: ${sitemapUrl}`);
  }

  return lines.join('\n');
}

/**
 * Generate robots.txt for specific user agent
 */
export function generateRobotsForUserAgent(
  userAgent: string,
  config: {
    allow?: string[];
    disallow?: string[];
    crawlDelay?: number;
  } = {}
): string {
  const lines: string[] = [];

  lines.push(`User-agent: ${userAgent}`);

  if (config.allow && config.allow.length > 0) {
    config.allow.forEach((path) => {
      lines.push(`Allow: ${path}`);
    });
  }

  if (config.disallow && config.disallow.length > 0) {
    config.disallow.forEach((path) => {
      lines.push(`Disallow: ${path}`);
    });
  }

  if (config.crawlDelay && config.crawlDelay > 0) {
    lines.push(`Crawl-delay: ${config.crawlDelay}`);
  }

  return lines.join('\n');
}

/**
 * Validate robots.txt content
 */
export function validateRobotsTxt(content: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!content || content.trim().length === 0) {
    errors.push('robots.txt content is empty');
    return { isValid: false, errors };
  }

  const lines = content.split('\n');

  // Check for User-agent directive
  const hasUserAgent = lines.some((line) => line.toLowerCase().startsWith('user-agent:'));
  if (!hasUserAgent) {
    errors.push('robots.txt must contain at least one User-agent directive');
  }

  // Check for valid directives
  const validDirectives = ['user-agent', 'allow', 'disallow', 'crawl-delay', 'request-rate', 'sitemap'];
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith('#')) {
      return; // Skip empty lines and comments
    }

    const directive = trimmed.split(':')[0].toLowerCase();
    if (!validDirectives.includes(directive)) {
      errors.push(`Invalid directive on line ${index + 1}: ${directive}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Parse robots.txt content
 */
export function parseRobotsTxt(content: string): Map<string, Map<string, string[]>> {
  const rules = new Map<string, Map<string, string[]>>();

  let currentUserAgent = '*';
  const currentRules = new Map<string, string[]>();

  const lines = content.split('\n');

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (trimmed.length === 0 || trimmed.startsWith('#')) {
      return;
    }

    const [directive, ...valueParts] = trimmed.split(':');
    const directiveLower = directive.toLowerCase();
    const value = valueParts.join(':').trim();

    if (directiveLower === 'user-agent') {
      // Save previous user agent rules
      if (currentRules.size > 0) {
        rules.set(currentUserAgent, new Map(currentRules));
        currentRules.clear();
      }
      currentUserAgent = value;
    } else {
      // Add rule for current user agent
      if (!currentRules.has(directiveLower)) {
        currentRules.set(directiveLower, []);
      }
      currentRules.get(directiveLower)!.push(value);
    }
  });

  // Save last user agent rules
  if (currentRules.size > 0) {
    rules.set(currentUserAgent, new Map(currentRules));
  }

  return rules;
}

/**
 * Check if path is allowed for user agent
 */
export function isPathAllowed(robotsTxt: string, path: string, userAgent: string = '*'): boolean {
  const rules = parseRobotsTxt(robotsTxt);

  // Get rules for specific user agent or default
  let agentRules = rules.get(userAgent);
  if (!agentRules) {
    agentRules = rules.get('*');
  }

  if (!agentRules) {
    return true; // Allow by default if no rules
  }

  // Check disallow rules first
  const disallowRules = agentRules.get('disallow') || [];
  for (const disallowPath of disallowRules) {
    if (path.startsWith(disallowPath)) {
      // Check if there's a more specific allow rule
      const allowRules = agentRules.get('allow') || [];
      for (const allowPath of allowRules) {
        if (path.startsWith(allowPath) && allowPath.length > disallowPath.length) {
          return true;
        }
      }
      return false;
    }
  }

  return true;
}

/**
 * Generate robots.txt for LLM crawlers
 */
export function generateRobotsForLLMCrawlers(): string {
  const lines: string[] = [];

  const llmCrawlers = ['Perplexity', 'Claude', 'ChatGPT', 'Bard', 'Copilot'];

  llmCrawlers.forEach((crawler) => {
    lines.push(`User-agent: ${crawler}`);
    lines.push('Allow: /');
    lines.push('Disallow: /admin');
    lines.push('Disallow: /private');
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Get recommended robots.txt for AskScrooge
 */
export function getRecommendedRobotsTxt(): string {
  return generateRobotsTxt({
    allowPublicPages: true,
    allowAssets: true,
    disallowAdmin: true,
    disallowPrivate: true,
    crawlDelay: 1,
    sitemapUrl: 'https://askscrooge.com/sitemap.xml',
  });
}
