/**
 * Heading Hierarchy Validator
 * Validates H1, H2, H3 hierarchy and content structure
 */

/**
 * Heading information
 */
export interface HeadingInfo {
  level: number;
  text: string;
  element: HTMLElement;
}

/**
 * Validation result
 */
export interface HeadingValidationResult {
  isValid: boolean;
  h1Count: number;
  headings: HeadingInfo[];
  errors: string[];
  warnings: string[];
}

/**
 * Get all headings from page
 */
export function getAllHeadings(): HeadingInfo[] {
  const headings: HeadingInfo[] = [];

  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headingElements.forEach((element) => {
    const level = parseInt(element.tagName[1]);
    headings.push({
      level,
      text: element.textContent || '',
      element: element as HTMLElement,
    });
  });

  return headings;
}

/**
 * Validate heading hierarchy
 */
export function validateHeadingHierarchy(): HeadingValidationResult {
  const headings = getAllHeadings();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for H1 count
  const h1Count = headings.filter((h) => h.level === 1).length;

  if (h1Count === 0) {
    errors.push('Page must have exactly one H1 tag');
  } else if (h1Count > 1) {
    errors.push(`Page has ${h1Count} H1 tags, but should have exactly one`);
  }

  // Check for heading hierarchy
  let previousLevel = 0;

  headings.forEach((heading, index) => {
    // Check for level skipping (e.g., H1 to H3)
    if (heading.level > previousLevel + 1) {
      errors.push(
        `Heading hierarchy skipped from H${previousLevel} to H${heading.level} at position ${index + 1}`
      );
    }

    // Check for empty headings
    if (!heading.text || heading.text.trim().length === 0) {
      errors.push(`Heading H${heading.level} at position ${index + 1} is empty`);
    }

    // Check for very long headings
    if (heading.text.length > 100) {
      warnings.push(`Heading H${heading.level} at position ${index + 1} is very long (${heading.text.length} chars)`);
    }

    previousLevel = heading.level;
  });

  // Check for H1 at start
  if (headings.length > 0 && headings[0].level !== 1) {
    errors.push('First heading should be H1');
  }

  return {
    isValid: errors.length === 0,
    h1Count,
    headings,
    errors,
    warnings,
  };
}

/**
 * Validate single heading
 */
export function validateHeading(element: HTMLElement): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  const tagName = element.tagName.toLowerCase();
  if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
    errors.push(`Element is not a heading tag: ${tagName}`);
    return { isValid: false, errors };
  }

  const text = element.textContent || '';

  if (!text || text.trim().length === 0) {
    errors.push('Heading is empty');
  }

  if (text.length > 100) {
    errors.push(`Heading is too long (${text.length} characters)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get heading level from element
 */
export function getHeadingLevel(element: HTMLElement): number | null {
  const match = element.tagName.match(/H(\d)/i);
  return match ? parseInt(match[1]) : null;
}

/**
 * Check if page has single H1
 */
export function hasSingleH1(): boolean {
  const h1Elements = document.querySelectorAll('h1');
  return h1Elements.length === 1;
}

/**
 * Get H1 element
 */
export function getH1Element(): HTMLElement | null {
  return document.querySelector('h1') as HTMLElement | null;
}

/**
 * Get H1 text
 */
export function getH1Text(): string {
  const h1 = getH1Element();
  return h1 ? h1.textContent || '' : '';
}

/**
 * Check heading hierarchy validity
 */
export function isHeadingHierarchyValid(): boolean {
  const result = validateHeadingHierarchy();
  return result.isValid;
}

/**
 * Get heading outline
 */
export function getHeadingOutline(): string {
  const headings = getAllHeadings();

  return headings
    .map((h) => {
      const indent = '  '.repeat(h.level - 1);
      return `${indent}H${h.level}: ${h.text}`;
    })
    .join('\n');
}

/**
 * Validate heading content
 */
export function validateHeadingContent(element: HTMLElement): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  const text = element.textContent || '';

  // Check for descriptive content
  if (text.length < 3) {
    errors.push('Heading text is too short (minimum 3 characters)');
  }

  // Check for all caps (usually not ideal)
  if (text === text.toUpperCase() && text.length > 3) {
    errors.push('Heading is in all caps (consider using proper case)');
  }

  // Check for special characters
  if (/[<>{}[\]]/g.test(text)) {
    errors.push('Heading contains special characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get heading statistics
 */
export function getHeadingStatistics(): {
  totalHeadings: number;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  averageLength: number;
} {
  const headings = getAllHeadings();

  const stats = {
    totalHeadings: headings.length,
    h1Count: 0,
    h2Count: 0,
    h3Count: 0,
    h4Count: 0,
    h5Count: 0,
    h6Count: 0,
    averageLength: 0,
  };

  let totalLength = 0;

  headings.forEach((h) => {
    if (h.level === 1) stats.h1Count++;
    else if (h.level === 2) stats.h2Count++;
    else if (h.level === 3) stats.h3Count++;
    else if (h.level === 4) stats.h4Count++;
    else if (h.level === 5) stats.h5Count++;
    else if (h.level === 6) stats.h6Count++;

    totalLength += h.text.length;
  });

  stats.averageLength = headings.length > 0 ? Math.round(totalLength / headings.length) : 0;

  return stats;
}
