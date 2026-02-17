/**
 * Social Metadata Generators
 * Generates Open Graph and Twitter Card metadata
 */

const MIN_IMAGE_WIDTH = 1200;
const MIN_IMAGE_HEIGHT = 630;

/**
 * Open Graph metadata
 */
export interface OpenGraphMetadata {
  title: string;
  description: string;
  url: string;
  type: 'website' | 'article' | 'product';
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  imageType?: string;
  siteName?: string;
  locale?: string;
}

/**
 * Twitter Card metadata
 */
export interface TwitterCardMetadata {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  image: string;
  site?: string;
  creator?: string;
  imageAlt?: string;
}

/**
 * Generate Open Graph metadata
 */
export function generateOpenGraphMetadata(options: OpenGraphMetadata): Record<string, string> {
  const metadata: Record<string, string> = {
    'og:title': options.title,
    'og:description': options.description,
    'og:url': options.url,
    'og:type': options.type,
    'og:image': options.image,
  };

  if (options.imageWidth) {
    metadata['og:image:width'] = options.imageWidth.toString();
  }

  if (options.imageHeight) {
    metadata['og:image:height'] = options.imageHeight.toString();
  }

  if (options.imageType) {
    metadata['og:image:type'] = options.imageType;
  }

  if (options.siteName) {
    metadata['og:site_name'] = options.siteName;
  }

  if (options.locale) {
    metadata['og:locale'] = options.locale;
  }

  return metadata;
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterCardMetadata(options: TwitterCardMetadata): Record<string, string> {
  const metadata: Record<string, string> = {
    'twitter:card': options.card,
    'twitter:title': options.title,
    'twitter:description': options.description,
    'twitter:image': options.image,
  };

  if (options.site) {
    metadata['twitter:site'] = options.site;
  }

  if (options.creator) {
    metadata['twitter:creator'] = options.creator;
  }

  if (options.imageAlt) {
    metadata['twitter:image:alt'] = options.imageAlt;
  }

  return metadata;
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(
  width: number,
  height: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (width < MIN_IMAGE_WIDTH) {
    errors.push(`Image width must be at least ${MIN_IMAGE_WIDTH}px (current: ${width}px)`);
  }

  if (height < MIN_IMAGE_HEIGHT) {
    errors.push(`Image height must be at least ${MIN_IMAGE_HEIGHT}px (current: ${height}px)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate image URL
 */
export function validateImageUrl(url: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!url) {
    errors.push('Image URL is required');
    return { isValid: false, errors };
  }

  // Check if URL is absolute
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    errors.push('Image URL must be absolute (start with http:// or https://)');
  }

  // Check if URL uses HTTPS
  if (url.startsWith('http://')) {
    errors.push('Image URL should use HTTPS protocol');
  }

  // Try to parse URL
  try {
    new URL(url);
  } catch {
    errors.push('Image URL is not a valid URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Open Graph metadata
 */
export function validateOpenGraphMetadata(metadata: OpenGraphMetadata): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!metadata.title) {
    errors.push('og:title is required');
  } else if (metadata.title.length < 10) {
    errors.push('og:title should be at least 10 characters');
  }

  if (!metadata.description) {
    errors.push('og:description is required');
  } else if (metadata.description.length < 20) {
    errors.push('og:description should be at least 20 characters');
  }

  if (!metadata.url) {
    errors.push('og:url is required');
  } else {
    try {
      new URL(metadata.url);
    } catch {
      errors.push('og:url is not a valid URL');
    }
  }

  if (!metadata.image) {
    errors.push('og:image is required');
  } else {
    const imageValidation = validateImageUrl(metadata.image);
    if (!imageValidation.isValid) {
      errors.push(...imageValidation.errors);
    }
  }

  if (metadata.imageWidth && metadata.imageHeight) {
    const dimensionValidation = validateImageDimensions(metadata.imageWidth, metadata.imageHeight);
    if (!dimensionValidation.isValid) {
      errors.push(...dimensionValidation.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Twitter Card metadata
 */
export function validateTwitterCardMetadata(metadata: TwitterCardMetadata): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!metadata.title) {
    errors.push('twitter:title is required');
  } else if (metadata.title.length < 10) {
    errors.push('twitter:title should be at least 10 characters');
  }

  if (!metadata.description) {
    errors.push('twitter:description is required');
  } else if (metadata.description.length < 20) {
    errors.push('twitter:description should be at least 20 characters');
  }

  if (!metadata.image) {
    errors.push('twitter:image is required');
  } else {
    const imageValidation = validateImageUrl(metadata.image);
    if (!imageValidation.isValid) {
      errors.push(...imageValidation.errors);
    }
  }

  const validCards = ['summary', 'summary_large_image', 'app', 'player'];
  if (!validCards.includes(metadata.card)) {
    errors.push(`twitter:card must be one of: ${validCards.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if image dimensions are optimal
 */
export function isImageDimensionOptimal(width: number, height: number): boolean {
  // Optimal dimensions are 1200x630
  return width >= 1200 && height >= 630;
}

/**
 * Get recommended image dimensions
 */
export function getRecommendedImageDimensions(): { width: number; height: number } {
  return {
    width: 1200,
    height: 630,
  };
}

/**
 * Combine Open Graph and Twitter Card metadata
 */
export function combineSocialMetadata(
  ogMetadata: OpenGraphMetadata,
  twitterMetadata: TwitterCardMetadata
): Record<string, string> {
  const combined: Record<string, string> = {};

  // Add Open Graph metadata
  const ogData = generateOpenGraphMetadata(ogMetadata);
  Object.assign(combined, ogData);

  // Add Twitter Card metadata
  const twitterData = generateTwitterCardMetadata(twitterMetadata);
  Object.assign(combined, twitterData);

  return combined;
}
