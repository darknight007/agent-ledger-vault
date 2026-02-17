/**
 * Google Search Console Integration
 * Handles GSC verification and setup
 */

/**
 * Configuration for Google Search Console
 */
export interface GSCConfig {
  verificationCode: string;
  siteUrl: string;
  enabled: boolean;
}

/**
 * Generate GSC verification meta tag
 * @param verificationCode - The verification code from Google Search Console
 * @returns Meta tag HTML string
 */
export function generateGSCVerificationTag(verificationCode: string): string {
  if (!verificationCode || verificationCode.trim().length === 0) {
    throw new Error('GSC verification code is required');
  }

  return `<meta name="google-site-verification" content="${verificationCode}" />`;
}

/**
 * Get GSC verification meta tag properties
 * @param verificationCode - The verification code from Google Search Console
 * @returns Object with meta tag properties
 */
export function getGSCVerificationMetaTag(verificationCode: string): {
  name: string;
  content: string;
} {
  if (!verificationCode || verificationCode.trim().length === 0) {
    throw new Error('GSC verification code is required');
  }

  return {
    name: 'google-site-verification',
    content: verificationCode,
  };
}

/**
 * Validate GSC verification code format
 * @param code - The verification code to validate
 * @returns True if valid, false otherwise
 */
export function isValidGSCCode(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }

  // GSC codes are typically alphanumeric strings of 40+ characters
  return /^[a-zA-Z0-9]{40,}$/.test(code.trim());
}

/**
 * Create GSC configuration
 * @param verificationCode - The verification code from Google Search Console
 * @param siteUrl - The site URL to verify
 * @returns GSC configuration object
 */
export function createGSCConfig(
  verificationCode: string,
  siteUrl: string
): GSCConfig {
  if (!isValidGSCCode(verificationCode)) {
    throw new Error('Invalid GSC verification code format');
  }

  if (!siteUrl || !siteUrl.startsWith('https://')) {
    throw new Error('Site URL must be a valid HTTPS URL');
  }

  return {
    verificationCode,
    siteUrl,
    enabled: true,
  };
}
