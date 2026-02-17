/**
 * Image Alt Text Validator
 * Validates alt text for all images on the page
 */

const MIN_ALT_LENGTH = 8;
const MAX_ALT_LENGTH = 125;

const GENERIC_ALT_PATTERNS = [
  /^image$/i,
  /^photo$/i,
  /^picture$/i,
  /^img$/i,
  /^image\d+$/i,
  /^photo\d+$/i,
  /^pic$/i,
  /^graphic$/i,
  /^screenshot$/i,
  /^untitled$/i,
  /^unnamed$/i,
];

/**
 * Image alt text information
 */
export interface ImageAltInfo {
  src: string;
  alt: string;
  isDecorative: boolean;
  element: HTMLImageElement;
}

/**
 * Validation result
 */
export interface ImageAltValidationResult {
  isValid: boolean;
  totalImages: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  images: ImageAltInfo[];
  errors: string[];
  warnings: string[];
}

/**
 * Get all images from page
 */
export function getAllImages(): ImageAltInfo[] {
  const images: ImageAltInfo[] = [];

  const imageElements = document.querySelectorAll('img');

  imageElements.forEach((element) => {
    const alt = element.getAttribute('alt') || '';
    const src = element.getAttribute('src') || '';

    images.push({
      src,
      alt,
      isDecorative: alt === '',
      element,
    });
  });

  return images;
}

/**
 * Validate image alt text
 */
export function validateImageAltText(): ImageAltValidationResult {
  const images = getAllImages();
  const errors: string[] = [];
  const warnings: string[] = [];

  let imagesWithAlt = 0;
  let imagesWithoutAlt = 0;

  images.forEach((image, index) => {
    if (!image.alt || image.alt.trim().length === 0) {
      if (!isDecorativeImage(image.element)) {
        errors.push(`Image ${index + 1} (${image.src}) is missing alt text`);
        imagesWithoutAlt++;
      }
    } else {
      imagesWithAlt++;

      // Validate alt text length
      if (image.alt.length < MIN_ALT_LENGTH) {
        warnings.push(`Image ${index + 1} alt text is too short (${image.alt.length} characters)`);
      }

      if (image.alt.length > MAX_ALT_LENGTH) {
        errors.push(`Image ${index + 1} alt text is too long (${image.alt.length} characters, max ${MAX_ALT_LENGTH})`);
      }

      // Check for generic alt text
      if (isGenericAltText(image.alt)) {
        warnings.push(`Image ${index + 1} has generic alt text: "${image.alt}"`);
      }

      // Check for keyword stuffing
      if (hasKeywordStuffing(image.alt)) {
        warnings.push(`Image ${index + 1} alt text may have keyword stuffing: "${image.alt}"`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    totalImages: images.length,
    imagesWithAlt,
    imagesWithoutAlt,
    images,
    errors,
    warnings,
  };
}

/**
 * Validate single image alt text
 */
export function validateImageAlt(element: HTMLImageElement): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (element.tagName.toLowerCase() !== 'img') {
    errors.push('Element is not an image');
    return { isValid: false, errors };
  }

  const alt = element.getAttribute('alt') || '';

  // Check if image is decorative
  if (isDecorativeImage(element)) {
    return { isValid: true, errors };
  }

  // Check if alt text is missing
  if (!alt || alt.trim().length === 0) {
    errors.push('Image is missing alt text');
  } else {
    // Validate alt text length
    if (alt.length < MIN_ALT_LENGTH) {
      errors.push(`Alt text is too short (${alt.length} characters, minimum ${MIN_ALT_LENGTH})`);
    }

    if (alt.length > MAX_ALT_LENGTH) {
      errors.push(`Alt text is too long (${alt.length} characters, maximum ${MAX_ALT_LENGTH})`);
    }

    // Check for generic alt text
    if (isGenericAltText(alt)) {
      errors.push(`Alt text is generic: "${alt}"`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if image is decorative
 */
export function isDecorativeImage(element: HTMLImageElement): boolean {
  // Check for empty alt attribute
  if (element.getAttribute('alt') === '') {
    return true;
  }

  // Check for aria-hidden
  if (element.getAttribute('aria-hidden') === 'true') {
    return true;
  }

  // Check for role="presentation"
  if (element.getAttribute('role') === 'presentation') {
    return true;
  }

  return false;
}

/**
 * Check if alt text is generic
 */
export function isGenericAltText(alt: string): boolean {
  return GENERIC_ALT_PATTERNS.some((pattern) => pattern.test(alt));
}

/**
 * Check for keyword stuffing
 */
export function hasKeywordStuffing(alt: string): boolean {
  // Check if same word appears multiple times
  const words = alt.toLowerCase().split(/\s+/);
  const wordCounts = new Map<string, number>();

  words.forEach((word) => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });

  // If any word appears more than 3 times, it might be keyword stuffing
  for (const count of wordCounts.values()) {
    if (count > 3) {
      return true;
    }
  }

  return false;
}

/**
 * Get alt text statistics
 */
export function getAltTextStatistics(): {
  totalImages: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  decorativeImages: number;
  averageAltLength: number;
  coverage: number;
} {
  const images = getAllImages();

  let imagesWithAlt = 0;
  let imagesWithoutAlt = 0;
  let decorativeImages = 0;
  let totalAltLength = 0;

  images.forEach((image) => {
    if (image.isDecorative) {
      decorativeImages++;
    } else if (image.alt && image.alt.trim().length > 0) {
      imagesWithAlt++;
      totalAltLength += image.alt.length;
    } else {
      imagesWithoutAlt++;
    }
  });

  const nonDecorativeImages = images.length - decorativeImages;
  const coverage = nonDecorativeImages > 0 ? (imagesWithAlt / nonDecorativeImages) * 100 : 0;

  return {
    totalImages: images.length,
    imagesWithAlt,
    imagesWithoutAlt,
    decorativeImages,
    averageAltLength: imagesWithAlt > 0 ? Math.round(totalAltLength / imagesWithAlt) : 0,
    coverage: Math.round(coverage),
  };
}

/**
 * Generate alt text suggestion
 */
export function generateAltTextSuggestion(src: string): string {
  // Extract filename from src
  const filename = src.split('/').pop() || 'image';

  // Remove file extension
  const nameWithoutExt = filename.split('.')[0];

  // Convert kebab-case or snake_case to Title Case
  const suggestion = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return suggestion;
}

/**
 * Validate alt text length
 */
export function validateAltTextLength(alt: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (alt.length < MIN_ALT_LENGTH) {
    errors.push(`Alt text is too short (${alt.length} characters, minimum ${MIN_ALT_LENGTH})`);
  }

  if (alt.length > MAX_ALT_LENGTH) {
    errors.push(`Alt text is too long (${alt.length} characters, maximum ${MAX_ALT_LENGTH})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get images missing alt text
 */
export function getImagesMissingAlt(): HTMLImageElement[] {
  const images = getAllImages();
  return images
    .filter((img) => !img.isDecorative && (!img.alt || img.alt.trim().length === 0))
    .map((img) => img.element);
}

/**
 * Get images with generic alt text
 */
export function getImagesWithGenericAlt(): HTMLImageElement[] {
  const images = getAllImages();
  return images
    .filter((img) => img.alt && isGenericAltText(img.alt))
    .map((img) => img.element);
}
