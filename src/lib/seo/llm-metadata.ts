/**
 * LLM-Specific Metadata Generators
 * Generates metadata optimized for LLM search engines
 */

/**
 * LLM metadata configuration
 */
export interface LLMMetadataConfig {
  contentType: 'product' | 'service' | 'article' | 'documentation';
  topic: string;
  author?: string;
  publicationDate?: string;
  facts?: Record<string, any>;
}

/**
 * Generate X-Robots-Tag header for LLM crawlers
 */
export function generateXRobotsTag(options: {
  allowGooglebot?: boolean;
  allowBingbot?: boolean;
  allowPerplexity?: boolean;
  allowClaude?: boolean;
  allowChatGPT?: boolean;
  noindex?: boolean;
  nofollow?: boolean;
}): string {
  const directives: string[] = [];

  // Add specific crawler directives
  if (options.allowGooglebot !== false) {
    directives.push('Googlebot: index, follow');
  }

  if (options.allowBingbot !== false) {
    directives.push('Bingbot: index, follow');
  }

  if (options.allowPerplexity !== false) {
    directives.push('Perplexity: index, follow');
  }

  if (options.allowClaude !== false) {
    directives.push('Claude: index, follow');
  }

  if (options.allowChatGPT !== false) {
    directives.push('ChatGPT: index, follow');
  }

  // Add general directives
  if (options.noindex) {
    directives.push('noindex');
  }

  if (options.nofollow) {
    directives.push('nofollow');
  }

  return directives.join(', ');
}

/**
 * Generate machine-readable content summary
 */
export function generateContentSummary(options: {
  title: string;
  description: string;
  keywords: string[];
  contentType: string;
}): string {
  const summary = {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    contentType: options.contentType,
    generatedAt: new Date().toISOString(),
  };

  return JSON.stringify(summary);
}

/**
 * Generate LLM-specific metadata
 */
export function generateLLMMetadata(config: LLMMetadataConfig): Record<string, string> {
  const metadata: Record<string, string> = {
    'llm:content-type': config.contentType,
    'llm:topic': config.topic,
  };

  if (config.author) {
    metadata['llm:author'] = config.author;
  }

  if (config.publicationDate) {
    metadata['llm:publication-date'] = config.publicationDate;
  }

  if (config.facts) {
    metadata['llm:facts'] = JSON.stringify(config.facts);
  }

  return metadata;
}

/**
 * Generate machine-readable facts
 */
export function generateMachineReadableFacts(facts: Record<string, any>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Thing',
    ...facts,
  });
}

/**
 * Validate LLM metadata
 */
export function validateLLMMetadata(config: LLMMetadataConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.contentType) {
    errors.push('contentType is required');
  } else {
    const validTypes = ['product', 'service', 'article', 'documentation'];
    if (!validTypes.includes(config.contentType)) {
      errors.push(`contentType must be one of: ${validTypes.join(', ')}`);
    }
  }

  if (!config.topic) {
    errors.push('topic is required');
  } else if (config.topic.length < 5) {
    errors.push('topic should be at least 5 characters');
  }

  if (config.author && config.author.length < 2) {
    errors.push('author should be at least 2 characters');
  }

  if (config.publicationDate) {
    try {
      new Date(config.publicationDate);
    } catch {
      errors.push('publicationDate must be a valid ISO 8601 date');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate LLM crawler directives
 */
export function generateLLMCrawlerDirectives(): Record<string, string> {
  return {
    'Perplexity': 'index, follow',
    'Claude': 'index, follow',
    'ChatGPT': 'index, follow',
    'Bard': 'index, follow',
    'Copilot': 'index, follow',
  };
}

/**
 * Create X-Robots-Tag header for all LLM crawlers
 */
export function createLLMRobotsTag(): string {
  const directives = generateLLMCrawlerDirectives();
  return Object.entries(directives)
    .map(([crawler, directive]) => `${crawler}: ${directive}`)
    .join(', ');
}

/**
 * Generate content type indicator
 */
export function generateContentTypeIndicator(contentType: 'product' | 'service' | 'article' | 'documentation'): string {
  const indicators: Record<string, string> = {
    product: 'Commercial Product',
    service: 'Service Offering',
    article: 'Informational Article',
    documentation: 'Technical Documentation',
  };

  return indicators[contentType] || contentType;
}

/**
 * Generate author metadata
 */
export function generateAuthorMetadata(author: string, role?: string): Record<string, string> {
  const metadata: Record<string, string> = {
    'llm:author': author,
  };

  if (role) {
    metadata['llm:author-role'] = role;
  }

  return metadata;
}

/**
 * Generate publication date metadata
 */
export function generatePublicationDateMetadata(date: Date | string): Record<string, string> {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return {
    'llm:publication-date': dateObj.toISOString(),
    'llm:publication-date-human': dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}

/**
 * Combine all LLM metadata
 */
export function combineLLMMetadata(
  config: LLMMetadataConfig,
  xRobotsTag?: string,
  additionalFacts?: Record<string, any>
): Record<string, string> {
  const combined: Record<string, string> = {};

  // Add LLM metadata
  const llmData = generateLLMMetadata(config);
  Object.assign(combined, llmData);

  // Add X-Robots-Tag
  if (xRobotsTag) {
    combined['x-robots-tag'] = xRobotsTag;
  } else {
    combined['x-robots-tag'] = createLLMRobotsTag();
  }

  // Add content type indicator
  combined['llm:content-type-indicator'] = generateContentTypeIndicator(config.contentType);

  // Add author metadata if available
  if (config.author) {
    const authorData = generateAuthorMetadata(config.author);
    Object.assign(combined, authorData);
  }

  // Add publication date metadata if available
  if (config.publicationDate) {
    const dateData = generatePublicationDateMetadata(config.publicationDate);
    Object.assign(combined, dateData);
  }

  // Add additional facts if available
  if (additionalFacts) {
    combined['llm:facts'] = JSON.stringify(additionalFacts);
  }

  return combined;
}
