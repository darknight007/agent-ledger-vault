/**
 * Meta Tag Generation Utilities
 * Generates and validates meta titles and descriptions
 */

/**
 * Validation result for meta tags
 */
export interface MetaTagValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Generate a meta title (50-60 characters)
 */
export function generateMetaTitle(
  primaryKeyword: string,
  brandName: string = 'AskScrooge',
  suffix?: string
): string {
  let title = `${primaryKeyword} — ${brandName}`;

  if (suffix) {
    title = `${primaryKeyword} ${suffix} — ${brandName}`;
  }

  // Truncate if too long
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }

  // Pad if too short (shouldn't happen with proper input)
  while (title.length < 50) {
    title += ' ';
  }

  return title;
}

/**
 * Generate a meta description (150-160 characters)
 */
export function generateMetaDescription(
  valueProposition: string,
  callToAction?: string
): string {
  let description = valueProposition;

  if (callToAction) {
    description = `${valueProposition} ${callToAction}`;
  }

  // Truncate if too long
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }

  // Pad if too short
  while (description.length < 150) {
    description += ' ';
  }

  return description;
}

/**
 * Validate meta title
 */
export function validateMetaTitle(title: string): MetaTagValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!title) {
    errors.push('Meta title is required');
  } else {
    if (title.length < 50) {
      errors.push(`Meta title is too short (${title.length} characters, minimum 50)`);
    }
    if (title.length > 60) {
      errors.push(`Meta title is too long (${title.length} characters, maximum 60)`);
    }
  }

  // Check for special characters that might cause encoding issues
  if (title && /[<>"]/.test(title)) {
    warnings.push('Meta title contains special characters that may need encoding');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate meta description
 */
export function validateMetaDescription(description: string): MetaTagValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!description) {
    errors.push('Meta description is required');
  } else {
    if (description.length < 150) {
      errors.push(`Meta description is too short (${description.length} characters, minimum 150)`);
    }
    if (description.length > 160) {
      errors.push(`Meta description is too long (${description.length} characters, maximum 160)`);
    }
  }

  // Check for special characters that might cause encoding issues
  if (description && /[<>"]/.test(description)) {
    warnings.push('Meta description contains special characters that may need encoding');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Sanitize meta tag content (remove special characters)
 */
export function sanitizeMetaTag(content: string): string {
  return content
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/"/g, '&quot;') // Escape quotes
    .replace(/&/g, '&amp;') // Escape ampersands
    .trim();
}

/**
 * Check if two meta titles are unique
 */
export function areMetaTitlesUnique(titles: string[]): boolean {
  const uniqueTitles = new Set(titles);
  return uniqueTitles.size === titles.length;
}

/**
 * Extract primary keyword from meta title
 */
export function extractPrimaryKeyword(title: string): string {
  // Remove brand name and special characters
  const withoutBrand = title.replace(/— AskScrooge/g, '').trim();
  // Get the first part before any dash or special character
  const keyword = withoutBrand.split(/[—–-]/)[0].trim();
  return keyword;
}

/**
 * Check if keyword is present in meta title
 */
export function isKeywordInTitle(title: string, keyword: string): boolean {
  return title.toLowerCase().includes(keyword.toLowerCase());
}

/**
 * Check if keyword is present in meta description
 */
export function isKeywordInDescription(description: string, keyword: string): boolean {
  return description.toLowerCase().includes(keyword.toLowerCase());
}

/**
 * Validate meta tag consistency
 */
export interface MetaTagConsistency {
  hasConsistentFormat: boolean;
  issues: string[];
}

export function validateMetaTagConsistency(titles: string[], descriptions: string[]): MetaTagConsistency {
  const issues: string[] = [];

  // Check if all titles follow similar format
  const titleFormats = titles.map((t) => {
    const hasBrandName = t.includes('AskScrooge');
    const hasDash = t.includes('—');
    return { hasBrandName, hasDash };
  });

  const allHaveBrandName = titleFormats.every((f) => f.hasBrandName);
  const allHaveDash = titleFormats.every((f) => f.hasDash);

  if (!allHaveBrandName) {
    issues.push('Not all titles include the brand name');
  }

  if (!allHaveDash) {
    issues.push('Not all titles use consistent separator (—)');
  }

  // Check if descriptions have consistent structure
  if (descriptions.length > 0) {
    const avgLength = descriptions.reduce((sum, d) => sum + d.length, 0) / descriptions.length;
    const outliers = descriptions.filter((d) => Math.abs(d.length - avgLength) > 20);

    if (outliers.length > 0) {
      issues.push(`${outliers.length} description(s) have inconsistent length`);
    }
  }

  return {
    hasConsistentFormat: issues.length === 0,
    issues,
  };
}
