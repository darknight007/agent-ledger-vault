/**
 * SEO Configuration Loader and Validator
 * Loads and validates SEO configuration with error handling
 */

import { PageConfig, PageMetadata } from './types';
import { seoConfig, getPageConfigByPath } from './seo.config';

/**
 * Validation errors for SEO configuration
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Validate page configuration
 */
export function validatePageConfig(config: PageConfig): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate title length (50-60 characters)
  if (!config.title || config.title.length < 50 || config.title.length > 60) {
    errors.push({
      field: 'title',
      message: `Title must be between 50-60 characters (current: ${config.title?.length || 0})`,
      value: config.title,
    });
  }

  // Validate description length (150-160 characters)
  if (!config.description || config.description.length < 150 || config.description.length > 160) {
    errors.push({
      field: 'description',
      message: `Description must be between 150-160 characters (current: ${config.description?.length || 0})`,
      value: config.description,
    });
  }

  // Validate keywords array
  if (!config.keywords || config.keywords.length === 0) {
    errors.push({
      field: 'keywords',
      message: 'Keywords array must not be empty',
      value: config.keywords,
    });
  }

  // Validate path
  if (!config.path || !config.path.startsWith('/')) {
    errors.push({
      field: 'path',
      message: 'Path must start with /',
      value: config.path,
    });
  }

  // Validate priority (0.0 - 1.0)
  if (config.priority < 0 || config.priority > 1) {
    errors.push({
      field: 'priority',
      message: 'Priority must be between 0.0 and 1.0',
      value: config.priority,
    });
  }

  // Validate ogImage URL
  if (config.ogImage && !isValidUrl(config.ogImage)) {
    errors.push({
      field: 'ogImage',
      message: 'ogImage must be a valid URL',
      value: config.ogImage,
    });
  }

  // Validate performance targets
  if (config.performanceTargets.lcp < 0) {
    errors.push({
      field: 'performanceTargets.lcp',
      message: 'LCP target must be positive',
      value: config.performanceTargets.lcp,
    });
  }

  if (config.performanceTargets.fid < 0) {
    errors.push({
      field: 'performanceTargets.fid',
      message: 'FID target must be positive',
      value: config.performanceTargets.fid,
    });
  }

  if (config.performanceTargets.cls < 0) {
    errors.push({
      field: 'performanceTargets.cls',
      message: 'CLS target must be positive',
      value: config.performanceTargets.cls,
    });
  }

  return errors;
}

/**
 * Validate all page configurations
 */
export function validateAllConfigs(): Map<string, ValidationError[]> {
  const results = new Map<string, ValidationError[]>();

  Object.entries(seoConfig).forEach(([key, config]) => {
    const errors = validatePageConfig(config);
    if (errors.length > 0) {
      results.set(key, errors);
    }
  });

  return results;
}

/**
 * Load page configuration by path
 */
export function loadPageConfig(path: string): PageConfig | null {
  const config = getPageConfigByPath(path);
  if (!config) {
    console.warn(`No SEO configuration found for path: ${path}`);
    return null;
  }

  const errors = validatePageConfig(config);
  if (errors.length > 0) {
    console.warn(`Validation errors for path ${path}:`, errors);
  }

  return config;
}

/**
 * Convert PageConfig to PageMetadata
 */
export function configToMetadata(config: PageConfig): PageMetadata {
  return {
    path: config.path,
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    ogType: config.contentType === 'product' ? 'product' : 'website',
    ogImage: config.ogImage,
    canonicalUrl: `https://askscrooge.com${config.path}`,
    breadcrumbs: config.breadcrumbs,
    structuredData: config.structuredData,
    llmMetadata: config.llmMetadata,
  };
}

/**
 * Check if a string is a valid URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all page metadata
 */
export function getAllPageMetadata(): PageMetadata[] {
  return Object.values(seoConfig).map(configToMetadata);
}

/**
 * Log configuration validation report
 */
export function logValidationReport(): void {
  const results = validateAllConfigs();

  if (results.size === 0) {
    console.log('✓ All SEO configurations are valid');
    return;
  }

  console.warn(`⚠ Found validation errors in ${results.size} configuration(s):`);
  results.forEach((errors, key) => {
    console.warn(`\n  ${key}:`);
    errors.forEach((error) => {
      console.warn(`    - ${error.field}: ${error.message}`);
    });
  });
}
